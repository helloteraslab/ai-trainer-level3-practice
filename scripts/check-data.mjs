import { readFile } from "node:fs/promises";

const data = JSON.parse(await readFile(new URL("../questions.json", import.meta.url), "utf8"));
const browserData = await readFile(new URL("../questions-data.js", import.meta.url), "utf8");
const rawIds = new Set(data.rawQuestions.map((question) => question.id));
const skillIds = new Set(data.skills.map((skill) => skill.id));
const allowedTypes = new Set(["choice", "blank"]);

const errors = [];

if (browserData !== `window.QUESTION_BANK = ${JSON.stringify(data, null, 2)};\n`) {
  errors.push("questions-data.js 与 questions.json 不一致，请运行 npm run build:data");
}

for (const item of data.learningItems) {
  if (!rawIds.has(item.raw_question_id)) {
    errors.push(`${item.id}: raw_question_id 不存在`);
  }
  if (!item.title || !item.prompt || !item.item_type) {
    errors.push(`${item.id}: 缺少 title/prompt/item_type`);
  }
  if (!item.task_hint) {
    errors.push(`${item.id}: 缺少来自 ipynb 注释的 task_hint`);
  }
  if (!allowedTypes.has(item.item_type)) {
    errors.push(`${item.id}: item_type 只能是 choice 或 blank，当前为 ${item.item_type}`);
  }
  if (item.item_type === "choice") {
    if (!Array.isArray(item.answer_json?.options) || !item.answer_json.options.includes(item.answer_json.correct_option)) {
      errors.push(`${item.id}: choice 题必须包含 options 和 correct_option`);
    }
    if (!item.id.includes("_function")) {
      errors.push(`${item.id}: choice 题只能用于函数选择，id 需要包含 _function`);
    }
  }
  if (item.item_type === "blank") {
    if (!Array.isArray(item.answer_json?.accepted_answers) || item.answer_json.accepted_answers.length === 0) {
      errors.push(`${item.id}: blank 题必须包含 accepted_answers`);
    }
  }
  for (const skill of item.skills || []) {
    if (!skillIds.has(skill)) {
      errors.push(`${item.id}: skill 不存在: ${skill}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`OK: ${data.rawQuestions.length} raw questions, ${data.learningItems.length} learning items.`);

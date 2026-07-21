const STORAGE_KEY = "codeDuolingoTrainerState.v1";

const state = {
  bank: null,
  currentRawQuestionId: null,
  currentStepIndex: 0,
  expanded: true,
  selectedChoice: null,
  answers: {},
  checkedResults: {},
  progress: loadProgress()
};

function loadProgress() {
  const fallback = {
    xp: 0,
    streak: 1,
    hearts: 5,
    attempts: [],
    mistakes: [],
    completedIds: [],
    checkedIds: [],
    skillXp: {},
    activity: {}
  };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return fallback;
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

async function init() {
  state.bank = await loadQuestionBank();
  state.currentRawQuestionId = recommendRawQuestionId();
  bindNavigation();
  bindReset();
  renderStats();
  renderPractice();
  renderSkillTree();
  renderReview();
  renderBank();
  registerServiceWorker();
}

async function loadQuestionBank() {
  if (window.QUESTION_BANK) return window.QUESTION_BANK;
  try {
    return await fetch("./questions.json").then((response) => response.json());
  } catch {
    document.body.innerHTML = `
      <main class="load-error">
        <h1>题库没有加载成功</h1>
        <p>如果你正在用 Chrome 直接打开本地文件，请改用本地网页服务打开，或刷新确认 questions-data.js 已存在。</p>
      </main>
    `;
    throw new Error("Question bank failed to load");
  }
}

function bindNavigation() {
  document.querySelectorAll(".nav-tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.remove("active"));
      document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(`${button.dataset.view}View`).classList.add("active");
    });
  });
}

function bindReset() {
  document.getElementById("resetProgressButton").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    state.progress = loadProgress();
    state.currentRawQuestionId = recommendRawQuestionId();
    state.currentStepIndex = 0;
    state.selectedChoice = null;
    state.answers = {};
    state.checkedResults = {};
    renderStats();
    renderPractice();
    renderSkillTree();
    renderReview();
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

function renderStats() {
  const xpStat = document.getElementById("xpStat");
  const streakStat = document.getElementById("streakStat");
  const heartsStat = document.getElementById("heartsStat");
  if (!xpStat || !streakStat || !heartsStat) return;
  xpStat.textContent = state.progress.xp;
  streakStat.textContent = `${state.progress.streak} 天`;
  heartsStat.textContent = state.progress.hearts;
}

function recommendRawQuestionId() {
  const items = state.bank.learningItems;
  const mistakenItem = state.progress.mistakes.map((id) => items.find((item) => item.id === id)).find(Boolean);
  if (mistakenItem) return mistakenItem.raw_question_id;

  const grouped = groupLearningItems();
  const unfinished = state.bank.rawQuestions.find((raw) =>
    (grouped.get(raw.id) || []).some((item) => !state.progress.checkedIds.includes(item.id))
  );
  return unfinished?.id || state.bank.rawQuestions[0]?.id || null;
}

function groupLearningItems() {
  const grouped = new Map();
  for (const item of state.bank.learningItems) {
    if (!grouped.has(item.raw_question_id)) grouped.set(item.raw_question_id, []);
    grouped.get(item.raw_question_id).push(item);
  }
  return grouped;
}

function getCurrentRawQuestion() {
  return state.bank.rawQuestions.find((raw) => raw.id === state.currentRawQuestionId) || state.bank.rawQuestions[0];
}

function getCurrentItems() {
  return groupLearningItems().get(getCurrentRawQuestion()?.id) || [];
}

function renderPractice() {
  const card = document.getElementById("lessonCard");
  const raw = getCurrentRawQuestion();
  const items = getCurrentItems();
  const currentItem = items[state.currentStepIndex] || items[0];
  if (!raw || !items.length || !currentItem) {
    card.innerHTML = `<div class="empty-state">题库为空。</div>`;
    return;
  }

  state.currentStepIndex = Math.min(state.currentStepIndex, items.length - 1);
  const checkedCount = items.filter((item) => state.progress.checkedIds.includes(item.id)).length;
  const shownItems = state.expanded ? items : [currentItem];

  card.innerHTML = `
    <div class="practice-topbar">
      <div>
        <h2>${escapeHtml(raw.question_no)} 实操训练</h2>
        <p>步骤 · ${checkedCount}/${items.length} 已核对 · ${escapeHtml(raw.title)}</p>
      </div>
      <button class="secondary-button compact" id="toggleExpandButton">${state.expanded ? "收起" : "展开"}</button>
    </div>

    <div class="practice-tools">
      <button class="ghost-button" id="switchRawButton">换一题</button>
      <button class="ghost-button" id="resetRawButton">重练本题</button>
    </div>

    <section class="truth-code">
      <h3>真题代码（空位与真题一致，在空格处作答）</h3>
      <div class="code-sheet">
        ${shownItems.map((item) => renderPracticeStep(item, items.indexOf(item))).join("")}
      </div>
    </section>

    <div class="bottom-stepbar">
      <button class="secondary-button" id="prevStepButton" ${state.currentStepIndex === 0 ? "disabled" : ""}>上一步</button>
      <button class="primary-button" id="nextStepButton">${state.currentStepIndex >= items.length - 1 ? "完成本题" : "下一步"}</button>
    </div>
  `;

  bindPracticeControls(items);
  scrollCurrentStepIntoView();
}

function renderPracticeStep(item, index) {
  const result = state.checkedResults[item.id];
  const checkedClass = result ? (result.correct ? "correct" : "wrong") : "";
  const activeClass = index === state.currentStepIndex ? "active" : "";
  const answer = state.answers[item.id] || "";
  const answerText = getDisplayAnswer(item);

  return `
    <article class="practice-step ${activeClass} ${checkedClass}" id="step-${item.id}">
      <p class="code-comment"># ${escapeHtml(item.task_hint || item.title)}</p>
      ${item.starter_code ? `<pre class="true-code"><code>${escapeHtml(item.starter_code)}</code></pre>` : ""}
      ${renderStepAnswerControl(item, answer)}
      <div class="step-actions">
        <button class="primary-button check-button" data-item-id="${item.id}">核对</button>
      </div>
      ${
        result
          ? `<div class="answer-reveal ${result.correct ? "correct" : "wrong"}">
              <strong>${result.correct ? "答对了" : "还差一点"}</strong>
              <p>答案：<code>${escapeHtml(answerText)}</code></p>
              <p>${escapeHtml(item.feedback.summary)}</p>
            </div>`
          : ""
      }
    </article>
  `;
}

function renderStepAnswerControl(item, value) {
  if (item.item_type === "choice") {
    return `
      <div class="choice-grid">
        ${item.answer_json.options
          .map(
            (option) => `
              <button class="choice-button ${value === option ? "selected" : ""}" data-item-id="${item.id}" data-choice="${escapeHtml(option)}">
                ${escapeHtml(option)}
              </button>
            `
          )
          .join("")}
      </div>
    `;
  }
  const placeholder = item.answer_json?.ordered_answers ? "多个空用逗号分隔，例如 cv2.resize, image" : "填空";
  return `
    <input
      class="answer-input"
      data-item-id="${item.id}"
      value="${escapeAttribute(value)}"
      placeholder="${escapeHtml(placeholder)}"
      autocomplete="off"
      autocapitalize="none"
      spellcheck="false"
    />
  `;
}

function bindPracticeControls(items) {
  document.getElementById("toggleExpandButton").addEventListener("click", () => {
    state.expanded = !state.expanded;
    renderPractice();
  });

  document.getElementById("switchRawButton").addEventListener("click", () => {
    const rawQuestions = state.bank.rawQuestions.filter((raw) => getItemsForRaw(raw.id).length);
    const currentIndex = rawQuestions.findIndex((raw) => raw.id === state.currentRawQuestionId);
    const nextRaw = rawQuestions[(currentIndex + 1) % rawQuestions.length] || rawQuestions[0];
    state.currentRawQuestionId = nextRaw.id;
    state.currentStepIndex = 0;
    renderPractice();
  });

  document.getElementById("resetRawButton").addEventListener("click", () => {
    for (const item of items) {
      delete state.answers[item.id];
      delete state.checkedResults[item.id];
      state.progress.checkedIds = state.progress.checkedIds.filter((id) => id !== item.id);
      state.progress.completedIds = state.progress.completedIds.filter((id) => id !== item.id);
      state.progress.mistakes = state.progress.mistakes.filter((id) => id !== item.id);
    }
    saveProgress();
    renderPractice();
    renderReview();
    renderSkillTree();
  });

  document.getElementById("prevStepButton").addEventListener("click", () => {
    if (state.currentStepIndex === 0) return;
    state.currentStepIndex -= 1;
    renderPractice();
  });

  document.getElementById("nextStepButton").addEventListener("click", () => {
    if (state.currentStepIndex < items.length - 1) {
      state.currentStepIndex += 1;
      renderPractice();
      return;
    }
    state.currentRawQuestionId = getNextRawQuestionId();
    state.currentStepIndex = 0;
    renderPractice();
  });

  document.querySelectorAll(".answer-input").forEach((input) => {
    input.addEventListener("input", () => {
      state.answers[input.dataset.itemId] = input.value;
    });
  });

  document.querySelectorAll(".choice-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.answers[button.dataset.itemId] = button.dataset.choice;
      renderPractice();
    });
  });

  document.querySelectorAll(".check-button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = state.bank.learningItems.find((candidate) => candidate.id === button.dataset.itemId);
      const index = items.findIndex((candidate) => candidate.id === item.id);
      state.currentStepIndex = index;
      submitStep(item);
    });
  });
}

function submitStep(item) {
  const answer = state.answers[item.id] || "";
  const result = gradeAnswer(item, answer);
  state.checkedResults[item.id] = result;
  updateProgress(item, result.correct, answer);
  renderStats();
  renderPractice();
  renderSkillTree();
  renderReview();
}

function getItemsForRaw(rawQuestionId) {
  return groupLearningItems().get(rawQuestionId) || [];
}

function getNextRawQuestionId() {
  const rawQuestions = state.bank.rawQuestions.filter((raw) => getItemsForRaw(raw.id).length);
  const currentIndex = rawQuestions.findIndex((raw) => raw.id === state.currentRawQuestionId);
  return (rawQuestions[(currentIndex + 1) % rawQuestions.length] || rawQuestions[0]).id;
}

function scrollCurrentStepIntoView() {
  window.setTimeout(() => {
    const item = getCurrentItems()[state.currentStepIndex];
    document.getElementById(`step-${item?.id}`)?.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
    window.scrollTo({ top: window.scrollY, left: 0 });
  }, 60);
}

function gradeAnswer(item, answer) {
  const answerJson = item.answer_json;
  let correct = false;
  if (item.item_type === "choice") {
    correct = answer === answerJson.correct_option;
  } else if (item.item_type === "blank") {
    if (Array.isArray(answerJson.ordered_answers)) {
      const parts = splitOrderedAnswer(answer);
      correct =
        parts.length === answerJson.ordered_answers.length &&
        answerJson.ordered_answers.every((accepted, index) => normalize(accepted) === normalize(parts[index]));
    } else {
      const normalized = normalize(answer);
      correct = answerJson.accepted_answers.some((accepted) => normalize(accepted) === normalized);
    }
  }
  return { correct, answer };
}

function updateProgress(item, correct, answer) {
  const today = new Date().toISOString().slice(0, 10);
  state.progress.attempts.unshift({
    item_id: item.id,
    title: item.title,
    correct,
    answer,
    at: new Date().toISOString()
  });
  state.progress.attempts = state.progress.attempts.slice(0, 80);
  state.progress.checkedIds = [...new Set([...(state.progress.checkedIds || []), item.id])];
  state.progress.activity[today] = (state.progress.activity[today] || 0) + (correct ? item.xp : 1);

  if (correct) {
    if (!state.progress.completedIds.includes(item.id)) state.progress.xp += item.xp;
    state.progress.completedIds = [...new Set([...state.progress.completedIds, item.id])];
    state.progress.mistakes = state.progress.mistakes.filter((id) => id !== item.id);
    item.skills.forEach((skill) => {
      state.progress.skillXp[skill] = (state.progress.skillXp[skill] || 0) + item.xp;
    });
  } else {
    state.progress.hearts = Math.max(0, state.progress.hearts - 1);
    state.progress.mistakes = [...new Set([item.id, ...state.progress.mistakes])].slice(0, 12);
  }
  saveProgress();
}

function getDisplayAnswer(item) {
  if (Array.isArray(item.answer_json?.ordered_answers)) return item.answer_json.ordered_answers.join(", ");
  if (item.item_type === "choice") return item.answer_json.correct_option;
  return item.answer_json?.accepted_answers?.[0] || "";
}

function renderSkillTree() {
  const tree = document.getElementById("skillTree");
  tree.innerHTML = state.bank.skills
    .map((skill) => {
      const xp = state.progress.skillXp[skill.id] || 0;
      const level = Math.min(3, Math.floor(xp / 24) + (xp > 0 ? 1 : 0));
      return `
        <article class="skill-node">
          <span class="pill">${skill.category}</span>
          <h3>${skill.name}</h3>
          <p class="small-muted">${skill.parent_id ? `上级：${skill.parent_id}` : "技能树起点"}</p>
          <div class="stars">${"⭐".repeat(level)}${"☆".repeat(3 - level)}</div>
        </article>
      `;
    })
    .join("");
}

function renderReview() {
  const mistakes = document.getElementById("mistakeList");
  const concepts = document.getElementById("errorConceptList");
  const itemsById = new Map(state.bank.learningItems.map((item) => [item.id, item]));
  const queuedItems = state.progress.mistakes.map((id) => itemsById.get(id)).filter(Boolean);
  const recentWrongItems = state.progress.attempts
    .filter((attempt) => !attempt.correct)
    .map((attempt) => itemsById.get(attempt.item_id))
    .filter(Boolean);
  const items = uniqueById([...queuedItems, ...recentWrongItems]).slice(0, 8);

  mistakes.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <div class="mistake-item">
              <span class="pill">${formatType(item.item_type)}</span>
              <strong>${item.title}</strong>
              ${item.task_hint ? `<p>${escapeHtml(item.task_hint)}</p>` : ""}
              <p class="small-muted">${item.feedback.summary}</p>
            </div>
          `
        )
        .join("")
    : `<div class="empty-state">目前没有待复习错题。故意做错一题，可以看到错题回流。</div>`;

  const conceptItems = summarizeErrorConcepts(items);
  concepts.innerHTML = conceptItems.length
    ? conceptItems
        .map(
          (concept) => `
            <div class="concept-item">
              <code>${escapeHtml(concept.name)}</code>
              <p>${escapeHtml(concept.use)}</p>
            </div>
          `
        )
        .join("")
    : `<div class="empty-state">目前还没有常见遗忘点。做错后，这里会提炼核心函数和用途。</div>`;

  const heatmap = document.getElementById("heatmap");
  const days = Array.from({ length: 28 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (27 - i));
    const key = date.toISOString().slice(0, 10);
    return { key, active: Boolean(state.progress.activity[key]) };
  });
  heatmap.innerHTML = days.map((day) => `<div class="heat-cell ${day.active ? "active" : ""}" title="${day.key}"></div>`).join("");
}

function summarizeErrorConcepts(items) {
  const concepts = new Map();
  for (const item of items) {
    const name = getCoreConcept(item);
    if (!name || concepts.has(name)) continue;
    concepts.set(name, {
      name,
      use: item.feedback?.summary || item.task_hint || item.title
    });
  }
  return [...concepts.values()].slice(0, 6);
}

function getCoreConcept(item) {
  const point = item.knowledge_points?.find((value) => /[()._]/.test(value)) || item.knowledge_points?.[0];
  if (point) return point.replace(/\(.*/, "");

  const answer = item.answer_json?.correct_option || item.answer_json?.accepted_answers?.[0] || "";
  const match = String(answer).match(/[A-Za-z_][\w]*(?:\.[A-Za-z_][\w]*)?/);
  return match?.[0] || item.title;
}

function renderBank() {
  const sourceBox = document.getElementById("sourceBox");
  sourceBox.innerHTML = `
    <p><strong>${state.bank.source.name}</strong></p>
    <p class="small-muted">优先级：${state.bank.source.priority}</p>
    <div class="pill-row">
      ${state.bank.source.directories.map((dir) => `<span class="pill">${dir}</span>`).join("")}
    </div>
  `;

  document.getElementById("rawQuestionList").innerHTML = state.bank.rawQuestions
    .map(
      (question) => `
        <div class="raw-card">
          <span class="pill green">${question.question_no}</span>
          <h3>${question.title}</h3>
          <p class="small-muted">${question.body}</p>
          <div class="pill-row">${question.skills.map((skill) => `<span class="pill">${skill}</span>`).join("")}</div>
        </div>
      `
    )
    .join("");

  document.getElementById("learningItemList").innerHTML = state.bank.learningItems
    .map(
      (item) => `
        <div class="learning-card">
          <div class="pill-row">
            <span class="pill green">${formatType(item.item_type)}</span>
            <span class="pill">${"⭐".repeat(item.mastery_level)}</span>
          </div>
          <h3>${item.title}</h3>
          ${item.task_hint ? `<p>${escapeHtml(item.task_hint)}</p>` : ""}
          <p class="small-muted">来源：${item.raw_question_id} · ${item.knowledge_points.join(" / ")}</p>
        </div>
      `
    )
    .join("");
}

function formatType(type) {
  const map = {
    choice: "选择题",
    blank: "填空题"
  };
  return map[type] || type;
}

function normalize(value) {
  return String(value).trim().replace(/\s+/g, "").replace(/[""]/g, "'").toLowerCase();
}

function splitOrderedAnswer(value) {
  return String(value)
    .split(/[,，;；\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

init();

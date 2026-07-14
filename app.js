const STORAGE_KEY = "codeDuolingoTrainerState.v1";

const state = {
  bank: null,
  currentItem: null,
  selectedChoice: null,
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
  state.currentItem = recommendItem();
  bindNavigation();
  bindReset();
  renderStats();
  renderLesson();
  renderRecommendations();
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
    state.currentItem = recommendItem();
    state.selectedChoice = null;
    renderStats();
    renderLesson();
    renderRecommendations();
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

function recommendItem() {
  const items = state.bank.learningItems;
  const dueMistake = state.progress.mistakes
    .map((id) => items.find((item) => item.id === id))
    .find(Boolean);
  if (dueMistake) return dueMistake;

  const candidates = items
    .sort((a, b) => {
      const aDone = state.progress.completedIds.includes(a.id) ? 1 : 0;
      const bDone = state.progress.completedIds.includes(b.id) ? 1 : 0;
      return aDone - bDone || a.mastery_level - b.mastery_level;
    });
  return candidates[0] || items[0];
}

function renderRecommendations() {
  const container = document.getElementById("recommendationList");
  const items = state.bank.learningItems
    .filter((item) => item.id !== state.currentItem?.id)
    .slice(0, 4);
  container.innerHTML = items
    .map(
      (item) => `
        <div class="recommendation-item">
          <div class="pill-row">
            <span class="pill green">${formatType(item.item_type)}</span>
          </div>
          <strong>${item.title}</strong>
          <p class="small-muted">${item.knowledge_points.join(" · ")}</p>
        </div>
      `
    )
    .join("");
}

function renderLesson(feedback = null) {
  const card = document.getElementById("lessonCard");
  const item = state.currentItem;
  if (!item) {
    card.innerHTML = `<div class="empty-state">题库为空。</div>`;
    return;
  }

  card.innerHTML = `
    <div class="lesson-header">
      <div>
        <div class="pill-row">
          <span class="pill green">${formatType(item.item_type)}</span>
          <span class="pill">${"⭐".repeat(item.mastery_level)}</span>
        </div>
        <h2>${item.title}</h2>
      </div>
      <button class="secondary-button" id="nextButton">换一题</button>
    </div>
    ${item.task_hint ? `<div class="task-hint"><span>原题提示</span><strong>${escapeHtml(item.task_hint)}</strong></div>` : ""}
    ${item.starter_code ? `<pre><code>${escapeHtml(item.starter_code)}</code></pre>` : ""}
    ${renderAnswerControl(item)}
    <div class="skill-tags">
      ${item.knowledge_points.map((point) => `<span class="pill">${escapeHtml(point)}</span>`).join("")}
    </div>
    <div class="actions">
      <button class="primary-button" id="submitButton">提交答案</button>
      <button class="secondary-button" id="hintButton">提示</button>
    </div>
    <div id="feedbackHost">${feedback ? renderFeedback(item, feedback) : ""}</div>
  `;

  bindLessonControls(item);
}

function renderAnswerControl(item) {
  if (item.item_type === "choice") {
    return `
      <div class="choice-grid">
        ${item.answer_json.options
          .map((option) => `<button class="choice-button" data-choice="${escapeHtml(option)}">${escapeHtml(option)}</button>`)
          .join("")}
      </div>
    `;
  }
  return `<input class="answer-input" id="answerInput" placeholder="输入填空答案，例如 agg" />`;
}

function bindLessonControls(item) {
  const nextButton = document.getElementById("nextButton");
  nextButton.addEventListener("click", () => {
    const items = state.bank.learningItems;
    const currentIndex = items.findIndex((candidate) => candidate.id === item.id);
    state.currentItem = items[(currentIndex + 1) % items.length] || recommendItem();
    state.selectedChoice = null;
    renderLesson();
    renderRecommendations();
  });

  document.getElementById("submitButton").addEventListener("click", submitAnswer);
  document.getElementById("hintButton").addEventListener("click", () => {
    const host = document.getElementById("feedbackHost");
    host.innerHTML = `<div class="feedback"><strong>提示</strong><p>${escapeHtml(item.feedback.summary)}</p></div>`;
  });

  document.querySelectorAll(".choice-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedChoice = button.dataset.choice;
      document.querySelectorAll(".choice-button").forEach((choice) => choice.classList.remove("selected"));
      button.classList.add("selected");
    });
  });
}

function submitAnswer() {
  const item = state.currentItem;
  const answer = getAnswer(item);
  const result = gradeAnswer(item, answer);
  updateProgress(item, result.correct, answer);
  renderStats();
  renderLesson(result);
  renderSkillTree();
  renderReview();
}

function getAnswer(item) {
  if (item.item_type === "choice") return state.selectedChoice;
  return document.getElementById("answerInput")?.value.trim() || "";
}

function gradeAnswer(item, answer) {
  const answerJson = item.answer_json;
  let correct = false;
  if (item.item_type === "choice") {
    correct = answer === answerJson.correct_option;
  } else if (item.item_type === "blank") {
    const normalized = normalize(answer);
    correct = answerJson.accepted_answers.some((accepted) => normalize(accepted) === normalized);
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
  state.progress.attempts = state.progress.attempts.slice(0, 40);
  state.progress.activity[today] = (state.progress.activity[today] || 0) + (correct ? item.xp : 1);

  if (correct) {
    state.progress.xp += item.xp;
    state.progress.completedIds = [...new Set([...state.progress.completedIds, item.id])];
    state.progress.mistakes = state.progress.mistakes.filter((id) => id !== item.id);
    item.skills.forEach((skill) => {
      state.progress.skillXp[skill] = (state.progress.skillXp[skill] || 0) + item.xp;
    });
  } else {
    state.progress.hearts = Math.max(0, state.progress.hearts - 1);
    state.progress.mistakes = [...new Set([item.id, ...state.progress.mistakes])].slice(0, 8);
  }
  saveProgress();
}

function renderFeedback(item, result) {
  const statusClass = result.correct ? "correct" : "wrong";
  const title = result.correct ? "答对了，XP 已增加" : "还差一点，已加入复习队列";
  return `
    <div class="feedback ${statusClass}">
      <strong>${title}</strong>
      <div class="feedback-grid">
        <div class="feedback-layer">
          <strong>1. 能否运行</strong>
          <span>${escapeHtml(item.feedback.run)}</span>
        </div>
        <div class="feedback-layer">
          <strong>2. 测试结果</strong>
          <span>${escapeHtml(item.feedback.tests)}</span>
        </div>
        <div class="feedback-layer">
          <strong>3. 更好写法</strong>
          <span>${escapeHtml(item.feedback.better)}</span>
        </div>
        <div class="feedback-layer">
          <strong>4. 知识点总结</strong>
          <span>${escapeHtml(item.feedback.summary)}</span>
        </div>
      </div>
    </div>
  `;
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

init();

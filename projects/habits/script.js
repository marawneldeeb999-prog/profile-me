const list = document.getElementById("habit-list");
const completedCount = document.getElementById("completed-count");
const totalCount = document.getElementById("total-count");
const progressPercent = document.getElementById("progress-percent");
const progressFill = document.getElementById("progress-fill");
const encouragement = document.getElementById("encouragement");
const streakCount = document.getElementById("streak-count");

function updateProgress() {
  const checks = list.querySelectorAll(".habit-check");
  const done = list.querySelectorAll(".habit-check:checked").length;
  const percent = checks.length ? Math.round((done / checks.length) * 100) : 0;
  completedCount.textContent = done;
  totalCount.textContent = checks.length;
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
  streakCount.textContent = done;
  encouragement.textContent = done === checks.length && done > 0
    ? "عملتها! يومك مليان خطوات حلوة."
    : done > 0
      ? "حلو! كمل على مهلك، أنت ماشي صح."
      : "ابدأ بأول عادة، والباقي هييجي واحدة واحدة.";
}

list.addEventListener("change", (event) => {
  if (event.target.matches(".habit-check")) updateProgress();
});

document.getElementById("add-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("new-habit");
  const name = input.value.trim();
  if (!name) return;

  const card = document.createElement("label");
  card.className = "habit-card";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "habit-check";
  const icon = document.createElement("span");
  icon.className = "habit-icon calm";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "✳";
  const text = document.createElement("span");
  text.className = "habit-text";
  const title = document.createElement("b");
  title.textContent = name;
  const detail = document.createElement("small");
  detail.textContent = "عادة جديدة";
  text.append(title, detail);
  const time = document.createElement("span");
  time.className = "habit-time";
  time.textContent = "كل يوم";
  card.append(checkbox, icon, text, time);
  list.append(card);
  input.value = "";
  updateProgress();
});

document.getElementById("today-label").textContent = new Intl.DateTimeFormat("ar-EG", {
  weekday: "long",
  day: "numeric",
  month: "long"
}).format(new Date());
updateProgress();

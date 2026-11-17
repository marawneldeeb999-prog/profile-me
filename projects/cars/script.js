const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "فتح القائمة" : "إغلاق القائمة");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "فتح القائمة");
    navigation.classList.remove("is-open");
  });
});

document.querySelectorAll(".favorite").forEach((button) => {
  button.addEventListener("click", () => {
    const isFavorite = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!isFavorite));
    button.textContent = isFavorite ? "♡" : "♥";
    showToast(isFavorite ? "تمت إزالة السيارة من المفضلة" : "تمت إضافة السيارة إلى المفضلة");
  });
});

document.querySelectorAll(".details-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const details = button.nextElementSibling;
    button.setAttribute("aria-expanded", String(!isExpanded));
    button.querySelector("span").textContent = isExpanded ? "＋" : "−";
    details.hidden = isExpanded;
  });
});

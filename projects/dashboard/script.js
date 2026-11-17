const ranges = {
  7: { revenue: "٥٤٬٣٠٠", visits: "١٢٬٨٤٠", orders: "٣٨٦", conversion: "٤٫٨٪" },
  30: { revenue: "٢١٨٬٦٠٠", visits: "٤٨٬٢١٠", orders: "١٬٤٥٨", conversion: "٥٫١٪" },
  90: { revenue: "٦١٢٬٩٠٠", visits: "١٣٦٬٧٩٠", orders: "٤٬٢٢٠", conversion: "٤٫٦٪" }
};

const rangeButtons = document.querySelectorAll(".filter");
rangeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    rangeButtons.forEach((item) => item.classList.toggle("active", item === button));
    const data = ranges[button.dataset.range];
    document.getElementById("revenue").textContent = data.revenue;
    document.getElementById("visits").textContent = data.visits;
    document.getElementById("orders").textContent = data.orders;
    document.getElementById("conversion").textContent = data.conversion;
  });
});

const searchInput = document.getElementById("dashboard-search");
const searchForm = document.getElementById("product-search");
const productRows = Array.from(document.querySelectorAll(".product-row"));
const noResults = document.getElementById("no-results");

function filterProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase("ar");
  let visibleRows = 0;
  productRows.forEach((row) => {
    const matches = row.dataset.search.toLocaleLowerCase("ar").includes(query);
    row.hidden = !matches;
    if (matches) visibleRows += 1;
  });
  noResults.hidden = visibleRows > 0;
}

searchInput.addEventListener("input", filterProducts);
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterProducts();
  document.getElementById("products").scrollIntoView({ behavior: "smooth", block: "center" });
});

const notificationToggle = document.getElementById("notification-toggle");
const notificationMenu = document.getElementById("notification-menu");
const notificationCount = document.getElementById("notification-count");
const unreadLabel = document.getElementById("unread-label");
const notificationList = document.getElementById("notification-list");
const notificationsEmpty = document.getElementById("notifications-empty");
const markAllReadButton = document.getElementById("mark-all-read");
const notifications = [
  { id: 1, icon: "▣", tone: "purple", title: "طلب جديد #1048", message: "وصلك طلب جديد بقيمة ١٬٢٨٠ ج.م.", time: "منذ ٥ دقائق", target: "#products", read: false },
  { id: 2, icon: "!", tone: "gold", title: "مخزون منخفض", message: "متبقي ٣ قطع من مزهرية هدوء.", time: "منذ ٣٠ دقيقة", target: "#products", read: false },
  { id: 3, icon: "↗", tone: "green", title: "زيادة في الزيارات", message: "الزيارات أعلى من الأسبوع الماضي بنسبة ١٨٪.", time: "منذ ساعة", target: "#reports", read: false },
  { id: 4, icon: "✓", tone: "green", title: "تم تحديث التقرير", message: "بيانات الأسبوع جاهزة للمراجعة.", time: "منذ ساعتين", target: "#activity", read: false },
  { id: 5, icon: "✦", tone: "purple", title: "هدف المبيعات", message: "وصلت لهدف المبيعات اليومي.", time: "اليوم، ٩:٣٠ ص", target: "#reports", read: false },
  { id: 6, icon: "✉", tone: "gold", title: "تقييم جديد", message: "عميل جديد شارك رأيه في تجربته.", time: "أمس", target: "#activity", read: true }
];

function renderNotifications() {
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  notificationCount.textContent = unreadCount;
  notificationCount.hidden = unreadCount === 0;
  unreadLabel.textContent = unreadCount ? `(${unreadCount} غير مقروء)` : "(تمت القراءة)";
  notificationToggle.setAttribute(
    "aria-label",
    unreadCount ? `الإشعارات، ${unreadCount} غير مقروءة` : "الإشعارات، كلها مقروءة"
  );
  notificationsEmpty.hidden = notifications.length > 0;
  markAllReadButton.disabled = unreadCount === 0;
  notificationList.replaceChildren(...notifications.map((notification) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `notification-item${notification.read ? "" : " unread"}`;
    item.dataset.notificationId = notification.id;

    const icon = document.createElement("span");
    icon.className = `notification-icon ${notification.tone}`;
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = notification.icon;

    const copy = document.createElement("span");
    copy.className = "notification-copy";
    const title = document.createElement("strong");
    title.textContent = notification.title;
    const message = document.createElement("p");
    message.textContent = notification.message;
    const time = document.createElement("small");
    time.textContent = notification.time;
    copy.append(title, message, time);

    const unreadDot = document.createElement("span");
    unreadDot.className = "unread-dot";
    unreadDot.setAttribute("aria-hidden", "true");
    item.append(icon, copy, unreadDot);
    return item;
  }));
}

notificationToggle.addEventListener("click", () => {
  const isExpanded = notificationToggle.getAttribute("aria-expanded") === "true";
  notificationToggle.setAttribute("aria-expanded", String(!isExpanded));
  notificationMenu.hidden = isExpanded;
  if (!isExpanded) renderNotifications();
});

notificationList.addEventListener("click", (event) => {
  const item = event.target.closest("button[data-notification-id]");
  if (!item) return;

  const notification = notifications.find((entry) => entry.id === Number(item.dataset.notificationId));
  if (!notification) return;
  notification.read = true;
  renderNotifications();
  notificationToggle.setAttribute("aria-expanded", "false");
  notificationMenu.hidden = true;
  document.querySelector(notification.target).scrollIntoView({ behavior: "smooth" });
});

markAllReadButton.addEventListener("click", () => {
  notifications.forEach((notification) => {
    notification.read = true;
  });
  renderNotifications();
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".notification-wrap")) {
    notificationToggle.setAttribute("aria-expanded", "false");
    notificationMenu.hidden = true;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    notificationToggle.setAttribute("aria-expanded", "false");
    notificationMenu.hidden = true;
  }
});

renderNotifications();

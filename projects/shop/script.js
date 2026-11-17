const products = {
  vase: { name: "مزهرية هدوء", price: 480, image: "images/vase.svg" },
  lamp: { name: "مصباح مساء", price: 920, image: "images/lamp.svg" },
  bowl: { name: "وعاء يومي", price: 360, image: "images/bowl.svg" }
};
const cartKey = "forme-cart-v1";
const cartCount = document.getElementById("cart-count");
const cartDialog = document.getElementById("cart-dialog");
const cartItems = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartFooter = document.getElementById("cart-footer");
const cartTotal = document.getElementById("cart-total");
const cartItemLabel = document.getElementById("cart-item-label");
const toast = document.getElementById("toast");
const numberFormat = new Intl.NumberFormat("ar-EG");
let toastTimer;
let cart = loadCart();

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

function loadCart() {
  let saved;
  try {
    saved = window.localStorage.getItem(cartKey);
  } catch (error) {
    showToast("التخزين غير متاح؛ السلة هتفضل شغالة خلال الزيارة دي.");
    return {};
  }
  if (!saved) return {};

  try {
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new TypeError("Invalid cart data");
    }
    return Object.fromEntries(
      Object.entries(parsed).filter(([id, quantity]) =>
        Object.prototype.hasOwnProperty.call(products, id) &&
        Number.isInteger(quantity) && quantity > 0
      )
    );
  } catch (error) {
    showToast("تعذر استعادة السلة المحفوظة؛ ابدأ سلة جديدة.");
    return {};
  }
}

function saveCart() {
  try {
    window.localStorage.setItem(cartKey, JSON.stringify(cart));
    return true;
  } catch (error) {
    return false;
  }
}

function formatPrice(price) {
  return `${numberFormat.format(price)} ج.م`;
}

function createQuantityButton(label, text, action, productId) {
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.dataset.action = action;
  button.dataset.productId = productId;
  button.textContent = text;
  return button;
}

function createCartItem(productId, quantity) {
  const product = products[productId];
  const item = document.createElement("article");
  item.className = "cart-item";

  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.name;
  item.append(image);

  const info = document.createElement("div");
  info.className = "cart-item-info";
  const name = document.createElement("h3");
  name.textContent = product.name;
  const unitPrice = document.createElement("p");
  unitPrice.textContent = `للقطعة: ${formatPrice(product.price)}`;
  const actions = document.createElement("div");
  actions.className = "cart-item-actions";
  const quantityControl = document.createElement("div");
  quantityControl.className = "quantity-control";
  quantityControl.append(
    createQuantityButton(`تقليل كمية ${product.name}`, "−", "decrease", productId)
  );
  const quantityLabel = document.createElement("span");
  quantityLabel.textContent = numberFormat.format(quantity);
  quantityControl.append(quantityLabel);
  quantityControl.append(
    createQuantityButton(`زيادة كمية ${product.name}`, "+", "increase", productId)
  );
  const remove = createQuantityButton(`حذف ${product.name} من السلة`, "حذف", "remove", productId);
  remove.className = "remove-item";
  actions.append(quantityControl, remove);
  info.append(name, unitPrice, actions);
  item.append(info);

  const lineTotal = document.createElement("strong");
  lineTotal.className = "cart-item-price";
  lineTotal.textContent = formatPrice(product.price * quantity);
  item.append(lineTotal);
  return item;
}

function renderCart() {
  const entries = Object.entries(cart);
  const itemCount = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const total = entries.reduce((sum, [id, quantity]) => sum + products[id].price * quantity, 0);

  cartCount.textContent = numberFormat.format(itemCount);
  cartItemLabel.textContent = `${numberFormat.format(itemCount)} ${itemCount === 1 ? "منتج" : "منتجات"}`;
  cartTotal.textContent = formatPrice(total);
  cartEmpty.hidden = itemCount > 0;
  cartFooter.hidden = itemCount === 0;
  cartItems.replaceChildren(...entries.map(([id, quantity]) => createCartItem(id, quantity)));
}

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.productId;
    const product = products[productId];
    if (!product) {
      showToast("المنتج ده مش متاح حاليًا.");
      return;
    }
    cart[productId] = (cart[productId] || 0) + 1;
    const saved = saveCart();
    renderCart();
    showToast(saved
      ? `اتضاف ${product.name} للسلة`
      : "اتضاف المنتج مؤقتًا؛ تعذر حفظ السلة للزيارة القادمة.");
  });
});

document.getElementById("open-cart").addEventListener("click", () => {
  renderCart();
  cartDialog.showModal();
});

document.getElementById("close-cart").addEventListener("click", () => cartDialog.close());
document.getElementById("continue-shopping").addEventListener("click", () => {
  cartDialog.close();
  document.getElementById("collection").scrollIntoView({ behavior: "smooth" });
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, productId } = button.dataset;
  if (!Object.prototype.hasOwnProperty.call(products, productId) || !cart[productId]) return;

  if (action === "increase") cart[productId] += 1;
  if (action === "decrease") {
    cart[productId] -= 1;
    if (cart[productId] === 0) delete cart[productId];
  }
  if (action === "remove") delete cart[productId];

  const saved = saveCart();
  renderCart();
  if (!saved) showToast("تم تحديث السلة مؤقتًا؛ تعذر حفظها للزيارة القادمة.");
});

document.getElementById("clear-cart").addEventListener("click", () => {
  cart = {};
  const saved = saveCart();
  renderCart();
  if (!saved) showToast("تم إفراغ السلة الحالية، لكن تعذر حفظ التغيير.");
});

document.getElementById("checkout-button").addEventListener("click", () => {
  const entries = Object.entries(cart);
  if (entries.length === 0) return;

  const total = entries.reduce((sum, [id, quantity]) => sum + products[id].price * quantity, 0);
  const lines = entries.map(([id, quantity]) =>
    `- ${products[id].name} × ${numberFormat.format(quantity)} = ${formatPrice(products[id].price * quantity)}`
  );
  const message = ["أهلًا، عايز أأكد الطلب ده:", ...lines, `الإجمالي: ${formatPrice(total)}`].join("\n");
  window.location.href = `https://wa.me/201095295675?text=${encodeURIComponent(message)}`;
});

cartDialog.addEventListener("click", (event) => {
  if (event.target === cartDialog) cartDialog.close();
});

renderCart();

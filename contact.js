document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("contact-form");
const whatsappNumber = "201095295675";

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const message = [
    `أهلًا مروان، أنا ${formData.get("name")}.`,
    `نوع المشروع: ${formData.get("project")}.`,
    "",
    formData.get("message")
  ].join("\n");

  window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
});

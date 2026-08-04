
export function getWhatsAppLink(phone, message = "") {
  if (!phone) return null;

  let digits = phone.replace(/[^\d]/g, "");

  if (digits.startsWith("0")) {
    digits = "254" + digits.slice(1);
  }

  if (!digits) return null;

  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
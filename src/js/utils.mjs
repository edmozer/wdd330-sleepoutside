// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getCartItemCount(key = "so-cart") {
  const cart = getLocalStorage(key) || [];
  if (!Array.isArray(cart)) return 0;

  return cart.reduce((sum, item) => {
    const qty = Number(item.Quantity ?? item.quantity ?? 1);
    return sum + (Number.isFinite(qty) ? qty : 1);
  }, 0);
}

export function updateCartBadge(badgeId = "cartBadge", key = "so-cart") {
  const badge = document.getElementById(badgeId);
  if (!badge) return;

  const count = getCartItemCount(key);
  if (count > 0) {
    badge.textContent = String(count);
    badge.style.display = "inline-block";
  } else {
    badge.textContent = "";
    badge.style.display = "none";
  }
}

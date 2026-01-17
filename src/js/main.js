import { updateCartBadge } from './utils.mjs';

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});

window.addEventListener('focus', updateCartBadge);

import { updateCartBadge } from './utils.mjs';
import ProductData from './ProductData.mjs';

async function addDiscountIndicators() {
  const cards = [...document.querySelectorAll('[data-product-id]')];
  if (cards.length === 0) return;

  const byCategory = new Map();
  cards.forEach((card) => {
    const category = card.dataset.productCategory || 'tents';
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category).push(card);
  });

  await Promise.all(
    [...byCategory.entries()].map(async ([category, categoryCards]) => {
      try {
        const dataSource = new ProductData(category);
        const products = await dataSource.getData();
        const byId = new Map(products.map((p) => [p.Id, p]));

        categoryCards.forEach((card) => {
          const productId = card.dataset.productId;
          const product = byId.get(productId);
          if (!product) return;

          const srp = Number(product.SuggestedRetailPrice);
          const finalPrice = Number(product.FinalPrice);
          if (
            !Number.isFinite(srp) ||
            !Number.isFinite(finalPrice) ||
            finalPrice >= srp
          )
            return;

          const percentOff = Math.round(((srp - finalPrice) / srp) * 100);
          if (percentOff <= 0) return;

          if (card.querySelector('.discount-badge')) return;

          const badge = document.createElement('span');
          badge.className = 'discount-badge';
          badge.textContent = `Save ${percentOff}%`;
          badge.setAttribute('aria-label', `${percentOff}% off`);

          const link = card.querySelector('a');
          if (link) link.prepend(badge);
        });
      } catch (err) {
        // Ignore discount indicator failures; page should still render.
      }
    }),
  );
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  addDiscountIndicators();
});

window.addEventListener('focus', updateCartBadge);

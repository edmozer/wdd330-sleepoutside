const { getCartItemCount, updateCartBadge } = require('../js/utils.mjs');

function setCart(value, key = 'so-cart') {
  localStorage.setItem(key, JSON.stringify(value));
}

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = '';
});

describe('Cart badge helpers', () => {
  test('getCartItemCount returns 0 when cart missing', async () => {
    expect(getCartItemCount()).toBe(0);
  });

  test('getCartItemCount counts array items (default qty=1)', async () => {
    setCart([{ Id: 'a' }, { Id: 'b' }]);
    expect(getCartItemCount()).toBe(2);
  });

  test('getCartItemCount sums Quantity/quantity when present', async () => {
    setCart([{ Quantity: 2 }, { quantity: 3 }, { Quantity: 'nope' }]);
    expect(getCartItemCount()).toBe(6);
  });

  test('updateCartBadge hides badge when count is 0', async () => {
    document.body.innerHTML = '<span id="cartBadge"></span>';
    updateCartBadge();

    const badge = document.getElementById('cartBadge');
    expect(badge.style.display).toBe('none');
    expect(badge.innerHTML).toBe('');
    expect(badge.getAttribute('aria-label')).toBe(null);
  });

  test('updateCartBadge shows sup count and aria-label when count > 0', async () => {
    document.body.innerHTML = '<span id="cartBadge"></span>';
    setCart([{ Id: 'a' }, { Id: 'b' }]);
    updateCartBadge();

    const badge = document.getElementById('cartBadge');
    expect(badge.style.display).toBe('inline-block');
    expect(badge.innerHTML).toBe('<sup>2</sup>');
    expect(badge.getAttribute('aria-label')).toBe('2 items in cart');
  });

  test('updateCartBadge no-ops when badge element missing', async () => {
    setCart([{ Id: 'a' }]);
    expect(() => updateCartBadge()).not.toThrow();
  });
});

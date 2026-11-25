// Cart drawer and search overlay for the round 2 header. Kept outside the React page so any page can load it.
// The header's Search and Cart buttons open them; ?cart=open|empty, &account=in and ?search[=term] open a state for review links.
(function () {
  var params = new URLSearchParams(location.search);
  var LOGGED_IN = params.get('account') === 'in';
  var FREE_SHIPPING = 200;

  var CROW = { id: 'crow', t: 'The Crow', ver: '6.75', v: 'Matte Black,  8.5', price: 195, i: 'assets/cart-crow.jpg' };
  var START = [
    { id: 'shirt', t: 'The Seven-Year Shirt', v: 'Heather Gray,  S', price: 24, i: 'assets/cart-shirt.webp' },
    { id: 'glove', t: 'The Getaway Glove', v: 'Black,  S', price: 85, i: 'assets/cart-glove.webp' }
  ];
  var cart = params.get('cart') === 'empty' ? [] : (params.get('cart') === 'open' ? [CROW].concat(START) : START.slice()).map(function (p) { return Object.assign({ qty: 1 }, p); });

  var a = function (f) { return 'assets/' + f; };
  var P = function (t, s, price, i, href, c) { return { t: t, s: s, price: price, i: a(i), href: href || '#', c: c || '' }; };
  var BOOT = function (t, s, i, c) { return P(t, s + ' Motorcycle Boots', 195, i, 'round2.html', c); };
  // Figma's order for "boots": Crow, Comanche, Apache, Knight, Armstrong, Cheyenne
  var CATALOG = [
    BOOT('The Crow', 'Waterproof', 'crow-side.jpg', 'Black'),
    BOOT('The Comanche', 'Waterproof', 'b4fdc64b58341ddee59d8b1aea86ab19.webp', 'Brown'),
    BOOT('The Apache', 'Waterproof', '707b4ae24b6fc5da02ec94dc8170eb28.webp', 'Brown'),
    BOOT('The Knight', 'Ventilated', '61ab92a9e8bc7b933e060cdd43be289d.jpg', 'Black'),
    BOOT('The Armstrong', 'Ventilated', '29ef2d88d41e65074a13462701b9ca56.webp', 'Brown'),
    BOOT('The Cheyenne', 'Waterproof', 'aa98e6afa39ea5cd228e08dfc5cbcfaf.webp', 'Brown'),
    BOOT('The Crossfield', 'Ventilated', '28eed0cd72d4d4e5624ce0b834af017f.webp', 'Black'),
    BOOT('The Walker', 'Ventilated', 'd8e176e1765480864c1eb36df2ab3a9e.webp', 'Brown'),
    BOOT('The Mohawk', 'Waterproof', '0408235c38f4cc93a8a8b19b32673e1c.webp', 'Brown'),
    BOOT('The Risky Boot', 'Limited Edition', '025ca2063c3d000d49befb47259872cb.webp', 'Gray'),
    P('The Getaway Glove', 'Motorcycle Gloves', 85, 'bebe2b5742b930cf9ba85bf80c9222cc.webp'),
    P('The Golden Glove', 'Motorcycle Gloves', 85, 'e8c53f3c844397af48646f9a61938b55.jpg'),
    P('Denim On Brown', 'Motorcycle Gloves', 85, '8ab98c6b6812dc23c370d31ef130d712.jpg'),
    P('Sons Of Speed', 'The Seven-Year Shirt', 24, '812d36e7b003d02960cfb189ce318a34.webp'),
    P('Gold Skull On Navy', 'The Seven-Year Shirt', 24, '214926dd2a845505f301eacac923d151.webp'),
    P('The American', 'Motorcycle Mask', 9.99, '8f86f4c64563d8ffd8a738c96c488e51.jpg'),
    P('The Original Skull', 'Motorcycle Mask', 9.99, '7aa9b315c0c77705a756152d22ae6285.jpg'),
    P('Riding Sleeves', 'Motorcycle Sleeves', 24, 'db2bb172fcc0c233affe08e81c553604.webp')
  ];
  var byName = function (t) { return CATALOG.filter(function (p) { return p.t === t; })[0]; };
  var recent = ['The Crow', 'The Comanche', 'The American', 'Sons Of Speed'].map(byName);
  var TERMS = ['brown motorcycle boots', 'motorcycle boots', 'boot', 'waterproof boots', 'ventilated boots', 'motorcycle gloves', 'seven-year shirt', 'motorcycle mask'];

  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); };
  var money = function (n) { return n % 1 ? n.toFixed(2) : String(n); };
  var root = document.createElement('div');
  root.className = 'ir-ov';
  document.body.appendChild(root);

  var open = '', query = '', discountOpen = false, opener = null;

  function show(which) {
    if (!open) opener = document.activeElement;
    open = which;
    document.documentElement.classList.toggle('ir-locked', !!which);
    render();
    if (!which && opener) opener.focus();
    var f = which === 'search' ? root.querySelector('.ir-s__input') : root.querySelector('.ir-close');
    if (f) f.focus();
  }

  function total() { return cart.reduce(function (n, p) { return n + p.price * p.qty; }, 0); }

  function cartHTML() {
    var count = cart.reduce(function (n, p) { return n + p.qty; }, 0);
    var close = '<button type="button" class="ir-close" data-act="close" aria-label="Close cart"><img src="assets/cart-close.svg" width="32" height="32" alt=""></button>';
    if (!cart.length) {
      return '<div class="ir-c__head ir-c__head--empty">' + close + '</div>' +
        '<div class="ir-c__empty"><h2>Your cart is empty</h2>' +
        (LOGGED_IN ? '' : '<p>Have an account? <a href="#">Log in</a> to check out faster.</p>') +
        '<button type="button" class="btn-red" data-act="close">Continue shopping</button></div>';
    }
    var rows = cart.map(function (p, i) {
      return '<li class="ir-c__row"><img class="ir-c__img" src="' + p.i + '" alt="">' +
        '<div class="ir-c__info"><div class="ir-c__top"><p class="ir-c__t">' + esc(p.t) + (p.ver ? ' <small>' + p.ver + '</small>' : '') + '</p><p class="ir-c__p">$ ' + p.price.toFixed(2) + '</p></div>' +
        '<p class="ir-c__v">' + esc(p.v) + '</p>' +
        '<div class="ir-c__qty"><div class="ir-q"><button type="button" data-act="dec" data-i="' + i + '" aria-label="Decrease quantity"' + (p.qty === 1 ? ' class="is-min"' : '') + '><img src="assets/cart-minus.svg" width="14" height="14" alt=""></button>' +
        '<span aria-live="polite">' + p.qty + '</span>' +
        '<button type="button" data-act="inc" data-i="' + i + '" aria-label="Increase quantity"><img src="assets/cart-plus.svg" width="14" height="14" alt=""></button></div>' +
        '<button type="button" class="ir-c__rm" data-act="rm" data-i="' + i + '" aria-label="Remove ' + esc(p.t) + '"><img src="assets/cart-trash.svg" width="20" height="20" alt=""></button></div></div></li>';
    }).join('');
    return '<div class="ir-c__head"><div class="ir-c__bar"><h2>Cart <span class="ir-c__n">' + count + '</span></h2>' + close + '</div>' +
      (total() >= FREE_SHIPPING ? '<p class="ir-c__ship">Your cart qualifies for free shipping</p>' : '') + '</div>' +
      '<ul class="ir-c__items">' + rows + '</ul>' +
      '<div class="ir-c__foot">' +
      '<div class="ir-c__disc"><button type="button" data-act="disc" aria-expanded="' + discountOpen + '">Discount<img src="assets/cart-discount-plus.svg" width="14" height="14" alt=""></button>' +
      (discountOpen ? '<form class="ir-c__code" onsubmit="return false"><input type="text" placeholder="Discount code" aria-label="Discount code"><button type="submit" class="btn-red">Apply</button></form>' : '') + '</div>' +
      '<div class="ir-c__sum"><p class="ir-c__total"><span>Estimated total</span><span>$ ' + money(total()) + ' USD</span></p>' +
      '<p class="ir-c__pay"><span class="ir-c__zero"><img src="assets/pay-zero.svg" width="16" height="16" alt="">Zero interest</span><span>4 payments, or from <b>$20.67</b>/mo with</span><img src="assets/pay-shop-word.svg" width="34" height="14" alt="Shop Pay"><img src="assets/pay-help.svg" width="20" height="20" alt=""></p>' +
      '<p class="ir-c__tax">Taxes and <a href="#">shipping</a> calculated at checkout.</p></div>' +
      '<a class="btn-red ir-c__checkout" href="#">Checkout</a>' +
      '<div class="ir-c__wallets"><a href="#" class="is-shop" aria-label="Shop Pay"><img src="assets/pay-shop.svg" width="51" height="20" alt=""></a><a href="#" class="is-paypal" aria-label="PayPal"><img src="assets/pay-paypal.svg" width="76" height="24" alt=""></a><a href="#" class="is-gpay" aria-label="Google Pay"><img src="assets/pay-gpay.svg" width="50" height="21" alt=""></a></div>' +
      '</div>';
  }

  function cards(list) {
    return '<ul class="ir-s__grid">' + list.map(function (p) {
      return '<li><a class="ir-s__card" href="' + p.href + '"><span class="ir-s__img"><img src="' + p.i + '" alt=""></span><b>' + esc(p.t) + '</b><span class="ir-s__sub"><span>' + esc(p.s) + '</span><span>$' + money(p.price) + '</span></span></a></li>';
    }).join('') + '</ul>';
  }

  function searchHTML() {
    var q = query.trim().toLowerCase(), body;
    if (!q) {
      body = recent.length ? '<div class="ir-s__h"><h3>Recently viewed</h3><button type="button" data-act="clear-recent">Clear</button></div>' + cards(recent) : '';
    } else {
      var words = q.split(/\s+/);
      var hits = CATALOG.filter(function (p) { var text = (p.t + ' ' + p.s + ' ' + p.c).toLowerCase(); return words.every(function (w) { return text.indexOf(w) >= 0; }); });
      var terms = TERMS.filter(function (t) { return t.indexOf(q) >= 0 || q.indexOf(t) >= 0; });
      if (!hits.length) {
        body = '<p class="ir-s__none">No results found for "' + esc(query.trim()) + '". Try another search.</p>';
      } else {
        // The part of a suggestion the shopper already typed is set lighter, as in Figma
        var chips = terms.map(function (t) { var i = t.indexOf(q); if (i < 0) return '<button type="button" data-act="term" data-term="' + esc(t) + '">' + esc(t) + '</button>'; return '<button type="button" data-act="term" data-term="' + esc(t) + '">' + esc(t.slice(0, i)) + '<span>' + esc(t.slice(i, i + q.length)) + '</span>' + esc(t.slice(i + q.length)) + '</button>'; }).join('');
        body = (chips ? '<div class="ir-s__chips">' + chips + '</div>' : '') + '<div class="ir-s__h"><h3>Products</h3></div>' + cards(hits.slice(0, 6)) +
          '<div class="ir-s__all"><a class="btn-red" href="plp.html?q=' + encodeURIComponent(query.trim()) + '">View all</a></div>';
      }
    }
    return '<form class="ir-s__bar" role="search" action="plp.html"><img class="ir-s__icon" src="assets/search-icon.svg" width="22" height="22" alt="">' +
      '<input class="ir-s__input" name="q" type="search" placeholder="Search" aria-label="Search" autocomplete="off" value="' + esc(query) + '">' +
      (query ? '<button type="button" class="ir-s__clear" data-act="clear">Clear</button>' : '') +
      '<button type="button" class="ir-close" data-act="close" aria-label="Close search"><img src="assets/search-close.svg" width="32" height="32" alt=""></button></form>' +
      '<div class="ir-s__body">' + body + '</div>';
  }

  function render() {
    root.innerHTML = !open ? '' : '<div class="ir-ov__shade ir-ov__shade--' + open + '" data-act="close"></div>' +
      (open === 'cart' ? '<aside class="ir-c" role="dialog" aria-modal="true" aria-label="Cart">' + cartHTML() + '</aside>'
        : '<div class="ir-s' + (query.trim() ? ' is-typed' : '') + '" role="dialog" aria-modal="true" aria-label="Search">' + searchHTML() + '</div>');
  }

  // Re-renders only the results so the input keeps focus and caret while typing
  function renderResults() {
    var fresh = document.createElement('div');
    fresh.innerHTML = searchHTML();
    root.querySelector('.ir-s__body').replaceWith(fresh.querySelector('.ir-s__body'));
    root.querySelector('.ir-s').classList.toggle('is-typed', !!query.trim());
    var clear = root.querySelector('.ir-s__clear'), want = fresh.querySelector('.ir-s__clear');
    if (!clear && want) root.querySelector('.ir-s__input').after(want);
    if (clear && !want) clear.remove();
  }

  root.addEventListener('input', function (e) { if (e.target.classList.contains('ir-s__input')) { query = e.target.value; renderResults(); } });
  root.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.dataset.act, p = cart[+el.dataset.i];
    if (act === 'close') return show('');
    if (act === 'inc') p.qty++;
    if (act === 'dec' && p.qty > 1) p.qty--;
    if (act === 'rm') cart.splice(+el.dataset.i, 1);
    if (act === 'disc') discountOpen = !discountOpen;
    if (act === 'clear-recent') recent = [];
    if (act === 'clear' || act === 'term') {
      query = act === 'term' ? el.dataset.term : '';
      renderResults();
      root.querySelector('.ir-s__input').value = query;
      return root.querySelector('.ir-s__input').focus();
    }
    render();
    // Re-rendering drops focus; put it back on the search field, or on the same control in the cart
    var f = open === 'search' ? root.querySelector('.ir-s__input') : root.querySelector('[data-act="' + act + '"]' + (el.dataset.i ? '[data-i="' + el.dataset.i + '"]' : '')) || root.querySelector('.ir-close');
    if (f) f.focus();
  });

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) show(''); });
  document.addEventListener('click', function (e) {
    if (e.composedPath().includes(root)) return;
    if (e.target.closest('[aria-label="Search"]')) { e.preventDefault(); return show('search'); }
    if (e.target.closest('[aria-label^="Cart"]')) { e.preventDefault(); return show('cart'); }
    var btn = e.target.closest('.btn-red');
    if (btn && /^Add/.test(btn.textContent.trim())) {
      var crow = cart.filter(function (p) { return p.id === 'crow'; })[0];
      if (crow) crow.qty++; else cart.unshift(Object.assign({ qty: 1 }, CROW));
      show('cart');
    }
  });

  if (params.has('cart')) show('cart');
  if (params.has('search')) { query = params.get('search'); show('search'); }
})();

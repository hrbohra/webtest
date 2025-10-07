
// Premium UI enhancements: classier cart toast and improved cart handling
(function(){
  // helper: find product by id from global products array
  function findProduct(id){
    if(typeof products === 'undefined') return null;
    return products.find(p=>p.id===id) || null;
  }

  // format price (assumes p is integer cents)
  function formatPrice(p){
    return '£' + (p/100).toFixed(2);
  }

  // update cart count in header
  function updateCartCount(){
    const cart = JSON.parse(localStorage.getItem('bb_cart')||'{}');
    const count = Object.values(cart).reduce((s,q)=>s+q,0);
    const el = document.getElementById('cart-count');
    if(el) el.textContent = count;
  }

  // show toast
  function showToast({title, img, qty, price, id}){
    const container = document.getElementById('toast-container');
    if(!container) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `
      <img src="${img}" alt="${title}">
      <div class="meta">
        <div class="desc"> added </div>
      </div>
      <div class="actions">
        <button class="view" data-id="${id}">View Cart</button>
        <button class="close" aria-label="dismiss">&times;</button>
      </div>
    `;
    container.prepend(t);
    // trigger show
    requestAnimationFrame(()=> t.classList.add('show'));
    // auto-dismiss
    const timeout = setTimeout(()=> closeToast(t), 4200);
    // handlers
    t.querySelector('.close').addEventListener('click', ()=> { clearTimeout(timeout); closeToast(t); });
    t.querySelector('.view').addEventListener('click', (e)=>{
      window.location.href = '/cart.html';
    });
  }

  function closeToast(t){
    t.classList.remove('show');
    setTimeout(()=> t.remove(), 350);
  }

  // New addToCart function that replaces previous behavior
  window.addToCart = function addToCart(productId, qty=1){
    try{
      const cart = JSON.parse(localStorage.getItem('bb_cart')||'{}');
      cart[productId] = (cart[productId]||0) + qty;
      localStorage.setItem('bb_cart', JSON.stringify(cart));
      updateCartCount();

      const p = findProduct(productId) || { name: 'Item', price: 0, image: '/images/tee.png', id: productId };
      showToast({ title: p.name, img: p.image, qty: qty, price: p.price, id: p.id });
    }catch(err){
      console.error('addToCart error', err);
    }
  };

  // Init count
  updateCartCount();

  // Optional: animate cart-link on new items briefly
  const cartLink = document.getElementById('cart-link');
  if(cartLink){
    const observer = new MutationObserver(()=> {
      cartLink.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)' }, { transform: 'translateY(0)' }], { duration: 420, iterations: 1 });
    });
    const cartCount = document.getElementById('cart-count');
    if(cartCount) observer.observe(cartCount, { childList: true, characterData: true, subtree: true });
  }

})();

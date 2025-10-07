// Main site script — injects products and manages a light local cart
(function(){
  const productListEl = document.getElementById('product-list');
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  function formatPrice(p){
    return '£' + (p/100).toFixed(2);
  }

  function updateCartCount(){
    const cart = JSON.parse(localStorage.getItem('bb_cart')||'{}');
    const count = Object.values(cart).reduce((s,q)=>s+q,0);
    const el = document.getElementById('cart-count');
    if(el) el.textContent = count;
  }

  function addToCart(id){
    const cart = JSON.parse(localStorage.getItem('bb_cart')||'{}');
    cart[id] = (cart[id]||0)+1;
    localStorage.setItem('bb_cart', JSON.stringify(cart));
    updateCartCount();
    // small UI feedback could be improved
    alert('Added to cart');
  }

  if(productListEl){
    window.PRODUCTS.forEach(p=>{
      const card = document.createElement('article');card.className='card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <div class="price">${formatPrice(p.price)}</div>
        <div style="margin-top:10px">
          <button class="btn" onclick="addToCart('${p.id}')">Add to cart</button>
        </div>
      `;
      productListEl.appendChild(card);
    });
  }

  // Expose addToCart to global so inline onclick works
  window.addToCart = addToCart;

  // initial count
  updateCartCount();
})();

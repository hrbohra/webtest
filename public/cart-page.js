// Cart page logic and checkout flow
(function(){
  const cartItemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  function formatPrice(p){ return '£' + (p/100).toFixed(2); }

  function render(){
    const cart = JSON.parse(localStorage.getItem('bb_cart')||'{}');
    const items = Object.keys(cart).map(id=>{
      const product = window.PRODUCTS.find(p=>p.id===id);
      return { product, qty: cart[id] };
    });
    cartItemsEl.innerHTML='';
    let total=0;
    if(items.length===0){ cartItemsEl.innerHTML='<p>Your cart is empty.</p>'; checkoutBtn.disabled=true; totalEl.textContent='£0.00'; return; }
    items.forEach(it=>{
      const row = document.createElement('div');
      row.className='card';
      row.style.display='flex';
      row.style.justifyContent='space-between';
      row.style.alignItems='center';
      row.style.marginBottom='12px';
      row.innerHTML = `
        <div style="display:flex;gap:12px;align-items:center">
          <img src="${it.product.image}" style="width:80px;height:80px;object-fit:cover;border-radius:6px">
          <div>
            <div><strong>${it.product.name}</strong></div>
            <div class="muted">${formatPrice(it.product.price)} each</div>
          </div>
        </div>
        <div style="text-align:right">
          <div>Qty: <input type="number" min="1" value="${it.qty}" data-id="${it.product.id}" style="width:60px"></div>
          <div style="margin-top:8px">Line: <strong>${formatPrice(it.product.price * it.qty)}</strong></div>
          <div style="margin-top:8px"><button class="btn" data-remove="${it.product.id}">Remove</button></div>
        </div>
      `;
      cartItemsEl.appendChild(row);
      total += it.product.price * it.qty;
    });
    totalEl.textContent = formatPrice(total);
    checkoutBtn.disabled = false;

    // wire quantity changes
    cartItemsEl.querySelectorAll('input[type=number]').forEach(inp=>{
      inp.addEventListener('change', e=>{
        const id = e.target.getAttribute('data-id');
        const val = Math.max(1, parseInt(e.target.value||1));
        const cart = JSON.parse(localStorage.getItem('bb_cart')||'{}');
        cart[id]=val; localStorage.setItem('bb_cart', JSON.stringify(cart)); render();
      });
    });

    cartItemsEl.querySelectorAll('[data-remove]').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const id = e.target.getAttribute('data-remove');
        const cart = JSON.parse(localStorage.getItem('bb_cart')||'{}');
        delete cart[id]; localStorage.setItem('bb_cart', JSON.stringify(cart)); render();
      });
    });
  }

  async function handleCheckout(){
    const cart = JSON.parse(localStorage.getItem('bb_cart')||'{}');
    if(Object.keys(cart).length===0){ alert('Cart is empty'); return; }

    // Build items payload
    const items = Object.keys(cart).map(id=>({ id, quantity: cart[id] }));

    // call serverless function to create a Stripe Checkout session
    checkoutBtn.disabled = true; checkoutBtn.textContent = 'Redirecting...';
    try{
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      const data = await res.json();
      if(data.url){
        // clear cart (optional)
        localStorage.removeItem('bb_cart');
        window.location = data.url; // redirect to Stripe Checkout
      } else {
        alert('Failed to create checkout session'); checkoutBtn.disabled=false; checkoutBtn.textContent='Checkout';
      }
    }catch(err){
      console.error(err); alert('Checkout failed'); checkoutBtn.disabled=false; checkoutBtn.textContent='Checkout';
    }
  }

  if(checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);
  render();
})();

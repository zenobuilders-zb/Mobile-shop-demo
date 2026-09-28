const state={
 view:"home",
 products:[
  {id:1,brand:"Samsung",name:"Galaxy A56",variant:"8GB / 256GB",price:41999,cost:37500,stock:4,imei:true},
  {id:2,brand:"Redmi",name:"Note 14 Pro",variant:"8GB / 128GB",price:24999,cost:22000,stock:7,imei:true},
  {id:3,brand:"Apple",name:"iPhone 15",variant:"128GB",price:52999,cost:48500,stock:1,imei:true},
  {id:4,brand:"OnePlus",name:"Nord CE 4",variant:"8GB / 128GB",price:24999,cost:21600,stock:5,imei:true},
  {id:5,brand:"Accessories",name:"USB-C Fast Charger",variant:"33W",price:899,cost:550,stock:3,imei:false}
 ],
 customers:[
  {id:1,name:"Walk-in Customer",phone:"—",purchases:18,spent:284500},
  {id:2,name:"Mohammed",phone:"+91 98XXXXXX12",purchases:12,spent:124500},
  {id:3,name:"Rahul",phone:"+91 97XXXXXX55",purchases:5,spent:48200}
 ],
 sales:[
  {id:"INV-1024",product:"Samsung Galaxy A56",customer:"Mohammed",amount:40999,payment:"UPI",time:"Today, 11:40 AM"},
  {id:"INV-1023",product:"Redmi Note 14 Pro",customer:"Rahul",amount:24999,payment:"Cash",time:"Today, 10:12 AM"},
  {id:"INV-1022",product:"USB-C Fast Charger",customer:"Walk-in Customer",amount:899,payment:"UPI",time:"Yesterday, 6:20 PM"}
 ],
 expenses:[{name:"Shop Rent",amount:15000},{name:"Electricity",amount:3200},{name:"Internet",amount:1000}]
};

const nav=[
 ["home","⌂","Home"],["products","▣","Products"],["sales","▤","Sales"],["customers","♙","Customers"],["reports","◒","Reports"],["expenses","₹","Expenses"],["settings","⚙","Settings"]
];

const $=s=>document.querySelector(s);
function money(n){return "₹"+Number(n).toLocaleString("en-IN")}
function renderNav(){
 $("#sideNav").innerHTML=nav.map(([id,ic,label])=>`<button class="side-item ${state.view===id?"active":""}" onclick="navigate('${id}')"><span>${ic}</span>${label}</button>`).join("");
 $("#bottomNav").innerHTML=nav.slice(0,5).map(([id,ic,label])=>`<button class="bottom-item ${state.view===id?"active":""}" onclick="navigate('${id}')"><span style="font-size:20px">${ic}</span>${label}</button>`).join("");
}
function navigate(view){state.view=view;render();$(".sidebar").classList.remove("open")}
function render(){renderNav();const titles={home:"Dashboard",products:"Products",sales:"Sales",customers:"Customers",reports:"Reports",expenses:"Expenses",settings:"Settings"};$("#pageTitle").textContent=titles[state.view];$("#content").innerHTML=pages[state.view]();$("#fab").style.display=["home","products","customers","expenses"].includes(state.view)?"block":"none"}
const pages={
home:()=>`<div class="content">
<div class="grid stats">
${stat("Today's Sales",money(32450),"↑ 12.4% vs yesterday")}
${stat("Today's Profit",money(6280),"↑ 8.2%")}
${stat("Orders","12","3 pending payments")}
${stat("Stock Value",money(842500),"72 products")}
</div>
<div class="section-title"><h2>Quick Actions</h2></div>
<div class="grid quick">
<button onclick="openSale()"><span style="font-size:23px">＋</span><strong>New Sale</strong><small class="muted">Create invoice</small></button>
<button onclick="openProduct()"><span style="font-size:23px">▣</span><strong>Add Product</strong><small class="muted">Add inventory</small></button>
<button onclick="openCustomer()"><span style="font-size:23px">♙</span><strong>Customer</strong><small class="muted">Add customer</small></button>
<button onclick="alert('Camera/IMEI scanner will be connected in the Android build.')"><span style="font-size:23px">⌕</span><strong>Scan IMEI</strong><small class="muted">Quick lookup</small></button>
</div>
<div class="section-title"><h2>Sales Overview</h2><button class="link-btn" onclick="navigate('reports')">View reports →</button></div>
<div class="grid two-col">
<div class="card"><div class="chart">${[40,60,45,78,62,90,72].map((h,i)=>`<div class="bar" style="height:${h}%"><span>${["M","T","W","T","F","S","S"][i]}</span></div>`).join("")}</div></div>
<div class="card"><div class="section-title" style="margin-top:0"><h2>Low Stock</h2><button class="link-btn" onclick="navigate('products')">See all</button></div><div class="list">${state.products.filter(p=>p.stock<=3).map(p=>`<div class="row"><div><div class="product-name">${p.name}</div><div class="muted">${p.variant}</div></div><span class="pill warn">${p.stock} left</span></div>`).join("")}</div></div>
</div>
<div class="section-title"><h2>Recent Sales</h2><button class="link-btn" onclick="navigate('sales')">See all</button></div>
<div class="card list">${state.sales.map(s=>saleRow(s)).join("")}</div>
</div>`,
products:()=>`<div class="content"><div class="toolbar"><input class="search" placeholder="Search products..." oninput="filterProducts(this.value)"><select class="select"><option>All</option><option>Phones</option><option>Accessories</option><option>Low stock</option></select><button class="primary" onclick="openProduct()">＋ Add</button></div><div class="grid product-grid" id="productGrid">${productCards(state.products)}</div></div>`,
sales:()=>`<div class="content"><div class="toolbar"><input class="search" placeholder="Search invoice or customer..."><select class="select"><option>All payments</option><option>UPI</option><option>Cash</option><option>Card</option></select><button class="primary" onclick="openSale()">＋ New Sale</button></div><div class="card table-card"><table class="table"><thead><tr><th>Invoice</th><th>Product</th><th>Customer</th><th>Payment</th><th>Total</th></tr></thead><tbody>${state.sales.map(s=>`<tr><td><b>${s.id}</b><br><span class="muted">${s.time}</span></td><td>${s.product}</td><td>${s.customer}</td><td><span class="pill green">${s.payment}</span></td><td><b>${money(s.amount)}</b></td></tr>`).join("")}</tbody></table></div></div>`,
customers:()=>`<div class="content"><div class="toolbar"><input class="search" placeholder="Search customers..."><button class="primary" onclick="openCustomer()">＋ Add Customer</button></div><div class="card table-card"><table class="table"><thead><tr><th>Customer</th><th>Phone</th><th>Purchases</th><th>Total spent</th><th></th></tr></thead><tbody>${state.customers.map(c=>`<tr><td><b>${c.name}</b></td><td>${c.phone}</td><td>${c.purchases}</td><td>${money(c.spent)}</td><td><button class="secondary" onclick="alert('Customer profile coming next')">View</button></td></tr>`).join("")}</tbody></table></div></div>`,
reports:()=>`<div class="content"><div class="grid stats">${stat("September Sales",money(482500),"↑ 14.8%")} ${stat("Gross Profit",money(68400),"14.2% margin")} ${stat("Expenses",money(21700),"3 categories")} ${stat("Net Profit",money(46700),"After expenses")}</div><div class="section-title"><h2>Performance</h2><select class="select"><option>September 2026</option></select></div><div class="grid two-col"><div class="card"><h3>Sales by day</h3><div class="chart">${[50,72,61,85,70,95,78].map((h,i)=>`<div class="bar" style="height:${h}%"><span>${i+22}</span></div>`).join("")}</div></div><div class="card"><h3>Top products</h3><div class="list">${state.products.slice(0,4).map((p,i)=>`<div class="row"><div><b>${i+1}. ${p.name}</b><div class="muted">${12-i*2} sold</div></div><b>${money((12-i*2)*p.price)}</b></div>`).join("")}</div></div></div></div>`,
expenses:()=>`<div class="content"><div class="toolbar"><select class="select"><option>September 2026</option></select><button class="primary" onclick="openExpense()">＋ Add Expense</button></div><div class="card"><div class="section-title" style="margin-top:0"><h2>Total expenses</h2><strong style="font-size:22px">${money(state.expenses.reduce((a,e)=>a+e.amount,0))}</strong></div>${state.expenses.map(e=>`<div class="row"><div><b>${e.name}</b><div class="muted">September 2026</div></div><b>${money(e.amount)}</b></div>`).join("")}</div></div>`,
settings:()=>`<div class="content"><div class="card"><h2>Shop Profile</h2><div class="form-grid"><div class="field"><label>SHOP NAME</label><input value="AK Mobile Store"></div><div class="field"><label>PHONE</label><input value="+91 00000 00000"></div><div class="field full"><label>ADDRESS</label><input value="Your shop address"></div><div class="field"><label>GSTIN</label><input placeholder="Optional"></div><div class="field"><label>CURRENCY</label><select><option>INR ₹</option></select></div></div><div class="modal-actions"><button class="primary" onclick="alert('Settings saved')">Save changes</button></div></div></div>`
};
function stat(a,b,c){return `<div class="card"><div class="stat-label">${a}</div><div class="stat-value">${b}</div><div class="trend">${c}</div></div>`}
function saleRow(s){return `<div class="row"><div><div class="product-name">${s.product}</div><div class="muted">${s.id} • ${s.customer}</div></div><div style="text-align:right"><b>${money(s.amount)}</b><div class="muted">${s.payment}</div></div></div>`}
function productCards(arr){return arr.map(p=>`<div class="card product-card"><div class="product-img">${p.brand==="Apple"?"":"📱"}</div><div class="product-body"><div class="muted">${p.brand}</div><h3>${p.name}</h3><div class="muted">${p.variant}</div><div style="display:flex;justify-content:space-between;align-items:end;margin-top:12px"><div><div class="price">${money(p.price)}</div><div class="muted">Cost ${money(p.cost)}</div></div><span class="pill ${p.stock<=2?"warn":"green"}">${p.stock} stock</span></div><div style="margin-top:12px"><button class="secondary" style="width:100%" onclick="productDetails(${p.id})">View product</button></div></div></div>`).join("")}
function filterProducts(q){const a=state.products.filter(p=>(p.name+" "+p.brand+" "+p.variant).toLowerCase().includes(q.toLowerCase()));$("#productGrid").innerHTML=productCards(a)}
function openModal(html){$("#modal").innerHTML=html;$("#modalBackdrop").classList.add("show")}
function closeModal(){$("#modalBackdrop").classList.remove("show")}
function openProduct(){openModal(`<h2>Add Product</h2><div class="form-grid"><div class="field"><label>BRAND</label><input id="pbrand" value="Samsung"></div><div class="field"><label>PRODUCT NAME</label><input id="pname" placeholder="Galaxy A56"></div><div class="field"><label>VARIANT</label><input id="pvariant" placeholder="8GB / 256GB"></div><div class="field"><label>QUANTITY</label><input id="pstock" type="number" value="1"></div><div class="field"><label>PURCHASE PRICE</label><input id="pcost" type="number" value="0"></div><div class="field"><label>SELLING PRICE</label><input id="pprice" type="number" value="0"></div><div class="field"><label>TRACK IMEI</label><select id="pimei"><option value="true">Yes</option><option value="false">No</option></select></div></div><div class="modal-actions"><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" onclick="saveProduct()">Save Product</button></div>`)}
function saveProduct(){const p={id:Date.now(),brand:$("#pbrand").value,name:$("#pname").value||"New Product",variant:$("#pvariant").value||"Standard",price:+$("#pprice").value||0,cost:+$("#pcost").value||0,stock:+$("#pstock").value||0,imei:$("#pimei").value==="true"};state.products.unshift(p);closeModal();render()}
function productDetails(id){const p=state.products.find(x=>x.id===id);openModal(`<h2>${p.name}</h2><div class="card" style="box-shadow:none;background:#f8f9fc"><div class="muted">${p.brand} • ${p.variant}</div><h2 style="margin:8px 0">${money(p.price)}</h2><div class="row"><span>Purchase price</span><b>${money(p.cost)}</b></div><div class="row"><span>Profit per unit</span><b>${money(p.price-p.cost)}</b></div><div class="row"><span>Stock</span><span class="pill ${p.stock<=2?"warn":"green"}">${p.stock}</span></div><div class="row"><span>IMEI tracking</span><b>${p.imei?"Enabled":"Disabled"}</b></div></div><div class="modal-actions"><button class="secondary" onclick="closeModal()">Close</button><button class="primary" onclick="openSale(${p.id})">Sell this</button></div>`)}
function openCustomer(){openModal(`<h2>Add Customer</h2><div class="form-grid"><div class="field"><label>NAME</label><input id="cname" placeholder="Customer name"></div><div class="field"><label>PHONE</label><input id="cphone" placeholder="+91..."></div><div class="field full"><label>ADDRESS</label><input id="caddress"></div></div><div class="modal-actions"><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" onclick="saveCustomer()">Save Customer</button></div>`)}
function saveCustomer(){state.customers.push({id:Date.now(),name:$("#cname").value||"New Customer",phone:$("#cphone").value||"—",purchases:0,spent:0});closeModal();render()}
function openSale(productId=null){const p=productId?state.products.find(x=>x.id===productId):state.products[0];openModal(`<h2>New Sale</h2><div class="field"><label>PRODUCT</label><select id="saleProduct">${state.products.filter(x=>x.stock>0).map(x=>`<option value="${x.id}" ${x.id===p.id?"selected":""}>${x.name} — ${money(x.price)}</option>`).join("")}</select></div><div class="field" style="margin-top:13px"><label>CUSTOMER</label><select id="saleCustomer">${state.customers.map(c=>`<option value="${c.id}">${c.name}</option>`).join("")}</select></div><div class="form-grid" style="margin-top:13px"><div class="field"><label>DISCOUNT</label><input id="discount" type="number" value="0"></div><div class="field"><label>PAYMENT</label><select id="payment"><option>UPI</option><option>Cash</option><option>Card</option><option>Credit</option></select></div></div><div class="card" style="margin-top:16px;box-shadow:none;background:#f7f8fb"><div class="row"><span>Product</span><b id="salePreview">${money(p.price)}</b></div><div class="row"><span>Total</span><b id="saleTotal">${money(p.price)}</b></div></div><div class="modal-actions"><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" onclick="completeSale()">Complete Sale</button></div>`);$("#saleProduct").onchange=()=>updateSaleTotal();$("#discount").oninput=()=>updateSaleTotal()}
function updateSaleTotal(){const p=state.products.find(x=>x.id===$("#saleProduct").value);const d=+$("#discount").value||0;$("#salePreview").textContent=money(p.price);$("#saleTotal").textContent=money(Math.max(0,p.price-d))}
function completeSale(){const p=state.products.find(x=>x.id===$("#saleProduct").value);if(!p||p.stock<1)return alert("This product is out of stock.");const c=state.customers.find(x=>x.id===$("#saleCustomer").value);const total=Math.max(0,p.price-(+$("#discount").value||0));p.stock--;c.purchases++;c.spent+=total;const id="INV-"+(1025+state.sales.length);state.sales.unshift({id,product:p.name,customer:c.name,amount:total,payment:$("#payment").value,time:"Just now"});closeModal();render();setTimeout(()=>openModal(`<div style="text-align:center;padding:15px"><div style="font-size:45px">✓</div><h2>Sale Completed</h2><p class="muted">${id} • ${p.name}</p><h2>${money(total)}</h2><div class="modal-actions" style="justify-content:center"><button class="secondary" onclick="closeModal()">Close</button><button class="primary" onclick="alert('Invoice sharing will be connected in the Android build.')">Share Invoice</button></div></div>`),100)}
function openExpense(){openModal(`<h2>Add Expense</h2><div class="form-grid"><div class="field"><label>CATEGORY</label><select id="ename"><option>Shop Rent</option><option>Electricity</option><option>Internet</option><option>Salary</option><option>Transport</option><option>Other</option></select></div><div class="field"><label>AMOUNT</label><input id="eamount" type="number"></div></div><div class="modal-actions"><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" onclick="saveExpense()">Save Expense</button></div>`)}
function saveExpense(){state.expenses.push({name:$("#ename").value,amount:+$("#eamount").value||0});closeModal();render()}
$("#modalBackdrop").onclick=e=>{if(e.target.id==="modalBackdrop")closeModal()}
$("#menuBtn").onclick=()=>$(".sidebar").classList.toggle("open");
$("#fab").onclick=()=>({home:openSale,products:openProduct,customers:openCustomer,expenses:openExpense}[state.view]||openSale)();
render();
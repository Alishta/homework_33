const data = {
    'Ukuleles':['Concert Ukulele', 'Soprano Ukulele', 'Tenor Ukulele'],
    'Guitars':['Classical Guitar', 'Acoustic Guitar', 'Electric Guitar'],
    'Accessories':['Strings', 'Case', 'Amp'],
    'Collections of sheet music':['Ukulele tutorial', 'Guitar tutorial', 'Tabs for ukulele'],
};

const prices = {
    'Concert Ukulele': 1500,
    'Soprano Ukulele': 1000,
    'Tenor Ukulele': 1200,
    'Classical Guitar': 1800,
    'Acoustic Guitar': 2000,
    'Electric Guitar': 2300,
    'Strings': 200,
    'Case': 500,
    'Amp': 800,
    'Ukulele tutorial': 20, 
    'Guitar tutorial': 30,
    'Tabs for ukulele': 30
}

const leftSideBar = document.getElementById('left-sidebar');
const categoriesSection = document.getElementById('categories-section');
const categoryList = document.getElementsByClassName('category');
const productList = document.getElementById('product-list');
const productDetails = document.getElementById('product-details');
const buyButton = document.getElementById('buy-button');
const productsSection = document.getElementById('products-section');
const productInfo = document.getElementById('product-info');
const ordersButton = document.getElementById('orders-button');
const shoppingCart = document.getElementById('shopping-card-section');
const orderForm = document.getElementById('order-form');
let selectedProduct = [];

console.log(leftSideBar, categoriesSection, categoryList, productList);
console.log(productDetails, buyButton, productsSection, productInfo, ordersButton, shoppingCart);

function showProducts(category) {
    const products = data[category];
    productList.innerHTML = '';

    products.forEach((product, index) => {
        const listItem = document.createElement('li');
        listItem.id = 'product-list-item';
        listItem.innerText = product;
        listItem.setAttribute('product-item-index', index);
        productList.appendChild(listItem);
    });
}

Array.from(categoryList).forEach((element) => {
    element.addEventListener('click',(event) => {
        const category = event.target.textContent;
        showProducts(category);
        productsSection.style.display = 'block';
        productInfo.style.display = 'none';
        orderForm.reset();
    })
})

productList.addEventListener('click', (event) => {
    const product = event.target.textContent;
    productDetails.textContent = 'You choose: ' + product.toLowerCase();
    orderForm.style.display = 'none';
    productInfo.style.display = 'block';
    orderForm.reset();
    selectedProduct = product;
})

buyButton.addEventListener('click', () => {
    orderForm.style.display = 'block';
})

function fillingForm() {
    const fullName = document.getElementById('full-name').value;
    const city = document.getElementById('city').value;
    const deliveryBranch = document.getElementById('delivery-branch').value;
    const cashOnDelivery = document.getElementById('cash-on-delivery');
    const cardPayment = document.getElementById('card-payment');
    const quantity = document.getElementById('quantity').value;
    const comment = document.getElementById('comment').value;
    const price = prices[selectedProduct] * quantity;
    let selectedPaymentMethod;

    if(cashOnDelivery.checked) {
        selectedPaymentMethod = cashOnDelivery.value;
    }

    if(cardPayment.checked) {
        selectedPaymentMethod = cardPayment.value;
    }

    const order = {
        product: selectedProduct.toLowerCase(),
        price: price,
        orderTime: new Date().toLocaleString('uk-UA', {timeZone: 'Europe/Kyiv'}),
        city: city,
        deliveryBranch: deliveryBranch,
        cardPayment: selectedPaymentMethod,
        quantity: quantity,
        comment: comment,
        fullName: fullName
    }

    return order;
}

orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if(orderForm.checkValidity()) {
        const order = fillingForm();
        saveOrder(order);

        alert(`You choose: ${order.product}: ${order.quantity} number of products. \n City: ${order.city}. \n Payment: ${order.cardPayment}. \n Branch-post: ${order.deliveryBranch}. \n Thank you for your order!`);

        orderForm.reset();
        // productDetails.innerText = '';
        productInfo.style.display = 'none';
        productsSection.style.display = 'none';
        orderForm.style.display = 'none';
    }
})

function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

function getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}

ordersButton.addEventListener('click', () => {
    categoriesSection.style.display = 'none';
    shoppingCart.style.display = 'block';
    productInfo.style.display = 'none';
    productsSection.style.display = 'none';
    // productDetails.style.display = 'none';

    showUsersOrder();
})

function showCategories() {
    categoriesSection.style.display = 'block';
    shoppingCart.style.display = 'none';
    productInfo.style.display = 'none';
    productsSection.style.display = 'none';
    // productDetails.style.display = 'none';
    productsSection.querySelector('h2').textContent = 'Goods in category';
    orderDetailsContainer.innerHTML = '';
}

let selectedProductsArray = [];

productList.addEventListener('click', (event) => {
    const product = event.target.textContent;
    productDetails.textContent = 'You choose: ' + product.toLowerCase();
    orderForm.style.display = 'none';
    productInfo.style.display = 'block';
    orderForm.reset();
    selectedProductsArray.push(product);
})

const orderDetailsContainer = document.createElement('div');
orderDetailsContainer.id = 'order-details-container';

function showUsersOrder() {
    shoppingCart.innerHTML = '';
    const storedObjects = getOrders();
    const shoppingCartTitle = document.createElement('h2');
    shoppingCartTitle.id = 'shopping-card-title';
    shoppingCartTitle.textContent = 'Basket';
    shoppingCart.appendChild(shoppingCartTitle);
    const updatePageButton = document.createElement('button');
    updatePageButton.textContent = 'Back';
    updatePageButton.id = 'update-button';
    updatePageButton.addEventListener('click', () => {
        showCategories();
        console.log('Back clicked');
    })
    shoppingCart.appendChild(updatePageButton);
    console.log(updatePageButton);

    storedObjects.forEach((order, index) => {
        const orderItem = document.createElement('div');
        orderItem.id = 'order-item';
        orderItem.style.margin = '20px 0';
        const orderInfo = `${order.product.toUpperCase()} - ${order.orderTime}<br>Price: ${order.price} <br>`;

        orderItem.innerHTML = orderInfo;

        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Details';
        detailsButton.addEventListener('click', () => showOrderDetails(order));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteOrder(index));

        orderItem.appendChild(deleteButton);
        orderItem.appendChild(detailsButton);
        shoppingCart.appendChild(orderItem);
    })
}

function showOrderDetails(order) {
    shoppingCart.appendChild(orderDetailsContainer);
    orderDetailsContainer.innerHTML = `
    <p>Name: ${order.fullName}
    <br>
    Product: ${order.product}
    <br>
    Price: ${order.price}
    <br>
    Time: ${order.orderTime}
    <br>
    City: ${order.city}
    <br>
    Delivery Branch: ${order.deliveryBranch}
    <br>
    Payment Method: ${order.cardPayment}
    <br>
    Quantity: ${order.quantity}
    <br>
    Comment: ${order.comment}
    </p>`;
}

function deleteOrder(orderIndex) {
    const storedObjects = getOrders();
    if (orderIndex >= 0 && orderIndex < storedObjects.length) {
        storedObjects.splice(orderIndex, 1);
        localStorage.setItem('orders', JSON.stringify(storedObjects));
        showUsersOrder();
        orderDetailsContainer.innerHTML = '';
        productsSection.querySelector('h2').textContent = '';
        productsSection.querySelector('ul').innerHTML = '';
    }
}
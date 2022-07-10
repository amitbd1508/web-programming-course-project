const url = "http://localhost:3000/";
let accessToken = localStorage.getItem("accessToken");
let user = JSON.parse(localStorage.getItem("user"));

window.onload = function (e) {
  e.preventDefault();

  if (accessToken) {
    showLoginPanel(false);
    showWelcomeUser(true, user);
    buildProductTable();
    buildCartTable();
  } else {
    showLoginPanel(true);
    showWelcomeUser(false, user);
    showProductTable(false);
  }
};

async function onClickLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (username && password && username.length > 0 && password.length > 0) {
    const response = await login(username, password);
    if (response.error) {
      swal("Login failed", response.message, "error");
    } else {
      const user = response.data;
      // saving token;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", user.accessToken);

      showLoginPanel(false);
      showWelcomeUser(true, user);

      buildProductTable();
      buildCartTable();
    }
  } else {
    swal("Invalid Credential!", "Please enter valid credentials!", "error");
  }
};

async function buildProductTable() {
  const productTableBody = document.getElementById("productTableBody");

  const products = await getProducts();

  if (!products) {
    showProductTable(false);
  } else {
    showProductTable(true, products.length);
    let bodyHtml = "";
    products.map((product) => {
      bodyHtml += `
        <tr>
          <td>${product.name}</td>
            <td>${product.price}</td>
            <td><img width="50" src="${product.imgUrl}"/></td>
            <td>${product.stock}</td>
            <td>
              <img onclick="updateCart(${product.id}, ${1})" src="./assets/images/cart.png" alt="add to cart" height="40"/>
            </td>
          </tr>`;
    });
    productTableBody.innerHTML = bodyHtml;
  }
}

async function buildCartTable() {
  const cartTableBody = document.getElementById("cartTableBody");

  const response = await getCart();

  if (response.error) {
    showCartTable(false);
  } else {
    const cart = response.data;

    showCartTable(true, cart.items.length);
    let bodyHtml = "";
    cart.items.map((item) => {
      bodyHtml += `
            <tr>
              <td>${item.name}</td>
              <td>${item.price}</td>
              <td>${parseFloat(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <button id="btnInc" onclick="updateCart(${
                  item.productId
                }, ${-1})"  type="button" class="btn btn-secondary">-</button>
                <input type="number" id="quantity" min="1" max="12" value="${
                  item.quantity
                }">
                <button id="btnDec" onclick="updateCart(${
                  item.productId
                }, ${1})" type="button" class="btn btn-secondary">+</button>
              </td>
            </tr>
      `;
    });
    cartTableBody.innerHTML = `${bodyHtml}
      <tr>
        <td colspan=2></td>
        <td>Total:</td>
        <td>${cart.items.reduce((total, item) => total+ (item.price*item.quantity), 0).toFixed(2)}</td>
      </tr>
    `;
  }
}
function logout() {
  sessionStorage.clear();
  showLoginPanel(true);
  showWelcomeUser(false);
}

// view
function showProductTable(show, productsSize) {
  const productTable = document.getElementById("productTable");
  const noProducts = document.getElementById("noProducts");
  if (show) {
    productTable.style.display = "block";
  } else {
    productTable.style.display = "none";
  }

  if (productsSize && productsSize > 0) {
    noProducts.style.display = "none";
  } else {
    noProducts.style.display = "block";
  }
}

function showCartTable(show, cartSize) {
  const cartTable = document.getElementById("cartTable");
  const noCartItems = document.getElementById("noCartItems");

  if (show) {
    cartTable.style.display = "block";
  } else {
    cartTable.style.display = "none";
  }

  if (cartSize && cartSize > 0) {
    noCartItems.style.display = "none";
  } else {
    noCartItems.style.display = "block";
  }
}

function showLoginPanel(show) {
  const loginPanel = document.getElementById("login-panel");
  const logoutPanel = document.getElementById("logout-panel");

  if (show) {
    loginPanel.style = "display:block!important";
    logoutPanel.style = "display:none!important";
  } else {
    loginPanel.style = "display:none!important";
    logoutPanel.style = "display:block!important";
  }
}

function showWelcomeUser(show, user) {
  const welcomePanel = document.getElementById("welcomePanel");
  const welcomeUserName = document.getElementById("welcomeUserName");
  if (show) {
    welcomeUserName.innerText = `${user.firstname} ${user.lastname}`;
    welcomePanel.style = "display:block!important";
  } else {
    welcomePanel.style = "display:none!important";
  }
}

async function updateCart(productId, quantity) {
  console.log(productId, quantity)
  const response = await updateRemoteCart(productId, quantity);
  console.log(response);
  if (response.error) {
    swal("Faild to update", response.message, "error");
  } else {
    buildCartTable();
    if(response.message) {
      swal("Item removed", response.message, "success");
    }
  }
}

async function completeOrder() {
  const response = await placeOrder();
  if(response.error) {
    swal("Faild to place order", response.message, "error");
  } else {
    buildCartTable();
    buildProductTable();
    swal("Order Recieved", response.message, "success");
  }
}

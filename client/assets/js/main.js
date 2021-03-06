const url = "http://localhost:3000/";
let accessToken = sessionStorage.getItem("accessToken");
let user = JSON.parse(sessionStorage.getItem("user"));

window.onload = function (e) {
  e.preventDefault();

  if (accessToken) {
    showLoginPanel(false);
    showWelcomeUser(true, user);
    buildProductTable();
    buildCartTable();
    showLoggedInView(true);
  } else {
    showLoginPanel(true);
    showWelcomeUser(false, user);
    showLoggedInView(false);
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
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("accessToken", user.accessToken);

      showLoginPanel(false);
      showWelcomeUser(true, user);
      showLoggedInView(true);

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
              <img onclick="addToCart(${product.id})" src="./assets/images/cart.png" alt="add to cart" height="40"/>
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
                <button id="btnInc" onclick="decrement(${
                  item.productId
                }, ${item.quantity})" type="button" class="btn btn-secondary">-</button>
                <input id="${item.productId}" onblur="updateCart(${
                  item.productId
                }, this.value, ${item.quantity})" style="width: 60px" type="number" id="quantity" min="1"  value="${
                  item.quantity
                }">
                <button id="btnDec" onclick="incremnt(${
                  item.productId
                }, ${item.quantity})" type="button" class="btn btn-secondary">+</button>
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
  showLoggedInView(false);
}

// view
function showLoggedInView(show) {
  const loggedinView = document.getElementById('loggedinView');
  if(show) {
    loggedinView.style = 'display:block!important'
  } else {
    loggedinView.style = 'display:none!important'
  }
}
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
    productTable.style.display = "none";

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
    cartTable.style.display = "none";
  }
}

function showLoginPanel(show) {
  const loginPanel = document.getElementById("login-panel");
  const logoutPanel = document.getElementById("logout-panel");
  const welcomeMessage = document.getElementById('welcomeMessage');

  if (show) {
    loginPanel.style = "display:block!important";
    logoutPanel.style = "display:none!important";
    welcomeMessage.style = "display:block!important";

  } else {
    loginPanel.style = "display:none!important";
    logoutPanel.style = "display:block!important";
    welcomeMessage.style = "display:none!important";

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

function incremnt(productId, prevQuantity) {

  const quantity = parseInt(document.getElementById(productId).value) + 1;
  updateCart(productId, quantity, prevQuantity);
}

function decrement(productId, prevQuantity) {
  const quantity = parseInt(document.getElementById(productId).value) - 1;
  updateCart(productId, quantity, prevQuantity);
}

function addToCart(productId) {
  const quantityElement = document.getElementById(productId);
  if(quantityElement) {
    updateCart(productId, parseInt(quantityElement.value)+1, parseInt(quantityElement.value));
  } else {
    updateCart(productId, 1, null);
  }
}

async function updateCart(productId, quantity, prevQuantity) {

  const response = await updateRemoteCart(productId, quantity);
  
  if (response.error) {
    if(response.errorCode == 401) {
      logout();
      swal("Logout", response.message, "error");
      return;
    }
    if(prevQuantity != null) {
      document.getElementById(productId).value = prevQuantity;
    }
    swal("Faild to add", response.message, "error");
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
    if(response.errorCode == 401) {
      logout();
      swal("Logout", response.message, "error");
      return;
    }
    swal("Faild to place order", response.message, "error");
  } else {
    buildCartTable();
    buildProductTable();
    swal("Order Recieved", response.message, "success");
  }
}

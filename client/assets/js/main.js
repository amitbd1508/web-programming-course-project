const url = "http://localhost:3000/";
let accessToken = sessionStorage.getItem("accessToken");
let user = JSON.parse(sessionStorage.getItem("user"));

window.onload = function() {
  const loginPanel = document.getElementById("login-panel");
  const logoutPanel = document.getElementById("logout-panel");
  const welcomePanel = document.getElementById("welcomePanel");
  const welcomeUserName = document.getElementById("welcomeUserName");
  const productTable = document.getElementById("productTable");
  const noProducts = document.getElementById("noProducts");
  const productTableBody = document.getElementById("productTableBody");

  if(accessToken) {
    showLoginPanel(false);
    showWelcomeUser(true, user);
    buildProductTable();
  } else {
    showLoginPanel(true);
    showWelcomeUser(false, user);
    showProductTable(false);
  }

  document.getElementById("btnLogin").onclick = async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username && password && username.length > 0 && password.length > 0) {
      const response = await login(username, password);
      if(response.error) {
        swal('Login failed', response.message, 'error');
      } else {
        const user = response.data;
         // saving token;
         sessionStorage.setItem('user', JSON.stringify(user));
         sessionStorage.setItem('accessToken', user.accessToken);

        showLoginPanel(false);
        showWelcomeUser(true, user);

        buildProductTable();
      }
    } else {
      swal("Invalid Credential!", "Please enter valid credentials!", "error");
    }
  };

  document.getElementById("btnLogout").onclick = () => {
    logout();
  };

  async function buildProductTable() {
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

  function logout() {
    sessionStorage.clear();
    showLoginPanel(true);
    showWelcomeUser(false);
  }

  // view
  function showProductTable(show, productsSize) {
    if (show) {
      productTable.style.display = "block";
    } else {
      productTable.style.display = "none";
    }

    if(productsSize && productsSize > 0) {
      noProducts.style.display = "none";
    } else {
      noProducts.style.display = "block";
    }
  };

  function showLoginPanel(show) {
    if (show) {
      loginPanel.style = "display:block!important";
      logoutPanel.style = "display:none!important";
    } else {
      loginPanel.style = "display:none!important";
      logoutPanel.style = "display:block!important";
    }
  };

  function showWelcomeUser(show, user) {
    if (show) {
      welcomeUserName.innerText = `${user.firstname} ${user.lastname}`;
      welcomePanel.style = "display:block!important";
    } else {
      welcomePanel.style = "display:none!important";
    }
  };
};

async function addToCart(productId) {
  console.log(product);
}

// Api Call

async function addToCart(productId) {
  const response = await fetch(`${url}api/v1/carts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
    }),
  });
  return await response.json();
}

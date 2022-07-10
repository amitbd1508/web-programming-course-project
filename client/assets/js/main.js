const url = "http://localhost:3000/api/v1/";

window.onload = function () {
  const loginPanel = document.getElementById("login-panel");
  const logoutPanel = document.getElementById("logout-panel");
  const welcomeUserName = document.getElementById('welcomeUserName');
  const productTable = document.getElementById("productTable");
  const noProducts = document.getElementById("noProducts");
  const productTableBody = document.getElementById("productTableBody");

  
  buildProductTable();
  buildCartTable();

  document.getElementById("login").onclick = async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username && password && username.length > 3 && password.length > 3) {
      const user = await login(username, password);
      console.log(user);
      loginPanel.style = "display: none!important";
      logoutPanel.style = "display: inline!important";
      welcomeUserName.innerText = `${user.user.firstname} ${user.user.lastname}`
      welcomeUserName.style.display = 'inline!important';
      

      await buildProductTable();
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
      productTable.style.display = "none";
      noProducts.style.display = "inline";
    } else {
      noProducts.style.display = "none";
      productTable.style.display = "inline";
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
    const cart = await getCart()

  }

  async function login(username, password) {
    const response = await fetch(`${url}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginId: username,
        password: password,
      }),
    });
    return await response.json();
  }

  async function getProducts() {
    const response = await fetch(`${url}products`, {
      headers: {
        "Content-Type": "application/json",
        //need to pass token
      },
    });
    return response.json();
  }

  async function getCartByUser() {
    const response = await fetch(`${url}carts`, {
      headers: {
        "Content-Type": "application/json",
        //need to pass token
      },
    });
    return response.json();
  }

  function logout() {
    console.log("logout");
    // sesion clear
    loginPanel.style = "display: inline!important";
    logoutPanel.style = "display: none!important";
  }
};


async function addToCart(productId) {
  console.log(product);


}


async function addToCart(productId) {
  const response = await fetch(`${url}carts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId
    }),
  });
  return await response.json();
}
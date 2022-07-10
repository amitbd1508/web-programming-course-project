async function login(username, password) {
    console.log(username, password)
    const response = await fetch(`${url}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    return await response.json();
  }


  async function getProducts() {
    const response = await fetch(`${url}api/v1/products`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
      },
    });
    return response.json();
  }

  async function getCart() {
    const response = await fetch(`${url}api/v1/carts`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
      },
    });
    return response.json();
  }

  async function addToCart(productId) {
    const response = await fetch(`${url}api/v1/carts/item/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
      }
    });
    return await response.json();
  }
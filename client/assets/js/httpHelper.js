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
        //need to pass token
      },
    });
    return response.json();
  }
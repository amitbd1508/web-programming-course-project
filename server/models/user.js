let db = [
  { id: 1, username: "amit", password: "111", fullname: "Amit ghosh" },
  { id: 2, username: "jhon", password: "222", fullname: "Jhon Dev" },
];

module.exports = class User {
  constructor(id, username, password, fullname) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.fullname = fullname;
    this.accessToken = null;
  }

  setAcessToken(token) {
    this.accessToken = token;
  }

  findById(userId) {
    return db.find(user => user.id ==id);
  }

  static getActiveUser(username, password) {
    return db.find(user => user.username === username && user.password === password && accessToken != null);
  }



};

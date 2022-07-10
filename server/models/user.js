
let userDB = [
  { id: 1, firstName: 'Amit', lastName: 'Ghosh', username: 'amit', password: '1234' },
  { id: 2, firstName: 'John', lastName: 'Dev', username: 'jhon', password: '1212' },
  { id: 3, firstName: 'User', lastName: 'One', username: 'user1', password: '1111' },
]


module.exports = class User {

  constructor(id, username, password) {
      this.id = id;
      this.username = username;
      this.password = password;
  }

  static getUser(username, password) {
    const index = userDB.findIndex(user => user.username === username && user.password === password)

    if(index < 0) {
      return null;
    }
    return userDB[index];
  }

  static findById(id) {
    const index = userDB.findIndex(user => user.id === id)
    return userDB[index];
  }

  static getByToken(token) {
    const userId = token.split('-')[0];
    const user = this.findById(userId);
    return user;
  }

}
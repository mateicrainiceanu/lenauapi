const db = require("../config/db")

class User {
    constructor(username, password, role){
        this.username = username;
        this.password = password;
        this.role = role
    }

    async save(){
        let sql = `
        INSERT INTO users(
            username,
            password,
            role 
        )
        VALUES(
            '${this.username}',
            '${this.password}',
            '${this.role}'
        )
        `

        return db.execute(sql);
    }

    static findAll(skip) {

        // Tot mai putin parola

        let sql = `SELECT * FROM users LIMIT ${skip}, ${skip + 5};` 

        return db.execute(sql);

    }

    static findUsername(username){
        
        let sql = `SELECT * FROM users WHERE username = '${username}';`

        return db.execute(sql);

    }

    static resetPassword(username, newpassword){
        let sql = `UPDATE users SET password = '${newpassword}' WHERE username = '${username}';`;
        return db.execute(sql);
    }

    static delete(id){
        let sql = `DELETE FROM users WHERE id = ${id}`;

        return db.execute(sql);
    }
}

module.exports = User;
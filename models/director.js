const db = require("../config/db")

class Director {
    constructor(index, name, link){
        this.index = Number(index);
        this.name = name;
        this.link = link;
    }

    async save() {
        let sql = `
        INSERT INTO directors (
            indexx,
            name,
            role 
        )
        VALUES(
            ${this.index},
            '${this.name}',
            '${this.link}'
        );
        `
        return db.execute(sql)
    }

    static find(){
        let sql = `SELECT * FROM directors ORDER BY indexx ASC;`
        return db.execute(sql);
    }

    static delete(id) {
        let sql = `DELETE FROM directors WHERE id = ${id};`

        return db.execute(sql)
    }
    
}

module.exports = Director;
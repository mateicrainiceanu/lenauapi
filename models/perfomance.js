const db = require('../config/db')

class Performance {
    constructor(performance){
        this.name = performance.name;
        this.paragraphs = JSON.stringify(performance.paragraphs);
        this.imglink = performance.imglink;
    }

    async save() {
        const sql = `
        INSERT INTO performances (
            name,
            paragraphs,
            imglink
        ) VALUES (
            '${this.name}',
            '${this.paragraphs}',
            '${this.imglink}'
        )`

        return db.execute(sql);
    }

    static find() {
        const sql = `SELECT * FROM performances`;

        return db.execute(sql)
    }

    static delete(id) {
        const sql = `DELETE FROM performances WHERE id = ${id}`
        return db.execute(sql)
    }
}

module.exports = Performance;
const db = require('../config/db')

class News {
    constructor(name, paragraph, link) {
        this.name = name;
        this.paragraph = paragraph;
        this.link = link;
    }

    async save() {
        const sql = `
        INSERT INTO news (
            name,
            paragraph,
            link
        )
        VALUES (
            '${this.name}',
            '${this.paragraph}',
            '${this.link}'
        )
        `
        return db.execute(sql);
        }

        static findAll(skip, limit) {

            var sqlline = '';

            if (limit){
                sqlline = `LIMIT ${skip}, ${limit}`
            }

            const sql = `SELECT * FROM news
            ORDER BY id DESC
            ${sqlline};`
            return db.execute(sql);
        }

        static delete(id) {
           let sql = `
           DELETE FROM news WHERE id = ${id};
           ` 
           return db.execute(sql)
        }
}

module.exports = News;
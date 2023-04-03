const db = require('../config/db')

class News {
    constructor(name, paragraph, link, category) {
        this.name = name;
        this.paragraph = paragraph;
        this.link = link;
        this.category = category;
    }

    async save() {
        const sql = `
        INSERT INTO news (
            name,
            paragraph,
            link,
            category
        )
        VALUES (
            '${this.name}',
            '${this.paragraph}',
            '${this.link}',
            '${this.category}'
        )
        `
        return db.execute(sql);
        }

        static findAll(skip, limit, category) {

            var sqlline = '';
            var sqlcateg = ''

            if (limit){
                sqlline = `LIMIT ${skip}, ${limit}`
            }

            if (category != "any"){
                sqlcateg = `WHERE category='${category}'`
            }

            const sql = `SELECT * FROM news
            ${sqlcateg}
            ORDER BY id DESC
            ${sqlline};`
            return db.execute(sql);
        }



        static getCategories(){
            const sql = `
            SELECT category FROM news;
            `

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
const db = require('../config/db');

class Url
{
    static create(longurl, shorturlid, callback) {
        const sql = `INSERT INTO links (longurl, shorturlid) VALUES (?, ?)`;
        db.query(sql, [longurl, shorturlid], callback);
    }

    static findAll(callback)
    {
        const sql = `SELECT * FROM links`;
        db.query(sql, callback);
    }

    static findByShortId(shorturlid, callback)
    {
        const sql = `SELECT * FROM links WHERE shorturlid=? LIMIT 1`;
        db.query(sql, [shorturlid], callback);
    }

    static incrementCount(id, newCount, callback)
    {
        const sql = `UPDATE links SET count=? WHERE id=? LIMIT 1`;
        db.query(sql, [newCount, id], callback);
    }
}

module.exports = Url;



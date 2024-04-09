const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('verifica.db')

db.serialize(()=>{
    db.run(`CREATE TABLE IF NOT EXISTS biglietto(
        id TEXT PRIMARY KEY,
        ingresso INTEGER,
        uscita INTEGER,
        costo INTEGER
    );`);
});
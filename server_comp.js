const express = require('express');
const app = express();
const port = 3333;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('verifica.db');
let today, today1;

//SERVER IN ASCOLTO
app.listen(port, (req, res) =>{
    console.log(`Server listening on port ${port}`);
});

//PARSING
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//POST
app.post('/biglietto', (req, res)=> {
    const id = Math.random().toString().replace("0.", ""); //GENERAZIONE RANDOM L'ID
    today = Date.now(); //GENERAZIONE DATA TEMPO REALE IN MILLISECONDI
    let date = new Date(today); //CONVERSIONE I MILLISECONDI NELLA DATA E ORA
    //INSERIMENTO BIGLIETTO
    db.run('INSERT INTO biglietto (id, ingresso) VALUES (?, ?)', [id, date.toString()], (error, result)=>{
        if(error){
            response = {
                code: -1,
                message: error.message
            }
            res.status(500).send(response)
        }
        
        response = {
            code: 1,
            id: id
        }
        res.status(201).send(response)
    });
});

//PUT
app.put('/biglietto/:id', (req, res)=>{
    today1 = Date.now(); //GENERAZIONE SECONDA DATA TEMPO REALE IN MILLISECONDI
    let costo = ((today1 - today)/1000)*0.1; //OPERAZIONE PER IL COSTO DI 10 CENTESIMI AL SECONDO
    costo = costo.toFixed(2); //ARROTONDAMENTO COSTO A 2 CIFRE DECIMALI
    let date = new Date(today1); //CONVERSIONE I MILLISECONDI NELLA DATA E ORA
    //AGGIORNAMENTO DATI
    db.run('UPDATE biglietto SET uscita = COALESCE(?,uscita), costo = COALESCE(?,costo) WHERE id = (?)', [date.toString(), costo, req.params.id], (error, result)=>{
        if(error){
            response = {
                code: -1,
                message: error.message
            }
            res.status(500).send(response)
        }
        
        response = {
            code: 1,
        }
        res.status(201).send(response)
    });
});

//DELETE
app.delete('/biglietto/:id', (req,res)=>{
    //CANCELLAZIONE DEL BIGLIETTO
    db.run('DELETE FROM biglietto WHERE id = ?', req.params.id, (error, result)=>{
        if(error){
            response = {
                code: -1,
                message: error.message
            }
            res.status(500).send(response)
        }
        
        response = {
            code: 1,
        }
        res.status(201).send(response)
    })
});

//GET 
app.get('/biglietto/:id', (req, res)=>{
    //VISUALIZZAZIONE DI TUTTI I CAMPI DEL BIGLIETTO SELEZIONATO
    db.all(`SELECT * FROM biglietto WHERE id = (?)`, req.params.id, (error, result)=>{
        if(error){
            response = {
                code: -1,
                message: error.message
            }
            res.status(500).send(response)
        }
        
        response = {
            code: 1,
            data: result
        }
        res.status(201).send(response)
    });
});
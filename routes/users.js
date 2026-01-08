const express = require('express');
const router = express.Router();
const db = require('../db');

//Verkrijgen (GET) van alle users

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users'); //Probeer de user-records op te halen in de database.
        res.json(rows); //
    } catch (err) { // Lukt het niet, toon dan een error.
        res.status(500).json({ error: err.message });
    }

});

//Verkrijgen (GET) voor alle users + sorteren (EXTRA FEATURE)
router.get('/sort', async (req, res) => {
    let {sort, order}= req.query; //Query uitlezen

    //Toegelaten sorteerbare velden (vermijden SQL-injectie)
    const allowedSortFields = ["id", "first_name", "last_name", "email"];
    const allowedOrder = ["asc", "desc"];

    //Als er een variabele wordt ingegeven die niet overeenstemt met de opgenomen lijst -> val terug op de deafaults (beveiliging tegen SQL-injecties)
    if (!allowedSortFields.includes(sort)) sort="id";
    if (!allowedOrder.includes(order)) order="asc";

    try{
        const sql =`SELECT * FROM users ORDER BY ${sort} ${order}`;
        const [rows] = await db.query(sql);

        res.json(rows);
    } catch (err){
        res.status(500).json({ error: err.message});
    }
})

//Verkrijgen (GET) voor één entiteit
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    //Haal de ID uit de URL, bv. /api/users/5 -> id =5

    try {
        const sql = 'SELECT * FROM users WHERE id= ?';
        const [rows] = await db.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "User niet gevonden" })
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }


});

//Toevoegen (POST) van een nieuwe user
router.post('/', async (req, res) => {
    const { first_name, last_name, email } = req.body;

    //Basisvalidatie van gegevens
    if (!first_name || !last_name || !email) {
        return res.status(400).json({ error: "Alle velden zijn verplicht" }); //Bad Request foutmelding (fout ligt bij gebruiker)
    }

    //Controle voornaam geldig?
    if (!/^[A-Za-z-\s]+$/.test(first_name)){ //Regex: ^ = start van tekst, [A-Za-z-\s] letters of streepje bevatten en spaties, + = één of meer tekens, $ = einde tekst
        return res.status(400).json({ error: "Voornaam mag geen cijfers bevatten"})
    }

    //Controle achternaam geldig?
    if (!/^[A-Za-z-\s]+$/.test(last_name)){ //Regex: ^ = start van tekst, [A-Za-z-\s] letters of streepje bevatten en spaties, + = één of meer tekens, $ = einde tekst
        return res.status(400).json({ error: "Achternaam mag geen cijfers bevatten"})
    }
    //Controle e-mail geldig
    if(!/^\S+@\S+\.\S+$/.test(email)){ //Regex: ^ : start, \S (geen spaties), + = meerdere tekens, \. = punt, ... $= einde
        return res.status(400).json({ error: "Ongeldig e-mailadres"})
    }


    try {
        const sql = 'INSERT INTO users (first_name, last_name, email) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [first_name, last_name, email])

        res.status(201).json({ // Iets correct toegevoegd
            message: "User toegevoegd",
            user_id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

//Updaten van een bestaande user (PUT)
router.put('/:id', async (req, res) => {
    const { id } = req.params
    // Haal de ID uit de URL, bv. /api/users/5 -> id =5

    const { first_name, last_name, email } = req.body
    // Haal de nieuwe waarden uit de body van de request

    // Basisvalidatie: velden mogen niet leeg zijn
    if (!first_name || !last_name || !email) {
        return res.status(400).json({ error: "Alle velden zijn verplicht" })
    }

    //Controle voornaam geldig?
    if (!/^[A-Za-z-\s]+$/.test(first_name)){ //Regex: ^ = start van tekst, [A-Za-z-\s] letters of streepje bevatten en spaties, + = één of meer tekens, $ = einde tekst
        return res.status(400).json({ error: "Voornaam mag geen cijfers bevatten"})
    }

    //Controle achternaam geldig?
    if (!/^[A-Za-z-\s]+$/.test(last_name)){ //Regex: ^ = start van tekst, [A-Za-z-\s] letters of streepje bevatten en spaties, + = één of meer tekens, $ = einde tekst
        return res.status(400).json({ error: "Achternaam mag geen cijfers bevatten"})
    }
    //Controle e-mail geldig
    if(!/^\S+@\S+\.\S+$/.test(email)){ //Regex: ^ : start, \S (geen spaties), + = meerdere tekens, \. = punt, ... $= einde
        return res.status(400).json({ error: "Ongeldig e-mailadres"})
    }

    try {
        // Eerst controleren of user bestaat
        const [existing] = await db.query('SELECT * FROM users WHERE id= ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({ error: "User niet gevonden " });
            //404 = Not Found -> user bestaat niet
        }

        //SQL-query om user te updaten
        const sql = `
        UPDATE users 
        SET first_name= ?, last_name= ?, email = ?
        WHERE id= ?`

        await db.query(sql, [first_name, last_name, email, id]);

        res.json({
            message: "User succesvol geüpdatet",
            update_id: id
        });

    } catch (err) {
        // 500: Internal Server error -> fout in de server of database
        res.status(500).json({ error: err.message });
    }
});

//Verwijderen (DELETE) van een user
router.delete('/:id', async(req, res) => {
    const {id} = req.params;
    // Haal de ID uit de URL, bv. /api/users/5 -> id = 5

    try {
        //Eerst controleren of user bestaat
        const [existing] = await db.query('SELECT * FROM users WHERE id= ?', [id]);

        if(existing.length === 0){
            return res.status(404).json({ error: "User niet gevonden"});
            // 404 = Not Found -> user bestaat niet
        }

        await db.query('DELETE FROM users WHERE id= ?', [id]);

        res.json({
            message: "User succesvol verwijderd",
            delete_id: id
        });
    } catch (err) {
        //500 = Internal Server Error -> Fout in server of database
        res.status(500).json({ error: err.message})
    }
});

module.exports = router;
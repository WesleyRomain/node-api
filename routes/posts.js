const express = require('express');
const router = express.Router();
const db = require('../db');

//Verkrijgen (GET) van alle posts

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM posts'); //Probeer de post-records op te halen in de database.
        res.json(rows); //
    } catch (err) { // Lukt het niet, toon dan een error.
        res.status(500).json({ error: err.message });
    }

});

//Verkijgen (GET) van posts met limit en offset
router.get('/paged', async (req,res) => {
    const {limit, offset} = req.query

    if(!limit || !offset){ //Indien geen limit/offset opgegeven > stuur foutbooschap
        return res.status(400).json({error: "Limit en offset zijn verplicht"});
    }

    if(isNaN(limit) || isNaN(offset)) { //Indien limit/offset geen nummers > stuur foutboodschap
        return res.status(400).json({ error: "Limit en offset moeten nummers zijn"});
    }

    try {
        const sql = "SELECT * FROM posts LIMIT ? OFFSET ?"
        const [rows] = await db.query(sql, [parseInt(limit), parseInt(offset)]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
});

router.get('/search', async (req, res) => {
    const {term} = req.query;

    if(!term){
        return res.status(400).json({ error: "Zoekterm is verplicht"})
    }

    try {
        const sql= `
        SELECT * FROM posts
        WHERE title LIKE ? OR content LIKE ?
        `;

        const searchTerm = `%${term}%`;
        const [rows] = await db.query(sql, [searchTerm, searchTerm]);

        res.json(rows);
    } catch (err){
        res.status(500).json({ error: err.message});
    }
});

//Verkrijgen (GET) voor één entiteit
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    //Haal de ID uit de URL, bv. /api/posts/5 -> id =5

    try {
        const sql = 'SELECT * FROM posts WHERE id= ?';
        const [rows] = await db.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Post niet gevonden" })
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }


});

//Toevoegen (POST) van een nieuwe post
router.post('/', async (req, res) => {
    const { title, content, user_id } = req.body;

    //Basisvalidatie van gegevens
    if (!title || !content || !user_id) {
        return res.status(400).json({ error: "Alle velden zijn verplicht" }); //Bad Request foutmelding (fout ligt bij gebruiker)
    }

    //Validatie of user een nummer is
    if(isNaN(user_id)) {
        return res.status(400).json({ error: "user_id moet een nummer zijn"})
    }

    try {
        const sql = 'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [title, content, user_id ])

        res.status(201).json({ //Post correct toegevoegd
            message: "Post toegevoegd",
            post_id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

//Updaten van een bestaande post (PUT)
router.put('/:id', async (req, res) => {
    const { id } = req.params
    // Haal de ID uit de URL, bv. /api/posts/5 -> id =5

    const { title, content, user_id } = req.body
    // Haal de nieuwe waarden uit de body van de request

    // Basisvalidatie: velden mogen niet leeg zijn
    if (!title || !content || !user_id) {
        return res.status(400).json({ error: "Alle velden zijn verplicht" })
    }

    //Validatie of user een nummer is
    if(isNaN(user_id)) {
        return res.status(400).json({ error: "user_id moet een nummer zijn"})
    }

    try {
        // Eerst controleren of post bestaat
        const [existing] = await db.query('SELECT * FROM posts WHERE id= ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({ error: "Post niet gevonden " });
            //404 = Not Found -> post bestaat niet
        }

        //SQL-query om post te updaten
        const sql = `
        UPDATE posts 
        SET title= ?, content= ?, user_id = ?
        WHERE id= ?`

        await db.query(sql, [title, content, user_id, id]);

        res.json({
            message: "Post succesvol geüpdatet",
            update_id: id
        });

    } catch (err) {
        // 500: Internal Server error -> fout in de server of database
        res.status(500).json({ error: err.message });
    }
});

//Verwijderen (DELETE) van een post
router.delete('/:id', async(req, res) => {
    const {id} = req.params;
    // Haal de ID uit de URL, bv. /api/posts/5 -> id = 5

    try {
        //Eerst controleren of post bestaat
        const [existing] = await db.query('SELECT * FROM posts WHERE id= ?', [id]);

        if(existing.length === 0){
            return res.status(404).json({ error: "Post niet gevonden"});
            // 404 = Not Found -> post bestaat niet
        }

        await db.query('DELETE FROM posts WHERE id= ?', [id]);

        res.json({
            message: "Post succesvol verwijderd",
            delete_id: id
        });
    } catch (err) {
        //500 = Internal Server Error -> Fout in server of database
        res.status(500).json({ error: err.message})
    }
});

module.exports = router;


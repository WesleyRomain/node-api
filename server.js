//Haals express binnen = framework dat mijn API laat werken
const express = require('express');

//Node leest mijn bestand .env
require('dotenv').config();

//Nodig om bestanden te tonen
const path= require('path');

const app= express(); //Maakt API-server
const port = process.env.PORT || 3000; //Mijn API draait op poort 3000

//Hierdoor kan mijn API JSON ontvangen in POST/PUT requsts
app.use(express.json());

//Root documentatiepagina
app.get('/', (req, res) => { //Wanneer iemand naar de root van mijn API gaat = http://localhost:3000 (bezoek), voer dan volgende functie uit:
    res.sendFile(path.join(__dirname, 'index.html')) // Stuur mijn serverbestand terug dirname = map waar serverbestand staat, gevolgd door naam bestand dat ik wil tonen => tesamen volledig pad
});

//Koppelen bestanden in routes/ aan URL paden
app.use('/api/users', require ('./routes/users'));
app.use('/api/posts', require ('./routes/posts'));

const db = require('./db');

//Testen connectie database
app.get('/db-test', async (req, res) => {
    try { // Probeer het volgende...
        const [rows] = await db.query('SELECT 1 + 1 AS result'); //Voer 1+1 uit en zet het resultaat in deze constante array
        res.json({ success: true, result: rows[0].result }); //Toon de test
    } catch (err) { // Als dit niet is gelukt, toon dan een foutbooschap.
        res.status(500).json({ success: false, error: err.message }); 
    }
});


//API draaien, je krijgt melding in de console (zie boodschap)
app.listen(port, () =>{
    console.log(`API running on http://localhost:${port}`)
})


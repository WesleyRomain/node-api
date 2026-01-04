//Haal de MySQL Library op: nodig om Node te laten praten met de database, promise zorgt voor async/await
const mysql = require ('mysql2/promise')

//Lees de .env variabelen
require('dotenv').config();

//Klaarmaken van groep database-connecties om gebruikt te worden
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
})

//Database-pool beschikbaar maken voor andere bestanden
module.exports = pool;
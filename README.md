# Node.js API - Users & Posts
Dit project omvat een database-driven API, gebouwd met Node.js, Express en MySQL.

De API bevat twee entiteiten: **users** en **posts**. Beiden hebben volledige CRUD- functionaliteiten & basisvalidatie. Posts werd uitgebreid met paginatie en zoekfunctionaliteiten.

Op de root van het project staat een HTML-documentatiepagina (`index.html`) die alle endpoints uitlegt.

---

## Installatie en opstarten

Volg de stappen om het project lokaal te installeren en runnen:

1. Clone de GitHub-repository naar je computer.
2. Open de projectmap.
3. Installeer de benodigde Node-modules.
4. Maak een MySQL-database aan voor users (Kolommen: first_name, last_name, email) en posts (title, content, user_id) En start via XAMPP MySQL en Apache.
5. Maak een `.env`-bestand aan in de root van het project met je databasegegevens (host,user, password, databasenaam en poort).
6. Start de server (npm run dev).
7. Open de browser en ga naar `http://localhost:3000` om de documentatiepagina te bekijken.
8. Gebruik Postman (of andere software) om POST, PUT, DELETE of andere (gespecialiseerde) functionaliteiten.

---

## Enpoints (kort overzicht)

De volledige uitleg staat op `index.html`.

### Users
- GET `/api/users`
- GET `/api/users/:id`
- GET `/api/users/sort?sort=&order=`
- POST `/api/users` 
- PUT `/api/users/:id` 
- DELETE `/api/users/:id` 

### Posts

- GET `/api/posts`
- GET `/api/posts:id`
- POST `/api/posts` 
- PUT `/api/posts/:id` 
- DELETE `/api/posts/:id` 
- GET `/api/users/paged?limit=&offset=` 
- GET `/api/users/search?term=`

---

## Functionaliteiten
1. CRUD voor users en posts
2. Validatie van velden (verplichte velden, numerieke velden, user_id moet een nummer zijn, enz.)
3. Zoekfunctionaliteiten op basis van een zoekterm (posts)
4. Paginatie met limit en offset (posts)
5. Documentatiepagina op de root van het project
6. Foutafhandeling bij alle endpoints

## Extra functionaliteiten
1. Zoeken op zowel titel als content (posts)
2. Sorteren van GET-request op basis van voornaam, naam of mail -> aflopend of oplopend

## Extra informatie

- De map `node_modules` staat in `.gitignore`.
- De API gebruikt Express Router voor een overzichtelijke structuur.
- De server draait standaard op poort 3000.
- Tijdens de ontwikkeling werd gebruikgemaakt van **nodemon** om de server om de server automatisch te herstarten bij wijzigingen (optioneel voor testen).
- AI werd gebruikt ter ondersteuning van dit project. De architectuur, basislogica, validaties en functionaliteiten zijn zelfstandig uitgewerkt.

## Bronvermelding (APA-stijl)

Aertssens, T. (2023). Web Essentials [Cursus]. Erasmushogeschool Brussel.

De Boeck, W. (2024). Web Advanced [Cursus]. Erasmushogeschool Brussel.

Dotenv. (2026). Dotenv documentation. Geraadpleegd via https://www.npmjs.com/package/dotenv

Express. (2026). Express.js  documentation. Geraadpleegd via https://expressjs.com/

Hambrouck, W. (2023). Data Essentials [Cursus]. Erasmushogeschool Brussel.

Heyman, B. (2025–2026). Backend Web [Cursus]. Erasmushogeschool Brussel.

MDN Web Docs. (2026). Template literals. Geraadpleegd via https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals

Microsoft. (2026). Copilot, AI-assistent voor algemene ondersteuning [Software]. Microsoft.

MySQL2. (2026). MySQL2 documentation. Geraadpleegd via https://www.npmjs.com/package/mysql2

Nodemon. (2026). Nodemon documentation. Geraadpleegd via https://www.npmjs.com/package/nodemon

RESTful API. (2026). RESTful API design guidelines. Geraadpleegd via https://restfulapi.net/

YouTube. (2026). Algemene oriëntatie project [Video]. Bekeken op 04/01/2026, van https://www.youtube.com/watch?v=_7UQPve99r4

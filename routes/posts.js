const express = require('express');
const router = express.Router();

router.get('/', (req,res) =>{
    res.json({ message: "Posts route werkt!"})
})

module.exports = router;
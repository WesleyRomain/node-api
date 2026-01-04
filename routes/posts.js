const express = require('express');
const router = express.Router();

//Test
router.get('/', (req,res) =>{
    res.json({ message: "Posts route werkt!"})
})

module.exports = router;
const express = require('express');
const router = express.Router();
const passport = require('../usedfiles/passport');
const { createUser, enterUser } = require('../controller/authetication');

router.post('/signup', createUser)
    .post('/login', enterUser);
    
        
exports.router = router;
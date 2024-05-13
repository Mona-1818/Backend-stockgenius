const express = require('express');
const router = express.Router();
const passport = require('../usedfiles/passport');
const { getUserById, getUserByUsername, updateUserInfo } = require('../controller/user');

router.get('/user/:id', getUserById)
    .get('/username/:username',getUserByUsername)
    .put('/user/:id', updateUserInfo);
    
exports.router = router;
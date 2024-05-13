const express = require('express');
const router = express.Router();
const { getStockData, fetchallstocks, gettop, getbottom, recommend} = require('../controller/page');

router.get('/:symbol',getStockData).get('/all/stocks', fetchallstocks).get('/top/ten',gettop).get('/bottom/ten',getbottom).get('/user/:id/recommendation', recommend);
    
exports.router = router;
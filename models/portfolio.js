const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const portfolioInfo = new Schema({
    symbol:{
        type: String,
        unique: true,
        required: true
    },
    amount:{
        type: Number,
        unique: true,
        required: true
    },
    price:{
        type: Number,
        unique: true,
        required: true
    }
});

const virtual = portfolioInfo.virtual('id');
virtual.get(function(){
    return this.id;
});

portfolioInfo.set('toJSON',{
    virtual: true,
    versionKey: false,
    transform: function(doc,ret){ delete ret_id}
});

exports.portfolioInfo= mongoose.model('PortfolioInfo',portfolioInfo);
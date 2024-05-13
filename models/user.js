const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const customerInfo = new Schema({
    username :{
        type: String,
        required: true,
        unique: true
    },
    salutaion:{
        type:String,
    },
    firstName:{
        type: String, 
    },
    middleName:{
        type:String,
    },
    lastName:{
        type: String,
    },
    password:{
        type: String,
        required: true,
        unique: true
    },
    Phone:{
        type: Number
    },
    email:{
        type: String,
        unique: true,
        require: true
    },
    Bio:{
        type: String,
    },
    dateofBirth:{
        type:String,
    },
    following:{
        type:[Schema.Types.Mixed], 
    },
    watchList:{
        type:[Schema.Types.Mixed], 
    },
    portfolio:{
        type:[Schema.Types.Mixed], 
    },
    photo:{
        type:String,
    },
    country:{
        type: String,
    },
    gender:{
        type: String,
    },
    isActive:{
        type:Boolean,
    },
    created:{
        type: Date,
        default: Date.now()
    },
    updated:{
        type: Date,
        default: Date.now()
    }
});

customerInfo.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

customerInfo.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

const virtual = customerInfo.virtual('id');
virtual.get(function(){
    return this.id;
});

customerInfo.set('toJSON',{
    virtual: true,
    versionKey: false,
    transform: function(doc,ret){ delete ret_id}
});

exports.UserInfo= mongoose.model('CustomerInfo',customerInfo);
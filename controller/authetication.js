const { UserInfo } = require("../models/user");
const passport = require('passport');
const generateToken = require('../usedfiles/token');

exports.createUser = async (req, res, next) => {
    try {
        const { username, password, email, conformationPassword } = req.body;
        if (conformationPassword === password){
            const user = new UserInfo({ username, password, email })
            await user.save();
            req.body = { username, password };
            passport.authenticate('local', { session: false }, (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(401).json({ message: info.message });
                }
                const token = generateToken(user);
                return res.json({ token, userId: user._id, userName: user.username, userEmail: user.email });
            })(req, res, next);
        } else{
            res.status(400).json({ error: "password not matched!!!"});
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.enterUser = async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        const token = generateToken(user);
        return res.json({ token, userId: user._id, userName: user.username, userEmail: user.email });
    })(req, res, next);
};
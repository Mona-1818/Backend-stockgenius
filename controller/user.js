const { UserInfo } = require("../models/user");
const PortfolioInfo = require("../models/portfolio");
const bcrypt = require('bcrypt');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./upload");
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

const upload = multer({
    storage: storage
}).single('image');

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserInfo.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getUserByUsername = async (req, res) => {
    try {
        const {username} = req.params;
        const user = await UserInfo.findOne({ username: username });
        if (user) {
            return res.json(user);
        } else{
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.updateUserInfo = (upload,async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserInfo.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const {
            salutation,
            firstName,
            middleName,
            lastName,
            Newpassword,
            password,
            Phone,
            email,
            Bio,
            dateofBirth,
            following,
            watchList,
            portfolio,
            photo,
            country,
            gender,
            isActive
        } = req.body;
        const image = photo.filename;
        if (salutation) user.salutaion = salutation;
        if (firstName) user.firstName = firstName;
        if (middleName) user.middleName = middleName;
        if (lastName) user.lastName = lastName;
        if(password){
            const hashedPassword = await bcrypt.hash(password, 10);
            const hashedNewPassword = await bcrypt.hash(Newpassword, 10);
            if (hashedPassword === user.password) user.password = hashedNewPassword;
        }
        if (Phone) user.Phone = Phone;
        if (email) user.email = email;
        if (Bio) user.Bio = Bio;
        if (dateofBirth) user.dateofBirth = dateofBirth;
        if (following) user.following = following;
        if (following){
            if (!Array.isArray(following)) {
                return res.status(400).json({ error: 'Invalid request format. Expected an array of symbols' });
            }
            user.following.push(...following);
        }
        if (watchList){
            if (!Array.isArray(watchList)) {
                return res.status(400).json({ error: 'Invalid request format. Expected an array of symbols' });
            }
            user.watchList.push(...watchList);
        }
        // if (recommendation){
        //     if (!Array.isArray(recommendation)) {
        //         return res.status(400).json({ error: 'Invalid request format. Expected an array of symbols' });
        //     }
        //     user.recommendationList.push(...recommendation);
        // }
        if (portfolio && Array.isArray(portfolio)) {
            user.portfolio = portfolio.map(port => ({
                symbol: port[0],
                amount: port[1],
                price: port[2]
            }));
        }
        if (photo) user.photo = image;
        if (country) user.country = country;
        if (gender) user.gender = gender;
        if (isActive) user.isActive = isActive;

        user.updated = Date.now(); 
        await user.save();

        res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ error: 'An error occurred while updating user information' });
    }
});


// } user.watchList = watchList;
        // if (recommendation){
        //     if (Array.isArray(recommendation)) {
        //         const recommendationDocs = await Promise.all(recommendation.map(async rec => {
        //             const [symbol, amount] = rec;
        //             const recommendationEntry = new Recommendation({ symbol, amount });
        //             await recommendationEntry.save();
        //             return recommendationEntry;
        //         }));
        //         user.recommendationList = recommendationDocs;
        //     }
        // }
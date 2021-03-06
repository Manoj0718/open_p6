const User = require("../models/user_models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//? sign up function ------//
exports.signup = (req, res, next) => {
    //* security  bcrypt and long* //*User password must be encrypted. -ok//
    bcrypt.hash(req.body.password, 12).then((hash) => {
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        user
            .save()
            .then(() => {
                res.status(201).json({ message: "New User added successfully!" });
            })
            .catch((error) => {
                res.status(500).json({ error: error });
            });
    });
};


//-------------//?Login Function --------------------------------
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
            return res.status(401).json({ error: new Error("User can not find in the database!") });
        }
        bcrypt
            .compare(req.body.password, user.password)
            .then((valid) => {
                if (!valid) {
                    return res
                        .status(401)
                        .json({ error: new Error("Wrong  Password!") });
                }
                const token = jwt.sign({ userId: user._id }, "SECRET_WORD", { expiresIn: "24h" });
                res.status(200).json({
                    userId: user._id,
                    token: token,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    error: error,
                });
            });
    }).catch((error) => {
        res.status(500).json({ error: error })
    })
};
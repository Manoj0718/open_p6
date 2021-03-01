const Sauce = require("../models/sauce_models");
const fs = require("fs");


//*GET function - All Products//
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            console.log(sauces, "sauce 01 "); //*got the sauces*/
            res.status(200).json(sauces);
            console.log(sauces, "sauce02 ");//*sauces*/
        })
        .catch((error) => {
            res.status(400).json({ error: error });
            console.log(error);
        });
};


//** GET _ID product */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            res.status(200).json(sauce);
            console.log("one sauce", sauce);
        })
        .catch((error) => {
            res.status(404).json({ error: error });
        });
};

//*POST  function**//
exports.createOneSauce = (req, res, next) => {

    req.body.sauce = JSON.parse(req.body.sauce); //*working json object
    const url = req.protocol + "://" + req.get("host");

    const sauce = new Sauce({
        userId: req.body.sauce.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat,
        //*new item don't have likes//
        likes: 0,
        dislikes: 0,
        usersLiked: [""],
        usersDisliked: [""],
    });
    sauce.save().then(() => {
        res.status(201).json({ message: "New sauce added by!" });
        console.log("new creates sauce", sauce);
    })
        .catch((error) => {
            res.status(400).json({ massage: "not created sauces!", error });
        });
};

//* PUT function //
exports.updateSauce = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params.id });
    if (req.file) {
        req.body.sauce = JSON.parse(req.body.sauce);
        const url = req.protocol + "://" + req.get("host");
        sauce = {
            _id: req.params.id,
            userId: req.body.sauce.userId,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            mainPepper: req.body.sauce.mainPepper,
            imageUrl: url + "/images/" + req.file.filename,
            heat: req.body.sauce.heat,
        };
    } else {
        sauce = {
            _id: req.params.id,
            userId: req.body.userId,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            heat: req.body.heat,
        };
    }
    Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => {
            res.status(201).json({ message: "Sauce updated successfully¡" });
        })
        .catch((error) => {
            res.status(400).json({ error: error });
        });
};


//* DELETE FUNCTION//
exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink("images/" + filename, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => {
                        res.status(200).json({ message: "Sauce deleted successfully¡" });
                    })
                    .catch((error) => {
                        res.status(400).json({ error: error });
                    });
            });
        })
        .catch((error) => {
            res.status(400).json({ error: error });
        });
};

//*----------Like Dislike Function----------------//
// If like = -1, the user dislikes the sauce.The
//user's ID must be added to or removed from the appropriate array.
// array.push
// need to check same user .


exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        let message;
        //*according to the uerId//
        if (req.body.like === 1) {
            if (sauce.usersLiked.includes(req.body.userId)) {
                res.status(400).json({ error: new Error("Invalid request for Like ") });
            } else {
                //*different userid//
                sauce.usersLiked.push(req.body.userId);
                sauce.likes = sauce.likes + 1;
                message = "One Like more ";
            }
        } //*useing array include method to check certain values include in the array=>this return True False statement// 
        if (req.body.like === 0) {
            if (sauce.usersLiked.includes(req.body.userId)) {
                sauce.usersLiked = sauce.usersLiked.filter(
                    (e) => e !== req.body.userId
                );
            } else if (sauce.usersDisliked.includes(req.body.userId)) {
                sauce.usersDisliked = sauce.usersDisliked.filter(
                    (e) => e !== req.body.userId
                );
            }
        }
        if (req.body.like === -1) {
            if (sauce.usersDisliked.includes(req.body.userId)) {
                res.status(400).json({ error: new Error("Invalid Like request!") });
            } else {
                sauce.usersDisliked = sauce.usersDisliked.filter(
                    (e) => e !== req.body.userId
                );
                sauce.dislikes += 1;
                sauce.usersDisliked.push(req.body.userId);
                message = "Sauce disliked! by " + req.body.userId;
            }
        }
        sauce
            .save()
            .then(() => {
                res.status(200).json({ message });
            })
            .catch((error) => {
                return res.status(400).json({ error: error.message });
            });
    });
};
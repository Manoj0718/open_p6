const multer = require("multer");

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => { //*dstianation function says where tosave files//
        callback(null, 'images'); //*it saves im images folder//
    },
    filename: (req, file, callback) => {
        //*file name space removed, replaced by '_'//
        //const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, Date.now() + '.' + extension);
        //console.log(name);
    }
});

module.exports = multer({ storage: storage }).single('image');
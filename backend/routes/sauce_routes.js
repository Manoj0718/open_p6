const express = require("express");
const router = express.Router();
//? import contollers
const multer = require("../middleware/multer-config");
const sauceCtrl = require("../controlls/sauce_controllers");
const authentication = require("../middleware/user_middleware");

//*routes for sauces **//

router.get("/", authentication, sauceCtrl.getAllSauces);
router.post("/", authentication, multer, sauceCtrl.createOneSauce);
router.get("/:id", authentication, sauceCtrl.getOneSauce);
router.put("/:id", authentication, multer, sauceCtrl.updateSauce);
router.post("/:id/like", authentication, sauceCtrl.likeSauce);
router.delete("/:id", authentication, sauceCtrl.deleteOneSauce);


module.exports = router;


//? GET - TO SHOW                 -- /
//? GET - TO SHOW ONE ITEM _ID    -- /:id
//? POST LOGIN -USER              --/:user
//? POST - SIGNUP _USER           --/:user
//? Put update                     --/:user
//?delete                           --/:user
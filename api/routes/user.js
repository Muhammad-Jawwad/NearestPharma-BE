const { predictPharmacy } = require("../controllers/user");

const router = require("express").Router();

//#region : USER AUTH

// router.post("/login",
//     validateLoginPharmacy,
//     loginPharmacy
// );

//#endregion

//#region : USER CRUD

router.post("/predict",
    predictPharmacy
);

//#endregion


module.exports = router;
const { getPharmacy, createPharmacy, getPharmacyById, updatePharmacy, deletePharmacy } = require("../controllers/pharmacy");
const { validateUpdatePharmacy, validateCreatePharmacy } = require("../middlewares/pharmacyValidation");

const router = require("express").Router();


router.get("/pharmacy", getPharmacy);
router.post("/new-pharmacy",
    validateCreatePharmacy,
    createPharmacy
);
router.get("/pharmacy/:id", getPharmacyById);
router.patch("/update-pharmacy/:id",
    validateUpdatePharmacy,
    updatePharmacy
);



module.exports = router;
const { getPharmacy, createPharmacy, getPharmacyById, updatePharmacy, deletePharmacy, loginPharmacy, getPharmacyMedicine, createPharmacyMedicine, getMedicineByPharmay, updatePharmacyMedicine, deletePharmacyMedicine } = require("../controllers/pharmacy");
const { validateCreatePharmacyMedicine, validateUpdatePharmacyMedicine } = require("../middlewares/pharmacyMedicineValidation");
const { validateUpdatePharmacy, validateCreatePharmacy, validateLoginPharmacy } = require("../middlewares/pharmacyValidation");

const router = require("express").Router();

//#region : PHARMACY AUTH

router.post("/login",
    validateLoginPharmacy,
    loginPharmacy
);

//#endregion

//#region : PHARMACY CRUD

router.get("/", getPharmacy);
router.post("/new",
    validateCreatePharmacy,
    createPharmacy
);
router.get("/:id", getPharmacyById);
router.patch("/update/:id",
    validateUpdatePharmacy,
    updatePharmacy
);

//#endregion

//#region : PHARMACY-MEDICINE

router.get("/registeredMedicines", getPharmacyMedicine);
router.post("/registerMedicine",
    validateCreatePharmacyMedicine,
    createPharmacyMedicine
);
router.get("/medicineByPharmacyId/:pharmacyId", getMedicineByPharmay);
router.patch("/updateMedicineQuantity/:id",
    validateUpdatePharmacyMedicine,
    updatePharmacyMedicine
);
router.get("/deleteRegisteredMedicine/:id", deletePharmacyMedicine);

//#endregion

module.exports = router;
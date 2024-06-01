const { getMedicine, createMedicine, updateMedicine, getMedicineById, searchMedicineByName } = require("../controllers/medicine");
const { validateCreateMedicine, validateUpdateMedicine } = require("../middlewares/medicineValidation");

const router = require("express").Router();


router.get("/", getMedicine);
router.post("/new",
    validateCreateMedicine,
    createMedicine
);
router.get("/:id", getMedicineById);
router.patch("/update/:id",
    validateUpdateMedicine,
    updateMedicine
);
router.get("/get/search", searchMedicineByName);


module.exports = router;
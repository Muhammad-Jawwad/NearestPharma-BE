const { getArea, getAreaById, deleteArea, createArea, updateArea } = require("../controllers/area");
const { validateCreateArea, validateUpdateArea } = require("../middlewares/areaValidation");

const router = require("express").Router();


router.get("/", getArea);
router.post("/new",
    validateCreateArea,
    createArea
);
router.get("/:id", getAreaById);
router.patch("/update/:id",
    validateUpdateArea,
    updateArea
);
router.delete("/delete/:id", deleteArea);



module.exports = router;
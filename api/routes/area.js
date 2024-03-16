const { getArea, getAreaById, deleteArea, createArea, updateArea } = require("../controllers/area");
const { validateCreateArea, validateUpdateArea } = require("../middlewares/areaValidation");

const router = require("express").Router();


router.get("/area", getArea);
router.post("/new-area",
    validateCreateArea,
    createArea
);
router.get("/area/:id", getAreaById);
router.patch("/update-area/:id",
    validateUpdateArea,
    updateArea
);
router.delete("/delete-area/:id", deleteArea);



module.exports = router;
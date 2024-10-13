// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const managementController = require('../controllers/managementController');
const regValidate = require("../utilities/inventory-validation");


router.get('/inventory/add-classification', managementController.getAddClassification);
router.get('/inventory/add-inventory', managementController.getAddInventory);
router.get('/', managementController.buildManagementView)

router.post("/add-classification", regValidate.classificationRules(), regValidate.checkClassData, utilities.handleErrors(invController.addNewClass));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:Vehicleid", utilities.handleErrors(invController.buildVehicleDetail));
module.exports = router;
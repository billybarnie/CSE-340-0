// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValid = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:Vehicleid", utilities.handleErrors(invController.buildVehicleDetail));
router.get('/getInventory/:classificationId', utilities.handleErrors(invController.getInventoryJSON))
router.get("/search", invController.searchVehicles);

router.get('/add-classification', utilities.handleErrors(invController.buildAddClass));
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory));
router.get('/', utilities.handleErrors(invController.buildManagement));

router.post("/add-classification", invValid.classificationRules(), invValid.checkClassData, utilities.handleErrors(invController.addNewClass));
router.post("/add-inventory", invValid.InventoryRules(), invValid.checkInventoryData, utilities.handleErrors(invController.addInv));


module.exports = router;
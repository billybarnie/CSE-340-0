const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const management = {}

management.buildManagementView = async function (req, res) {
    let data = ['inventory', 'classification']
    const detail = await utilities.buildManagement(data)
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: 'Inventory Management',
        nav,
        detail,
        errors: null
      })
}

management.getAddClassification = async function (req, res) {
    let nav = await utilities.getNav()
    res.render('./inventory/add-classification', { 
        title: 'Add New Classification',
        nav,
        errors: null,
     });


};

management.getAddInventory = async function (req, res) {
    res.render('./add-inventory', { title: 'Add New Inventory' });
};


module.exports = management
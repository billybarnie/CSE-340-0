const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    error: null
  })
}

invCont.buildVehicleDetail = async function (req, res, next) {
  const Vehicle_id = req.params.Vehicleid
  const data = await invModel.getInventoryByVehicleID(Vehicle_id)
  const detail = await utilities.buildVehicleDetailData(data)
  let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model,
    nav,
    detail,
    error: null
  })
}

invCont.buildManagement = async function (req, res, next) {
  const data = await invModel.getInventoryDatabaseTables()
  const grid = await utilities.buildManageGrid(data)
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    grid,
    errors: null,
  })
}

invCont.buildAddClass = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

invCont.addNewClass = async function (req, res, next) {
  const { classification_name } = req.body
  const result = await invModel.addNewClass(classification_name)
  if (result) {
    req.flash("notice", "Classification added successfully")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, there was an error adding the classification")
    res.redirect("/inv/add-classification")
  }
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const data = await invModel.getClassifications()
  const classifications = await utilities.buildClassification(data)
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classifications,
    errors: null,
  })
}

invCont.addInv = async function (req, res, next) {
  const { inv_make, inv_model, inv_color, inv_price, classification_id, inv_year, inv_description,inv_miles } = req.body
  const result = await invModel.addInv(inv_make, inv_model, inv_color, inv_price, classification_id,inv_miles,inv_description,inv_year)
  if (result) {
    req.flash("notice", "Inventory added successfully")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, there was an error adding the inventory")
    res.redirect("/inv/add-inventory")
  }
}
module.exports = invCont
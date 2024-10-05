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
  })
}

module.exports = invCont
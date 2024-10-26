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
  const tools = await utilities.getHeaderTools(req, res)
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    tools,
    error: null
  })
}

invCont.buildVehicleDetail = async function (req, res, next) {
  const Vehicle_id = req.params.Vehicleid
  const data = await invModel.getInventoryByVehicleID(Vehicle_id)
  const detail = await utilities.buildVehicleDetailData(data)
  let nav = await utilities.getNav()
  const tools = await utilities.getHeaderTools(req, res)
  res.render("./inventory/detail", {
    title: data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model,
    nav,
    detail,
    tools,
    error: null
  })
}

invCont.buildManagement = async function (req, res, next) {
  const data = await invModel.getInventoryDatabaseTables()
  const grid = await utilities.buildManageGrid(data)
  let nav = await utilities.getNav()
  let classificationList = await invModel.getClassifications()
  const classificationSelect = await utilities.buildClassification(classificationList)
  const tools = await utilities.getHeaderTools(req, res)
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    grid,
    tools,
    classificationSelect,
    errors: null,
  })
}

invCont.buildAddClass = async function (req, res, next) {
  let nav = await utilities.getNav()
  const tools = await utilities.getHeaderTools(req, res)
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    tools,
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
  const tools = await utilities.getHeaderTools(req, res)
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classifications,
    tools,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build Edit Inventory View
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const tools = await utilities.getHeaderTools(req, res);
  let itemData = await invModel.getVehicleById(inv_id);
  itemData = itemData[0];
  const classificationList = await invModel.getClassifications();
  const classificationSelect = await utilities.buildClassification(classificationList, itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    tools,
    classifications: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationList = await invModel.getClassifications()
    const classificationSelect = await utilities.buildClassificationList(classificationList, classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const tools = await utilities.getHeaderTools(req, res);
  let itemData = await invModel.getVehicleById(inv_id);
  itemData = itemData[0];
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("./inventory/delete-confirmation", {
    title: "Delete " + itemName,
    nav,
    tools,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
}

invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  const result = await invModel.deleteInventory(inv_id);

  if (result) {
    req.flash("notice", "Inventory deleted successfully");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, there was an error deleting the inventory");
    let nav = await utilities.getNav();
    const tools = await utilities.getHeaderTools(req, res);
    let itemData = await invModel.getVehicleById(inv_id);
    itemData = itemData[0];
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

    res.render("./inventory/delete-confirmation", {
      title: "Delete " + itemName,
      nav,
      tools,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
    });
  }
}

invCont.searchVehicles = async (req, res) => {
  const searchTerm = req.query.q; // Assuming the search query is passed via query parameter
  try {
    const results = await invModel.searchVehiclesByTerm(searchTerm);
    const nav = await utilities.getNav();
    const searchResultsHTML = await utilities.buildSearchResultsGrid(results);
    
    res.render("inventory/search-results", {
      title: "Search Results",
      nav,
      searchResultsHTML,
      errors: null,
    });
  } catch (error) {
    console.error("Error processing search", error);
    res.status(500).render("errors/error", { message: "Server error", nav });
  }
};

module.exports = invCont
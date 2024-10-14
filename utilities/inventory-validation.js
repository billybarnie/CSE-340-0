const utilities = require(".");
const invModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");
const validate = {};


/* ***********************************************
 * Classification Validation and Check for errors
 * **********************************************/
validate.classificationRules = () => {
    return [
        // Must contain alphabet characters only
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isAlpha()
        .withMessage("Classification Name")
        .custom(async (classification_name) => {
            const classificationExists =
              await invModel.checkClassificationExists(classification_name);
            if (classificationExists) {
              throw new Error(
                "Classification exists. Please use a different class name"
              );
            }
          }),
    ]
}

validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("./inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        });
        return;
    }
    next();
}

validate.InventoryRules = () => {
    return [
      body("inv_miles")
        .isInt({ min: 0 })
        .withMessage("Miles must be greater than zero"),
      body("inv_make")
        .isLength({ min: 2 })
        .withMessage("You may not input a single letter")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Field must not contain spaces or special characters"),
      body("inv_model")
        .isLength({ min: 2 })
        .withMessage("You may not input a single letter")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Field must not contain spaces or special characters"),
      body("inv_color")
        .isLength({ min: 2 })
        .withMessage("You may not input a single letter")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Field must not contain spaces or special characters"),
      body("inv_price")
        .isFloat({ min: 0.01 })
        .withMessage("The price can not be zero or equivalent"),
      body("classification_id")
        .isInt({ min: 1 })
        .withMessage("Class ID must be greater than zero"),
    ];
  };
  
  validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model,inv_miles, inv_color, inv_price, classification_id,inv_year, inv_description } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      let data = await invModel.getClassifications();
      let classifications = await utilities.buildClassification(data);
      res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        errors,
        inv_description,
        inv_year,
        inv_miles,
        inv_make,
        inv_model,
        inv_color,
        inv_price,
        classification_id,
        classifications,
      });
      return;
    }
    next();
  };
  

module.exports = validate;
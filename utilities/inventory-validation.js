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


module.exports = validate
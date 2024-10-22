const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')


router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post("/register", regValidate.registationRules(), regValidate.checkRegData,  utilities.handleErrors(accountController.registerAccount))

router.get("/",utilities.checkLogin,utilities.handleErrors(accountController.buildManagement))
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)
router.get("/logout", accountController.logout);
router.get("/update/:id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount));
router.post("/update/:id",regValidate.accountUpdateRules(),regValidate.checkAccountData, utilities.checkLogin, utilities.handleErrors(accountController.updateAccount));
router.post("/change-password/:id",regValidate.accountPasswordRules(),regValidate.checkAccountPasswordData, utilities.checkLogin, utilities.handleErrors(accountController.updateAccountPassword));

module.exports = router
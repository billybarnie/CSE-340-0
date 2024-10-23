const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a class="invlist" href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}
  
Util.buildVehicleDetailData = async function(data) {
  let detail
    if(data.length > 0) {

      detail = '<div class="vehicle-display"> '
      let image = data[0].inv_image
      detail += '<img src="../..' + image + '"/>'

      data.forEach(vehicle => {
        detail += `<section class="pricing">
        <section>
        <h3>NO interest NO haggled price $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</h3>
        <div class="miles">Mileage: ${vehicle.inv_miles.toLocaleString()} ODO</div>
        <p id="docFee"> does not include our $100 Dealer Documentary Service Fee.</p>
        </section>
          <p>Miles: ${vehicle.inv_miles.toLocaleString()}</p>
          <p>Interior Color: N/A </p>
          <p>Exterior Color: ${vehicle.inv_color} </p>
          <p>Description: ${vehicle.inv_description} </p>
        </section>   
        </div>`

      })
    }
    return detail
}

Util.buildManageGrid = async function(data){
  let grid
  grid = '<ul id=management-cards>'
  data.forEach(databaseTables => {
    grid += `
    <li>
      <div class="management-card">
        <h2>${capitalizeFirstLetter(databaseTables.table_name)}</h2>
        <img src="/images/site/edits.webp">
        <a href="/inv/add-${databaseTables.table_name}" title="Add a ${capitalizeFirstLetter(databaseTables.table_name)} table">
          Add record to ${capitalizeFirstLetter(databaseTables.table_name)}
        </a>
      </div>
    </li>
  `;
  })
  grid += '</ul>'
  return grid
}


Util.buildClassification = async function(data){
  let dropdown
  dropdown = '<select name="classification_id" id="classification_id">'
  data.rows.forEach(row => {
    dropdown += '<option value="' + row.classification_id + '">' + row.classification_name + '</option>'
  })
  dropdown += '</select>'
  return dropdown
}

Util.buildAccountManagementGrid = async function(res){
  let grid = `
  <ul id="management-cards">
    <li>
      <div class="management-card">
        <h2>Update Account Information</h2>
        <img src="/images/site/edits.webp" alt="Edit Icon">
        <a href="/account/update/${res.locals.accountData.account_id}" title="Update Account Information">
          Update Account Information
        </a>
      </div>
    </li>
  </ul>
  ${res.locals.management ? `
    <li>
      <div class="management-card">
        <h2>Manage Inventory</h2>
        <img src="/images/site/edit-icon.svg" alt="Manage Inventory Icon">
        <a href="/inv/" title="Manage Inventory">Manage Inventory</a>
      </div>
    </li>` : ''}
  </ul>
`;
    return grid
}
  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ************************
  * Constructs the header and checks for authentication or not
  ************************** */

Util.getHeaderTools = async function (req, res, next) {
  let header;
  
  if (res.locals.loggedin) {
    header = '<ul id="header-tools">';
    header += '<li><a href="/account/logout" title="Logout of your account">Logout</a></li>';
    header += '<li><a href="/account/" title="View your profile">Welcome ' + res.locals.accountData.account_firstname + '</a></li>';
    header += '</ul>';
  } else {
    header = '<a href="/account/login" title="My Account">My Account</a>';
  }

  return header;
};
  
module.exports = Util
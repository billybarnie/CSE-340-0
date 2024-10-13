const invModel = require("../models/inventory-model")
const Util = {}

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

Util.buildManagement = async function (data) {
  let detail 
  
  if(data.length > 0) {
    detail = 'my mom'
    data.forEach(table => {
      const link = `/inv/${table.name}`
      detail += `<a href="${link}"><button>${table}</button></a>`
      
    })
  }
  return detail
}

  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

  
module.exports = Util
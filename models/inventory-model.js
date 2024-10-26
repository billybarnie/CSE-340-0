const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

  async function getInventoryByVehicleID(Vehicle_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.inv_id = $1`,
        [Vehicle_id]
      )
      return data.rows
    } catch (error) {
      console.error("getVehicleID error " + error)
    }
  }

async function getInventoryDatabaseTables(){
  const data = await pool.query("SELECT * FROM information_schema.tables WHERE table_schema = 'public'")
  let invTables = []
  for (let i = 0; i < data.rows.length; i++) {
    if (data.rows[i].table_name === "inventory") {
      invTables.push(data.rows[i])
    }
    if (data.rows[i].table_name === "classification") {
      invTables.push(data.rows[i])
    }
  }
  return invTables
}

  async function addNewClass(classification_name){
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

  async function checkClassificationExists(classification_name) 
{
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name ~* $1"
    const data = await pool.query(sql, [classification_name])
    return data.rowCount
  } catch (error){
    return error.message
  }
}

async function addInv(inv_make, inv_model, inv_color, inv_price, classification_id,inv_miles,inv_description,inv_year){
  try {
    const inv_thumbnail = "/images/vehicles/no-image-tn.png"
    const inv_image = "/images/vehicles/no-image.png"
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_color, inv_price, classification_id, inv_thumbnail, inv_image, inv_miles, inv_description, inv_year) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_color, inv_price, classification_id, inv_thumbnail, inv_image, inv_miles, inv_description, inv_year])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
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
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1";
    return await pool.query(sql, [inv_id]);
  } catch (error) {
    console.error("model error: " + error);
  }
}

async function searchVehiclesByTerm(searchTerm) {
  try {
    const sql = "SELECT * FROM vehicles WHERE inv_make LIKE $1";
    const data = await pool.query(sql, [`%${searchTerm}%`]);
    return data.rows;
  } catch (error) {
    console.error("Error searching for vehicles", error);
    throw error;
  }
}

  module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByVehicleID, getInventoryDatabaseTables, checkClassificationExists,addNewClass,addInv, updateInventory, deleteInventory, searchVehiclesByTerm}
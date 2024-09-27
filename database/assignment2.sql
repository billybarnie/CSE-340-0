--Inserting Tony Starks info into the database using the following code snippet--
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n')

--Making Tony Stark the Admin instead of the CLient using the following code snippet--
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 2; --account_id is set to 2 because Tony had been deleted and then readded changing the account id number--

--Deleting Tony STark from the database with the following code snippet--
DELETE FROM account WHERE account_id = 2;

--Modification to ID 10's description replacing 'the small interiors' with 'a huge interior' using the following snippet--
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;

--Using inner join to select the make and the model from the inventory table and getting the class name to then display them--
SELECT inventory.make, inventory.model, classification.classification_name
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

--updating file path from /images/ to /images/vehicles/ with the replcae method in the following code snippet--
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
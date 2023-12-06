const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();
const port = 3000; 

app.use(bodyParser.json());
const STATIC_BEARER_TOKEN = 'Bearer 77d865e9015053e539a90ce9964afacfa45e4acd31a1b996ea70b7bfacd0d67f';
const STATIC_CLIENT_ID = '2c32f0d647472abac59c80d57f4b92fa96aa569b5f56925daa29cae919f57e3e';

app.use(cors());
app.use((req, res, next) => {
  const bearerToken = req.headers.authorization;
  const clientId = req.headers['client-id'];

  // Verify Bearer Token and Client ID
  if (bearerToken === STATIC_BEARER_TOKEN && clientId === STATIC_CLIENT_ID) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});
app.post('/petpooja/menu/update', (req, res) => {
  try {
    console.log('Request:', req);
  
    const requestData = req.body;
    console.log("Hawai dunia");
    console.log('Request data:', requestData);
    res.json({ success: true, message: 'Menu updated successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error processing Petpooja data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
app.post('/toggleStockStatus', (req, res) => {
  // Extract data from the request body
  const { restID, type, inStock, itemID } = req.body;

  // Perform necessary actions based on the data
  // (You can replace the console.log statements with your actual logic)

  console.log(`Received request for restaurant ID: ${restID}`);
  console.log(`Type: ${type}`);
  console.log(`In stock: ${inStock}`);
  console.log(`Item IDs: ${itemID.join(', ')}`);

  // Respond with a success message
  res.json({ success: true, message: 'Stock status updated successfully' });
});
app.post('/getStoreStatus', (req, res) => {
  const { restID, status, store_status } = req.body;
  console.log(`Received request for restaurant ID: ${restID}`);
  console.log(`Status: ${status}`);
  console.log(`store_statis: ${store_status}`);
  res.json({ success: true, message: 'Store status getted successfully' });
});
app.post('/updateStoreStatus', (req, res) => {
  const { restID, status, store_status, turn_on_time } = req.body;

  // Validate the required parameters
  if (!restID || !status || !store_status || (status === 'failed' && !turn_on_time)) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }
  console.log(`Received request for restaurant ID: ${restID}`);
  console.log(`Status: ${status}`);
  console.log(`store_statis: ${store_status}`);
  console.log(`turn_on_time: ${turn_on_time}`);
  res.status(200).json({ success: true, message: 'Store status updated successfully' });
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

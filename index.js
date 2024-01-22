const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const axios= require('axios');
const admin = require('firebase-admin');
const app = express();
const port = 3000; 

// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '100mb' }));
const STATIC_BEARER_TOKEN = 'Bearer 77d865e9015053e539a90ce9964afacfa45e4acd31a1b996ea70b7bfacd0d67f';
const STATIC_CLIENT_ID = '2c32f0d647472abac59c80d57f4b92fa96aa569b5f56925daa29cae919f57e3e';
const serviceAccount = require('./petpooja-aef99-firebase-adminsdk-yvwma-25ab019a6c.json');

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        apiKey: "AIzaSyCc49GAiMtE8eE2k_lHR3AIb1NgsggxAIY",
        authDomain: "petpooja-aef99.firebaseapp.com",
        projectId: "petpooja-aef99",
        storageBucket: "petpooja-aef99.appspot.com",
        messagingSenderId: "641584974476",
        appId: "1:641584974476:web:2699998df5ca63761509a9",
        measurementId: "G-G5Q3FPVN59"
    });
} catch (error) {
    console.error('Firebase initialization error', error.stack);
}

const db = admin.firestore();

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb'}));

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
app.use((req, res, next) => {
  // Check if the route needs data splitting
  if (req.originalUrl === '/petpooja/menu/update') {
    // Split the data as needed
    // For example, split the array into chunks of size 10
    if (req.body && req.body.items && Array.isArray(req.body.items)) {
      const chunkSize = 10;
      req.body.items = chunkArray(req.body.items, chunkSize);
      // console.log("Hawai dunia hai meri");
      // console.log(req.body.items);
    }
  }

  // Continue to the next middleware or route
  next();
});
function chunkArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  
  return result;
}
// app.post('/petpooja/menu/update', (req, res) => {
//   try {
//     console.log('Request:', req);
  
//     const requestData = req.body;
//     console.log("Hawai dunia");
//     console.log('Request data:', requestData);
//     res.json({ success: "1", message: 'Menu items are successfully listed.' });
//   } catch (error) {
//     // Handle errors
//     console.error('Error processing Petpooja data:', error);
//     res.status(500).json({ success: "0", message: 'Internal Server Error' });
//   }
// });

let postedDataArray = [];
app.route('/petpooja/menu/update')
  .post((req, res) => {
    try {
      // Get data from the request body
      const requestData = req.body;

      // Process the posted data (update menu)
      console.log('Posted data:', requestData);

      // Assuming you have some logic to update the menu using requestData

      // Store the posted data in the array
      postedDataArray.length = 0;
      postedDataArray.push(requestData);

      // Send a response for the update
      res.json({ success: "1", message: 'Menu items are successfully listed.' });

    } catch (error) {
      // Handle errors
      console.error('Error processing Petpooja data:', error);
      res.status(500).json({ success: "0", message: 'Menu sync failed' });
    }
  })
  .get((req, res) => {
    try {
      if (postedDataArray.length > 0) {
        // Send the previously posted data as a response for the GET request
        res.json({ success: "1", message: 'Menu items successfully fetched.', data: postedDataArray });
      } else {
        res.json({ success: "0", message: 'No data available.' });
      }

    } catch (error) {
      // Handle errors
      console.error('Error fetching Petpooja menu data:', error);
      res.status(500).json({ success: "0", message: 'Internal Server Error' });
    }
  });

// app.post('/toggleStockStatus', (req, res) => {
//   // Extract data from the request body
//   const { restID, type, inStock, itemID, autoTurnOnTime,customTurnOnTime } = req.body;

//   // Perform necessary actions based on the data
//   // (You can replace the console.log statements with your actual logic)

//   console.log(`Received request for restaurant ID: ${restID}`);
//   console.log(`Type: ${type}`);
//   console.log(`In stock: ${inStock}`);
//   console.log(`AutoTurnOnTime: ${autoTurnOnTime}`);
//   console.log(`CustomTurnOnTime: ${customTurnOnTime}`);
//   console.log(`Item IDs: ${itemID.join(', ')}`);

//   // Respond with a success message
//   res.json({ success: '1', message: 'Stock status updated successfully' });
// });
app.post('/toggleStockStatus', (req, res) => {
  // Extract data from the request body
  const { restID, type, inStock, itemID, autoTurnOnTime, customTurnOnTime } = req.body;

  // Perform necessary actions based on the data
  // (You can replace the console.log statements with your actual logic)

  console.log(`Received request for restaurant ID: ${restID}`);
  console.log(`Type: ${type}`);
  console.log(`In stock: ${inStock}`);
  console.log(`AutoTurnOnTime: ${autoTurnOnTime}`);
  console.log(`CustomTurnOnTime: ${customTurnOnTime}`);
  if (itemID !== undefined) {
    if (Array.isArray(itemID)) {
      console.log(`Item IDs: ${itemID.join(', ')}`);
    } else {
      console.log(`Item ID: ${itemID}`);
    }
  } else {
    console.log('Item ID not provided');
  }
  try {
    // Your logic here

    // If the logic is successful, respond with a success message
    res.json({code: 200, status: 'success', message: 'Stock status updated successfully' });
  } catch (error) {
    // If there is an error, respond with an error message
    // console.error(`Error processing request: ${error.message}`);
    res.json({ code: "400", message: "Stock status not updated successfully",success: "failed"});
  }
});

app.post('/getStoreStatus', (req, res) => {
  const { restID, status, store_status } = req.body;
  console.log(`Received request for restaurant ID: ${restID}`);
  console.log(`Status: ${status}`);
  console.log(`store_statis: ${store_status}`);
  res.json({ "http_code":200,"status":"success","store_status":"1","message":"Store Delivery Status fetched successfully" });
});
// app.post('/updateStoreStatus', (req, res) => {
//   const { restID,  store_status,reason, turn_on_time } = req.body;

//   // Validate the required parameters
//   // if (!restID || !status || !store_status || (status === 'failed' && !turn_on_time)) {
//   //     return res.status(400).json({ success: false, message: 'Missing required parameters' });
//   // }
//   console.log(`Received request for restaurant ID: ${restID}`);
//   console.log(`Status: ${reason}`);
//   console.log(`store_statis: ${store_status}`);
//   console.log(`turn_on_time: ${turn_on_time}`);
//   res.status(200).json({ success: '1', message: 'Store status updated successfully' });
// });
app.post('/updateStoreStatus', (req, res) => {
  const { restID, store_status, reason, turn_on_time } = req.body;

  // Validate the required parameters
  // if (!restID || !status || !store_status || (status === 'failed' && !turn_on_time)) {
  //     return res.status(400).json({ success: false, message: 'Missing required parameters' });
  // }
  
  console.log(`Received request for restaurant ID: ${restID}`);
  console.log(`Status: ${reason}`);
  console.log(`store_status: ${store_status}`);
  console.log(`turn_on_time: ${turn_on_time}`);

  try {
    // Your logic here

    // If the logic is successful, respond with a success message including restID
    res.status(200).json({ http_code: 200, status: 'success', message: `Store Status updated successfully for store ${restID}` });
  } catch (error) {
    // If there is an error, respond with an error message
    // console.error(`Error processing request: ${error.message}`);
    // res.status(500).json({  http_code: 500,error:'${error.message}', message: 'Error updating store status' });
    res.status(200).json({  http_code: "400", status: "success",message: "Store Status updated successfully for store restID"  });
  }
});

app.post('/receiveOrder', async (req, res) => {
  try {
    const orderData = req.body;
    console.log('Received order data:', orderData);

    const response = await axios.post('https://47pfzh5sf2.execute-api.ap-southeast-1.amazonaws.com/V1/save_order', orderData);

    console.log('Response from other server:', response.data);

    res.status(200).json({
      success: '1',
      message: 'Order data received and forwarded successfully.',
      responseData: response.data, 
    });
  } catch (error) {
    console.error('Error processing order data:', error);
    res.status(500).json({ success: '0', message: 'Internal server error.' });
  }
});



app.post('/petpooja-callback', async (req, res) => {
  try {
    const { restID, orderID, status, cancel_reason, minimum_prep_time, minimum_delivery_time, rider_name, rider_phone_number, is_modified } = req.body;

    // Process the data as needed
    console.log('Received callback from Pet Pooja:');
    console.log('Restaurant ID:', restID);
    console.log('Order ID:', orderID);
    console.log('Status:', status);
    console.log('minimum_prep_time:', minimum_prep_time);
    console.log('minimum_delivery_time:', minimum_delivery_time);
    console.log('Total Time', minimum_prep_time + minimum_delivery_time);

    // Query the Firestore collection to find the document with the given order ID
    const querySnapshot = await db.collection('Orders').where('orderID', '==', orderID).get();

    // Check if the document exists
    if (querySnapshot.empty) {
      // If the order does not exist, create a new order
      await db.collection('Orders').add(req.body);
      console.log('Order created successfully');
    } else {
      // If the order exists, update the existing order
      const docRef = querySnapshot.docs[0].ref;
      await docRef.update(req.body);
      console.log('Order updated successfully');
    }

    // Send a response to acknowledge receipt
    const responseMessage = `Callback received successfully for Order ${orderID} at Restaurant ${restID} with status ${status}.`;
    res.status(200).json({ message: responseMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// // Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


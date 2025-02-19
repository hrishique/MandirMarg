// index.js
const express = require('express');
const axios = require('axios');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors'); // Import CORS
const bodyParser = require('body-parser');


const app = express();
app.use(cors()); // Enable CORS for all origins
app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.json());

// Configuration
const GOOGLE_API_KEY = "AIzaSyC51cQXK6Km23YIcDp79vl8lkgexlAE4wU"; // Set this environment variable securely
const PORT = process.env.PORT || 3000;

/**
 * Proxy endpoint for the Google Directions API.
 * Example request: GET /api/directions?origin=27.5,75.0&destination=27.55,75.05&waypoints=27.52,75.02|27.53,75.03
 */
app.get('/api/directions', async (req, res) => {
  try {
    const { origin, destination, waypoints } = req.query;
    const directionsUrl = 'https://maps.googleapis.com/maps/api/directions/json';

    console.log('Inside directions  ------>>>>> ', directionsUrl);

    const params = {
      origin,
      destination,
      key: GOOGLE_API_KEY,
      travelMode: 'DRIVING'
    };

    if (waypoints) {
      params.waypoints = waypoints; // Use pipe ("|") to separate multiple waypoints.
    }

    const response = await axios.get(directionsUrl, { params });
    console.log("Response : ",JSON.stringify(response.data))
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching directions:', error);
    res.status(500).json({ error: 'Failed to fetch directions' });
  }
});

/**
 * Endpoint to capture analytics data.
 * Example request: POST /api/analytics with JSON payload.
 */
app.post('/api/analytics', (req, res) => {
  // In a real-world app, forward this data to a database or analytics service.
  console.log('Analytics data received:', req.body);
  res.json({ status: 'success' });
});

/**
 * Endpoint to serve static route data.
 */
app.get('/api/routes', (req, res) => {
    console.log('Inside routes  ------>>>>> ');

  const routeData = {
    id: "temple-route",
    name: "Temple Safe Route",
    waypoints: [
      { lat: 27.36932843563573, lng: 75.41226887746211 },
      { lat: 27.368863879751792, lng:  75.40998505095912 },
      { lat: 27.36770814689824, lng: 75.40711431932128 },
      { lat: 27.367141606771053, lng: 75.40581292087096 }
    //   { lat: 27.52, lng: 75.02 },
    //   { lat: 27.53, lng: 75.03 },
    //   { lat: 27.55, lng: 75.05 }
    ],
    instructions: [
      "Start at the main gate.",
      "Follow the red marked path.",
      "Turn right at the checkpoint.",
      "Arrive at the temple."
    ]
  };
  res.json(routeData);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

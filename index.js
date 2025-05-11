const express = require('express');
const app = express();
const urlRoutes = require('./routes/urlRoutes');

app.use(express.static("public"));
app.use(express.json());
app.use('/', urlRoutes);

// In your backend (Node.js/Express):
const cors = require("cors");
app.use(cors()); // Enable all CORS requests


app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});


// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { createConnection, connectToDatabase, executeQuery } = require('./database');
const { createOrUpdateCSVFile, generateDownloadLink } = require('./csvUtils');
const routes = require('./routes');
const fs = require('fs');
const { TYPES } = require('tedious');
const app = express();
const port = 4000;
app.use(bodyParser.json());
let connection;
app.use('/create', routes); 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

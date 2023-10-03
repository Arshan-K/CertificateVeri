const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path'); 
const mysql = require('mysql2');
const cors = require('cors');

require("dotenv").config();
app.use(express.static(path.join(__dirname, 'public')));


// const connection = mysql.createConnection({
//     host: "db4free.net",
//     user: "tester258",
//     password: "arshan@123",
//     database: "veri_doc258",
//     multipleStatements: true                      //online database
//   });   

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true
})


  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
    } else {
      console.log("Connected to the database!");
    }
  });
  
  app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' folder

app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); 
});

app.get('/getData', (req, res) => {
    const Reference_Number = req.query.rid;
    
        if (Reference_Number) {

            const sql = 'SELECT * FROM data WHERE `COL 1` = ?';
            connection.query(sql, [Reference_Number], (err, results) => {
            
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');       //data fecthing from database 
                return;
            }

           
            if (results.length === 0) {
                res.status(404).send('Data not !!!! found');
                return;
            }

            const data = results[0]; // Assuming there's only one matching row
            const result = {
                Certificate_Number: data.Certificate_Number,
                Name: data.Name,
                Designation: data.Designation,
                Institute: data.Institute,
                Workshop_Organiser: data.Workshop_Organiser,
                Workshop_Name: data.Workshop_Name,
                Workshop_Date: data.Workshop_Date,
            };


            res.json(results);
        });
    } else {
        res.status(400).send('Bad Request');
    }
});

// const PORT = process.env.PORT || 3306
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const myHTTP_PORT = process.env.HTTP_PORT  
const MYSQL_PORT = process.env.DB_PORT  // Use port 3306 as a default for MySQL

app.listen(myHTTP_PORT, () => {
    console.log(`HTTP Server is running on port ${myHTTP_PORT}`);
});

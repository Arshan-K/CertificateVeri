const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path'); 

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' folder

app.get('/getData', (req, res) => {
    const Reference_Number = req.query.rid;
    const result = { Certificate_Number: '', Name: '', Designation: '', Institute: '', Workshop_Organiser: '', Workshop_Name: '', Workshop_Date: '', Profile_Photo: '' };

    if (Reference_Number) {
        fs.readFile('public/data.csv', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                alert("Please Check Reference ID ");
                return;
            }

            const lines = data.split('\n');
            for (const line of lines) {
                const values = line.split(',');
                if (values[0] === Reference_Number) {

                    result.Profile_Photo = values[8];
                    result.Certificate_Number = values[1];
                    result.Name = values[2];
                    result.Designation = values[3];
                    result.Institute = values[4];
                    result.Workshop_Organiser = values[5];
                    result.Workshop_Name = values[6];
                    result.Workshop_Date = values[7];
                    
                    break;
                }
            }

            res.json(result);
        });
    } else {
        res.status(400).send('Bad Request');
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

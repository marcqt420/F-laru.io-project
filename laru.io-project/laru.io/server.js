const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const metadataFile = path.join(__dirname, 'metadata.json');

app.use(express.static('public'));
app.use(express.json());

app.get('/metadata', (req, res) => {
    fs.readFile(metadataFile, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading metadata');
        }
        const metadata = JSON.parse(data);
        res.json(metadata.public); // Only send the public metadata
    });
});

app.post('/update-metadata', (req, res) => {
    const { key, value } = req.body;
    fs.readFile(metadataFile, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading metadata');
        }
        let metadata = JSON.parse(data);
        let keys = key.split('.');
        let obj = metadata;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]]) obj[keys[i]] = {};
            obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;

        fs.writeFile(metadataFile, JSON.stringify(metadata, null, 4), (err) => {
            if (err) {
                return res.status(500).send('Error updating metadata');
            }
            res.json(metadata.public); // Respond with updated public metadata
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

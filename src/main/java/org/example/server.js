const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());

app.get('/api/data', async (req, res) => {
    const { type, municipality } = req.query;

    let query = '';

    if (type && municipality) {
        query = `for $a in vet:filter-by-type("${type}") where $a?location = "${municipality}" return $a`;
    } else if (type) {
        query = `vet:filter-by-type("${type}")`;
    } else if (municipality) {
        query = `for $a in vet:all() where $a?location = "${municipality}" return $a`;
    } else {
        query = 'vet:all()';
    }

    try {
        const response = await axios.get('http://localhost:8984/rest/vet', {
            params: { query },
            auth: {
                username: 'admin',
                password: 'admin'
            },
            headers: {
                'Accept': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from BaseX:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

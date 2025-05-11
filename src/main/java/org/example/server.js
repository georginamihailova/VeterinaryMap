const express = require('express');
const cors = require('cors');
const { SaxonJS } = require('saxon-js');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());

// Read XML file
const xmlData = fs.readFileSync('veterinary.xml', 'utf8');

// Helper function to execute XQuery
async function executeXQuery(query) {
    return new Promise((resolve) => {
        SaxonJS.transform({
            stylesheetText: `
                <xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
                    <xsl:template name="xsl:initial-template">
                        <xsl:variable name="doc" select="parse-xml($xml)"/>
                        <xsl:sequence select="${query}"/>
                    </xsl:template>
                    <xsl:param name="xml"/>
                </xsl:stylesheet>`,
            sourceText: "<dummy/>",
            stylesheetParams: {
                xml: xmlData
            },
            destination: "serialized",
            deliverResult: (result) => {
                try {
                    const json = JSON.parse(result.principalResult);
                    resolve(Array.isArray(json) ? json : [json]);
                } catch (e) {
                    console.error("Error parsing result:", e);
                    resolve([]);
                }
            }
        }, "async");
    });
}

// API endpoint to get all clinics
app.get('/getVeterinaries', async (req, res) => {
    try {
        const clinics = await executeXQuery('vet:get-all()');
        res.json(clinics.map(clinic => ({
            veterinary: {
                name: clinic.name,
                legalEntity: clinic.legalEntity,
                address: clinic.address,
                dateEstablished: clinic.dateEstablished,
                location: clinic.location,
                longitude: clinic.longitude,
                latitude: clinic.latitude
            },
            buildingType: clinic.type
        })));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching data');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
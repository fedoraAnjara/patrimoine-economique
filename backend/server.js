// server.js
const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());

app.get('/api/data', (req, res) => {

    const data = {
        personne: {
            nom: 'John Doe',
        },
        patrimoine: {
            possessions: [
                {
                    libelle: 'MacBook Pro',
                    valeur: 2500000,
                    dateDebut: '2023-01-01',
                    dateFin: null,
                    tauxAmortissement: 5,
                },
                {
                    libelle: 'Alternance',
                    valeurConstante: 500000,
                    dateDebut: '2022-01-01',
                    dateFin: null,
                    tauxAmortissement: 0,
                    jour: 1,
                },
                {
                    libelle: 'Survie',
                    valeurConstante: 300000,
                    dateDebut: '2022-05-01',
                    dateFin: null,
                    tauxAmortissement: 0,
                    jour: 2,
                },
            ],
        },
    };
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

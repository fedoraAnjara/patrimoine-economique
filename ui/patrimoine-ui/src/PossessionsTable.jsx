import React, { useState, useEffect } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import Patrimoine from '../../../models/Patrimoine.js';
import Personne from '../../../models/Personne.js';
import Argent from '../../../models/possessions/Argent.js';
import BienMateriel from '../../../models/possessions/BienMateriel.js';
import Flux from '../../../models/possessions/Flux.js';

const PossessionsTable = () => {
    const [possessions, setPossessions] = useState([]);
    const [dateFin, setDateFin] = useState('');
    const [patrimoine, setPatrimoine] = useState(null);
    const [resultat, setResultat] = useState('');
    const [survieValue, setSurvieValue] = useState('');
    const [alternanceValue, setAlternanceValue] = useState('');
    const [calculatedDate, setCalculatedDate] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/data.json');
                const result = await response.json();

                const personneData = result.find(item => item.model === 'Personne').data;
                const patrimoineData = result.find(item => item.model === 'Patrimoine').data;

                const personne = new Personne(personneData.nom);
                const possessions = patrimoineData.possessions.map(p => {
                    switch (p.libelle) {
                        case 'MacBook Pro':
                            return new BienMateriel(personne, p.libelle, p.valeur, new Date(p.dateDebut), p.dateFin ? new Date(p.dateFin) : null, p.tauxAmortissement);
                        case 'Alternance':
                        case 'Survie':
                            return new Flux(personne, p.libelle, p.valeur, new Date(p.dateDebut), p.dateFin ? new Date(p.dateFin) : null, p.tauxAmortissement, p.jour);
                        default:
                            return null;
                    }
                }).filter(p => p !== null);

                const patrimoineInstance = new Patrimoine(personne, possessions);
                setPatrimoine(patrimoineInstance);
                setPossessions(possessions);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        }

        fetchData();
    }, []);

    const handleCalculate = () => {
        if (patrimoine && dateFin) {
            const date = new Date(dateFin);
            if (isNaN(date.getTime())) {
                setResultat('Format de Date non valide!');
                return;
            }

            const valeur = patrimoine.getValeur(date);
            if (isNaN(valeur)) {
                setResultat('Les valeurs saisies ne sont pas valides!');
            } else {
                setResultat(`Le patrimoine de ${patrimoine.possesseur.nom} à la date ${date.toLocaleDateString()} est de : ${valeur}`);
                
                // Stocker la date calculée
                setCalculatedDate(date.toLocaleDateString());

                // Calcul des valeurs spécifiques pour Survie et Alternance
                const survie = possessions.find(p => p.libelle === 'Survie');
                const alternance = possessions.find(p => p.libelle === 'Alternance');

                setSurvieValue(survie ? survie.getValeur(date) : 'Non défini');
                setAlternanceValue(alternance ? alternance.getValeur(date) : 'Non défini');
            }
        } else {
            setResultat('Date de fin ou patrimoine non défini');
        }
    };

    return (
        <div>
            <h3>Propriétaire : {patrimoine?.possesseur.nom}</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Libellé</th>
                        <th>Valeur Initiale</th>
                        <th>Date Début</th>
                        <th>Date Fin</th>
                        <th>Amortissement</th>
                        <th>Valeur Actuelle</th>
                    </tr>
                </thead>
                <tbody>
                    {possessions.map((possession, index) => (
                        <tr key={index}>
                            <td>{possession.libelle}</td>
                            <td>{possession.valeurConstante || possession.valeur}</td>
                            <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
                            <td>{calculatedDate || (possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : '')}</td>
                            <td>{possession.tauxAmortissement}</td>
                            <td>{possession.getValeur(new Date(dateFin || Date.now()))}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div id='dateFinContainer'>
                <Form.Group controlId="dateFin">
                    <Form.Control
                        type="date"
                        value={dateFin}
                        onChange={(e) => setDateFin(e.target.value)}
                    />
                </Form.Group>
                <Button id="btn" onClick={handleCalculate}>Calculer le patrimoine</Button>
            </div>

            <Form.Group controlId="resultat">
                <Form.Control
                    type="text"
                    placeholder='Résultat'
                    value={resultat}
                    readOnly
                />
            </Form.Group>
            <Form.Group controlId="survieValue">
                <Form.Control
                    type="text"
                    placeholder='Valeur Survie'
                    value={survieValue}
                    readOnly
                />
            </Form.Group>
            <Form.Group controlId="alternanceValue">
                <Form.Control
                    type="text"
                    placeholder='Valeur Alternance'
                    value={alternanceValue}
                    readOnly
                />
            </Form.Group>
        </div>
    );
};

export default PossessionsTable;

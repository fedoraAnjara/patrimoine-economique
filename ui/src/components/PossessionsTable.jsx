import React, { useState, useEffect } from "react";
import { Table, Form, Button } from "react-bootstrap";
import Patrimoine from "../../../models/Patrimoine.js";
import Personne from "../../../models/Personne.js";
import Possession from "../../../models/possessions/Possession.js";
import Flux from "../../../models/possessions/Flux.js";
import { Link } from "react-router-dom";
import CreatePossessionPopup from "./CreatePossessionPopup.jsx";

const PossessionsTable = () => {
  const [possessions, setPossessions] = useState([]);
  const [dateFin, setDateFin] = useState("");
  const [patrimoine, setPatrimoine] = useState(null);
  const [resultat, setResultat] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  
  useEffect(() => {
    const possesseur = new Personne("John Doe");
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/possession");
        //console.log(response);(debug)
        const result = await response.json();
        const possessions = result[1].data.possessions;
        const possessionList = [];

        for (const possession of possessions) {
          if (possession.jour == undefined) {
            possessionList.push(
              new Possession(
                possesseur,
                possession.libelle,
                possession.valeur,
                new Date(possession.dateDebut),
                possession.dateFin,
                possession.tauxAmortissement,
              ),
            );
          } else {
            possessionList.push(
              new Flux(
                possesseur,
                possession.libelle,
                possession.valeur,
                new Date(possession.dateDebut),
                possession.dateFin,
                possession.tauxAmortissement,
                possession.jour,
              ),
            );
          }
        }

        const patrimoine = new Patrimoine(possesseur, possessionList);
        setPatrimoine(patrimoine);
        setPossessions(possessionList);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données:",
          error.message,
        );
        console.error("Détails:", error);
      }
    }

    fetchData();
  }, []);

  const handleCalculate = () => {
    if (patrimoine && dateFin) {
      const date = new Date(dateFin);
      if (isNaN(date.getTime())) {
        setResultat("Format de Date non valide!");
        return;
      }

      // Vérifier si la dateFin est inférieure à la dateDebut pour chaque possession
      const possessionWithInvalidDate = possessions.find(
        (possession) => date < new Date(possession.dateDebut),
      );
      if (possessionWithInvalidDate) {
        setResultat(
          "Le calcul du patrimoine ne peut pas se faire car certaines possessions ne sont pas encore aquis a cette date.",
        );
        return;
      }

      const valeur = patrimoine.getValeur(date);
      if (isNaN(valeur)) {
        setResultat("Les valeurs saisies ne sont pas valides!");
      } else {
        setResultat(
          `Le patrimoine de ${
            patrimoine.possesseur.nom
          } à la date ${date.toLocaleDateString()} est de : ${valeur} Ar`,
        );
      }
    } else {
      setResultat("Date de fin ou patrimoine non défini");
    }
  };

  const handleCreatePossession = async (possessionInfo) => {
    try {
      const response = await fetch("http://localhost:3000/possession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(possessionInfo),
      });

      if (response.ok) {
        const newPossession = await response.json();
        setPossessions([...possessions, newPossession]);
      } else {
        console.error("Erreur lors de la création de la possession");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la possession:", error);
    }
  };


  return (
    <div>
      <h2>Liste des Possessions</h2>
      <h3 id="guy">Propriétaire : {patrimoine?.possesseur.nom}</h3>
      <Button onClick={() => setShowPopup(true)} className="btn btn-primary mb-3">
        Créer une Possession
      </Button>
      <Link to="/" className="btn btn-primary mb-3">
        Retourner à l'accueil
      </Link>
      <Table id="table" striped bordered hover>
        <thead>
          <tr>
            <th>Libellé</th>
            <th>Valeur Initiale</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Amortissement</th>
            <th>Valeur Actuelle</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((possession, index) => (
            <tr key={index}>
              <td>{possession.libelle}</td>
              <td>
                {possession instanceof Flux ? "0 Ar" : `${possession.valeur} Ar`}
              </td>
              <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
              <td>
                {possession.dateFin
                  ? new Date(possession.dateFin).toLocaleDateString()
                  : dateFin}
              </td>
              <td>
                {possession.tauxAmortissement
                  ? `${possession.tauxAmortissement} %`
                  : ""}
              </td>
              <td>
                <Button
                  onClick={() => {
                    fetch(`http://localhost:3000/possession/${possession.libelle}/close`, {
                      method: "PUT",
                    });
                    // Reload after close
                    setPossessions((prev) =>
                      prev.map((pos) =>
                        pos.libelle === possession.libelle
                          ? { ...pos, dateFin: new Date().toISOString().split("T")[0] }
                          : pos
                      )
                    );
                  }}
                  variant="danger"
                >
                  Clôturer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CreatePossessionPopup
        show={showPopup}
        handleClose={() => setShowPopup(false)}
        handleCreate={handleCreatePossession}
      />
      <div id="dateFinContainer">
        <Form.Group controlId="dateFin">
          <Form.Control
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </Form.Group>
        <Button id="btn" onClick={handleCalculate}>
          Calculer le patrimoine
        </Button>
      </div>

      <Form.Group controlId="resultat">
        <Form.Control
          type="text"
          placeholder="Résultat"
          value={resultat}
          readOnly
        />
      </Form.Group>
    </div>
  );
};
export default PossessionsTable;

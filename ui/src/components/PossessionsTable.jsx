import React, { useState, useEffect } from "react";
import { Container, Button, Table } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import Possession from "../models/possessions/Possession";
import '../assets/PossessionsTable.css';

const PossessionPage = () => {
  const [possessions, setPossessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPossessions();
  }, []);

  const fetchPossessions = () => {
    fetch("https://patrimoine-economique-backend-0yha.onrender.com/possession")
      .then((response) => response.json())
      .then((data) => {
        const patrimoineData = data.find((item) => item.model === "Patrimoine");
        if (patrimoineData) {
          const currentDate = new Date();
          const updatedPossessions = patrimoineData.data.possessions.map(
            (possessionData) => {
              const possession = new Possession(
                possessionData.possesseur,
                possessionData.libelle,
                possessionData.valeur,
                new Date(possessionData.dateDebut),
                possessionData.dateFin
                  ? new Date(possessionData.dateFin)
                  : null,
                possessionData.tauxAmortissement
              );
              return {
                ...possessionData,
                valeurActuelle: possession.getValeur(currentDate) || "-",
              };
            }
          );
          setPossessions(updatedPossessions);
        }
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des possessions:", error)
      );
  };

  const handleCreate = () => {
    navigate("/create");
  };

  const handleEdit = (libelle) => {
    navigate(`/edit/${libelle}`);
  };

  const handleClose = (libelle) => {
    console.log("Closing possession with libelle:", libelle); // Log libelle
    fetch(`https://patrimoine-economique-backend-0yha.onrender.com/possession/${libelle}/close`, {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          fetchPossessions();
        } else {
          console.error("Erreur lors de la fermeture de la possession.");
        }
      })
      .catch((error) =>
        console.error("Erreur lors de la fermeture de la possession:", error)
      );
  };
  

  return (
    <Container className="possessions-table-container">
      <h1 className="text-center mb-4">Liste des Possessions</h1>
      <div className="d-flex justify-content-between mb-4">
        <Button className="btn-custom" onClick={handleCreate}>
          Créer
        </Button>
        <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
      <Table striped bordered hover className="text-center">
        <thead className="thead-custom">
          <tr>
            <th>Libellé</th>
            <th>Valeur</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Taux Amortissement</th>
            <th>Valeur Actuelle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((possession) => (
            <tr key={possession.libelle}>
              <td>{possession.libelle || "-"}</td>
              <td>{possession.valeur || "-"}</td>
              <td>{possession.dateDebut ? new Date(possession.dateDebut).toLocaleDateString() : "-"}</td>
              <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : "-"}</td>
              <td>{possession.tauxAmortissement || "-"}</td>
              <td>{possession.valeurActuelle || "-"}</td>
              <td>
                <Button
                  className="btn-edit me-2"
                  onClick={() => handleEdit(possession.libelle)}
                >
                  Éditer
                </Button>
                <Button
                  className="btn-clos"
                  onClick={() => handleClose(possession.libelle)}
                >
                  Clôturer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PossessionPage;

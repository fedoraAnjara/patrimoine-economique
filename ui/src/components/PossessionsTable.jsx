import React, { useState, useEffect } from "react";
import { Container, Button, Table } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import Possession from "../../../models/possessions/Possession";

const PossessionPage = () => {
  const [possessions, setPossessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPossessions();
  }, []);

  const fetchPossessions = () => {
    fetch("http://localhost:3000/possession")
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
    fetch(`http://localhost:3000/possession/${libelle}/close`, {
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
    <Container>
      <h1 className="fw-normal">List of Possessions</h1>
      <Button className="mt-4 fs-5 px-4" onClick={handleCreate}>
        Create
      </Button>
      <Link to="/" className="btn btn-primary mb-3">
        Retourner a l'acceuil
      </Link>
      <Table className="table table-hover my-5 text-left">
        <thead className="fs-5">
          <tr>
            <th>Libellé</th>
            <th className="text-center">Valeur</th>
            <th className="text-center">Date Début</th>
            <th className="text-center">Date Fin</th>
            <th className="text-center">Taux Amortissement</th>
            <th className="text-center">Valeur Actuelle</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="fw-normal">
          {possessions.map((possession) => (
            <tr key={possession.libelle}>
              <td>{possession.libelle || "-"}</td>
              <td className="text-center">{possession.valeur || "-"}</td>
              <td className="text-center">
                {possession.dateDebut
                  ? new Date(possession.dateDebut).toLocaleDateString()
                  : "-"}
              </td>
              <td className="text-center">
                {possession.dateFin
                  ? new Date(possession.dateFin).toLocaleDateString()
                  : "-"}
              </td>
              <td className="text-center">
                {possession.tauxAmortissement || "-"}
              </td>
              <td className="text-center">
                {possession.valeurActuelle || "-"}
              </td>
              <td className="text-center">
                <Button
                  className="bg-light border-1 border-secondary text-secondary px-4 me-1"
                  onClick={() => handleEdit(possession.libelle)}
                >
                  Edit
                </Button>
                <Button
                  className="bg-light border-1 border-danger text-danger px-3 ms-1"
                  onClick={() => handleClose(possession.libelle)}
                >
                  Close
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

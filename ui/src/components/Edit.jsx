import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Importer le style du date picker
import { useParams, useNavigate } from "react-router-dom";

const Edit = () => {
  const { libelle } = useParams();
  const navigate = useNavigate();

  const [possession, setPossession] = useState({
    libelle: libelle, // Utiliser le libellé actuel comme valeur par défaut
    dateFin: new Date(), // Date actuelle comme valeur par défaut
  });

  const handleChange = (e) => {
    setPossession({ ...possession, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setPossession({ ...possession, dateFin: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:3000/possession/${libelle}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...possession,
        dateFin: possession.dateFin.toISOString(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la mise à jour de la possession.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Mise à jour réussie:", data);
        navigate("/possession");
      })
      .catch((error) => {
        console.error("Erreur:", error);
      });
  };

  const handleFocus = (e) => {
    e.target.select(); // Sélectionner automatiquement tout le texte lors du focus
  };

  return (
    <Container>
      <h1>Éditer la Possession</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formLibelle">
          <Form.Label>Libellé</Form.Label>
          <Form.Control
            type="text"
            name="libelle"
            value={possession.libelle}
            onChange={handleChange}
            onFocus={handleFocus} // Ajouter l'événement onFocus ici
            placeholder="Entrez le libellé"
          />
        </Form.Group>

        <Form.Group controlId="formDateFin">
          <Form.Label>Date de Fin</Form.Label>
          <DatePicker
            selected={possession.dateFin}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            placeholderText="Sélectionnez une date"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Mettre à jour
        </Button>
      </Form>
    </Container>
  );
};

export default Edit;


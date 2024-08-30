import React, { useState } from "react";
import { Container, Button, Form, Card } from "react-bootstrap";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from "react-router-dom";
import '../assets/Create.css'; // Assure-toi d'ajouter le CSS

const Create = () => {
  const [libelle, setLibelle] = useState("");
  const [valeur, setValeur] = useState("0");
  const [dateDebut, setDateDebut] = useState(new Date());
  const [tauxAmortissement, setTauxAmortissement] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedValeur = parseInt(valeur, 10);
    const formattedTauxAmortissement = tauxAmortissement
      ? parseInt(tauxAmortissement, 10)
      : null;

    const newPossession = {
      possesseur: {
        nom: "John Doe",
      },
      libelle,
      valeur: formattedValeur,
      dateDebut: dateDebut.toISOString(),
      tauxAmortissement: formattedTauxAmortissement,
    };

    fetch("http://localhost:3000/possession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPossession),
    })
      .then((response) => {
        if (response.ok) {
          navigate("/possession");
        } else {
          console.error("Erreur lors de la création de la possession");
        }
      })
      .catch((error) =>
        console.error("Erreur lors de la création de la possession:", error)
      );
  };

  return (
    <Container className="create-container">
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h1 className="text-center mb-4">Créer une nouvelle possession</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="libelle">
              <Form.Label>Libellé</Form.Label>
              <Form.Control
                type="text"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                required
                className="input-custom"
              />
            </Form.Group>

            <Form.Group controlId="valeur">
              <Form.Label>Valeur</Form.Label>
              <Form.Control
                type="number"
                value={valeur}
                onChange={(e) => setValeur(e.target.value)}
                required
                className="input-custom"
              />
            </Form.Group>

            <Form.Group controlId="dateDebut">
              <Form.Label>Date Début</Form.Label>
              <DatePicker
                selected={dateDebut}
                onChange={(date) => setDateDebut(date)}
                className="form-control input-custom"
                dateFormat="yyyy-MM-dd"
              />
            </Form.Group>

            <Form.Group controlId="tauxAmortissement">
              <Form.Label>Taux d'Amortissement</Form.Label>
              <Form.Control
                type="number"
                value={tauxAmortissement}
                onChange={(e) => setTauxAmortissement(e.target.value)}
                placeholder=""
                className="input-custom"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="btn-custom">
              Créer
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Create;

import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import { useParams, useNavigate, Link } from "react-router-dom";
import '../assets/Create.css';
import '../assets/Edit.css';

const Edit = () => {
  const { libelle } = useParams();
  const navigate = useNavigate();

  const [possession, setPossession] = useState({
    libelle: libelle,
    dateFin: null,
  });

  useEffect(() => {
    fetch(`https://patrimoine-economique-backend-0yha.onrender.com/possession/${libelle}`)
      .then(response => response.json())
      .then(data => {
        setPossession({
          libelle: data.libelle,
          dateFin: data.dateFin ? new Date(data.dateFin) : null, // Load existing dateFin or keep it null
        });
      })
      .catch(error => {
        console.error("Erreur lors du chargement de la possession:", error);
      });
  }, [libelle]);

  const handleChange = (e) => {
    setPossession({ ...possession, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setPossession({ ...possession, dateFin: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedPossession = {
      ...possession,
      dateFin: possession.dateFin ? possession.dateFin.toISOString() : null, // Send null if dateFin wasn't set
    };

    fetch(`https://patrimoine-economique-backend-0yha.onrender.com/possession/${libelle}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPossession),
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
    e.target.select();
  };

  return (
    <>
    <Link to="/possession" className="editClsBtn clsBtn btn">x</Link>
    <Container className="create-container">
      <Card className="cardEditContain mb-4 shadow-sm">
        <h1>Éditer la Possession</h1>
        <Card.Body className="editCardBody">
          <Form onSubmit={handleSubmit} className="editFormContainer">
            <Form.Group controlId="formLibelle">
              <Form.Label>Libellé</Form.Label>
              <Form.Control
                type="text"
                name="libelle"
                value={possession.libelle}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder="Entrez le libellé"
              />
            </Form.Group>

            <Form.Group controlId="formDateFin">
              <Form.Label>Date de Fin</Form.Label>
              <DatePicker
                selected={possession.dateFin}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="datePicker form-control"
                placeholderText="Sélectionnez une date"
                isClearable // Option to clear the date
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="btn-custom">
              Mettre à jour
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
    </>
  );
};

export default Edit;

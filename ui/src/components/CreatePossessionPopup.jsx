import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CreatePossessionPopup = ({ show, handleClose, handleCreate }) => {
  const [libelle, setLibelle] = useState("");
  const [valeur, setValeur] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [taux, setTaux] = useState("");

  const handleSubmit = () => {
    if (libelle && valeur && dateDebut && taux) {
      handleCreate({ libelle, valeur, dateDebut, taux });
      handleClose();
    } else {
      alert("Veuillez remplir tous les champs !");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Créer une nouvelle Possession</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formLibelle">
            <Form.Label>Libellé</Form.Label>
            <Form.Control
              type="text"
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
              placeholder="Entrez le libellé"
            />
          </Form.Group>
          <Form.Group controlId="formValeur">
            <Form.Label>Valeur</Form.Label>
            <Form.Control
              type="number"
              value={valeur}
              onChange={(e) => setValeur(e.target.value)}
              placeholder="Entrez la valeur"
            />
          </Form.Group>
          <Form.Group controlId="formDateDebut">
            <Form.Label>Date Début</Form.Label>
            <Form.Control
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formTaux">
            <Form.Label>Taux</Form.Label>
            <Form.Control
              type="number"
              value={taux}
              onChange={(e) => setTaux(e.target.value)}
              placeholder="Entrez le taux d'amortissement"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Créer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreatePossessionPopup;

import React from 'react';
import { Navbar, Nav, Container, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../assets/Header.css';
import patrimoineImg from '../assets/patrimoine.jpg';

const App = () => {
  return (
    <div>
      <Navbar bg="primary" variant="dark" expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand href="/">PatrimonyApp</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <LinkContainer to="/patrimoine">
                <Nav.Link>Patrimoine</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/possession">
                <Nav.Link>Possessions</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h1 className="display-4">Bienvenue dans l'application de gestion du patrimoine</h1>
              <p className="lead">
                Gérez facilement votre patrimoine et vos possessions avec notre application intuitive.
              </p>
              <Button variant="light" size="lg" href="/possession">
                Commencer maintenant
              </Button>
            </Col>
            <Col>
              <img src={patrimoineImg} alt="patrimoine illustration" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default App;

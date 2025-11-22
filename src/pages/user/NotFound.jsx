import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 

const NotFound = () => {

 
  const styles = {
    pageContainer: {
      backgroundColor: '#122117',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      color: '#ffffff',
    },
    contentCard: {
      backgroundColor: '#254630', 
      padding: '3rem',
      borderRadius: '15px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)', 
      border: '1px solid #1aaf4b',
    },
    errorCode: {
      fontSize: '8rem',
      fontWeight: '700',
      color: '#ffffff',
      lineHeight: '1',
      marginBottom: '1rem'
    },
    description: {
      fontSize: '1.5rem',
      color: '#e0e0e0',
      marginBottom: '2rem'
    },
    ctaButton: {
      backgroundColor: '#1aaf4b',
      borderColor: '#1aaf4b',
      color: '#ffffff',
      padding: '10px 30px',
      fontSize: '1.2rem',
      fontWeight: '600',
    }
  };


  return (
    <div style={styles.pageContainer}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} className="text-center">
            <div style={styles.contentCard}>
              

              <h1 style={styles.errorCode}>404</h1>
              
              <h2 className="mb-4">¡Ups! Página no encontrada.</h2>
              
              <p style={styles.description}>
                Lo sentimos, la página que estás buscando no existe o ha sido movida.
              </p>
              

              <Link to="/">
                <Button 
                  variant="primary"
                  style={styles.ctaButton} 
                  className="px-4 py-2"
                >
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;
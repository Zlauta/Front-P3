import { formatearDinero } from '@/utils/FormatearPrecio.js';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';

const MenuGrid = ({ menus, onEdit, onDelete }) => {
  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {menus.map((menu) => (
        <Col key={menu._id}>
          <Card className="h-100 shadow border-0" style={{ background: '#1E2A26' }}>
            <div className="position-relative">
                <Card.Img
                variant="top"
                src={menu.imagen || '/images/placeholder.svg'}
                style={{ height: '180px', objectFit: 'cover' }}
                />
                <Badge bg="warning" text="dark" className="position-absolute top-0 end-0 m-2 shadow">
                   {formatearDinero(menu.precio)}
                </Badge>
            </div>
            
            <Card.Body className="text-white d-flex flex-column">
              <Card.Title className="fw-bold">{menu.nombre}</Card.Title>
              <div className="mb-2">
                <Badge bg="secondary">{menu.categoria}</Badge>
              </div>
              <Card.Text className="text-white-50 small flex-grow-1">
                {menu.descripcion?.length > 60 
                    ? menu.descripcion.substring(0, 60) + '...' 
                    : menu.descripcion}
              </Card.Text>
            </Card.Body>

            <Card.Footer className="bg-transparent border-top-0 d-flex justify-content-between pb-3">
              <Button
                variant="outline-light"
                size="sm"
                className="flex-grow-1 me-2"
                onClick={() => onEdit(menu)}
              >
                Editar
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(menu._id, menu.nombre)}
              >
                Eliminar
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default MenuGrid;
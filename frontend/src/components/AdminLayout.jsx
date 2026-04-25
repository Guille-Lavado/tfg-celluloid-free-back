import { NavLink, Outlet } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

export default function AdminLayout() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">Celluloid Admin</Navbar.Brand>
          <Navbar.Toggle aria-controls="admin-navbar" />
          <Navbar.Collapse id="admin-navbar">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/admin/obras">
                Obras
              </Nav.Link>
              <Nav.Link as={NavLink} to="/admin/usuarios">
                Usuarios
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Aquí se renderizan las páginas hijas */}
      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  );
};
// client/src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navigation() {
  return (
    <Navbar
      bg="light"
      expand="lg"
      className="navigation shadow-sm"
      sticky="top"
    >
      <Container fluid>
        {/* Logo/Brand */}
        <Navbar.Brand as={Link} to="/">
          <span style={{ fontSize: "24px", marginRight: "8px" }}>📚</span>
          LOGO
        </Navbar.Brand>

        {/* Mobile Toggle Button */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navigation Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Teaching Dropdown */}
            <NavDropdown title="การสอนและคาบเรียน" id="teaching-dropdown">
              <NavDropdown.Item as={Link} to="/teaching/record">
                บันทึกการสอน
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/teaching/stats">
                สถิติการสอน
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/teaching/sessions">
                จัดการคาบเรียน
              </NavDropdown.Item>
            </NavDropdown>

            {/* Students Dropdown */}
            <NavDropdown title="นักเรียน" id="students-dropdown">
              <NavDropdown.Item as={Link} to="/students/register">
                ลงทะเบียนนักเรียนใหม่
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/students/enroll">
                ลงทะเบียนเรียนคอร์สใหม่
              </NavDropdown.Item>
            </NavDropdown>

            {/* Finance Dropdown */}
            <NavDropdown title="การเงิน" id="finance-dropdown">
              <NavDropdown.Item as={Link} to="/finance/payment-status">
                อัปเดตสถานะการชำระเงิน
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/finance/reports">
                รายงานการเงิน
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

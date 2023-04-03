import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; 
import { BiMessageSquareDetail } from 'react-icons/bi';
function Header() {
  return (
    <Navbar collapseOnSelect expand="lg"  style={{backgroundColor: '#104271'}}>
      <Container className="navbar-text">
        <Navbar.Brand href="/home" className="logo-navbar-brand">
        </Navbar.Brand>
        <Navbar.Brand href="/home" className="navbar-text">
            Hire IT
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/home" className="navbar-text">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/about" className="navbar-text">About</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={NavLink} to="/resume" className="navbar-text" >My resume</Nav.Link>
            <Nav.Link eventKey={2} as={NavLink} to="/contact" className="navbar-text">
              <BiMessageSquareDetail size={24}/>
            </Nav.Link>
            <NavDropdown title="Username" style={{color: "white"}}   id="collasible-nav-dropdown">
              <NavDropdown.Item className="header-custome-navbar-dropdown" as={NavLink} to="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item className="header-custome-navbar-dropdown" as={NavLink} to="/logout" >
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; 
import { BiMessageSquareDetail } from 'react-icons/bi';
import {  RiProfileLine } from 'react-icons/ri';
import { MdNotifications } from 'react-icons/md';
import { logout, selectIsAdmin, selectUser } from "../../store/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import AvatarImage from "./AvatarImage";
function Header() {
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const dispatch = useDispatch();
  const full_name = user.first_name + " " + user.last_name;
  const [name, ] = useState(full_name ||"");
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  }
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
            { 
              !isAdmin && <Nav.Link as={NavLink} to="/resume" className="navbar-text" ><RiProfileLine size={24}/></Nav.Link>
            }
            <Nav.Link eventKey={2} as={NavLink} to="/contact" className="navbar-text">
              <BiMessageSquareDetail size={24}/>
              <div className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              <span className="visually-hidden">Notification count</span>
                5
              </div>
            </Nav.Link>
            <Nav.Link eventKey={2} as={NavLink} to="/notify" className="navbar-text">
              <MdNotifications size={24}/>
              <div className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              <span className="visually-hidden">Notification count</span>
                5
              </div>
            </Nav.Link>
            <AvatarImage avatar_url={user.avatar_url}/>
            <NavDropdown title={name} style={{color: "white"}}   id="collasible-nav-dropdown">
              <NavDropdown.Item className="header-custome-navbar-dropdown" as={NavLink} to="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item className="header-custome-navbar-dropdown" onClick={handleLogout}>
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

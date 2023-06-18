import React, { useLayoutEffect } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; 
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TextsmsIcon from '@mui/icons-material/Textsms';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { logout, selectIsAdmin } from "../../store/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import AvatarImage from "./AvatarImage";
import { selectFile, selectUserInfo } from "../../store/UserSlice";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
function Header() {
  const user_info = useSelector(selectUserInfo);
  const file = useSelector(selectFile);
  const isAdmin = useSelector(selectIsAdmin);
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  }
  useLayoutEffect(() => {
    if(user_info)
    {
        setAvatar(user_info.avatar_url) 
        setFirstName(user_info.account.first_name);
        setLastName(user_info.account.last_name);
    }
  }, [user_info ]);
  return (
    <Navbar collapseOnSelect expand="lg">
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
              !isAdmin && 
              <>
                <Nav.Link as={NavLink} to="/resume" className="navbar-text" ><PictureAsPdfIcon/></Nav.Link>
                { file && <Nav.Link as={NavLink} to="/jobs" className="navbar-text" ><ContentPasteSearchIcon/></Nav.Link>}
              </>  
            }
            {
              isAdmin && 
              <>
                <Nav.Link as={NavLink} to="/recruiter/upload-jobs" className="navbar-text" ><AddCircleOutlineIcon/></Nav.Link>
                <Nav.Link as={NavLink} to="/candidates/search" className="navbar-text" ><AssignmentIndIcon/></Nav.Link>
              </>   
            }
            <Nav.Link as={NavLink} to="/chat" className="navbar-text">
              <TextsmsIcon/>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/calendar" className="navbar-text">
              <EventNoteIcon/>
            </Nav.Link>
            <AvatarImage avatar_url={avatar}/>
            <NavDropdown title={firstName + " " + lastName} style={{color: "white"}}   id="collasible-nav-dropdown">
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

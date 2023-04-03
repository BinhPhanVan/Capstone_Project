import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom"; // Import Link from react-router-dom for routing
import { useEffect } from "react";
const NotFound = () => {
  useEffect(() => {
    document.title = "Not Found | Hire IT";
  }, []);
  return (
    <div className="not-found-container">
      <Container className="not-found-content">
        <h1 className="text-danger">404 Not Found</h1>
        <p className="lead">
          The page you are looking for does not exist. How you got here is a
          mystery.
        </p>
        <p className="mb-4">
          But you can click the button below to go back to the homepage.
        </p>
        <Button as={Link} to="/" variant="primary">
          Go Back to Homepage
        </Button>{" "}
        {/* Use Link from react-router-dom to navigate to homepage */}
      </Container>
    </div>
  );
};

export default NotFound;

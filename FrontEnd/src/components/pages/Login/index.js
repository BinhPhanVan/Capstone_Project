import React, { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../../store/AuthSlice";
import { useNavigate } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handle_submit = async (e) => {
    e.preventDefault();
    const actionResult = await dispatch(login({ email, password }));
    if (login.fulfilled.match(actionResult)) {
      toast.success(actionResult.payload["email"]);
      navigate("/home")
    }
    if (login.rejected.match(actionResult)) {
      console.log(actionResult);
      toast.error(actionResult.payload);
      setEmail("");
      setPassword("");
    }
  };

  useEffect(() => {
    document.title = "Login | Hire IT";
  }, []);
  return (
    <div>
      <div className="login-page">
        <div className="login-container">
          
          <div className="form">
            <Form onSubmit={handle_submit}  className="login-form">
              <h1>Login HireIT</h1>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formHorizontalEmail"
              >
                <Form.Label column sm={2}>
                  Email
                </Form.Label>
                <Col sm={20}>
                  <Form.Control type="email" 
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      placeholder="Enter your email"
                      value={email}
                      required
                  />
                </Col>
              </Form.Group>

              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formHorizontalPassword"
              >
                <Form.Label column sm={2}>
                  Password
                </Form.Label>
                <Col sm={20}>
                  <Form.Control type="password" 
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  required/>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1">
                <Col sm={{ span: 10, offset: 1 }}>
                  <Button type="submit">Sign in</Button>
                </Col>
              </Form.Group>
              <p> You haven't account?  
                <Link className="signup-link" to="/signup">
                  Sign Up
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

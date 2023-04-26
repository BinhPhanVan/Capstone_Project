import {
  Form,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoading, signup } from "../../../store/AuthSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SpinnerLoading from "../../commons/SpinnerLoading";
function SignUp() {
  const loading = useSelector(selectIsLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState(""); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handle_signup= async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(
      signup({
        first_name,
        last_name,
        email,
        password,
      })
    );
    if (signup.fulfilled.match(resultAction)) {
      navigate("/confirmSignUp");
      toast.success(resultAction.payload.message);
    }
    if (signup.rejected.match(resultAction)) {
      toast.error(resultAction.payload);
    }
  }
  useEffect(() => {
    document.title = "Sign Up | Hire IT";
  }, []);
  return (
    <div>
      <SpinnerLoading loading={loading}/>
      <div>
      <div className="signup-page">
        <div className="signup-container">
          <div className="form">
            <Form className="signup-form" onSubmit={handle_signup}>
              <h1>Sign Up Now</h1>
              <Form.Group
                as={Row}
                className="mb-1"
                controlId="formHorizontalEmail"
              >
                <Form.Label column sm={1}>
                  Email
                </Form.Label>
                <Col sm={20}>
                  <Form.Control
                    type="email"
                    name="email"
                    value= {email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </Col>
              </Form.Group>

              <Form.Group
                as={Row}
                className="mb-1"
              >
                <Form.Label column sm={1}>
                  Information
                </Form.Label>
                <Col sm={20}>
                  <Row>
                    <Col sm={6}>
                      <InputGroup controlId="formHorizontalFirstName">
                        <FormControl 
                          value= {first_name}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First Name" required />
                      </InputGroup>
                    </Col>
                    <Col sm={6}>
                      <InputGroup controlId="formHorizontalLastName">
                        <FormControl 
                          value= {last_name}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last Name" required />
                      </InputGroup>
                    </Col>
                  </Row>
                </Col> 
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-2"
                controlId="formHorizontalPassword"
              >
                <Form.Label column sm={1}>
                  Password
                </Form.Label>
                <Col sm={20}>
                  <Form.Control
                    type="password"
                    name="password"
                    value= {password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1">
                <Col sm={{ span: 10, offset: 1 }}>
                  <Button type="submit">Sign Up</Button>
                </Col>
              </Form.Group>
            </Form>
          </div>
          {/* <div class="oval-container">
            <div class="oval-content">
              <h1>"Discover your dream job with our online job search platform."</h1>
            </div>
          </div> */}
        </div>
      </div>
    </div>
    </div>
  );
}

export default SignUp;

import {
  Form,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recruiter_signup, selectIsLoading } from "../../../store/AuthSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SpinnerLoading from "../../commons/SpinnerLoading";
import { Grid } from "@material-ui/core";
function RecruiterSignUp() {
  const loading = useSelector(selectIsLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [company_name, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handle_signup = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(
      recruiter_signup({
        first_name,
        last_name,
        email,
        password,
        company_name,
        address,
      })
    );
    if (recruiter_signup.fulfilled.match(resultAction)) {
      navigate("/confirmSignUp");
      toast.success(resultAction.payload.message);
    }
    if (recruiter_signup.rejected.match(resultAction)) {
      toast.error(resultAction.payload);
    }
  };
  return (
    <div>
      <SpinnerLoading loading={loading} />
      <div>
        <div className="signup-page">
          <div className="signup-container">
            <div className="form">
              <Form
                className="signup-form recruiter-signup-form"
                onSubmit={handle_signup}
              >
                <h1>Sign Up Now</h1>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Form.Group
                      as={Row}
                      className="mb-1"
                      controlid="formHorizontalEmail"
                    >
                      <Form.Label column sm={1}>
                        Email
                      </Form.Label>
                      <Col sm={20}>
                        <Form.Control
                          type="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                        />
                      </Col>
                    </Form.Group>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Form.Group
                      as={Row}
                      className="mb-2"
                      controlid="formHorizontalPassword"
                    >
                      <Form.Label column sm={1}>
                        Password
                      </Form.Label>
                      <Col sm={20}>
                        <Form.Control
                          type="password"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                        />
                      </Col>
                    </Form.Group>
                  </Grid>
                  <Grid item xs={12}>
                    <Form.Group as={Row} className="mb-1">
                      <Form.Label column sm={1}>
                        Information
                      </Form.Label>
                      <Col sm={20}>
                        <Row>
                          <Col sm={6}>
                            <InputGroup controlid="formHorizontalFirstName">
                              <FormControl
                                value={first_name}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name"
                                required
                              />
                            </InputGroup>
                          </Col>
                          <Col sm={6}>
                            <InputGroup controlid="formHorizontalLastName">
                              <FormControl
                                value={last_name}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last Name"
                                required
                              />
                            </InputGroup>
                          </Col>
                        </Row>
                      </Col>
                    </Form.Group>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Form.Group
                      as={Row}
                      className="mb-2"
                      controlid="formHorizontalCompanyName"
                    >
                      <Form.Label column sm={1}>
                        Company Name
                      </Form.Label>
                      <Col sm={20}>
                        <Form.Control
                          value={company_name}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Enter name your company"
                          required
                        />
                      </Col>
                    </Form.Group>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Form.Group
                      as={Row}
                      className="mb-2"
                      controlid="formHorizontalAddress"
                    >
                      <Form.Label column sm={1}>
                        Address
                      </Form.Label>
                      <Col sm={20}>
                        <Form.Control
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter address your company"
                          required
                        />
                      </Col>
                    </Form.Group>
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterSignUp;

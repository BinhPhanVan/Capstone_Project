import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectVerifyEmail } from "../../../store/AuthSlice";
function ConfirmSignUp() {
  const [email, setEmail] = useState(useSelector(selectVerifyEmail) || "");
  const [otp, setOTP] = useState("");
  useEffect(() => {
    document.title = "Confirm SignUp | Hire IT";
  }, []);

  return (
    <div>
      <div className="confirm-page">
        <div className="confirm-container">
          <div className="form">
            <Form className="confirm-form">
              <h1>Confirm Account</h1>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formHorizontalEmail"
              >
                <Form.Label column sm={2}>
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
                className="mb-3"
                controlId="formHorizontalPassword"
              >
                <Form.Label column sm={2}>
                  OTP
                </Form.Label>
                <Col sm={20}>
                  <Form.Control
                    type="text"
                    className="text-center"
                    name="otp"
                    value= {otp}
                    onChange={(e) => setOTP(e.target.value)}
                    placeholder="Enter your OTP"
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1">
                <Col sm={{ span: 10, offset: 1 }}>
                  <Button type="submit">Confirm</Button>
                </Col>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmSignUp;

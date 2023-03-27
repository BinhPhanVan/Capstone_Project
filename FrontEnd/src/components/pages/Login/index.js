import React, { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Col, Container, Row } from "react-bootstrap";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../../store/AuthSlice";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const handle_submit = async (e) => {
    e.preventDefault();
    const actionResult = await dispatch(login({ email, password }));
    if (login.fulfilled.match(actionResult)) {
      console.log(actionResult);
      toast.success(actionResult.payload['email']);
    } 
    if (login.rejected.match(actionResult)) 
    {
      console.log(actionResult);
      toast.error(actionResult.payload);
    }
  };

  useEffect(() => {
    document.title = "Login";
  }, []);
  return (
    <div>
      <Container>
        <Row>
          <Col xs={2}></Col>
          <Col xs={8}>
            <div className="login-page">
              <div className="login-container">
                <div className="panel"></div>
                <div className="form">
                  <form onSubmit={handle_submit}>
                    <h1>Đăng nhập</h1>

                    <label>Email :</label>
                    <input
                      className="form-input"
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      type="email"
                      placeholder="Nhập địa chỉ email của bạn..."
                      value={email}
                      required
                    />
                    <br />
                    <br></br>
                    <label>Mật khẩu :</label>
                    <input
                      className="form-input"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      name="password"
                      placeholder="Nhập mật khẩu của bạn..."
                      value={password}
                      required
                    />
                    <br />

                    <button type="submit">Đăng nhập</button>
                    <div className="bottom-text">
                      <p>Bạn chưa có tài khoản?</p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={2}></Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;

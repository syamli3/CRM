import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { login } from "../../features/login/loginActions";

export const Login = ({ formSwitcher }) => {
  const dispatch = useDispatch();
  const { isLoading, isAuth, error } = useSelector((state) => state.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    isAuth && navigate("/dashboard");
  }, [isAuth]);

  const handleOnChange = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return alert("Please enter email and password");
    }
    dispatch(login({ email, password }));
  };

  const handleOnResetSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      return alert("Please enter email");
    }
    // TODO: call reset password API
  };
  return (
    <Container className="text-start">
      <Row>
        <Col>
          <h1 className="text-info text-center">Client Login</h1>
          <hr />
          {error && (
            <Alert className="fs-6" variant="danger">
              {error}
            </Alert>
          )}
          <Form className="fs-4" autoComplete="off" onSubmit={handleOnSubmit}>
            <Form.Group className="mb-2" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={handleOnChange}
                value={email}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPass">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                onChange={handleOnChange}
                value={password}
                placeholder="Enter password"
                required
              />
            </Form.Group>

            <Button className="d-block" variant="primary" type="submit">
              Login
            </Button>
            {isLoading && (
              <Spinner
                className="d-block w-full m-auto mt-2"
                variant="primary"
                animation="grow"
              />
            )}
          </Form>
          <hr />
        </Col>
      </Row>
      <Row>
        <Col>
          <a href="#!" onClick={() => formSwitcher("reset")} className="fs-6">
            Forget Password
          </a>
        </Col>
      </Row>
      <Row className="py-4">
        <Col>
          Are you new here? <a href="/registration">Register Now</a>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

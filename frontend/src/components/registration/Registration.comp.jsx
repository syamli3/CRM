import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { userRegistration } from "../../api/registrationApi";

const initialState = {
  name: "",
  company: "",
  address: "",
  phone: "",
  email: "",
  password: "",
  confirmPass: "",
};

const passError = {
  isLenthError: false,
  isSamePass: false,
};

export const RegistrationComp = () => {
  const [newUser, setNewUser] = useState(initialState);
  const [passwordError, setPasswordError] = useState(passError);
  const [regStatus, setRegStatus] = useState({ status: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });

    if (name === "password") {
      const isLenthError = value.length < 8;
      setPasswordError({ ...passwordError, isLenthError });
    }

    if (name === "confirmPass") {
      const isSamePass = value !== newUser.password;
      setPasswordError({ ...passwordError, isSamePass });
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const { name, company, address, phone, email, password } = newUser;
    const formData = { name, company, address, phone, email, password };

    setIsLoading(true);
    try {
      const result = await userRegistration(formData);
      setRegStatus({ status: "success", message: result.message });
      setIsLoading(false);
    } catch (error) {
      setRegStatus({
        status: "error",
        message: error.message || "Something went wrong",
      });
      setIsLoading(false);
    }
  };

  return (
    <Container className="text-start">
      <Row>
        <Col>
          <h1 className="text-info text-center">User Registration</h1>
          <hr />
          {regStatus.message && (
            <Alert variant={regStatus.status === "success" ? "success" : "danger"}>
              {regStatus.message}
            </Alert>
          )}
          <Form onSubmit={handleOnSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleOnChange}
                placeholder="Enter Full Name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={newUser.company}
                onChange={handleOnChange}
                placeholder="Enter Company Name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={newUser.address}
                onChange={handleOnChange}
                placeholder="Enter Address"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="number"
                name="phone"
                value={newUser.phone}
                onChange={handleOnChange}
                placeholder="Enter Phone Number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleOnChange}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleOnChange}
                placeholder="Enter password"
                required
              />
              {passwordError.isLenthError && (
                <Form.Text className="text-danger">
                  Password must be at least 8 characters long.
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPass"
                value={newUser.confirmPass}
                onChange={handleOnChange}
                placeholder="Confirm password"
                required
              />
              {passwordError.isSamePass && (
                <Form.Text className="text-danger">
                  Passwords do not match.
                </Form.Text>
              )}
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              disabled={
                passwordError.isLenthError ||
                passwordError.isSamePass ||
                isLoading
              }
            >
              Register
            </Button>
            {isLoading && <Spinner animation="border" variant="primary" />}
          </Form>
          <hr />
        </Col>
      </Row>
      <Row>
        <Col>
          Already have an account? <a href="/">Login Now</a>
        </Col>
      </Row>
    </Container>
  );
};

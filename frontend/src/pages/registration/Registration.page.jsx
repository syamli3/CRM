import React from "react";
import { Container } from "react-bootstrap";
import { RegistrationComp } from "../../components/registration/Registration.comp";
import "./Registration.style.css";

export const Registration = () => {
  return (
    <div className="registration-page bg-info">
      <Container className="form-box w-50">
        <RegistrationComp />
      </Container>
    </div>
  );
};

export default Registration;

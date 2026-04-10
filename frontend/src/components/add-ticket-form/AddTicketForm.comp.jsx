import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import "./AddTicketForm.style.css";

export const AddTicketForm = ({
  handleOnSubmit,
  formData,
  handleOnChange,
  isLoading,
  error,
  successMsg,
}) => {
  return (
    <Container className="text-start my-5 add-new-ticket">
      <Row>
        <Col className="m-4">
          <h1 className="text-info text-center">Add New Ticket</h1>
          <hr />
          <div>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {isLoading && <Spinner variant="primary" animation="border" />}
          </div>
          <Form
            className="fs-5 d-grid gap-2"
            autoComplete="off"
            onSubmit={handleOnSubmit}
          >
            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Col sm={3}>
                <Form.Label>Subject</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  name="subject"
                  onChange={handleOnChange}
                  value={formData.subject}
                  placeholder="Enter Subject"
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Col sm={3}>
                <Form.Label>Issue On</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  type="date"
                  name="issueDate"
                  onChange={handleOnChange}
                  value={formData.issueDate}
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Col sm={3}>
                <Form.Label>Issue Found</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  as="textarea"
                  rows="7"
                  name="detail"
                  onChange={handleOnChange}
                  value={formData.detail}
                  placeholder="Enter Details"
                  required
                />
              </Col>
            </Form.Group>

            <Button variant="info" type="submit" size="lg" disabled={isLoading}>
              Add New Ticket
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

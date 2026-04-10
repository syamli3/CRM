import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { replyOnSelectedTicket } from "../../features/ticket/ticketActions";
import { Send } from "lucide-react";

export const UpdateTicket = ({ _id }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const { isLoading, replyMsg } = useSelector((state) => state.tickets);

  const handleOnChange = (e) => setMessage(e.target.value);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const msgObj = {
      message,
      sender: "Client",
    };
    dispatch(replyOnSelectedTicket(_id, msgObj));
    setMessage("");
  };

  return (
    <Form onSubmit={handleOnSubmit}>
      <Form.Group className="mb-3">
        <Form.Control
          as="textarea"
          rows={4}
          name="message"
          value={message}
          onChange={handleOnChange}
          placeholder="Type your message here..."
          className="rounded-4 border-light-subtle shadow-sm p-3"
          required
        />
      </Form.Group>
      <div className="text-end">
        <Button 
            variant="primary" 
            type="submit" 
            className="d-flex align-items-center gap-2 px-4 py-2 rounded-4 shadow-sm border-0"
            style={{ background: 'var(--saas-primary)' }}
            disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : <><Send size={16} /> Send Reply</>}
        </Button>
      </div>
      {replyMsg && <div className="text-success mt-2 small text-end">{replyMsg}</div>}
    </Form>
  );
};

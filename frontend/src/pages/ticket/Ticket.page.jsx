import React, { useEffect } from "react";
import { Container, Row, Col, Button, Card, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSelectedTicket, closeSelectedTicket } from "../../features/ticket/ticketActions";
import { MessageHistory } from "../../components/message-history/MessageHistory.comp";
import { UpdateTicket } from "../../components/update-ticket/UpdateTicket.comp";
import { ArrowLeft, Clock, User, Tag } from "lucide-react";
import { motion } from "framer-motion";

export const Ticket = () => {
  const { tId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedTicket, isLoading, error } = useSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(fetchSelectedTicket(tId));
  }, [tId, dispatch]);

  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button 
          variant="link" 
          onClick={() => navigate(-1)} 
          className="text-decoration-none text-muted p-0 mb-4 d-flex align-items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Button>

        {isLoading && <div className="text-center py-5">Loading ticket details...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {selectedTicket && selectedTicket._id && (
          <Row className="g-4">
            <Col lg={8}>
              <Card className="neo-saas-card border-0 p-4 mb-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h2 className="fw-bold mb-1">{selectedTicket.subject}</h2>
                    <div className="text-muted small">Ticket ID: #{selectedTicket._id}</div>
                  </div>
                  <Badge className="glass-pill bg-primary text-white border-0 px-3 py-2">
                    {selectedTicket.status}
                  </Badge>
                </div>
                <hr className="opacity-10" />
                <div className="conversation-area py-3">
                  <h6 className="fw-bold mb-4 text-muted small uppercase">Conversation History</h6>
                  <MessageHistory msg={selectedTicket.conversation} />
                </div>
              </Card>

              <Card className="neo-saas-card border-0 p-4">
                <h6 className="fw-bold mb-4">Post a Reply</h6>
                <UpdateTicket _id={selectedTicket._id} />
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="neo-saas-card border-0 p-4 sidebar-sticky">
                <h6 className="fw-bold mb-4">Ticket Insights</h6>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-2 rounded-3 text-primary">
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="text-muted small">Created On</div>
                      <div className="fw-medium">{new Date(selectedTicket.addedAt).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-2 rounded-3 text-primary">
                      <User size={18} />
                    </div>
                    <div>
                      <div className="text-muted small">Customer ID</div>
                      <div className="fw-medium">{selectedTicket.clientId}</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-2 rounded-3 text-primary">
                      <Tag size={18} />
                    </div>
                    <div>
                      <div className="text-muted small">Current Status</div>
                      <div className="fw-medium text-primary">{selectedTicket.status}</div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline-danger" 
                  className="mt-5 w-100 rounded-3 py-2 fw-bold" 
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => dispatch(closeSelectedTicket(tId))}
                  disabled={selectedTicket.status === "Closed"}
                >
                  {selectedTicket.status === "Closed" ? "Ticket Closed" : "Close This Ticket"}
                </Button>
              </Card>
            </Col>
          </Row>
        )}
      </motion.div>
    </Container>
  );
};

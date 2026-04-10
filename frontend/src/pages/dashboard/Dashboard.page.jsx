import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTickets } from "../../features/ticket/ticketActions.js";
import { Link } from "react-router-dom";
import { TicketTable } from "../../components/ticket-table/TicketTable.comp.jsx";
import { FilterPills } from "../../components/productivity/FilterPills.comp.jsx";
import { DashboardSidebar } from "../../components/productivity/DashboardSidebar.comp.jsx";
import { PlusCircle, Search, RefreshCw, LayoutDashboard, Calendar, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../../neo-saas.css";

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { tickets, isLoading, error } = useSelector((state) => state.tickets);
  
  const [filter, setFilter] = useState("Pending Operator response");
  const [searchTerm, setSearchTerm] = useState("");
  const [dispTickets, setDispTickets] = useState([]);

  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);

  useEffect(() => {
    let filtered = tickets;
    
    // Status Filter
    if (filter !== "All") {
      filtered = filtered.filter(t => t.status === filter);
    }
    
    // Search Filter
    if (searchTerm) {
      filtered = filtered.filter(t => t.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    setDispTickets(filtered);
  }, [tickets, filter, searchTerm]);

  const counts = {
    total: tickets?.length || 0,
    pending: tickets?.filter(t => t.status === "Pending Operator response").length || 0,
    closed: tickets?.filter(t => t.status === "Closed").length || 0,
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Container fluid className="px-lg-5 py-4 bg-light min-vh-100">
      <Row className="mb-4 align-items-end g-3">
        <Col md={8}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="d-flex align-items-center gap-3"
          >
            <div className="bg-primary text-white p-3 rounded-4 shadow-sm">
                <LayoutDashboard size={24} />
            </div>
            <div>
                <h5 className="text-muted mb-0 small uppercase ls-1">{getGreeting()}, Operator</h5>
                <h2 className="fw-bold mb-0">Support Workspace</h2>
            </div>
          </motion.div>
        </Col>
        <Col md={4} className="text-md-end">
            <div className="d-flex gap-2 justify-content-md-end">
                <Button variant="outline-secondary" onClick={() => dispatch(fetchAllTickets())} className="border-0 bg-white shadow-sm p-3 rounded-4">
                    <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
                </Button>
                <Button 
                    as={Link} 
                    to="/add-ticket" 
                    variant="primary" 
                    className="d-flex align-items-center gap-2 p-3 shadow-sm rounded-4 border-0"
                    style={{ background: 'var(--saas-primary)' }}
                >
                    <PlusCircle size={20}/> <span className="fw-bold">New Ticket</span>
                </Button>
            </div>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Main Workspace Area */}
        <Col lg={8}>
          <div className="dashboard-content pb-5">
            <Row className="mb-3 align-items-center">
                <Col md={7}>
                    <FilterPills activeFilter={filter} setFilter={setFilter} counts={counts} />
                </Col>
                <Col md={5}>
                    <InputGroup className="shadow-sm rounded-4 overflow-hidden mb-4">
                      <InputGroup.Text className="bg-white border-0 ps-3">
                        <Search size={18} className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Search tickets..."
                        className="search-glass border-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                </Col>
            </Row>

            <AnimatePresence mode="wait">
                <motion.div
                    key={filter + searchTerm}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-3 text-muted">Syncing workspace...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger rounded-4">{error}</div>
                    ) : (
                        <TicketTable tickets={(dispTickets || []).slice(0, 15)} />
                    )}
                </motion.div>
            </AnimatePresence>
          </div>
        </Col>

        {/* Intelligence Sidebar */}
        <Col lg={4}>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <DashboardSidebar tickets={tickets} />
            </motion.div>
        </Col>
      </Row>

      <div className="position-fixed bottom-0 start-50 translate-middle-x pb-4 text-muted small opacity-50 d-none d-lg-block">
        <Calendar size={12} className="me-1" /> {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </Container>
  );
};

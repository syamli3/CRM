import React from "react";
import { Table, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Clock, MessageSquare, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export const TicketTable = ({ tickets }) => {
  const getAgeStatus = (date) => {
    const diff = (new Date() - new Date(date)) / (1000 * 60 * 60); // hours
    if (diff > 48) return "urgent";
    if (diff > 24) return "warning";
    return "normal";
  };

  return (
    <div className="neo-saas-card overflow-hidden border-0">
      <Table hover responsive className="mb-0">
        <thead className="bg-light text-secondary">
          <tr style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <th className="px-4 py-3 border-0">#</th>
            <th className="py-3 border-0">Subject</th>
            <th className="py-3 border-0 text-center">Inactivity</th>
            <th className="py-3 border-0">Status</th>
            <th className="py-3 border-0 text-end px-4">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {tickets.length ? (
            tickets.map((row) => (
              <tr key={row._id} className="align-middle border-bottom">
                <td className="px-4 py-3 text-muted" style={{ fontSize: "0.8rem" }}>
                  #{row._id.slice(-5)}
                </td>
                <td className="py-3 fw-medium">
                  <div className="d-flex flex-column">
                    {row.subject}
                    <span className="text-muted" style={{ fontSize: "0.7rem", fontWeight: "normal" }}>
                        Opened: {new Date(row.addedAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-center">
                    {(() => {
                        const status = getAgeStatus(row.addedAt);
                        return (
                            <div className="d-flex align-items-center justify-content-center gap-1">
                                <Clock size={12} className={status === 'urgent' ? 'text-danger' : status === 'warning' ? 'text-warning' : 'text-muted'} />
                                <span style={{ fontSize: '0.75rem' }} className={status === 'urgent' ? 'text-danger fw-bold' : ''}>
                                    {Math.round((new Date() - new Date(row.addedAt)) / (1000 * 60 * 60))}h
                                </span>
                            </div>
                        )
                    })()}
                </td>
                <td className="py-3">
                  <Badge 
                    className={`px-3 py-2 border-0 fw-medium ${
                        row.status === 'Closed' ? 'status-pill-closed' : row.status === 'Pending Operator response' ? 'status-pill-pending' : 'status-pill-open'
                    }`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {row.status}
                  </Badge>
                </td>
                <td className="py-3 text-end px-4">
                  <Link to={`/ticket/${row._id}`} className="text-decoration-none">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="d-inline-flex bg-light rounded-circle shadow-sm border p-2"
                      style={{ cursor: "pointer" }}
                    >
                      <ExternalLink size={14} className="text-primary" />
                    </motion.div>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-5 text-muted">
                <MessageSquare className="mb-2 opacity-25" size={48} />
                <p>No active tickets found.</p>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

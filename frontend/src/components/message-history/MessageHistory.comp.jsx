import React from "react";
import "./MessageHistory.style.css";

export const MessageHistory = ({ msg }) => {
  if (!msg) return null;

  return msg.map((row, i) => (
    <div key={i} className={`message-history mt-3 d-flex flex-column ${row.sender === 'Client' ? 'align-items-end' : 'align-items-start'}`}>
      <div className={`p-3 rounded-4 shadow-sm border ${row.sender === 'Client' ? 'bg-primary text-white border-primary' : 'bg-light text-dark'}`} style={{ maxWidth: '80%' }}>
        <div className="fw-bold mb-1" style={{ fontSize: '0.8rem' }}>{row.sender}</div>
        <div className="message">{row.message}</div>
      </div>
      <div className="text-muted mt-1 px-2" style={{ fontSize: '0.7rem' }}>
        {new Date(row.date).toLocaleString()}
      </div>
    </div>
  ));
};

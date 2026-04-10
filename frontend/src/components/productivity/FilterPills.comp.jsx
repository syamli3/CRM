import React from "react";
import { Badge } from "react-bootstrap";
import { motion } from "framer-motion";

export const FilterPills = ({ activeFilter, setFilter, counts }) => {
  const filters = [
    { label: "All Tickets", value: "All", count: counts.total },
    { label: "Open", value: "Pending Operator response", count: counts.pending },
    { label: "Closed", value: "Closed", count: counts.closed },
  ];

  return (
    <div className="d-flex gap-2 mb-4">
      {filters.map((f, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter(f.value)}
          style={{ cursor: "pointer" }}
        >
          <Badge
            className={`glass-pill px-3 py-2 d-flex align-items-center gap-2 border-0 ${
              activeFilter === f.value
                ? "bg-primary text-white shadow"
                : "bg-light text-secondary border"
            }`}
          >
            {f.label}
            <span
              className={`rounded-circle px-2 py-1 ${
                activeFilter === f.value ? "bg-white text-primary" : "bg-secondary text-white"
              }`}
              style={{ fontSize: "0.65rem", minWidth: "20px" }}
            >
              {f.count || 0}
            </span>
          </Badge>
        </motion.div>
      ))}
    </div>
  );
};

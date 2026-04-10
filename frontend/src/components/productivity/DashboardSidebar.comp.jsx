import React from "react";
import { Card, ProgressBar } from "react-bootstrap";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Zap, Target, TrendingUp, HelpCircle } from "lucide-react";

const COLORS = ["#6366f1", "#f59e0b", "#22c55e", "#ef4444"];

export const DashboardSidebar = ({ tickets = [] }) => {
  const pending = (tickets || []).filter(t => t.status !== "Closed").length;
  const closed = (tickets || []).filter(t => t.status === "Closed").length;
  const total = tickets?.length || 1;
  const resolutionRate = Math.round((closed / total) * 100);

  const chartData = [
    { name: "Closed", value: closed },
    { name: "Pending", value: pending },
  ];

  return (
    <div className="sidebar-sticky d-flex flex-column gap-4">
      <Card className="neo-saas-card border-0 p-4 productivity-stat-card">
        <div className="d-flex align-items-center gap-2 mb-3">
          <Target className="text-primary" size={20} />
          <h6 className="mb-0 fw-bold">Performance Pulse</h6>
        </div>
        <div className="text-center mb-3">
          <div className="display-4 fw-bold text-primary">{resolutionRate}%</div>
          <div className="small text-muted">Resolution Rate</div>
        </div>
        <ProgressBar now={resolutionRate} variant="primary" style={{ height: "8px" }} className="rounded-pill" />
      </Card>

      <Card className="neo-saas-card border-0 p-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <TrendingUp className="text-success" size={20} />
          <h6 className="mb-0 fw-bold">Status Hub</h6>
        </div>
        <div style={{ height: "200px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="d-flex justify-content-between small text-muted">
            <span>Closed: {closed}</span>
            <span>Pending: {pending}</span>
        </div>
      </Card>

      <Card className="bg-primary text-white border-0 p-4 rounded-4 shadow">
        <div className="d-flex gap-3">
            <Zap size={32} />
            <div>
                <h6 className="fw-bold mb-1">Productivity Tip</h6>
                <p className="small mb-0 opacity-75">
                    Tickets older than 48 hours are automatically highlighted in red. Handle them first!
                </p>
            </div>
        </div>
      </Card>

      <div className="text-center text-muted small py-3">
        <HelpCircle size={14} className="me-1" />
        Need help? Contact support
      </div>
    </div>
  );
};

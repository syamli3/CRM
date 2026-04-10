import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "./features/login/loginSlice";
import { authorizeAccessToken, refreshAccessToken } from "./api/userApi";
import { DefaultLayout } from "./layout/DefaultLayout";
import { Dashboard } from "./pages/dashboard/Dashboard.page";
import { Entry } from "./pages/entry/Entry.page";
import { AddTicket } from "./pages/new-ticket/AddTicket.page";
import { TicketLists } from "./pages/ticket-listing/TicketLists.page";
import { Ticket } from "./pages/ticket/Ticket.page";
import { Registration } from "./pages/registration/Registration.page";
import "./App.css";
function App() {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.login);
  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const isTokenValid = await authorizeAccessToken();
        if (isTokenValid) {
          dispatch(loginSuccess());
        } else {
          const newToken = await refreshAccessToken();
          if (newToken) {
            dispatch(loginSuccess());
          }
        }
      } catch (error) {
        console.error("Error checking token validity:", error);
      }
    };
    checkTokenValidity();
  }, [dispatch]);
  return (
    <div className="App">
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route
            path="/dashboard"
            element={isAuth ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/add-ticket"
            element={isAuth ? <AddTicket /> : <Navigate to="/" />}
          />
          <Route
            path="/tickets"
            element={isAuth ? <TicketLists /> : <Navigate to="/" />}
          />
          <Route
            path="/ticket/:tId"
            element={isAuth ? <Ticket /> : <Navigate to="/" />}
          />
        </Route>
        <Route
          path="/"
          element={isAuth ? <Navigate to="/dashboard" /> : <Entry />}
        />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </div>
  );
}

export default App;

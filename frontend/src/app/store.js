import { configureStore } from "@reduxjs/toolkit";
import ticketsReducer from "../features/ticket/ticketsSlice";
import loginReducer from "../features/login/loginSlice";
import newTicketReducer from "../features/ticket/newTicketSlice";

export const store = configureStore({
  reducer: {
    tickets: ticketsReducer,
    login: loginReducer,
    newTicket: newTicketReducer,
  },
});

export default store;

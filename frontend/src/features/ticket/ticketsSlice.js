import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tickets: [],
  isLoading: false,
  error: "",
  replyTicketError: "",
  replyMsg: "",
  selectedTicket: {},
  searchTicketList: [],
};

const ticketListSlice = createSlice({
  name: "ticketList",
  initialState,
  reducers: {
    fetchTicketLoading: (state) => {
      state.isLoading = true;
    },
    fetchTicketSuccess: (state, action) => {
      state.isLoading = false;
      state.tickets = action.payload;
      state.searchTicketList = action.payload;
      state.error = "";
    },
    fetchTicketFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchSingleTicketSuccess: (state, action) => {
      state.isLoading = false;
      state.selectedTicket = action.payload;
      state.error = "";
    },
    fetchSingleTicketFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    replyTicketLoading: (state) => {
      state.isLoading = true;
    },
    replyTicketSuccess: (state, action) => {
      state.isLoading = false;
      state.replyMsg = action.payload;
      state.replyTicketError = "";
    },
    replyTicketFailure: (state, action) => {
      state.isLoading = false;
      state.replyTicketError = action.payload;
    },
    searchTickets: (state, { payload }) => {
      state.searchTicketList = state.tickets.filter((row) => {
        if (!payload) return row;

        return row.subject.toLowerCase().includes(payload.toLowerCase());
      });
    },
  },
});

const { reducer, actions } = ticketListSlice;

export const {
  fetchTicketLoading,
  fetchTicketSuccess,
  fetchTicketFailure,
  fetchSingleTicketSuccess,
  fetchSingleTicketFailure,
  replyTicketLoading,
  replyTicketSuccess,
  replyTicketFailure,
  searchTickets,
} = actions;
export default reducer;

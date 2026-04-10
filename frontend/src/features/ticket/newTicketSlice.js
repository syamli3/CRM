import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: "",
  successMsg: "",
};

const newTicketSlice = createSlice({
  name: "newTicket",
  initialState,
  reducers: {
    openTicketLoading: (state) => {
      state.isLoading = true;
    },
    openTicketSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.successMsg = payload;
    },
    openTicketFail: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },
    resetSuccessMsg: (state) => {
      state.successMsg = "";
    },
  },
});

const { reducer, actions } = newTicketSlice;

export const {
  openTicketLoading,
  openTicketSuccess,
  openTicketFail,
  resetSuccessMsg,
} = actions;

export default reducer;

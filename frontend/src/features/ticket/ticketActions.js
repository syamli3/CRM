import {
  fetchTicketLoading,
  fetchTicketSuccess,
  fetchTicketFailure,
  searchTickets,
  fetchSingleTicketSuccess,
  fetchSingleTicketFailure,
  replyTicketLoading,
  replyTicketSuccess,
  replyTicketFailure,
} from "./ticketsSlice.js";
import {
  openTicketLoading,
  openTicketSuccess,
  openTicketFail,
} from "./newTicketSlice.js";
import {
  getAllTickets,
  createTicket,
  fetchSingleTicket,
  replyOnTicket,
  closeTicket,
} from "../../api/ticketApi.js";

const fetchAllTickets = () => async (dispatch) => {
  dispatch(fetchTicketLoading());
  try {
    const result = await getAllTickets();
    if (result.data.status === "error") {
      return dispatch(fetchTicketFailure(result.data.message));
    }
    const tickets = result.data.tickets;
    return dispatch(fetchTicketSuccess(tickets));
  } catch (error) {
    return dispatch(fetchTicketFailure(error.message));
  }
};

const filterSerachTicket = (str) => (dispatch) => {
  dispatch(searchTickets(str));
};

const fetchSelectedTicket = (_id) => async (dispatch) => {
  dispatch(fetchTicketLoading());
  try {
    const result = await fetchSingleTicket(_id);
    if (result.status === "error") {
      return dispatch(fetchSingleTicketFailure(result.message));
    }
    return dispatch(fetchSingleTicketSuccess(result.ticket));
  } catch (error) {
    return dispatch(fetchSingleTicketFailure(error.message));
  }
};

const replyOnSelectedTicket = (_id, msgObj) => async (dispatch) => {
  dispatch(replyTicketLoading());
  try {
    const result = await replyOnTicket(_id, msgObj);
    if (result.status === "error") {
      return dispatch(replyTicketFailure(result.message));
    }
    dispatch(fetchSelectedTicket(_id));
    return dispatch(replyTicketSuccess(result.message));
  } catch (error) {
    return dispatch(replyTicketFailure(error.message));
  }
};

const openNewTicket = (formData) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    dispatch(openTicketLoading());
    try {
      const result = await createTicket(formData);
      if (result.status === "success") {
        dispatch(openTicketSuccess(result.message));
        resolve(result);
      } else {
        dispatch(openTicketFail(result.message));
      }
    } catch (error) {
      dispatch(openTicketFail(error.message));
    }
  });
};

const closeSelectedTicket = (_id) => async (dispatch) => {
  dispatch(fetchTicketLoading());
  try {
    const result = await closeTicket(_id);
    if (result.status === "error") {
      return dispatch(fetchSingleTicketFailure(result.message));
    }
    dispatch(fetchSelectedTicket(_id));
    return dispatch(replyTicketSuccess(result.message));
  } catch (error) {
    return dispatch(fetchSingleTicketFailure(error.message));
  }
};

export {
  fetchAllTickets,
  filterSerachTicket,
  openNewTicket,
  fetchSelectedTicket,
  replyOnSelectedTicket,
  closeSelectedTicket,
};

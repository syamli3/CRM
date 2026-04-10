import ticketModel from "./ticket.schema.js";

const insertTicket = async (ticketObj) => {
  return new Promise((resolve, reject) => {
    try {
      ticketModel(ticketObj)
        .save()
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

const getTickets = async (clientId) => {
  return new Promise((resolve, reject) => {
    try {
      ticketModel
        .find({ clientId })
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

const getTicketById = async (ticketId, clientId) => {
  return new Promise((resolve, reject) => {
    try {
      ticketModel
        .findOne({ _id: ticketId, clientId })
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

const updateClientTicket = async (ticketId, clientId, updateObj) => {
  return new Promise((resolve, reject) => {
    try {
      ticketModel
        .findOneAndUpdate(
          { _id: ticketId, clientId },
          {
            status: "Operator response pending",
            $push: { conversation: updateObj },
          },
          { new: true }
        )
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

const updateStatusClose = async (ticketId, clientId) => {
  return new Promise((resolve, reject) => {
    try {
      ticketModel
        .findOneAndUpdate(
          { _id: ticketId, clientId },
          {
            status: "Closed",
            isActive: false,
          },
          { new: true }
        )
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

const deleteTicket = async (ticketId, clientId) => {
  return new Promise((resolve, reject) => {
    try {
      ticketModel
        .findOneAndDelete({ _id: ticketId, clientId })
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

const updateClientTicketStatus = async (ticketId, clientId, updateObj) => {
  return new Promise((resolve, reject) => {
    try {
      ticketModel
        .findOneAndUpdate(
          { _id: ticketId, clientId },
          {
            $set: updateObj,
          },
          { new: true }
        )
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

export {
  insertTicket,
  getTickets,
  getTicketById,
  updateClientTicket,
  updateClientTicketStatus,
  updateStatusClose,
  deleteTicket,
};

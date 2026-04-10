import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddTicketForm } from "../../components/add-ticket-form/AddTicketForm.comp";
import { openNewTicket } from "../../features/ticket/ticketActions";
import { resetSuccessMsg } from "../../features/ticket/newTicketSlice";

const initialFrmDt = {
  subject: "",
  issueDate: "",
  detail: "",
};

export const AddTicket = () => {
  const dispatch = useDispatch();
  const { isLoading, error, successMsg } = useSelector(
    (state) => state.newTicket
  );

  const [formData, setFormData] = useState(initialFrmDt);

  useEffect(() => {
    return () => {
      successMsg && dispatch(resetSuccessMsg());
    };
  }, [dispatch, successMsg]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const { subject, detail } = formData;
    const ticketObj = {
      subject,
      sender: "Client",
      message: detail,
    };

    dispatch(openNewTicket(ticketObj));
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <AddTicketForm
      handleOnSubmit={handleOnSubmit}
      formData={formData}
      handleOnChange={handleOnChange}
      isLoading={isLoading}
      error={error}
      successMsg={successMsg}
    />
  );
};

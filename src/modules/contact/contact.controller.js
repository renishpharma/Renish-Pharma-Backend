import Contact from "./contact.model.js";
import catchAsync from "../../utils/catchAsync.js";

export const createContact = catchAsync(async (req, res) => {
  const contact = await Contact.create(req.body);

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: contact
  });
});

export const getContacts = catchAsync(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    count: contacts.length,
    data: contacts
  });
});
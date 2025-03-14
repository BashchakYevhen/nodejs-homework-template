const { Contact } = require("../models/contacts.model");
require("dotenv").config();
const { LIMIT } = process.env;

async function getAllContacts(req, res, next) {
  console.log("Q_U_E_R_Y", req.query);
  const { page = 1, limit = LIMIT, favorite } = req.query;
  const skip = (page - 1) * limit;
  const favoriteContacts = favorite ? { favorite } : {};

  const contacts = await Contact.find(favoriteContacts).skip(skip).limit(limit);
  return res.status(200).json({ data: { contact: contacts } });
}

async function getContactByID(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    return res.status(400).json({ message: "Not found" });
  }
  return res.status(200).send({ data: { contact: contact } });
}

async function addContact(req, res, next) {
  const newContact = await Contact.create(req.body);
  res.status(201).json({
    data: {
      contact: newContact,
    },
  });
}

async function deleteContact(req, res, next) {
  const { contactId } = req.params;
  const contactById = await Contact.findById(contactId);
  if (contactById) {
    await Contact.findByIdAndDelete(contactId);
  }
  return res.status(200).json({ data: { contact: contactById } });
}

async function updateContact(req, res, next) {
  const body = req.body;
  const contactId = req.params;
  if (!body) {
    return res.status(400).json({ message: "missing fields" });
  }
  const refreshContact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  res.status(200).json({ data: { contact: refreshContact } });
}

async function updateStatusContact(req, res, next) {
  const { contactId } = req.params;
  const { favorite } = req.body;
  if (!favorite) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  const result = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    {
      new: true,
    }
  );
  if (!result) {
    return res.status(400).json({ message: "missing fields" });
  }
  res.status(200).json({
    data: { result },
  });
}

module.exports = {
  getAllContacts,
  getContactByID,
  addContact,
  deleteContact,
  updateContact,
  updateStatusContact,
};

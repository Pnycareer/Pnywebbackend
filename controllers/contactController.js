import Contact from "../models/Contact.js";

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, course, message } = req.body;

    const newContact = new Contact({ name, email, phone, course, message });
    await newContact.save();

    res
      .status(201)
      .json({ success: true, message: "Form submitted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

import Contact from '../models/Contact.js';

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, course, message } = req.body;

    const newContact = new Contact({ name, email, phone, course, message });
    await newContact.save();

    res.status(201).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// controllers/eventController.js
import Event from '../models/Event.js';
import EventCategory from '../models/EventCategory.js';
import { uploadFiles } from '../multer/multerConfig.js';
export const createEvent = (req, res) => {
    uploadFiles(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      try {
        const {
          title,
          slug,
          category,
          date,
          address,
          description,
          link,
          metaTitle,
          metaDescription,
          inSitemap,
          pageIndex,
          customCanonicalUrl,
        } = req.body;
        // Check if category exists
        const eventCategory = await EventCategory.findById(category);
        if (!eventCategory) {
          return res.status(404).json({ error: 'Event category not found' });
        }
        // Handle file path
        const eventImage = req.files['image'] ? req.files['image'][0].path : null;
        // Create a new event
        const event = new Event({
          title,
          slug,
          category,
          image: eventImage,
          date,
          address,
          description,
          link,
          metaTitle,
          metaDescription,
          inSitemap,
          pageIndex,
          customCanonicalUrl,
        });
        const savedEvent = await event.save();
        res.status(201).json({ message: 'Event created successfully', event: savedEvent });
      } catch (error) {
        res.status(500).json({ error: 'Error creating event' });
      }
    });
  };
  

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('category');
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('category');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching event' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Error updating event' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting event' });
  }
};

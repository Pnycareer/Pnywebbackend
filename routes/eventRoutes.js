// routes/eventRoutes.js
import express from 'express';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';

const Everouter = express.Router();

// Route to create a new event
Everouter.post('/', createEvent);

// Route to get all events
Everouter.get('/', getAllEvents);

// Route to get a single event by ID
Everouter.get('/:id', getEventById);

// Route to update an event by ID
Everouter.put('/:id', updateEvent);

// Route to delete an event by ID
Everouter.delete('/:id', deleteEvent);

export default Everouter;

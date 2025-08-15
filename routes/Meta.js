import express from 'express'
import { addMeta , getMetas } from '../controllers/Metacontroller.js';

const router = express.Router();

// Route to add meta information
router.post("/metas", addMeta);

// Route to get all meta information
router.get("/home", getMetas);

export default  router;

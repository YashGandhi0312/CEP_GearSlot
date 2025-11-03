const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');
const Trainee = require('../models/Trainee');
const { startOfDay, endOfDay } = require('date-fns'); // <-- ADD THIS LINE

// @route   GET /api/slots
// @desc    Get all slots (and populate trainee info)
// @route   GET /api/slots
// @desc    Get slots filtered by date (Query parameter: ?date=YYYY-MM-DD)
router.get('/', async (req, res) => {
  try {
    const { date } = req.query; // Get the date from the query string

    const filter = {};
    if (date) {
        // If a date is provided, find all slots between the start and end of that day
        const dayStart = startOfDay(new Date(date));
        const dayEnd = endOfDay(new Date(date));
        
        filter.date = { $gte: dayStart, $lte: dayEnd }; // <-- NEW FILTER
    }

    const slots = await Slot.find(filter) // <-- USE FILTER
      .populate('trainees')
      .sort({ date: 1, startTime: 1 }); // <-- SORT BY NEW 'date' FIELD
      
    res.json(slots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/slots
// @desc    Create a new slot
router.post('/', async (req, res) => {
  const { date, startTime, endTime, maxTrainees } = req.body; // <-- CHANGE: Removed dayOfWeek, added 'date'
  try {
    const newSlot = new Slot({
      date: new Date(date), // <-- CHANGE: Convert string to Date object
      startTime,
      endTime,
      maxTrainees,
    });

    const slot = await newSlot.save();
    res.status(201).json(slot); // 201 = Created
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/slots/:id
// @desc    Delete a slot
router.delete('/:id', async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) {
      return res.status(404).json({ msg: 'Slot not found' }); // <-- FIX: Was 44
    }

    await Slot.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Slot removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- Trainee Management in a Slot ---

// @route   POST /api/slots/:id/trainees
// @desc    Add a trainee to a slot
router.post('/:id/trainees', async (req, res) => {
  const { traineeId } = req.body; // Expecting the trainee's ID

  try {
    const slot = await Slot.findById(req.params.id);
    const trainee = await Trainee.findById(traineeId);

    if (!slot) {
      return res.status(404).json({ msg: 'Slot not found' });
    }
    if (!trainee) {
      return res.status(404).json({ msg: 'Trainee not found' });
    }

    // Check if slot is full
    if (slot.trainees.length >= slot.maxTrainees) {
      return res.status(400).json({ msg: 'Slot is full' });
    }

    // Check if trainee is already in this slot
    if (slot.trainees.includes(traineeId)) {
      return res.status(400).json({ msg: 'Trainee already in this slot' });
    }

    // Add the trainee's ID to the array and save
    slot.trainees.push(traineeId);
    await slot.save();
    
    // Populate the slot before sending it back
    const populatedSlot = await Slot.findById(req.params.id).populate('trainees');
    res.json(populatedSlot);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/slots/:id/trainees/:traineeId
// @desc    Remove a trainee from a slot
router.delete('/:id/trainees/:traineeId', async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ msg: 'Slot not found' });
    }

    // Pull (remove) the traineeId from the trainees array
    slot.trainees.pull(req.params.traineeId);
    await slot.save();
    
    const populatedSlot = await Slot.findById(req.params.id).populate('trainees');
    res.json(populatedSlot);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error'); // <-- FIX: Corrected this catch block
  }
});

module.exports = router;
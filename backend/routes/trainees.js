const express = require('express');
const router = express.Router();
const Trainee = require('../models/Trainee');

// @route   POST /api/trainees
// @desc    Create a new trainee
router.post('/', async (req, res) => {
  const { name, phone, email } = req.body;
  try {
    let trainee = await Trainee.findOne({ phone });
    if (trainee) {
      return res.status(400).json({ msg: 'Trainee with this phone number already exists' });
    }
    
    trainee = new Trainee({
      name,
      phone,
      email,
    });

    await trainee.save();
    res.status(201).json(trainee);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/trainees
// @desc    Get all trainees (for your search list)
router.get('/', async (req, res) => {
  try {
    const trainees = await Trainee.find().sort({ name: 1 });
    res.json(trainees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/trainees/:id
// @desc    Delete a trainee
router.delete('/:id', async (req, res) => {
  try {
    let trainee = await Trainee.findById(req.params.id);
    if (!trainee) {
      return res.status(404).json({ msg: 'Trainee not found' });
    }

    // Note: We'll need to add logic here to remove this trainee
    // from all slots they were assigned to. We'll do that later.

    await Trainee.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Trainee removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// We can add a PUT route for editing later if needed.

module.exports = router;
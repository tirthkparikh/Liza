import express from 'express'
import Reminder from '../models/Reminder.js'

const router = express.Router()

// Get all reminders for user
router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: 'liza' })
      .sort({ datetime: 1 })
    res.json(reminders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create reminder
router.post('/', async (req, res) => {
  try {
    const reminder = new Reminder({
      ...req.body,
      userId: 'liza'
    })
    await reminder.save()
    res.json(reminder)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update reminder
router.put('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' })
    }
    res.json(reminder)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete reminder
router.delete('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id)
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' })
    }
    res.json({ message: 'Reminder deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router


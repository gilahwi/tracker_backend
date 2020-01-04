const mongoose = require('mongoose')
const { Schema } = mongoose

const CycleSchema = new Schema({
  startDate: Date,
  hasEnded: Boolean,
  cycleLength: Number
})

mongoose.model('Cycle', CycleSchema)

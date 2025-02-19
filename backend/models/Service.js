import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 15
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Add this before creating the model
serviceSchema.index({ name: 1, isActive: 1 });
serviceSchema.index({ 'doctors': 1 });

// Remove the pre-find middleware and handle population in the controller
const Service = mongoose.model('Service', serviceSchema);

export default Service; 
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'not_required'],
    default: 'pending'
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  patientNotes: {
    type: String,
    default: ''
  },
  doctorNotes: {
    type: String
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  transactionId: {
    type: String
  },
  isFreeAppointment: {
    type: Boolean,
    default: false
  },
  prescription: {
    medicines: [{
      name: String,
      dosage: String,
      duration: String,
      instructions: String
    }],
    notes: String,
    prescribedDate: {
      type: Date,
      default: Date.now
    }
  },
  paymentMethod: {
    type: String,
    default: null
  },
  scheduledAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Add compound index with unique constraint
appointmentSchema.index(
  { doctor: 1, date: 1, time: 1 },
  { 
    unique: true,
    partialFilterExpression: { 
      status: { $in: ['pending', 'scheduled'] } 
    }
  }
);

// Add index for efficient querying
appointmentSchema.index({ doctor: 1, scheduledAt: 1 });
appointmentSchema.index({ patient: 1, scheduledAt: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment; 
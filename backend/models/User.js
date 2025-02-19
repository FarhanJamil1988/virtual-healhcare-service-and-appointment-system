import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  phoneNumber: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: null
  },
  
  specialization: {
    type: String,
    required: function() {
      return this.role === 'doctor';
    },
    default: null
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  workingHours: {
    start: {
      type: String,
      default: '09:00'
    },
    end: {
      type: String,
      default: '17:00'
    }
  },
  duration: {
    type: Number,
    required: function() {
      return this.role === 'doctor';
    },
    default: function() {
      return this.role === 'doctor' ? 30 : undefined;
    }
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: function() {
      return this.role === 'doctor';
    }
  }],
  appointmentCount: {
    type: Number,
    default: 0,
    required: function() {
      return this.role === 'patient';
    }
  },
  freeAppointmentsUsed: {
    type: Number,
    default: 0,
    required: function() {
      return this.role === 'patient';
    }
  }
}, {
  timestamps: true
});

// Pre-save hook for hashing password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User; 
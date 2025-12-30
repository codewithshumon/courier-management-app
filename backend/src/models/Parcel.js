import mongoose from 'mongoose';

const parcelSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        default: 'Bangladesh',
      },
      lat: Number,
      lng: Number,
    },
  },
  receiver: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        default: 'Bangladesh',
      },
      lat: Number,
      lng: Number,
    },
  },
  parcelDetails: {
    type: {
      type: String,
      enum: ['document', 'package', 'fragile', 'electronics', 'clothing', 'other'],
      default: 'package',
    },
    weight: {
      type: String,
    },
    dimensions: {
      length: String,
      width: String,
      height: String,
    },
    description: String,
    items: [{
      name: String,
      quantity: {
        type: Number,
        default: 1,
      },
      value: {
        type: Number,
        default: 0,
      },
    }],
  },
  payment: {
    method: {
      type: String,
      enum: ['cod', 'prepaid', 'card', 'bank_transfer'],
      default: 'cod',
    },
    amount: {
      type: Number,
    },
    codAmount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: String,
  },
  delivery: {
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'],
      default: 'pending',
    },
    estimatedDelivery: Date,
    actualDelivery: Date,
    deliveryNotes: String, 
    failedReason: String,
    proofOfDelivery: {
      image: String,
      signature: String,
      notes: String,
    },
  },
  tracking: [{
    status: {
      type: String,
      enum: ['created', 'pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'],
      required: true,
    },
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    notes: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  qrCode: {
    type: String,
    default: '',
  },
  barcode: {
    type: String,
    default: '',
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'express'],
    default: 'normal',
  },
  insurance: {
    insured: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  notes: String, 
}, {
  timestamps: true,
});

parcelSchema.pre('save', function(next) {
  if (!this.trackingNumber || this.trackingNumber === '') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.trackingNumber = `TRK${timestamp}${random}`;
  }
  next();
});

parcelSchema.pre('save', function(next) {
  if (this.isNew) {
    this.tracking.push({
      status: 'created',
      notes: 'Parcel booking created',
      timestamp: new Date(),
    });
  }
  
  if (this.isModified('delivery.status')) {
    this.tracking.push({
      status: this.delivery.status,
      notes: this.delivery.deliveryNotes || '',
      timestamp: new Date(),
    });
  }
  next();
});

parcelSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Parcel = mongoose.model('Parcel', parcelSchema);
export default Parcel;
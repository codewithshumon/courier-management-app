import Parcel from '../models/Parcel.js';
import User from '../models/User.js';
import { generateQRCode } from '../utils/generateQR.js';
import { sendParcelStatusEmail } from '../utils/emailService.js';

export const createParcel = async (req, res) => {
  try {
    const {
      sender,
      receiver,
      parcelDetails,
      payment,
      delivery, 
      customer,
      notes
    } = req.body;

    console.log('Received delivery data:', delivery);
    console.log('Received notes:', notes);

    if (!sender || !receiver || !parcelDetails || !payment) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (!receiver.name || !receiver.phone) {
      return res.status(400).json({
        success: false,
        message: 'Receiver name and phone are required'
      });
    }

    const amountNum = parseFloat(payment.amount) || 0;
    const codAmountNum = parseFloat(payment.codAmount) || 0;

    const parcelData = {
      customer: customer || req.user.id,
      sender: {
        name: sender.name || req.user.name,
        phone: sender.phone || req.user.phone,
        email: sender.email || req.user.email || '',
        address: {
          street: sender.address?.street || '',
          city: sender.address?.city || '',
          state: sender.address?.state || '',
          zipCode: sender.address?.zipCode || '',
          country: sender.address?.country || 'Bangladesh'
        }
      },
      receiver: {
        name: receiver.name,
        phone: receiver.phone,
        email: receiver.email || '',
        address: {
          street: receiver.address?.street || '',
          city: receiver.address?.city || '',
          state: receiver.address?.state || '',
          zipCode: receiver.address?.zipCode || '',
          country: receiver.address?.country || 'Bangladesh'
        }
      },
      parcelDetails: {
        type: parcelDetails.type || 'package',
        weight: parcelDetails.weight || '1.0',
        dimensions: {
          length: parcelDetails.dimensions?.length || '',
          width: parcelDetails.dimensions?.width || '',
          height: parcelDetails.dimensions?.height || ''
        },
        description: parcelDetails.description || '',
        items: parcelDetails.items || [{ name: 'Item', quantity: 1, value: 0 }]
      },
      payment: {
        method: payment.method || 'cod',
        amount: amountNum, 
        codAmount: codAmountNum, 
        status: 'pending'
      },
      delivery: {
        status: 'pending',
        deliveryNotes: delivery?.notes || ''
      },
      notes: notes || '', 
      tracking: [] 
    };

    console.log('Parcel data to save:', JSON.stringify(parcelData, null, 2));

    const parcel = await Parcel.create(parcelData);
    
    console.log('Parcel created with tracking number:', parcel.trackingNumber);

    try {
      const qrCodePath = generateQRCode(parcel.trackingNumber, parcel._id);
      parcel.qrCode = qrCodePath;
      await parcel.save();
      console.log('QR code generated:', qrCodePath);
    } catch (qrError) {
      console.warn('QR code generation failed:', qrError.message);
    }

    if (!parcel.tracking || parcel.tracking.length === 0) {
      parcel.tracking.push({
        status: 'created',
        notes: 'Parcel booking created',
        updatedBy: req.user.id,
      });
      await parcel.save();
    }

    const io = req.app.get('socketio');
    if (io) {
      io.to(`user-${req.user.id}`).emit('parcel-created', parcel);
    }

    res.status(201).json({
      success: true,
      message: 'Parcel created successfully',
      parcel,
    });
  } catch (error) {
    console.error('Create parcel error:', error);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Tracking number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getParcels = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    } else if (req.user.role === 'agent') {
      query['delivery.agent'] = req.user.id;
    }

    if (status && status !== 'all') {
      query['delivery.status'] = status;
    }

    if (search) {
      query.$or = [
        { trackingNumber: { $regex: search, $options: 'i' } },
        { 'sender.name': { $regex: search, $options: 'i' } },
        { 'receiver.name': { $regex: search, $options: 'i' } },
        { 'sender.phone': { $regex: search, $options: 'i' } },
        { 'receiver.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const parcels = await Parcel.find(query)
      .populate('customer', 'name email phone')
      .populate('delivery.agent', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Parcel.countDocuments(query);

    res.status(200).json({
      success: true,
      count: parcels.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      parcels,
    });
  } catch (error) {
    console.error('Get parcels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getParcel = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('delivery.agent', 'name phone vehicleType licensePlate')
      .populate('tracking.updatedBy', 'name role');

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: 'Parcel not found',
      });
    }

    if (
      req.user.role === 'customer' &&
      parcel.customer._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this parcel',
      });
    }

    if (
      req.user.role === 'agent' &&
      parcel.delivery.agent &&
      parcel.delivery.agent._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this parcel',
      });
    }

    res.status(200).json({
      success: true,
      parcel,
    });
  } catch (error) {
    console.error('Get parcel error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid parcel ID',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const updateParcelStatus = async (req, res) => {
  try {
    const { status, notes, location, proofImage, signature } = req.body;

    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: 'Parcel not found',
      });
    }

    if (
      req.user.role === 'agent' &&
      parcel.delivery.agent?.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this parcel',
      });
    }

    parcel.delivery.status = status;
    parcel.delivery.deliveryNotes = notes || '';

    parcel.tracking.push({
      status,
      location,
      notes,
      updatedBy: req.user.id,
      timestamp: new Date(),
    });

    if (status === 'delivered') {
      parcel.delivery.actualDelivery = new Date();
      parcel.payment.status = 'paid';
      
      if (proofImage) {
        parcel.delivery.proofOfDelivery.image = proofImage;
      }
      if (signature) {
        parcel.delivery.proofOfDelivery.signature = signature;
      }
    }

    if (status === 'failed') {
      parcel.delivery.failedReason = notes;
    }

    await parcel.save();

    try {
      const customer = await User.findById(parcel.customer);
      if (customer && customer.email) {
        await sendParcelStatusEmail(parcel, customer);
      }
    } catch (emailError) {
      console.warn('Email sending failed:', emailError.message);
    }

    const io = req.app.get('socketio');
    if (io) {
      io.to(`parcel-${parcel._id}`).emit('status-updated', {
        parcelId: parcel._id,
        status,
        timestamp: new Date(),
        notes,
      });

      io.to(`user-${parcel.customer}`).emit('parcel-updated', parcel);
    }

    res.status(200).json({
      success: true,
      message: 'Parcel status updated successfully',
      parcel,
    });
  } catch (error) {
    console.error('Update parcel status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid parcel ID',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const trackParcel = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const parcel = await Parcel.findOne({ trackingNumber })
      .populate('customer', 'name email phone')
      .populate('delivery.agent', 'name phone vehicleType')
      .populate('tracking.updatedBy', 'name role');

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: 'Parcel not found',
      });
    }

    res.status(200).json({
      success: true,
      parcel,
    });
  } catch (error) {
    console.error('Track parcel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getParcelMetrics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let query = {};
    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    } else if (req.user.role === 'agent') {
      query['delivery.agent'] = req.user.id;
    }

    const metrics = {
      total: await Parcel.countDocuments(query),
      pending: await Parcel.countDocuments({ ...query, 'delivery.status': 'pending' }),
      inTransit: await Parcel.countDocuments({ ...query, 'delivery.status': 'in_transit' }),
      delivered: await Parcel.countDocuments({ ...query, 'delivery.status': 'delivered' }),
      failed: await Parcel.countDocuments({ ...query, 'delivery.status': 'failed' }),
      today: await Parcel.countDocuments({
        ...query,
        createdAt: { $gte: today, $lt: tomorrow },
      }),
    };

    let codQuery = { 'payment.method': 'cod', 'payment.status': 'pending' };
    if (req.user.role === 'customer') {
      codQuery.customer = req.user.id;
    }

    const totalCOD = await Parcel.aggregate([
      { $match: codQuery },
      { $group: { _id: null, total: { $sum: '$payment.amount' } } },
    ]);

    const weeklyStats = await Parcel.aggregate([
      {
        $match: {
          ...query,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
          delivered: {
            $sum: {
              $cond: [{ $eq: ['$delivery.status', 'delivered'] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      metrics: {
        ...metrics,
        totalCOD: totalCOD[0]?.total || 0,
      },
      weeklyStats,
    });
  } catch (error) {
    console.error('Get parcel metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getMyParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ customer: req.user.id })
      .sort({ createdAt: -1 })
      .populate('delivery.agent', 'name phone');

    res.status(200).json({
      success: true,
      count: parcels.length,
      parcels,
    });
  } catch (error) {
    console.error('Get my parcels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
import User from '../models/User.js';
import Parcel from '../models/Parcel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;

    if (req.user.role === 'agent') {
      const { assignedArea, vehicleType, licensePlate } = req.body;
      if (assignedArea) updates.assignedArea = assignedArea;
      if (vehicleType) updates.vehicleType = vehicleType;
      if (licensePlate) updates.licensePlate = licensePlate;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file',
      });
    }

    const user = await User.findById(req.user.id);
    
    if (user.profileImage) {
      const oldImagePath = path.join(__dirname, '../..', user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    user.profileImage = `/uploads/profiles/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const activeParcels = await Parcel.countDocuments({
      customer: req.user.id,
      'delivery.status': { $nin: ['delivered', 'failed', 'returned'] }
    });

    if (activeParcels > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete account with active parcels',
      });
    }

    if (user.profileImage) {
      const imagePath = path.join(__dirname, '../..', user.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      users,
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let userStats = {};
    
    if (user.role === 'customer') {
      const parcelStats = await Parcel.aggregate([
        { $match: { customer: user._id } },
        { $group: {
          _id: '$delivery.status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$payment.amount' }
        }}
      ]);

      userStats.parcelStats = parcelStats;
      userStats.totalParcels = await Parcel.countDocuments({ customer: user._id });
      userStats.totalSpent = parcelStats.reduce((sum, stat) => sum + stat.totalAmount, 0);
    }

    if (user.role === 'agent') {
      const deliveryStats = await Parcel.aggregate([
        { $match: { 'delivery.agent': user._id } },
        { $group: {
          _id: '$delivery.status',
          count: { $sum: 1 },
          avgDeliveryTime: { $avg: { $subtract: ['$delivery.actualDelivery', '$delivery.estimatedDelivery'] } }
        }}
      ]);

      userStats.deliveryStats = deliveryStats;
      userStats.totalDeliveries = await Parcel.countDocuments({ 'delivery.agent': user._id });
      userStats.successRate = deliveryStats.find(stat => stat._id === 'delivered')?.count || 0;
    }

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        stats: userStats,
      },
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
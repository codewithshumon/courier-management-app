'use client'

import { useState, useEffect } from 'react'
import { api } from '@/app/lib/api'
import { toast } from 'react-toastify'
import {
  FaSearch,
  FaMapMarkerAlt,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaBoxOpen,
  FaUser,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa'
import DashboardLayout from '@/app/components/Layout/DashboardLayout'

export default function TrackParcelPage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [parcel, setParcel] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchParcel = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number')
      return
    }

    setLoading(true)
    try {
      const response = await api.trackParcel(trackingNumber)
      if (response.success) {
        setParcel(response.parcel)
        toast.success('Parcel found!')
      }
    } catch (error) {
      toast.error(error.message || 'Parcel not found')
      setParcel(null)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="h-5 w-5 text-yellow-500" />
      case 'assigned':
        return <FaUser className="h-5 w-5 text-blue-500" />
      case 'picked_up':
        return <FaBoxOpen className="h-5 w-5 text-purple-500" />
      case 'in_transit':
        return <FaTruck className="h-5 w-5 text-indigo-500" />
      case 'delivered':
        return <FaCheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <FaClock className="h-5 w-5 text-red-500" />
      default:
        return <FaClock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'assigned':
        return 'bg-blue-100 text-blue-800'
      case 'picked_up':
        return 'bg-purple-100 text-purple-800'
      case 'in_transit':
        return 'bg-indigo-100 text-indigo-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Track Your Parcel</h1>
          <p className="text-gray-600 mt-2">Enter your tracking number to get real-time updates</p>
        </div>

        <div className="card mb-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tracking Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (e.g., TRK123456789)"
                  className="input-field pl-10"
                />
              </div>
            </div>
            <button
              onClick={fetchParcel}
              disabled={loading}
              className="btn-primary h-11 px-6"
            >
              {loading ? 'Searching...' : 'Track Parcel'}
            </button>
          </div>
        </div>

        {parcel ? (
          <div className="space-y-8">
            <div className="card">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Parcel Details</h3>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tracking Number</p>
                      <p className="font-mono font-medium">{parcel.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Status</p>
                      <div className="flex items-center space-x-2">
                        <span className={`status-badge ${getStatusColor(parcel.delivery.status)}`}>
                          {parcel.delivery.status.replace('_', ' ')}
                        </span>
                        {getStatusIcon(parcel.delivery.status)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium capitalize">{parcel.payment.method}</p>
                    </div>
                  </div>
                </div>
                {parcel.qrCode && (
                  <div className="mt-4 lg:mt-0">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${parcel.qrCode}`}
                      alt="QR Code"
                      className="h-32 w-32"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-6">Tracking History</h3>
              <div className="space-y-8">
                {parcel.tracking.map((track, index) => (
                  <div key={index} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        track.status === 'delivered' ? 'bg-green-100' :
                        track.status === 'failed' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}>
                        {getStatusIcon(track.status)}
                      </div>
                      {index < parcel.tracking.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium capitalize">
                            {track.status.replace('_', ' ')}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{track.notes}</p>
                          {track.location?.address && (
                            <p className="text-sm text-gray-500 mt-1 flex items-center">
                              <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                              {track.location.address}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {formatDate(track.timestamp)}
                          </p>
                          {track.updatedBy?.name && (
                            <p className="text-xs text-gray-500 mt-1">
                              Updated by: {track.updatedBy.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaUser className="mr-2 text-blue-600" />
                  Sender Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{parcel.sender.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium flex items-center">
                      <FaPhone className="h-4 w-4 mr-2 text-gray-400" />
                      {parcel.sender.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">
                      {parcel.sender.address.street}, {parcel.sender.address.city}
                      <br />
                      {parcel.sender.address.state}, {parcel.sender.address.zipCode}
                      <br />
                      {parcel.sender.address.country}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaUser className="mr-2 text-blue-600" />
                  Receiver Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{parcel.receiver.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium flex items-center">
                      <FaPhone className="h-4 w-4 mr-2 text-gray-400" />
                      {parcel.receiver.phone}
                    </p>
                  </div>
                  {parcel.receiver.email && (
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium flex items-center">
                        <FaEnvelope className="h-4 w-4 mr-2 text-gray-400" />
                        {parcel.receiver.email}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="font-medium">
                      {parcel.receiver.address.street}, {parcel.receiver.address.city}
                      <br />
                      {parcel.receiver.address.state}, {parcel.receiver.address.zipCode}
                      <br />
                      {parcel.receiver.address.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Parcel Details</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium capitalize">{parcel.parcelDetails.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Weight</p>
                      <p className="font-medium">{parcel.parcelDetails.weight} kg</p>
                    </div>
                  </div>
                  {parcel.parcelDetails.dimensions && (
                    <div>
                      <p className="text-sm text-gray-600">Dimensions (L × W × H)</p>
                      <p className="font-medium">
                        {parcel.parcelDetails.dimensions.length} × 
                        {parcel.parcelDetails.dimensions.width} × 
                        {parcel.parcelDetails.dimensions.height} cm
                      </p>
                    </div>
                  )}
                  {parcel.parcelDetails.description && (
                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="font-medium">{parcel.parcelDetails.description}</p>
                    </div>
                  )}
                  {parcel.parcelDetails.items && parcel.parcelDetails.items.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Items</p>
                      <div className="mt-2 space-y-2">
                        {parcel.parcelDetails.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name} × {item.quantity}</span>
                            <span>৳{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Payment & Delivery</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium capitalize">{parcel.payment.method}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-medium">৳{parcel.payment.amount.toFixed(2)}</p>
                    </div>
                  </div>
                  {parcel.payment.codAmount > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">COD Amount</p>
                      <p className="font-medium">৳{parcel.payment.codAmount.toFixed(2)}</p>
                    </div>
                  )}
                  {parcel.delivery.agent && (
                    <div>
                      <p className="text-sm text-gray-600">Assigned Agent</p>
                      <p className="font-medium">{parcel.delivery.agent.name}</p>
                      <p className="text-xs text-gray-500">
                        Phone: {parcel.delivery.agent.phone}
                      </p>
                      {parcel.delivery.agent.vehicleType && (
                        <p className="text-xs text-gray-500">
                          Vehicle: {parcel.delivery.agent.vehicleType}
                        </p>
                      )}
                    </div>
                  )}
                  {parcel.delivery.estimatedDelivery && (
                    <div>
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="font-medium">{formatDate(parcel.delivery.estimatedDelivery)}</p>
                    </div>
                  )}
                  {parcel.delivery.actualDelivery && (
                    <div>
                      <p className="text-sm text-gray-600">Delivered On</p>
                      <p className="font-medium">{formatDate(parcel.delivery.actualDelivery)}</p>
                    </div>
                  )}
                  {parcel.insurance.insured && (
                    <div>
                      <p className="text-sm text-gray-600">Insurance</p>
                      <p className="font-medium">৳{parcel.insurance.amount.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
                <FaBoxOpen className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No parcel found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Enter a valid tracking number above to track your parcel.
                You'll get real-time updates on its location and status.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
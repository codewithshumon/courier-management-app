'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'
import { toast } from 'react-toastify'
import DashboardLayout from '@/app/components/Layout/DashboardLayout'
import { 
  FaArrowLeft, 
  FaBox, 
  FaUser, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaWeight,
  FaRuler,
  FaMoneyBill,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaQrcode,
  FaPrint,
  FaShare,
  FaCopy,
  FaDownload
} from 'react-icons/fa'

export default function ParcelDetails({ trackingNumber }) {
  const { user, token } = useAuth()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [parcel, setParcel] = useState(null)
  const [trackingHistory, setTrackingHistory] = useState([])
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (trackingNumber && token) {
      fetchParcelDetails()
    }
  }, [trackingNumber, token])

  const downloadQRCode = async () => {
    if (!parcel?.qrCode) return
    
    try {
      setDownloading(true)
      
      const imageUrl = `${process.env.NEXT_PUBLIC_API_IMAGE_URL}${parcel.qrCode}`
      const filename = `QR_${parcel.trackingNumber}.png`
      
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      
      link.click()
      
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
      
      toast.success('QR Code downloaded successfully!')
      
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setDownloading(false)
    }
  }

  const fetchParcelDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parcels/track/${trackingNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setParcel(data.parcel)
        const sortedTracking = [...data.parcel.tracking].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        )
        setTrackingHistory(sortedTracking)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load parcel details')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'picked_up': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'in_transit': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'failed': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FaClock className="h-5 w-5" />
      case 'assigned': 
      case 'picked_up': 
      case 'in_transit': return <FaTruck className="h-5 w-5" />
      case 'out_for_delivery': return <FaTruck className="h-5 w-5" />
      case 'delivered': return <FaCheckCircle className="h-5 w-5" />
      case 'failed': return <FaClock className="h-5 w-5" />
      default: return <FaBox className="h-5 w-5" />
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    if (parcel && navigator.share) {
      navigator.share({
        title: `Track Your Parcel: ${parcel.trackingNumber}`,
        text: `Track your parcel with tracking number: ${parcel.trackingNumber}`,
        url: window.location.href,
      })
    } else if (parcel) {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleCopyTrackingNumber = () => {
    if (parcel) {
      navigator.clipboard.writeText(parcel.trackingNumber)
      toast.success('Tracking number copied!')
    } else {
      navigator.clipboard.writeText(trackingNumber)
      toast.success('Tracking number copied!')
    }
  }

  const getProgressPercentage = () => {
    if (!parcel) return 0
    const statusOrder = ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered']
    const currentIndex = statusOrder.indexOf(parcel.delivery?.status)
    return currentIndex >= 0 ? Math.round(((currentIndex + 1) / statusOrder.length) * 100) : 0
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-100">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading parcel details...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!parcel) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <FaBox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Parcel Not Found</h2>
            <p className="text-gray-600 mb-6">The parcel you're looking for doesn't exist.</p>
            <Link
              href="/customer/parcels"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Back to My Parcels
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/customer/parcels"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2"
              >
                <FaArrowLeft className="h-4 w-4 mr-2" />
                Back to My Parcels
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Parcel Tracking</h1>
              <div className="flex items-center mt-2">
                <p className="text-gray-600 mr-4">Tracking Number:</p>
                <div className="flex items-center">
                  <code className="bg-gray-100 px-3 py-1 rounded-lg font-mono text-lg font-bold text-blue-600">
                    {parcel.trackingNumber}
                  </code>
                  <button
                    onClick={handleCopyTrackingNumber}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    title="Copy tracking number"
                  >
                    <FaCopy className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center"
              >
                <FaShare className="h-4 w-4 mr-2" />
                Share
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium flex items-center"
              >
                <FaPrint className="h-4 w-4 mr-2" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Current Status</h2>
              <div className="flex items-center mt-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(parcel.delivery?.status)} border flex items-center`}>
                  {getStatusIcon(parcel.delivery?.status || 'pending')}
                  <span className="ml-2">{parcel.delivery?.status?.replace(/_/g, ' ').toUpperCase() || 'PENDING'}</span>
                </div>
                {parcel.delivery?.estimatedDelivery && (
                  <div className="ml-4 text-sm text-gray-600">
                    Estimated Delivery: {formatDateShort(parcel.delivery.estimatedDelivery)}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Booked On</div>
              <div className="font-medium">{formatDateShort(parcel.createdAt)}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Booking Created</span>
              <span>Delivered</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <div className="text-xs text-gray-500">Pending</div>
              <div className="text-xs text-gray-500">In Transit</div>
              <div className="text-xs text-gray-500">Delivered</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Sender/Receiver Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sender & Receiver Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sender Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <FaUser className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Sender</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{parcel.sender?.name || 'N/A'}</p>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <FaPhone className="h-4 w-4 mr-2" />
                      {parcel.sender?.phone || 'N/A'}
                    </div>
                    {parcel.sender?.email && (
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <FaEnvelope className="h-4 w-4 mr-2" />
                        {parcel.sender.email}
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex items-start text-sm">
                      <FaMapMarkerAlt className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">{parcel.sender?.address?.street || 'N/A'}</p>
                        <p>{parcel.sender?.address?.city || 'N/A'}, {parcel.sender?.address?.zipCode || 'N/A'}</p>
                        <p>{parcel.sender?.address?.country || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Receiver Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <FaUser className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Receiver</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{parcel.receiver?.name || 'N/A'}</p>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <FaPhone className="h-4 w-4 mr-2" />
                      {parcel.receiver?.phone || 'N/A'}
                    </div>
                    {parcel.receiver?.email && (
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <FaEnvelope className="h-4 w-4 mr-2" />
                        {parcel.receiver.email}
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex items-start text-sm">
                      <FaMapMarkerAlt className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">{parcel.receiver?.address?.street || 'N/A'}</p>
                        <p>{parcel.receiver?.address?.city || 'N/A'}, {parcel.receiver?.address?.zipCode || 'N/A'}</p>
                        <p>{parcel.receiver?.address?.country || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Parcel Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <FaBox className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Parcel Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-32 text-gray-600">Type:</div>
                      <div className="font-medium capitalize">{parcel.parcelDetails?.type || 'N/A'}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 text-gray-600">Weight:</div>
                      <div className="font-medium flex items-center">
                        <FaWeight className="h-4 w-4 mr-2 text-gray-400" />
                        {parcel.parcelDetails?.weight || 'N/A'} kg
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 text-gray-600">Dimensions:</div>
                      <div className="font-medium flex items-center">
                        <FaRuler className="h-4 w-4 mr-2 text-gray-400" />
                        {parcel.parcelDetails?.dimensions?.length || 'N/A'} × {parcel.parcelDetails?.dimensions?.width || 'N/A'} × {parcel.parcelDetails?.dimensions?.height || 'N/A'} cm
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-32 text-gray-600">Payment Method:</div>
                      <div className="font-medium flex items-center">
                        <FaMoneyBill className="h-4 w-4 mr-2 text-gray-400" />
                        {parcel.payment?.method?.toUpperCase() || 'N/A'}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 text-gray-600">Total Amount:</div>
                      <div className="font-medium text-lg">৳{parcel.payment?.amount || '0'}</div>
                    </div>
                    {parcel.payment?.method === 'cod' && (
                      <div className="flex items-center">
                        <div className="w-32 text-gray-600">COD Amount:</div>
                        <div className="font-medium">৳{parcel.payment?.codAmount || '0'}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {parcel.parcelDetails?.description && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{parcel.parcelDetails.description}</p>
                </div>
              )}

              {/* Items List */}
              {parcel.parcelDetails?.items && parcel.parcelDetails.items.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-4">Items in Parcel</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value (৳)</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {parcel.parcelDetails.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm">{item.name || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm">{item.quantity || '0'}</td>
                            <td className="px-4 py-3 text-sm">৳{item.value || '0'}</td>
                            <td className="px-4 py-3 text-sm font-medium">৳{(item.quantity || 0) * (item.value || 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {parcel.delivery?.deliveryNotes && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Delivery Notes</h4>
                  <p className="text-gray-600">{parcel.delivery.deliveryNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Tracking History & QR Code */}
          <div className="space-y-6">
            {/* Tracking History */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Tracking History</h3>
              {trackingHistory.length === 0 ? (
                <div className="text-center py-4">
                  <FaClock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No tracking history available</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {trackingHistory.map((track, index) => (
                    <div key={index} className="relative">
                      {index !== trackingHistory.length - 1 && (
                        <div className="absolute top-6 left-2.5 bottom-0 w-0.5 bg-gray-200"></div>
                      )}
                      <div className="flex">
                        <div className="relative z-10">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                            track.status === 'delivered' ? 'bg-green-100' :
                            track.status === 'failed' ? 'bg-red-100' : 'bg-blue-100'
                          }`}>
                            {getStatusIcon(track.status)}
                          </div>
                        </div>
                        <div className="ml-4 pb-6">
                          <div className="font-medium text-gray-900">{track.status?.replace(/_/g, ' ').toUpperCase() || 'N/A'}</div>
                          <div className="text-sm text-gray-500 mt-1">{formatDate(track.timestamp)}</div>
                          {track.notes && (
                            <p className="text-sm text-gray-600 mt-2">{track.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* QR Code */}
            {parcel.qrCode && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <FaQrcode className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
                </div>
                <div className="text-center">
                  <img 
                    src={`${process.env.NEXT_PUBLIC_API_IMAGE_URL}${parcel.qrCode}`}
                    alt="QR Code"
                    className="w-48 h-48 mx-auto border border-gray-200 rounded-lg p-4"
                  />
                  <p className="text-sm text-gray-600 mt-4">
                    Scan this QR code to track this parcel
                  </p>
                  <button
                    onClick={downloadQRCode}
                    disabled={downloading}
                    className={`mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 w-full flex items-center justify-center ${
                      downloading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {downloading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <FaDownload className="h-4 w-4 mr-2" />
                        Download QR Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Footer */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Parcel ID</h4>
              <p className="text-sm text-gray-600 font-mono truncate" title={parcel._id}>
                {parcel._id}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Insurance</h4>
              <p className="text-sm text-gray-600">
                {parcel.insurance?.insured ? `৳${parcel.insurance.amount || '0'} Insured` : 'Not Insured'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Priority</h4>
              <p className="text-sm text-gray-600 capitalize">{parcel.priority || 'normal'}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
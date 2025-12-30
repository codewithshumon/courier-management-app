'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'
import { toast } from 'react-toastify'
import DashboardLayout from '@/app/components/Layout/DashboardLayout'
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaBoxOpen, 
  FaTruckLoading, 
  FaCheckCircle, 
  FaTimesCircle,
  FaQrcode,
  FaPrint
} from 'react-icons/fa'

export default function MyParcelsPage() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [parcels, setParcels] = useState([])
  const [filteredParcels, setFilteredParcels] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedParcel, setSelectedParcel] = useState(null)

  useEffect(() => {
    if(!user || !token) return;

    fetchParcels()
  }, [user, token])

  useEffect(() => {
    filterParcels()
  }, [parcels, searchTerm, statusFilter])
 
  const fetchParcels = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parcels?customer=${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setParcels(data.parcels || [])
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error('Failed to load parcels')
    } finally {
      setLoading(false)
    }
  }

  const filterParcels = () => {
    let filtered = [...parcels]

    if (searchTerm) {
      filtered = filtered.filter(parcel =>
        parcel.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.receiver.address.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(parcel => parcel.delivery.status === statusFilter)
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    setFilteredParcels(filtered)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'assigned': return 'bg-blue-100 text-blue-800'
      case 'picked_up': return 'bg-purple-100 text-purple-800'
      case 'in_transit': return 'bg-indigo-100 text-indigo-800'
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FaBoxOpen className="h-5 w-5" />
      case 'assigned': 
      case 'picked_up': 
      case 'in_transit': return <FaTruckLoading className="h-5 w-5" />
      case 'out_for_delivery': return <FaTruckLoading className="h-5 w-5" />
      case 'delivered': return <FaCheckCircle className="h-5 w-5" />
      case 'failed': return <FaTimesCircle className="h-5 w-5" />
      default: return <FaBoxOpen className="h-5 w-5" />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const handlePrintQR = (parcel) => {
    if (parcel.qrCode) {
      window.open(`${process.env.NEXT_PUBLIC_API_URL}/${parcel.qrCode}`, '_blank')
    } else {
      toast.info('QR code not generated yet')
    }
  }

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'failed', label: 'Failed' }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Parcels</h1>
              <p className="text-gray-600">Track and manage all your shipments</p>
            </div>
            <Link
              href="/customer/book"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              + Book New Parcel
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by tracking number, receiver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="text-right">
              <button
                onClick={fetchParcels}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm text-gray-600">Total Parcels</div>
            <div className="text-2xl font-bold text-gray-900">{parcels.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm text-gray-600">In Transit</div>
            <div className="text-2xl font-bold text-blue-600">
              {parcels.filter(p => ['in_transit', 'out_for_delivery'].includes(p.delivery.status)).length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm text-gray-600">Delivered</div>
            <div className="text-2xl font-bold text-green-600">
              {parcels.filter(p => p.delivery.status === 'delivered').length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {parcels.filter(p => p.delivery.status === 'pending').length}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading parcels...</p>
            </div>
          ) : filteredParcels.length === 0 ? (
            <div className="p-8 text-center">
              <FaBoxOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No parcels found</h3>
              <p className="text-gray-600 mb-4">Start by booking your first parcel</p>
              <Link
                href="/customer/book"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Book Parcel
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white min-w-max whitespace-nowrap capitalize tracking-wider">
                      Tracking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white min-w-max whitespace-nowrap capitalize tracking-wider">
                      Receiver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white min-w-max whitespace-nowrap capitalize tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white min-w-max whitespace-nowrap capitalize tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white min-w-max whitespace-nowrap capitalize tracking-wider">
                      Booked Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white min-w-max whitespace-nowrap capitalize tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white min-w-max whitespace-nowrap capitalize tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredParcels.map((parcel) => (
                    <tr key={parcel._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-blue-600">{parcel.trackingNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{parcel.receiver.name}</div>
                        <div className="text-sm text-gray-500">{parcel.receiver.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{parcel.receiver.address.city}</div>
                        <div className="text-xs text-gray-500">{parcel.receiver.address.street}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(parcel.delivery.status)}
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(parcel.delivery.status)}`}>
                            {parcel.delivery.status.replace('_', ' ')}
                          </span>
                        </div>
                        {parcel.delivery.estimatedDelivery && (
                          <div className="text-xs text-gray-500 mt-1">
                            Est: {formatDate(parcel.delivery.estimatedDelivery)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(parcel.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">৳{parcel.payment.amount}</div>
                        <div className="text-xs text-gray-500">{parcel.payment.method.toUpperCase()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/customer/track/${parcel.trackingNumber}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEye className="h-5 w-5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedParcel && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Parcel Details</h3>
                <button
                  onClick={() => setSelectedParcel(null)}
                  className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
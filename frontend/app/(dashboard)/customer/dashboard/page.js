'use client'

import { useState, useEffect } from 'react'
import { api } from '@/app/lib/api'
import { toast } from 'react-toastify'
import {
  FaBox,
  FaShippingFast,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaChartLine,
} from 'react-icons/fa'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

import { useAuth } from '@/app/contexts/AuthContext'
import DashboardLayout from '@/app/components/Layout/DashboardLayout'

export default function CustomerDashboard() {
  const [metrics, setMetrics] = useState(null)
  const [recentParcels, setRecentParcels] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const statCards = [
    {
      title: 'Total Parcels',
      value: metrics?.total || 0,
      icon: FaBox,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'In Transit',
      value: metrics?.inTransit || 0,
      icon: FaShippingFast,
      color: 'bg-purple-500',
      change: '+5%',
    },
    {
      title: 'Delivered',
      value: metrics?.delivered || 0,
      icon: FaCheckCircle,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Failed',
      value: metrics?.failed || 0,
      icon: FaTimesCircle,
      color: 'bg-red-500',
      change: '-2%',
    },
    {
      title: 'Pending COD',
      value: `$${metrics?.totalCOD || 0}`,
      icon: FaMoneyBillWave,
      color: 'bg-yellow-500',
      change: '+3%',
    },
    {
      title: 'Today Bookings',
      value: metrics?.today || 0,
      icon: FaChartLine,
      color: 'bg-indigo-500',
      change: '+15%',
    },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-blue-100 mt-2">
            Track and manage your parcels efficiently with our courier management system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Delivery Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics?.weeklyStats || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" name="Parcels" />
                  <Bar dataKey="delivered" fill="#10b981" name="Delivered" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Parcels</h3>
              <a href="/customer/parcels" className="text-sm text-blue-600 hover:text-blue-700">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {recentParcels.map((parcel) => (
                <div key={parcel._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{parcel.trackingNumber}</p>
                    <p className="text-sm text-gray-500">
                      To: {parcel.receiver.name} • {parcel.receiver.address.city}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`status-badge status-${parcel.delivery.status}`}>
                      {parcel.delivery.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500">
                      ${parcel.payment.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/customer/book"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <FaBox className="h-6 w-6 text-blue-600" />
              </div>
              <span className="mt-2 font-medium">Book New Parcel</span>
            </a>
            <a
              href="/customer/track"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <FaShippingFast className="h-6 w-6 text-blue-600" />
              </div>
              <span className="mt-2 font-medium">Track Parcel</span>
            </a>
            <a
              href="/customer/qr-codes"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <FaCheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <span className="mt-2 font-medium">My QR Codes</span>
            </a>
            <a
              href="/customer/profile"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <FaMoneyBillWave className="h-6 w-6 text-blue-600" />
              </div>
              <span className="mt-2 font-medium">Payment History</span>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
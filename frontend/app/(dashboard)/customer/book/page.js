'use client'

import { useState } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { toast } from 'react-toastify'
import DashboardLayout from '@/app/components/Layout/DashboardLayout'

export default function BookParcelPage() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    sender: {
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || '',
        country: user?.address?.country || 'Bangladesh',
      },
    },
    receiver: {
      name: '',
      phone: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Bangladesh',
      },
    },
    parcelDetails: {
      type: 'package',
      weight: '',
      dimensions: {
        length: '',
        width: '',
        height: '',
      },
      description: '',
      items: [{ name: '', quantity: 1, value: 0 }],
    },
    payment: {
      method: 'cod',
      amount: '',
      codAmount: '',
    },
    delivery: {
      notes: '',
    },
  })

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleNestedChange = (section, subSection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section][subSection],
          [field]: value
        }
      }
    }))
  }

  const handleAddressChange = (person, field, value) => {
    setFormData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        address: {
          ...prev[person].address,
          [field]: value
        }
      }
    }))
  }

  const handleNumericInput = (value, allowDecimal = false) => {
    if (allowDecimal) {
      const regex = /^\d*\.?\d*$/
      return regex.test(value) ? value : ''
    } else {
      const regex = /^\d*$/
      return regex.test(value) ? value : ''
    }
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.parcelDetails.items]
    
    if (field === 'quantity') {
      newItems[index][field] = handleNumericInput(value, false)
    } else if (field === 'value') {
      newItems[index][field] = handleNumericInput(value, true)
    } else {
      newItems[index][field] = value
    }
    
    setFormData(prev => ({
      ...prev,
      parcelDetails: {
        ...prev.parcelDetails,
        items: newItems
      }
    }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      parcelDetails: {
        ...prev.parcelDetails,
        items: [...prev.parcelDetails.items, { name: '', quantity: 1, value: 0 }]
      }
    }))
  }

  const removeItem = (index) => {
    if (formData.parcelDetails.items.length > 1) {
      const newItems = formData.parcelDetails.items.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        parcelDetails: {
          ...prev.parcelDetails,
          items: newItems
        }
      }))
    }
  }

  const calculateCOD = () => {
    const itemsTotal = formData.parcelDetails.items.reduce((sum, item) => 
      sum + (Number(item.value || 0) * Number(item.quantity || 1)), 0)
    const deliveryFee = itemsTotal * 0.05
    const total = itemsTotal + deliveryFee
    
    setFormData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        amount: total.toFixed(2),
        codAmount: formData.payment.method === 'cod' ? total.toFixed(2) : '0'
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        customer: user?.id,
        parcelDetails: {
          ...formData.parcelDetails,
          weight: formData.parcelDetails.weight || '1.0',
          items: formData.parcelDetails.items.map(item => ({
            name: item.name || 'Item',
            quantity: Number(item.quantity) || 1,
            value: Number(item.value) || 0
          }))
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parcels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      toast.success('Parcel booked successfully!')
      
      setFormData({
        sender: {
          name: user?.name || '',
          phone: user?.phone || '',
          email: user?.email || '',
          address: {
            street: user?.address?.street || '',
            city: user?.address?.city || '',
            state: user?.address?.state || '',
            zipCode: user?.address?.zipCode || '',
            country: user?.address?.country || 'Bangladesh',
          },
        },
        receiver: {
          name: '',
          phone: '',
          email: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Bangladesh',
          },
        },
        parcelDetails: {
          type: 'package',
          weight: '',
          dimensions: {
            length: '',
            width: '',
            height: '',
          },
          description: '',
          items: [{ name: '', quantity: 1, value: 0 }],
        },
        payment: {
          method: 'cod',
          amount: '',
          codAmount: '',
        },
        delivery: {
          notes: '',
        },
      })

    } catch (error) {
      toast.error(error.message || 'Failed to book parcel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Book New Parcel</h1>
          <p className="text-gray-600">Fill in the details to schedule a parcel pickup</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">1</span>
              Sender Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={formData.sender.name}
                  onChange={(e) => handleInputChange('sender', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.sender.phone}
                  onChange={(e) => handleInputChange('sender', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.sender.address.street}
                  onChange={(e) => handleAddressChange('sender', 'street', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.sender.address.city}
                  onChange={(e) => handleAddressChange('sender', 'city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                <input
                  type="text"
                  value={formData.sender.address.zipCode}
                  onChange={(e) => handleAddressChange('sender', 'zipCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="h-6 w-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2">2</span>
              Receiver Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Name *</label>
                <input
                  type="text"
                  value={formData.receiver.name}
                  onChange={(e) => handleInputChange('receiver', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Phone *</label>
                <input
                  type="tel"
                  value={formData.receiver.phone}
                  onChange={(e) => handleInputChange('receiver', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={formData.receiver.email}
                  onChange={(e) => handleInputChange('receiver', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                <input
                  type="text"
                  value={formData.receiver.address.street}
                  onChange={(e) => handleAddressChange('receiver', 'street', e.target.value)}
                  placeholder="Street address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  value={formData.receiver.address.city}
                  onChange={(e) => handleAddressChange('receiver', 'city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code *</label>
                <input
                  type="text"
                  value={formData.receiver.address.zipCode}
                  onChange={(e) => handleAddressChange('receiver', 'zipCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="h-6 w-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mr-2">3</span>
              Parcel Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parcel Type *</label>
                <select
                  value={formData.parcelDetails.type}
                  onChange={(e) => handleInputChange('parcelDetails', 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="document">Document</option>
                  <option value="package">Package</option>
                  <option value="fragile">Fragile</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.parcelDetails.weight}
                  onChange={(e) => handleInputChange('parcelDetails', 'weight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
                <input
                  type="number"
                  value={formData.parcelDetails.dimensions.length}
                  onChange={(e) => handleNestedChange('parcelDetails', 'dimensions', 'length', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
                <input
                  type="number"
                  value={formData.parcelDetails.dimensions.width}
                  onChange={(e) => handleNestedChange('parcelDetails', 'dimensions', 'width', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={formData.parcelDetails.dimensions.height}
                  onChange={(e) => handleNestedChange('parcelDetails', 'dimensions', 'height', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.parcelDetails.description}
                  onChange={(e) => handleInputChange('parcelDetails', 'description', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the contents of your parcel"
                />
              </div>
            </div>

            {/* Items Section with Labels */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700">Items in Parcel</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Add Item
                </button>
              </div>
              
              {/* Column Headers - Only show for first row */}
              <div className="grid grid-cols-12 gap-4 mb-2 px-3">
                <div className="col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Item Name
                  </label>
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Value (৳)
                  </label>
                </div>
              </div>
              
              {formData.parcelDetails.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 mb-3">
                  <div className="col-span-6">
                    <input
                      type="text"
                      placeholder="Enter item name"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="0.00"
                      value={item.value}
                      onChange={(e) => handleItemChange(index, 'value', e.target.value)}
                      inputMode="decimal"
                      pattern="[0-9.]*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={formData.parcelDetails.items.length <= 1}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold"
                      title="Remove item"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={calculateCOD}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
            >
              Calculate COD
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="h-6 w-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-2">4</span>
              Payment & Delivery
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method *</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.payment.method === 'cod'}
                      onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Cash on Delivery (COD)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="prepaid"
                      checked={formData.payment.method === 'prepaid'}
                      onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Prepaid</span>
                  </label>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (৳)</label>
                    <input
                      type="number"
                      value={formData.payment.amount}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                    />
                  </div>
                  {formData.payment.method === 'cod' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">COD Amount (৳)</label>
                      <input
                        type="number"
                        value={formData.payment.codAmount}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Notes</label>
                <textarea
                  value={formData.delivery.notes}
                  onChange={(e) => handleInputChange('delivery', 'notes', e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special instructions for delivery..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">By clicking "Book Parcel", you agree to our terms and conditions</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Booking...' : 'Book Parcel'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
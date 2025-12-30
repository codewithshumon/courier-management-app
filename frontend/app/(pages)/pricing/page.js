'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FaTruck,
  FaCalculator,
  FaBox,
  FaShippingFast,
  FaCrown,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaPhoneAlt,
  FaEnvelope,
  FaDollarSign,
  FaWeightHanging,
  FaLocationArrow,
  FaTag,
  FaPercent
} from 'react-icons/fa'
import Footer from '@/app/components/Layout/Footer'
import { useAuth } from '@/app/contexts/AuthContext'

export default function PricingPage() {
  const { user, token} = useAuth()
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const [weight, setWeight] = useState(1)
  const [distance, setDistance] = useState(10)
  const [parcelType, setParcelType] = useState('package')
  const [priority, setPriority] = useState('standard')
  const [insurance, setInsurance] = useState(false)
  const [insuranceAmount, setInsuranceAmount] = useState(0)

  const parcelTypes = [
    { id: 'document', label: 'Document', baseRate: 50, weightFactor: 5 },
    { id: 'package', label: 'Package', baseRate: 100, weightFactor: 10 },
    { id: 'electronics', label: 'Electronics', baseRate: 150, weightFactor: 15 },
    { id: 'fragile', label: 'Fragile', baseRate: 200, weightFactor: 20 },
  ]

  const priorities = [
    { id: 'standard', label: 'Standard (3-5 days)', multiplier: 1.0 },
    { id: 'express', label: 'Express (1-2 days)', multiplier: 1.5 },
    { id: 'same_day', label: 'Same Day', multiplier: 2.0 },
    { id: 'overnight', label: 'Overnight', multiplier: 2.5 },
  ]

  const subscriptionPlans = [
    {
      name: 'Starter',
      icon: FaBox,
      monthlyPrice: '৳2,999',
      annualPrice: '৳28,799',
      description: 'Perfect for small businesses and startups',
      features: [
        { name: 'Up to 100 parcels/month', included: true },
        { name: 'Basic real-time tracking', included: true },
        { name: 'Email support', included: true },
        { name: 'COD management', included: true },
        { name: 'Mobile app access', included: true },
        { name: 'Basic reports', included: true },
        { name: 'Priority support', included: false },
        { name: 'Custom branding', included: false },
        { name: 'API access', included: false },
        { name: 'Advanced analytics', included: false },
      ],
      popular: false,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Business',
      icon: FaShippingFast,
      monthlyPrice: '৳7,999',
      annualPrice: '৳76,799',
      description: 'For growing businesses with multiple users',
      features: [
        { name: 'Up to 500 parcels/month', included: true },
        { name: 'Advanced tracking with GPS', included: true },
        { name: 'Phone & email support', included: true },
        { name: 'Multi-user accounts (up to 5)', included: true },
        { name: 'API access', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Custom reports', included: true },
        { name: 'Priority support', included: true },
        { name: 'Custom branding', included: false },
        { name: 'Dedicated account manager', included: false },
      ],
      popular: true,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Enterprise',
      icon: FaCrown,
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      description: 'For large organizations with custom needs',
      features: [
        { name: 'Unlimited parcels', included: true },
        { name: 'Custom solutions & integrations', included: true },
        { name: '24/7 priority support', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'Custom branding & white-label', included: true },
        { name: 'Advanced API access', included: true },
        { name: 'On-premise deployment option', included: true },
        { name: 'Training & onboarding', included: true },
        { name: 'SLA guarantee', included: true },
        { name: 'Custom development', included: true },
      ],
      popular: false,
      color: 'from-amber-500 to-amber-600'
    }
  ]

  const additionalServices = [
    {
      name: 'Insurance',
      description: 'Protect your valuable shipments',
      price: '1.5% of declared value',
      min: '৳50',
      icon: FaTag
    },
    {
      name: 'COD Processing',
      description: 'Cash on Delivery management fee',
      price: '2.5% of COD amount',
      min: '৳20',
      icon: FaDollarSign
    },
    {
      name: 'Return Management',
      description: 'Handle returns efficiently',
      price: '৳100 per return',
      min: '৳100',
      icon: FaArrowRight
    },
    {
      name: 'Warehouse Storage',
      description: 'Temporary storage solutions',
      price: '৳50/day per package',
      min: '৳50',
      icon: FaBox
    }
  ]


  const faqData = [
    {
      q: 'Is there a setup fee?',
      a: 'No, there are no setup fees for any of our plans. You only pay the monthly or annual subscription fee.'
    },
    {
      q: 'Can I change my plan later?',
      a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.'
    },
    {
      q: 'Do you offer discounts for non-profits?',
      a: 'Yes, we offer special pricing for registered non-profit organizations. Contact our sales team for more information.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards, bank transfers, and mobile banking in Bangladesh.'
    },
    {
      q: 'Is there a contract or minimum commitment?',
      a: 'No, all plans are month-to-month with no long-term contracts. You can cancel anytime.'
    },
    {
      q: 'Do you offer custom pricing for enterprise clients?',
      a: 'Yes, we provide custom pricing and solutions for enterprise clients. Contact our sales team for a personalized quote.'
    }
  ]

  const calculateShippingCost = () => {
    const parcel = parcelTypes.find(p => p.id === parcelType) || parcelTypes[0]
    const priorityObj = priorities.find(p => p.id === priority) || priorities[0]
    
    let cost = parcel.baseRate + (weight * parcel.weightFactor) + (distance * 5)
    
    cost *= priorityObj.multiplier
    
    if (insurance && insuranceAmount > 0) {
      cost += (insuranceAmount * 0.015)
    }
    
    cost = Math.max(cost, 100)
    
    return Math.round(cost)
  }

  const handleGetStarted = () => {
    window.location.href = '/login'
  }

  const calculateSavings = (monthly, annual) => {
    const monthlyNum = parseInt(monthly.replace(/[^0-9]/g, ''))
    const annualNum = parseInt(annual.replace(/[^0-9]/g, ''))
    const yearlyTotal = monthlyNum * 12
    const savings = ((yearlyTotal - annualNum) / yearlyTotal * 100).toFixed(0)
    return savings
  }
  
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <FaTruck className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">CourierExpress</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition">Home</Link>
              <a href="#calculator" className="text-gray-600 hover:text-blue-600 transition">Calculator</a>
              <a href="#plans" className="text-gray-600 hover:text-blue-600 transition">Plans</a>
              <a href="#services" className="text-gray-600 hover:text-blue-600 transition">Services</a>
              <a href="#faq" className="text-gray-600 hover:text-blue-600 transition">FAQ</a>
            </div>
            
            <div className="flex items-center space-x-4">
              {(!user || !token) && <Link 
                href="/login" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign In
              </Link>}
              <button
                onClick={handleGetStarted}
                className="btn-primary px-6 py-2"
              >
                {(!user || !token) ? 'Get Started' : 'Dashboard'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
              <FaTag className="mr-2" />
              Transparent Pricing
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Simple, Fair{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                Pricing
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              No hidden fees, no surprises. Choose the plan that works for you or calculate your exact shipping costs.
            </p>
            
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-lg font-medium ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                className="relative inline-flex h-7 w-14 items-center rounded-full bg-blue-600 transition-colors"
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'monthly' ? 'translate-x-1' : 'translate-x-8'
                }`} />
              </button>
              <div className="flex items-center space-x-2">
                <span className={`text-lg font-medium ${billingPeriod === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Annual
                </span>
                <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full font-medium">
                  Save up to 20%
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="calculator" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Shipping Cost Calculator
              </h2>
              <p className="text-gray-600">
                Estimate your shipping costs instantly
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <div className="flex items-center mb-6">
                  <FaCalculator className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold">Calculate Your Cost</h3>
                </div>
                
                <div className="space-y-6 min-w-max">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaWeightHanging className="inline mr-2" />
                      Weight (kg)
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="0.1"
                        max="50"
                        step="0.1"
                        value={weight}
                        onChange={(e) => setWeight(parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-lg min-w-max font-semibold text-gray-900 w-16">
                        {weight} kg
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaLocationArrow className="inline mr-2" />
                      Distance (km)
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="1"
                        max="500"
                        step="1"
                        value={distance}
                        onChange={(e) => setDistance(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-lg min-w-max font-semibold text-gray-900 w-16">
                        {distance} km
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaBox className="inline mr-2" />
                      Parcel Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {parcelTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setParcelType(type.id)}
                          className={`px-3 py-2 text-sm rounded-lg border transition ${
                            parcelType === type.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaShippingFast className="inline mr-2" />
                      Delivery Priority
                    </label>
                    <div className="space-y-2">
                      {priorities.map((p) => (
                        <label
                          key={p.id}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                            priority === p.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="priority"
                            value={p.id}
                            checked={priority === p.id}
                            onChange={(e) => setPriority(e.target.value)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <div className="ml-3">
                            <span className="text-sm font-medium">{p.label}</span>
                            <p className="text-xs text-gray-500">
                              {p.multiplier === 1.0 ? 'Base rate' : `${p.multiplier}x base rate`}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Insurance
                        </label>
                        <p className="text-xs text-gray-500">1.5% of declared value</p>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={insurance}
                          onChange={(e) => setInsurance(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    {insurance && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Declared Value (৳)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={insuranceAmount}
                          onChange={(e) => setInsuranceAmount(parseInt(e.target.value) || 0)}
                          className="input-field"
                          placeholder="Enter value to insure"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="card bg-linear-to-br from-blue-50 to-purple-50">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Estimated Cost
                  </h3>
                  <p className="text-gray-600">
                    Your total shipping cost breakdown
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="text-center py-6 bg-white rounded-xl shadow-sm">
                    <div className="text-sm text-gray-500 mb-2">Total Estimated Cost</div>
                    <div className="text-5xl font-bold text-blue-600 mb-2">
                      ৳{calculateShippingCost()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Inclusive of all charges
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Base rate</span>
                        <span className="font-medium">৳{
                          (parcelTypes.find(p => p.id === parcelType)?.baseRate || 0)
                        }</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Weight charge ({weight}kg)</span>
                        <span className="font-medium">৳{
                          weight * (parcelTypes.find(p => p.id === parcelType)?.weightFactor || 0)
                        }</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Distance charge ({distance}km)</span>
                        <span className="font-medium">৳{distance * 5}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{priority.replace('_', ' ')} delivery</span>
                        <span className="font-medium">×{
                          (priorities.find(p => p.id === priority)?.multiplier || 1).toFixed(1)
                        }</span>
                      </div>
                      {insurance && insuranceAmount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Insurance (1.5%)</span>
                          <span className="font-medium">৳{Math.round(insuranceAmount * 0.015)}</span>
                        </div>
                      )}
                      <div className="border-t pt-3 flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-blue-600">৳{calculateShippingCost()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={handleGetStarted}
                      className="w-full btn-primary py-3"
                    >
                      Book This Shipment
                    </button>
                    <p className="text-xs text-gray-500 mt-3">
                      Price is an estimate. Final cost may vary based on actual measurements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Subscription{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                Plans
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your business needs. All plans include our core features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptionPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                  plan.popular 
                    ? 'border-2 border-purple-500 shadow-lg' 
                    : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className={`bg-linear-to-br ${plan.color} p-6 rounded-xl mb-6`}>
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <plan.icon className="h-10 w-10 mb-3" />
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                    </div>
                    {plan.name === 'Enterprise' ? (
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white">Custom</div>
                        <div className="text-white/80 text-sm">Contact sales</div>
                      </div>
                    ) : (
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white">
                          {billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                        </div>
                        <div className="text-white/80 text-sm">
                          {billingPeriod === 'monthly' ? 'per month' : 'per year'}
                          {plan.name !== 'Enterprise' && billingPeriod === 'annual' && (
                            <div className="text-xs mt-1">
                              Save {calculateSavings(plan.monthlyPrice, plan.annualPrice)}%
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-gray-900">Features:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        {feature.included ? (
                          <FaCheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" />
                        ) : (
                          <FaTimesCircle className="h-5 w-5 text-gray-300 mt-0.5 mr-3 shrink-0" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto">
                  {plan.name === 'Enterprise' ? (
                    <Link
                      href="/contact"
                      className={`w-full btn-secondary flex items-center justify-center`}
                    >
                      <FaPhoneAlt className="mr-2" />
                      Contact Sales
                    </Link>
                  ) : (
                    <button
                      onClick={handleGetStarted}
                      className={`w-full ${
                        plan.popular ? 'btn-primary' : 'btn-secondary'
                      } flex items-center justify-center`}
                    >
                      Start Free Trial
                    </button>
                  )}
                  <p className="text-center text-gray-500 text-sm mt-3">
                    {plan.name === 'Enterprise' 
                      ? 'Custom implementation available' 
                      : '14-day free trial, no credit card required'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Plan Comparison
              </h3>
              <p className="text-gray-600">
                Compare features across all plans
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 border-b">Features</th>
                    {subscriptionPlans.map((plan, idx) => (
                      <th key={idx} className="text-center p-4 border-b">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['Real-time Tracking', 'COD Management', 'Mobile App', 'API Access', 'Multi-user', 'Advanced Analytics', 'Priority Support', 'Custom Branding', 'Dedicated Support'].map((feature, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-4 border-b">{feature}</td>
                      {subscriptionPlans.map((plan, pIdx) => {
                        const included = plan.features.some(f => 
                          f.name.toLowerCase().includes(feature.toLowerCase().split(' ')[0])
                        )
                        return (
                          <td key={pIdx} className="text-center p-4 border-b">
                            {included ? (
                              <FaCheckCircle className="h-5 w-5 text-green-500 inline" />
                            ) : (
                              <FaTimesCircle className="h-5 w-5 text-gray-300 inline" />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Additional{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                Services
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enhance your shipping experience with our premium services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="card">
                <div className="bg-blue-50 p-4 rounded-xl w-fit mb-4">
                  <service.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-blue-600">{service.price}</div>
                  <div className="text-sm text-gray-500">Minimum: {service.min}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              <FaPercent className="mr-2" />
              Volume discounts available for high-volume shippers
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                Questions
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about our pricing
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqData.map((faq, idx) => (
              <div key={idx} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Our team is here to help you choose the right plan for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="btn-primary flex items-center justify-center"
                >
                  <FaPhoneAlt className="mr-2" />
                  Contact Sales
                </Link>
                <a
                  href="mailto:sales@courierexpress.com"
                  className="btn-secondary flex items-center justify-center"
                >
                  <FaEnvelope className="mr-2" />
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-linear-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using CourierExpress for efficient parcel management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Start Free Trial
            </button>
            <Link
              href="/"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-blue-600 text-white px-3 py-1.5 rounded-full shadow-lg hover:bg-blue-700 transition transform"
      >
        ↑
      </button>
    </div>
  )
}
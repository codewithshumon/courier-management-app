'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FaTruck, 
  FaShieldAlt, 
  FaMapMarkerAlt, 
  FaUserFriends,
  FaChartLine,
  FaQrcode,
  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaPhoneAlt,
  FaRocket,
  FaCrown,
  FaCalculator,
  FaBox,
  FaShippingFast
} from 'react-icons/fa'
import Footer from './components/Layout/Footer'
import { useAuth } from './contexts/AuthContext'

export default function HomePage() {
  const { user, token} = useAuth()
  const [stats, setStats] = useState({
    parcelsDelivered: 12500,
    happyCustomers: 8500,
    deliveryAgents: 250,
    successRate: 98.7
  })

  const [currentFeature, setCurrentFeature] = useState(0)
  const [billingPeriod, setBillingPeriod] = useState('monthly')

  const features = [
    {
      title: 'Real-Time Tracking',
      description: 'Track your parcels in real-time with live GPS updates',
      icon: FaMapMarkerAlt,
      color: 'from-blue-500 to-cyan-500',
      delay: 'delay-100'
    },
    {
      title: 'QR Code Delivery',
      description: 'Secure QR code verification for package pickup and delivery',
      icon: FaQrcode,
      color: 'from-purple-500 to-pink-500',
      delay: 'delay-200'
    },
    {
      title: 'COD Management',
      description: 'Easy cash-on-delivery management with digital receipts',
      icon: FaChartLine,
      color: 'from-green-500 to-emerald-500',
      delay: 'delay-300'
    },
    {
      title: 'Multi-Language',
      description: 'Support for English & Bengali with more languages coming',
      icon: FaUserFriends,
      color: 'from-orange-500 to-red-500',
      delay: 'delay-400'
    }
  ]

  const testimonials = [
    {
      name: 'Rahim Khan',
      role: 'Business Owner',
      content: 'The best courier service I\'ve used. Real-time tracking is amazing!',
      rating: 5,
      image: '/testimonials/user1.jpg'
    },
    {
      name: 'Fatima Begum',
      role: 'E-commerce Seller',
      content: 'COD management made easy. My customers love the convenience.',
      rating: 5,
      image: '/testimonials/user2.jpg'
    },
    {
      name: 'Shahriar Ahmed',
      role: 'IT Professional',
      content: 'The dashboard analytics helped me optimize my shipping costs.',
      rating: 4,
      image: '/testimonials/user3.jpg'
    }
  ]

  const stepsData = [
    {
      step: '01',
      title: 'Book a Parcel',
      description: 'Fill out the simple form with sender and receiver details',
      icon: FaTruck,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      step: '02',
      title: 'Track Real-Time',
      description: 'Monitor your parcel location with live GPS tracking',
      icon: FaMapMarkerAlt,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      step: '03',
      title: 'Receive & Confirm',
      description: 'Get notified upon delivery with digital proof',
      icon: FaCheckCircle,
      color: 'bg-green-100 text-green-600'
    }
  ]

  const pricingPlans = [
    {
      name: 'Starter',
      icon: FaBox,
      monthlyPrice: '৳2,999',
      annualPrice: '৳28,799',
      description: 'Perfect for small businesses',
      features: [
        'Up to 100 parcels/month',
        'Basic real-time tracking',
        'Email support',
        'COD management',
        'Mobile app access',
        'Basic reports'
      ],
      notIncluded: [
        'Priority support',
        'Custom branding',
        'API access',
        'Advanced analytics'
      ],
      popular: false,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Business',
      icon: FaShippingFast,
      monthlyPrice: '৳7,999',
      annualPrice: '৳76,799',
      description: 'For growing businesses',
      features: [
        'Up to 500 parcels/month',
        'Advanced tracking',
        'Phone & email support',
        'Multi-user accounts',
        'API access',
        'Advanced analytics',
        'Custom reports'
      ],
      notIncluded: [
        'Custom branding',
        'Dedicated account manager'
      ],
      popular: true,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Enterprise',
      icon: FaCrown,
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      description: 'For large organizations',
      features: [
        'Unlimited parcels',
        'Custom solutions',
        '24/7 priority support',
        'Dedicated account manager',
        'Custom branding',
        'White-label solution',
        'On-premise deployment',
        'Training & onboarding'
      ],
      notIncluded: [],
      popular: false,
      color: 'from-amber-500 to-amber-600'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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
              <div className="bg-blue-600 p-2 rounded-lg">
                <FaTruck className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CourierExpress</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition">Pricing</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition">How It Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition">Contact</a>
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

      <section className="pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
                <FaShieldAlt className="mr-2" />
                Trusted by 500+ Businesses
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Modern Courier Management{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                  Simplified
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Track parcels in real-time, manage deliveries efficiently, and provide exceptional customer experience with our all-in-one courier management platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="btn-primary flex items-center justify-center px-8 py-3 text-lg"
                >
                  Start Free Trial
                  <FaArrowRight className="ml-2" />
                </button>
                <a
                  href="#pricing"
                  className="btn-secondary flex items-center justify-center px-8 py-3 text-lg"
                >
                  <FaCalculator className="mr-2" />
                  View Pricing
                </a>
              </div>
              
              <div className="mt-8 flex items-center space-x-6">
                <div className="flex items-center">
                  <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">No credit card required</span>
                </div>
                <div className="flex items-center">
                  <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">14-day free trial</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl p-1 shadow-2xl">
                <div className="bg-white rounded-xl p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 bg-red-400 rounded-full"></div>
                      <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
                      <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Live Dashboard</span>
                  </div>
                  
                  <div className="relative h-64 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden mb-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <FaMapMarkerAlt className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
                        <p className="text-gray-600 font-medium">Real-Time Tracking</p>
                      </div>
                    </div>
                    
                    <div className="absolute top-1/4 left-1/4 h-4 w-4 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="absolute top-2/3 left-2/3 h-4 w-4 bg-green-500 rounded-full animate-bounce delay-300"></div>
                    <div className="absolute top-1/3 right-1/4 h-4 w-4 bg-purple-500 rounded-full animate-bounce delay-500"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Active Deliveries</p>
                      <p className="text-2xl font-bold text-gray-900">42</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Today's Success</p>
                      <p className="text-2xl font-bold text-green-600">97%</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FaTruck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Package Delivered</p>
                    <p className="text-xs text-gray-500">Just now • Dhaka to Chittagong</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-linear-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(stats).map(([key, value], index) => (
              <div key={key} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {typeof value === 'number' && key !== 'successRate' ? value.toLocaleString() : value}
                  {key === 'successRate' && '%'}
                </div>
                <div className="text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                Every Need
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your courier operations efficiently
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${currentFeature === index ? 'ring-2 ring-blue-500' : ''}`}
                onMouseEnter={() => setCurrentFeature(index)}
              >
                <div className={`p-3 rounded-lg bg-linear-to-br ${feature.color} w-fit mb-4 transition-transform duration-300 ${feature.delay}`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-20 bg-linear-to-r from-blue-500 to-purple-600 rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 md:p-12 lg:p-16">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Real-Time Dashboard
                </h3>
                <p className="text-blue-100 mb-6">
                  Monitor all your deliveries in one place with our intuitive dashboard. 
                  Get instant updates, analytics, and insights to optimize your operations.
                </p>
                <ul className="space-y-3">
                  {['Live tracking maps', 'Delivery analytics', 'COD reports', 'Agent performance'].map((item, idx) => (
                    <li key={idx} className="flex items-center text-white">
                      <FaCheckCircle className="h-5 w-5 mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-8">
                <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 h-full">
                  <div className="flex space-x-4 mb-6">
                    <div className="h-2 w-2/3 bg-blue-400 rounded-full"></div>
                    <div className="h-2 w-1/3 bg-purple-400 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[65, 42, 89].map((percent, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{percent}%</div>
                        <div className="text-sm text-gray-500">Success Rate</div>
                      </div>
                    ))}
                  </div>
                  <div className="h-32 bg-linear-to-r from-blue-400 to-purple-400 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                Pricing
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Choose the plan that fits your business needs. All plans include core features.
            </p>
            
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly billing
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                className="relative inline-flex h-6 w-12 items-center rounded-full bg-blue-600 transition-colors"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'monthly' ? 'translate-x-1' : 'translate-x-7'
                }`} />
              </button>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${billingPeriod === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Annual billing
                </span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                  Save 20%
                </span>
              </div>
            </div>
            
            <div className="mb-12">
              <Link 
                href="/pricing" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <FaCalculator className="mr-2" />
                View detailed pricing with shipping calculator
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
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
                
                <div className={`bg-linear-to-br ${plan.color} p-4 rounded-xl mb-6`}>
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <plan.icon className="h-8 w-8 mb-2" />
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                    </div>
                    {plan.name === 'Enterprise' ? (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">Custom</div>
                        <div className="text-white/80 text-sm">Contact sales</div>
                      </div>
                    ) : (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
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
                  <h4 className="font-semibold text-gray-900">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <FaCheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.notIncluded.length > 0 && (
                    <>
                      <h4 className="font-semibold text-gray-900 mt-6">Not included:</h4>
                      <ul className="space-y-3">
                        {plan.notIncluded.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-gray-400">
                            <div className="h-5 w-5 mr-3 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
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
                      <FaRocket className="mr-2" />
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
          
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Need a Custom Plan?
              </h3>
              <p className="text-gray-600 mb-6">
                We offer custom pricing for businesses with unique requirements. 
                Contact our sales team for a personalized quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="btn-primary flex items-center justify-center"
                >
                  <FaPhoneAlt className="mr-2" />
                  Contact Sales
                </Link>
                <Link
                  href="/pricing"
                  className="btn-secondary flex items-center justify-center"
                >
                  <FaCalculator className="mr-2" />
                  View Full Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                Works
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple steps to transform your courier management
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {stepsData.map((item, index) => (
              <div key={index} className="relative">
                <div className="card h-full text-center">
                  <div className={`${item.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                Customers Say
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-linear-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Courier Management?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust our platform for efficient parcel management and delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition duration-300 transform"
            >
              Start Free Trial
            </button>
            <Link
              href="/register"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg transition duration-300 transform"
            >
              Create Account
            </Link>
            <a
              href="#pricing"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg transition duration-300 transform"
            >
              View Pricing
            </a>
          </div>
          <p className="text-blue-200 mt-6 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
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
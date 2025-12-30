import React from 'react'
import Link from 'next/link'

import {
  FaTruck,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaShieldAlt
} from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const productLinks = [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'API', href: '/api-docs' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Status', href: '/status' },
    { name: 'Mobile App', href: '/mobile' }
  ]

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '/press' },
    { name: 'Partners', href: '/partners' },
    { name: 'Contact', href: '/contact' }
  ]

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
    { name: 'Security', href: '/security' }
  ]

  const socialLinks = [
    { icon: FaFacebook, href: 'https://facebook.com/courierexpress', label: 'Facebook' },
    { icon: FaTwitter, href: 'https://twitter.com/courierexpress', label: 'Twitter' },
    { icon: FaLinkedin, href: 'https://linkedin.com/company/courierexpress', label: 'LinkedIn' },
    { icon: FaInstagram, href: 'https://instagram.com/courierexpress', label: 'Instagram' }
  ]

  const contactInfo = [
    { icon: FaPhoneAlt, text: '+880 1234 567890', href: 'tel:+8801234567890' },
    { icon: FaEnvelope, text: 'support@courierexpress.com', href: 'mailto:support@courierexpress.com' },
    { icon: FaMapMarkerAlt, text: '123 Business Street, Dhaka 1200, Bangladesh' },
    { icon: FaClock, text: '24/7 Customer Support' }
  ]

  return (
    <footer id='contact' className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary-600 p-2 rounded-lg">
                <FaTruck className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold">CourierExpress</span>
                <p className="text-sm text-gray-400 mt-1">Modern Logistics Solutions</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Delivering excellence in parcel management and logistics since 2020. 
              Trusted by thousands of businesses across Bangladesh.
            </p>
            
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-400">
                <FaShieldAlt className="h-4 w-4 mr-2 text-green-500" />
                <span>SSL Secured</span>
              </div>
              <div className="text-sm text-gray-400">•</div>
              <div className="text-sm text-gray-400">ISO 9001 Certified</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <span className="bg-primary-600/20 p-1 rounded mr-2"></span>
              Product
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <span className="bg-primary-600/20 p-1 rounded mr-2"></span>
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <span className="bg-primary-600/20 p-1 rounded mr-2"></span>
              Contact Us
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start">
                  <info.icon className="h-5 w-5 text-primary-400 mt-0.5 mr-3 shrink-0" />
                  {info.href ? (
                    <a 
                      href={info.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {info.text}
                    </a>
                  ) : (
                    <span className="text-gray-400">{info.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            <p>&copy; {currentYear} CourierExpress. All rights reserved.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {legalLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
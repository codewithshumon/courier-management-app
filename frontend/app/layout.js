import { Inter } from 'next/font/google'
import './globals.css'

import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './contexts/AuthContext'

const inter = Inter({ subsets: ['latin'], display: 'swap', })

export const metadata = {
  title: 'Courier Management System',
  description: 'Track and manage your parcels efficiently',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </body>
    </html>
  )
}
const API_URL = process.env.NEXT_PUBLIC_API_URL

export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token')
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong')
    }

    return data
  },

  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  getProfile() {
    return this.request('/auth/profile')
  },

  updateProfile(updates) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  },

  createParcel(data) {
    return this.request('/parcels', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  getParcels(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/parcels?${query}`)
  },

  getParcel(id) {
    return this.request(`/parcels/${id}`)
  },

  trackParcel(trackingNumber) {
    return this.request(`/parcels/track/${trackingNumber}`)
  },

  updateParcelStatus(id, data) {
    return this.request(`/parcels/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
}
import axios from 'axios'

export const enrolmentAPI = axios.create({
  baseURL: 'http://localhost:3001'
})

export const identityAPI = axios.create({
  baseURL: 'http://localhost:3002',
})

export const verificationAPI = axios.create({
  baseURL: 'http://localhost:3003',
})

export const civilRegAPI = axios.create({
  baseURL: 'http://localhost:3004',
})

export const gsbAPI = axios.create({
  baseURL: 'http://localhost:3005',
})
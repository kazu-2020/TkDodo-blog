import ReactDOM from 'react-dom/client'
import React from 'react'

import { initMocks } from '@/test/server'

import App from './App'
import './index.css'

initMocks()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

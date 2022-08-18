import ReactDOM from 'react-dom/client'
import React from 'react'

import { initMocks } from '@/test/server'

import App from './App'
import './assets/css/index.scss'

initMocks()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

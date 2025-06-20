import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import SpendingList from './spendingList.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SpendingList />
  </StrictMode>,
)

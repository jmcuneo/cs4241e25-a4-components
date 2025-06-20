import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import EditPage from './editPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EditPage />
  </StrictMode>,
)

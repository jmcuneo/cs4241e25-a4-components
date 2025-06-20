import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import EditPage from './editPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EditPage />
  </StrictMode>,
)

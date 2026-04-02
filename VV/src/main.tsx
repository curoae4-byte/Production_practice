import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import PortfolioWorksPage from './pages/PortfolioWorksPage'
import LayoutGridOverlay from './components/LayoutGridOverlay'
import FpsOverlay from './components/FpsOverlay'
import './index.css'

// точка входа: роутинг + глобальные оверлеи 
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/portfolio" element={<PortfolioWorksPage />} />
        </Routes>
        {/* служебные штуки поверх всего */}
        <LayoutGridOverlay />
        <FpsOverlay />
      </>
    </BrowserRouter>
  </React.StrictMode>,
)

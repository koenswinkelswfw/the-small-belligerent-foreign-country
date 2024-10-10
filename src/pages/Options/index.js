

import React from 'react'
import { createRoot } from 'react-dom/client'
import Options from './Options.jsx'
import './options.css'


const rootElement = document.getElementById('options-root')
if (rootElement) {
  createRoot(rootElement).render(<Options />)
}

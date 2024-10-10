import React from 'react'
import { createRoot } from 'react-dom'

import Panel from './Panel'
import './index.css'

const container = document.getElementById('app-container')
const root = createRoot(container)
root.render(<Panel />)

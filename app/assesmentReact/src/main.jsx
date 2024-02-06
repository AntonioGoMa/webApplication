/**
 * This code initializes a React application by rendering the App component within a BrowserRouter provided by React Router. 
 * It uses ReactDOM.createRoot to render the application into an HTML element with the id "root." 
 * The code also ensures strict mode for React, enhancing debugging and performance.
 * Additionally, it imports the necessary components and CSS for the application.
 * 
 * @author Antonio
 */ 
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { BrowserRouter } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/coursework/app">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

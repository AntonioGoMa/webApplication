/**
 * The NotFound component displays an error message (404 - Page Not Found) along with an image of a sad cat.
 * It's typically used to indicate that a requested page or resource couldn't be found on the website.
 *
 * @author Antonio
 */ 

import React from 'react'
import error from '/src/assets/sadCat.jpg'

const NotFound = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', 
        textAlign: 'center',
      }}
    >
      <h1
        className='text-5xl font-bold'
        style={{
          background: '-webkit-linear-gradient(left, #3b82f6, #10b981)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          padding: '0.2em',
        }}
      >
        ERROR 404 - PAGE NOT FOUND
      </h1>
      <img src={error} alt='A sad cat' style={{ width: '100%', maxWidth: '60%' }} />
    </div>
  )
}

export default NotFound

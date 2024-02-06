/**
 * The App component is the main entry point of the web application. 
 * It manages user authentication, routing, and the overall layout of the application. 
 * It includes components for signing in, a menu, displaying content, and a footer. 
 * The component also maintains the user's sign-in status, user notes, and content ratings. 
 * It uses React Router for handling different routes within the application.
 * 
 * @author Antonio
 */

import { useState } from 'react'
import './index.css'
import Country from './components/Country.jsx'
import Footer from './components/Footer.jsx'
import Home from './components/Home.jsx'
import Menu from './components/Menu.jsx'
import NotFound from './components/NotFound.jsx'
import Content from './components/Content.jsx'
import SignIn from './components/SignIn.jsx'
import { Routes, Route } from 'react-router-dom'

function App() {

  const [signedIn, setSignedIn] = useState(false)
  const [note, setNote] = useState([])
  const [rate, setRate] = useState([])
  const [selectedContentID, setSelectedContentID] = useState(null)

  return (
    <>
      <div className='divStyle flex flex-col h-screen'>
        <div className='flex-grow'>
          <SignIn
            signedIn={signedIn}
            setSignedIn={setSignedIn}
            note={note}
            setNote={setNote}
            rate={rate}
            setRate={setRate}
          />
          <Menu />
          <Routes>
            <Route path='/home' element={<Home />} />
            <Route path='/country' element={<Country />} />
            <Route path='/content' element={<Content
              signedIn={signedIn}
              note={note}
              setNote={setNote}
              rate={rate}
              setRate={setRate}
              setSelectedContentID={setSelectedContentID}
            />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>

  )
}

export default App

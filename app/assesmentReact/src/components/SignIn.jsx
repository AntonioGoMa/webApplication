/**
 * The SignIn component provides a user interface for signing in and out of a web application.
 * It allows users to enter their username and password to sign in, and it also handles token-based authentication.
 * When signed in, it provides the option to sign out. 
 * The component can display an error message if sign-in fails and includes a responsive menu.
 * 
 * @author Antonio
 */ 
import { useState, useEffect } from 'react'

function SignIn(props) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorSigningIn, setErrorSigningIn] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(
        () => {
            const token = localStorage.getItem('token')
            if (token) {
                props.setSignedIn(true)
                checkTokenStillValid(token)
                viewRatings(token)
            }
        }, [])

        const safeJsonParse = async (response) => {
            if (!response.ok) {
                if (response.status === 401) {
                    handleSessionExpiry() 
                }
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            const text = await response.text()
            return text ? JSON.parse(text) : {}
        }

    const viewRatings = (token) => {
        fetch(`https://w20021570.nuwebspace.co.uk/coursework/api/rate`, {
            method: 'GET',
            headers: new Headers({ 'Authorization': 'Bearer ' + token })
        })
            .then(safeJsonParse)     
            .then(data => {
                props.setRate(data)
            })
            .catch(error => {
                console.error('Error fetching ratings:', error)
            })}

    useEffect(() => {
        let tokenValidationInterval

        if (props.signedIn) {
            tokenValidationInterval = setInterval(() => {
                validateToken()
            }, 30000) 
        }
        return () => {
            if (tokenValidationInterval) {
                clearInterval(tokenValidationInterval)
            }
        }
    }, [props.signedIn])

    const checkTokenStillValid = (token) => {
        return fetch('https://w20021570.nuwebspace.co.uk/coursework/api/note', {
            method: 'GET',
            headers: new Headers({ 'Authorization': 'Bearer ' + token })
        })
            .then(safeJsonParse)
            
    }

    const signIn = async () => {
        const encodedString = btoa(username + ':' + password)
        fetch('https://w20021570.nuwebspace.co.uk/coursework/api/token', {
            method: 'GET',
            headers: new Headers({ 'Authorization': 'Basic ' + encodedString })
        })
            .then(response => {
                if (response.status === 200) {
                    setErrorSigningIn(false)
                    props.setSignedIn(true)
                } else {
                        setErrorSigningIn(true)
                        props.setSignedIn(false)
                        alert('Wrong credentials, please try again')
                    
                }
                return response.json()
            })
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token)
                }
                checkTokenStillValid(data.token)
            })
            .catch(error => {
                console.log(error)
                props.setSignedIn(false)
            })
    }
    
    const validateToken = () => {
        const token = localStorage.getItem('token')
        if (token) {
            checkTokenStillValid(token)
            .catch(error => {
                if (error.message === '401') {
                    handleSessionExpiry()
                } else {
                    console.error('Error validating token:', error)
                }
            })
        }
    }

    const handleSessionExpiry = () => {
        localStorage.removeItem('token')
        alert('Your session has expired. Please sign in again.')
        window.location.href = '/coursework/app/home'
    }

    const signOut = () => {
        props.setSignedIn(false)
        localStorage.removeItem('token')
        window.location.href = '/coursework/app/home'
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
      }

    const handleUsername = (event) => { setUsername(event.target.value) }
    const handlePassword = (event) => { setPassword(event.target.value) }
    const inputColor = errorSigningIn ? 'bg-red-100' : 'bg-slate-100'

    return (
        <div className='bg-black p-2 text-md text-right relative'>
          <button
            onClick={toggleMenu}
            className='md:hidden absolute top-2 right-2 text-black z-10 p-1.5'
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
          <div className={`md:flex md:space-x-2 ${isMenuOpen ? 'block' : 'hidden'}`}>
            {!props.signedIn && (
              <div className='md:w-full'>
                <input
                  type='text'
                  placeholder='username'
                  className={`w-full p-1 mx-2 mb-2 rounded-md md:w-auto md:mb-0 ${inputColor}`} 
                  value={username}
                  onChange={handleUsername}
                />
                <input
                  type='password'
                  placeholder='password'
                  className={`w-full p-1 mx-2 mb-2 rounded-md md:w-auto ${inputColor}`} 
                  value={password}
                  onChange={handlePassword}
                />
                <input
                  type='submit'
                  value='Sign In'
                  className='w-full py-1 px-2 mx-2  mb-2 bg-gradient-to-r from-blue-500 to-teal-400 p-4 
                  shadow-lg hover:bg-green-500 rounded-md md:w-auto' 
                  onClick={signIn}
                />
              </div>
            )}
            {props.signedIn && (
              <div>
                <input
                  type='submit'
                  value='Sign Out'
                  className='w-full py-1 px-2 mx-2 bg-gradient-to-r from-blue-500 to-teal-400 
                  p-4 shadow-lg hover:bg-green-500 rounded-md md:w-auto'
                  onClick={signOut}
                />
              </div>
            )}
          </div>
        </div>
      )
    }

export default SignIn

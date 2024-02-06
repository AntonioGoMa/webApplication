
/**
 * The Menu component renders a navigation menu with links that allow users to navigate between different sections of a web application. 
 * It uses React Router to create links to the 'Home,' 'Country,' and 'Content' sections 
 * providing a visual design with hover effects and transitions.
 *
 * @author Antonio
 */

import { Link } from 'react-router-dom'

function Menu(props) {
  return (
    <nav className='bg-gradient-to-r from-blue-500 to-teal-400 p-4 shadow-lg'>
      <ul className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 justify-center'>
        <li>
          <Link
            to='/home'
            className='text-white font-semibold hover:text-yellow-500 transition duration-300'
          > Home
          </Link>
        </li>
        <li>
          <Link
            to='/country'
            className='text-white font-semibold hover:text-yellow-500 transition duration-300'
          > Country
          </Link>
        </li>
        <li>
          <Link
            to='/content'
            className='text-white font-semibold hover:text-yellow-500 transition duration-300'
          > Content
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Menu

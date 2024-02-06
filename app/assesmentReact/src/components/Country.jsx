
/**
 * The Country component displays the name of a country passed as a prop.
 * The Search component provides a search input field with an icon. 
 * Users can enter a search query, and it can be used to filter content based on the entered query.
 * 
 * The GetCountry component fetches and displays a list of countries. 
 * It includes a search input field to filter countries by name. 
 * The component renders a grid of country names and adapts the layout for different screen sizes.
 *
 * @author Antonio
 */

import { useEffect, useState } from 'react'

function Country(props) {
    const toggleVisibility = () => {
        if (extendCountry === props.country.country) {
            setExtendCountry(null)
        } else {
            setExtendCountry(props.country.country)
        }
    }

    const expandCountry = 'md:col-span-2'
    const { extendCountry, setExtendCountry } = props
    const isExpanded = props.country.country === extendCountry
    const authors = props.country.authorName.split(', ')
    const cities = props.country.city.split(', ')
    const authorCityMap = {}

    authors.forEach((author, index) => {
        const city = cities[index]
        if (authorCityMap[author]) {
            authorCityMap[author].push(city)
        } else {
            authorCityMap[author] = [city]
        }
    })

    return (
        <section className={`cursor-pointer ${isExpanded ? expandCountry : ''}`}>
            <h2
                className='text-xl font-semibold cursor-pointer'
                onClick={() => toggleVisibility(props.country.country)}
            >
                {props.country.country}
            </h2>
            {isExpanded && (
                <div className='mt-4'>
                    <h3 className='text-lg font-semibold' >
                        Authors and Cities:
                    </h3>
                    <ul>
                        {Object.keys(authorCityMap).map((author, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>
                                {author}: {authorCityMap[author].join(', ')}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    )
}

function Search(props) {
    return (
        <div className='flex justify-center items-center h-16'>
            <div className='flex items-center border border-black rounded-lg'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5bg-gradient-to-r from-blue-500 to-teal-400  ml-2'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M21 21l-4-4m0 0l-4-4m4 4l-4-4M5 12a7 7 0 0114 0c0 3.866-3.134 7-7 7a7 7 0 01-7-7 7 7 0 017-7z'
                    />
                </svg>
                <input
                    type='text'
                    value={props.search}
                    onChange={props.handleSearch}
                    className='w-48 py-2 px-4 rounded-lg focus:outline-none'
                    placeholder='Search...'
                />
            </div>
        </div>
    )
}

function GetCountry(props) {

    const [country, setCountry] = useState([])
    const [search, setSearch] = useState('')
    const [extendCountry, setExtendCountry] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetch('https://w20021570.nuwebspace.co.uk/coursework/api/country')
            .then(safeJsonParse)
            .then(data => {
                setCountry(data)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching country:', error)
                setLoading(false)
            })
    }, [])

    const safeJsonParse = async (response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const text = await response.text()
        return text ? JSON.parse(text) : {}
    }

    const searchCountry = (country) => {
        const foundInTitle = country.country.toLowerCase().includes(search.toLowerCase())
        return foundInTitle
    }

    const countryJSX = country
        .filter(searchCountry)
        .map((country, i) => (
            <div
                key={i + country.country}
                className={`p-4 m-2 rounded-lg border border-gray-300 ${extendCountry === country.country ? 'md:col-span-4' : 'col-span-1'
                    }`}
            >
                <Country country={country}
                    extendCountry={extendCountry}
                    setExtendCountry={setExtendCountry} />
            </div>
        ))

    const handleSearch = (event) => {
        setSearch(event.target.value)
    }

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='col-span-1 md:col-span-2'>
                    <h1 className='text-3xl font-bold mb-4 mt-4'>Country</h1> 
                    <Search search={search} handleSearch={handleSearch} />
                </div>
            </div>
            {loading ? (
                <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                    <div className='loader'></div>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {countryJSX.length === 0 && !loading ? (
                        <div className='text-red-500 text-center no-content col-span-full'>
                            <p>No countries found.</p>
                        </div>
                    ) : (
                        countryJSX
                    )}
                </div>
            )}
        </>
    )
}

export default GetCountry 
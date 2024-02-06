/**
 * The Content component displays detailed information about a single content item.
 * It allows users to expand and view content details, including the abstract, content type, authors, and awards.
 * Users can also add notes and ratings if they are signed in.
 *
 * @author Antonio
 */

import React, { useEffect, useState } from 'react'
import Note from './Note'
import Rate from './Rate'

function Content(props) {

    const toggleVisibility = () => {
        if (extendContent === props.content.contentID) {
            setExtendContent(null)
        } else {
            setExtendContent(props.content.contentID)
        }
    }

    const expandedContentClass = 'md:col-span-2'
    const { extendContent, setExtendContent } = props
    const isExpanded = props.content.contentID === extendContent

    return (
        <div className={`cursor-pointer ${isExpanded ? expandedContentClass : ''}`}>
            <h2 className='text-xl font-semibold cursor-pointer'
                onClick={() => toggleVisibility(props.content.contentID)}>
                {props.content.title}
            </h2>
            
            {isExpanded && (
                <div className='mt-4'>
                    <h3 className='text-lg font-semibold'>Abstract</h3>
                    <p className='mb-2'>{props.content.abstract}</p>
                    <h3 className='text-lg font-semibold'>Content Type</h3>
                    <p className='mb-2'>{props.content.contentType}</p>
                    <div>
                        <h3 className='text-lg font-semibold'>Authors</h3>
                        {props.author.map((author, index) => (
                            <div key={index} className='mb-2'>
                                <p className='font-semibold'>{author.authorName}</p>
                                <p>Institution: {author.institution}</p>
                            </div>
                        ))}
                    </div>
                    {props.content.award && (
                        <>
                            <h3 className='text-lg font-semibold'>Awarded as:</h3>
                            <p>🏅 {props.content.award}</p>
                        </>
                    )}
                    {props.signedIn && (
                        <div className='mt-4'>
                            <Note contentID={props.content.contentID} />
                            <Rate contentID={props.content.contentID} />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

/**
 * The GetContent function fetches and displays a list of content items.
 * It includes search and filtering options, allows pagination, and adapts the layout for different screen sizes.
 * It manages the state, fetches content data, and renders content items based on user-selected filters and pagination.
 *
 * @author Antonio
 */

function GetContent(props) {
    const [content, setContent] = useState([])
    const [author, setAuthor] = useState([])
    const [page, setPage] = useState(1)
    const [selectedContentType, setSelectedContentType] = useState('All content')
    const [loading, setLoading] = useState(false)
    const [extendContent, setExtendContent] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = () => {
        const searchUrl = `https://w20021570.nuwebspace.co.uk/project/search?search=${searchQuery}`
        fetch(searchUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch content - ${response.status}`)
                }
                if (response.status === 204) {
                    alert('No content found for the search query.')
                    return null
                }
                return response.json()
            })
            .then(data => {
                if (data !== null) {
                    setContent(data)
                }
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching content:', error)
            })
    }
    
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const noContentMessage = (<div
        className='text-red-500 text-center no-content'>
        <p> No content available for the selected type. </p>
    </div>)

    const itemsPerPage = 20

    useEffect(() => {
        setLoading(true)
        setPage(1)
        const contentUrl =
            selectedContentType === 'All content'
                ? 'https://w20021570.nuwebspace.co.uk/coursework/api/content'
                : `https://w20021570.nuwebspace.co.uk/coursework/api/content?type=${selectedContentType}`

        fetch(contentUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch content - ${response.status}`)
                }
                return response.json()
            })
            .then(data => {
                setContent(data)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching content:', error)
            })
        fetch('https://w20021570.nuwebspace.co.uk/coursework/api/author')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch author - ${response.status}`)
                }
                return response.json()
            })
            .then(data => {
                setAuthor(data)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching author:', error)

                setLoading(false)
            })
    }, [selectedContentType, searchQuery])

    const startOfPage = (page - 1) * itemsPerPage
    const endOfPage = startOfPage + itemsPerPage

    const getAuthorForContent = contentId => {
        return author.filter(author => author.contentID === contentId)
    }
    const contentJSX = content
        .filter(item => selectedContentType === 'All content' || item.contentType === selectedContentType)
        .slice(startOfPage, endOfPage)
        .map((item) => (
            <div
                key={item.contentID}
                className={`p-4 m-2 rounded-lg border border-gray-300 ${extendContent === item.contentID ? 'md:col-span-2' : 'col-span-1'
                    }`}>
                <Content
                    content={item}
                    author={getAuthorForContent(item.contentID)}
                    signedIn={props.signedIn}
                    note={props.note}
                    setNote={props.setNote}
                    extendContent={extendContent}
                    setExtendContent={setExtendContent}
                />
            </div>
        ))

    const lastPage = contentJSX.length === 0
    const firstPage = page <= 1
    const prevDisabled = firstPage ? 'disabled' : ''
    const nextDisabled = lastPage ? 'disabled' : ''

    const nextPage = () => {
        if (!lastPage) {
            setPage((prevPage) => prevPage + 1)
        }
    }

    const previousPage = () => {
        if (!firstPage) {
            setPage((prevPage) => prevPage - 1)
        }
    }

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='col-span-1 md:col-span-2'>
                    <h1 className='text-3xl font-bold mb-4 mt-4'>Contents</h1>
                    <div className='mb-4'>
                        <input
                            type='text'
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className='w-48 py-2 px-4 rounded-lg focus:outline-none border border-black ml-2'
                            placeholder='Search...'/>
                        <button
                            onClick={handleSearch}
                            className='bg-gradient-to-r from-blue-500 to-teal-400 py-2 px-4 rounded-lg text-white ml-2'
                        > Search
                        </button>
                    </div>
                    <div className='mb-4'>
                        <select
                            value={selectedContentType}
                            onChange={(e) => setSelectedContentType(e.target.value)}>
                            <option value='All content'>All content</option>
                            <option value='Course'>Course</option>
                            <option value='Demo'>Demo</option>
                            <option value='Doctoral Consortium'>Doctoral Consortium</option>
                            <option value='Event'>Event</option>
                            <option value='Late-Breaking Work'>Late-Breaking Work</option>
                            <option value='Paper'>Paper</option>
                            <option value='Poster'>Poster </option>
                            <option value='Work-in-Progress'>Work-in-Progress</option>
                            <option value='Workshop'>Workshop</option>
                            <option value='Case Study'>Case Study</option>
                            <option value='Panel'>Panel</option>
                            <option value='AltCHI'>AltCHI</option>
                            <option value='SIG'>SIG</option>
                            <option value='Keynote'>Keynote</option>
                            <option value='Interactivity'>Interactivity</option>
                            <option value='Journal'>Journal</option>
                            <option value='Symposia'>Symposia </option>
                            <option value='Competitions'>Competitions</option>
                        </select>
                    </div>
                </div>
                {loading ? (
                        <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        <div className='loader'></div> </div>
                   
                ) : (
                    <>
                        {contentJSX.length > 0 ? contentJSX : noContentMessage}
    
                        {/* Pagination buttons */}
                        {contentJSX.length > 0 && (
                            <div className='flex justify-center mb-4 col-span-full'>
                                <button
                                    onClick={previousPage}
                                    disabled={page <= 1}
                                    className={`py-2 px-4 mr-2 ${page <= 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'} rounded`}
                                > Previous
                                </button>
                                <button
                                    onClick={nextPage}
                                    disabled={content.length === 0}
                                    className={`py-2 px-4 ${content.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'} rounded`}
                                > Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
    
}
export default GetContent



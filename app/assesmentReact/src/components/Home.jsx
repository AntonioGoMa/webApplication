
/**
 * The Preview component displays details about a video preview, including its title and a clickable link to the video.
 * It is used to render video preview information.
 * 
 * The Home component fetches and displays video preview data from an API. 
 * It renders a welcome message and one video preview. 
 * This component represents the home page of the CHI 2023 web application and showcases a single video preview.
 *
 * @author Antonio
 */

import { useEffect, useState } from 'react'

function Preview(props) {
    const [videoId, setVideoId] = useState('')

    // Extract the video ID from the URL
    const extractVideoId = (url) => {
        const match = url.match(/(?:\/|v=)([a-zA-Z0-9_-]{11})$/)
        return match ? match[1] : ''
    }

    useEffect(() => {
        // Extract the video ID from the video URL
        const videoId = extractVideoId(props.preview.preview_video)
        setVideoId(videoId)
    }, [props.preview.preview_video])

    return (
        <section className='mb-4'>
            <h2 className='text-xl font-semibold mb-2'>Video title:</h2>
            <p>{props.preview.title}</p>
            <h3 className='text-xl font-semibold mt-2'>Video Preview:</h3>
            {videoId && (

                <div className='youtube-container  flex items-center justify-center'>
                    <iframe
                        width='560'
                        height='315'
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title='YouTube video player'
                        frameBorder='0'
                        allowFullScreen
                    ></iframe>
                </div> 
                )}
             <h3 className='text-xl font-semibold mt-2'>Link:</h3>
             <a href={props.preview.preview_video} className='text-blue-500 hover:underline'> 
             {props.preview.preview_video} </a>
        </section>
    )
}

function Home(props) {
    const [preview, setPreview] = useState([])
    const limit = 1

    useEffect(() => {
        fetch(`https://w20021570.nuwebspace.co.uk/coursework/api/preview?limit=${limit}`)
            .then((response) => response.json())
            .then((data) => setPreview(data))
    }, [])

    const previewJSX = preview.map((item) => (
        <Preview key={item.title} preview={item} />
    ))

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-3xl font-bold'>CHI 2023</h1>
            <p className='text-lg mt-4'>Welcome to the home page!</p>
            <div className='mt-8'>{previewJSX}</div>
        </div>
    )
}

export default Home

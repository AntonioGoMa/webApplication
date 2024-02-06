/**
 * The Ratings component provides a user interface for rating content with stars.
 * Users can click on stars to give or delete feedback on content. 
 * It communicates with an API to fetch and update ratings and displays the current rating using stars.
 *
 * @author Antonio
 */ 

import  { useEffect, useState } from 'react'

function Rate(props) {
    const [rate, setRate] = useState(props.rate || 0)

    useEffect(() => {
        fetch(`https://w20021570.nuwebspace.co.uk/coursework/api/rate?contentID=${props.contentID}`, {
            method: 'GET',
            headers: new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('token') })
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                }
            })
            .then(data => {
                if (data && data.length > 0) {
                    setRate(data[0].rate)
                }
            })
            .catch(error => {
                console.error('Error fetching note:', error)
            })
            
       
    }, [props.contentID,])

    useEffect(() => {
        if (props.rate !== rate) {
            setRate(props.rate || 0)
            
        }
    }, [ props.rate])



    const saveRating = (starValue) => {
        setRate(starValue)
        let formData = new FormData()
        formData.append('contentID', props.contentID)
        formData.append('rate', starValue)

        fetch('https://w20021570.nuwebspace.co.uk/coursework/api/rate', {
            method: 'POST',
            headers: new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('token') }),
            body: formData,
        })
            .then(response => {
                if (response.status === 200 || response.status === 204) {
                   
                    setRate(starValue)
                }
            })
    }

    const deleteRate = () => {
        fetch(`https://w20021570.nuwebspace.co.uk/coursework/api/rate?contentID=${props.contentID}`, {
            method: 'DELETE',
            headers: new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('token') }),
        })
            .then(response => {
                if (response.status === 200 || response.status === 204) {
                
                    setRate('')
                }
            })
    }


    const handleStarClick = (starValue) => {
        if (starValue === rate) {
            
            setRate(0)
            deleteRate()
        } else {
            setRate(starValue)
            saveRating(starValue)
            
        }
    }
    
    const renderStars = () => {
        const stars = [1, 2, 3, 4, 5]
    
        return stars.map((star) => (
            <span
                key={star}
                className={`cursor-pointer text-2xl ${star <= rate ? 'text-yellow-500' : 'text-gray-300'}`}
                onClick={() => handleStarClick(star)}
            >
                ★
            </span>
        ))
    }

const contentText='Feedback on content' 

    return (
        <div className='flex flex-col p-5'>
            <div>
                <p className='text-lg font-semibold mb-2'>{contentText}</p>
                {renderStars()}
            </div>
        </div>
            
    )
}

export default Rate

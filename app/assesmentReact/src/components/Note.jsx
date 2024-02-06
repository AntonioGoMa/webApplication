
/**
 * The Note component provides a user interface for adding, saving, viewing, and removing notes associated with a specific content item. 
 * It communicates with an API to fetch and update notes, allowing users to interact with and manage notes related to the content.
 *
 * @author Antonio
 */

import React, { useEffect, useState } from 'react'

function Note(props) {
    const [note, setNote] = useState("")

    useEffect(() => {        
        fetch(`https://w20021570.nuwebspace.co.uk/coursework/api/note?contentID=${props.contentID}`, {
            method: 'GET',
            headers: new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('token') })
        })
        .then(response => {
            if (response.status === 200) {
                return response.json()
            } 
        })
        .then(data => {
            if (data && data.note) {
                setNote(data.note)
            }
        })
        .catch(error => {
            console.error('Error fetching note:', error)
        })

    }, [props.contentID])


    
    const saveNote = () => {
        let formData = new FormData()
        formData.append('contentID', props.contentID)
        formData.append('note', note)

        
        fetch('https://w20021570.nuwebspace.co.uk/coursework/api/note', {
            method: 'POST',
            headers: new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('token') }),
            body: formData,
        })
            .then(response => {
                if (response.status === 200 || response.status === 204) {
                    // Assuming you want to update the note state with the contentID
                  setNote(note)
                  window.alert('Note saved!')
                }
            })}

    const removeNote = () => {
        fetch(`https://w20021570.nuwebspace.co.uk/coursework/api/note?contentID=${props.contentID}`, {
            method: 'DELETE',
            headers: new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('token') }),
        })
            .then(response => {
                if (response.status === 200 || response.status === 204) {
                    setNote('')
                    window.alert('Note removed!')
                }
            })
    }

    const viewNotes = () => {
        const noteContentID = props.contentID
        fetch(`https://w20021570.nuwebspace.co.uk/coursework/api/note?contentID=${noteContentID}`, {
            method: 'GET',
            headers: new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('token') })
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                   
                } else {
                    throw new Error(`Failed to fetch note - Status code: ${response.status}`)
                }
            })
            .then(data => {
                if (data && data.length > 0) {
                    setNote(data[0].note) 
                } else {
                    setNote('') 
                } 
            })
            .catch(error => {
                console.error('Error fetching notes:', error)
                window.alert('There is no note to view.')
            })
    }
    return (

        <div className='flex flex-col p-5'>
                <textarea
                    name='note'
                    placeholder='Make note:'
                    rows='1'
                    cols='10'
                    maxLength='20'
                    className='p-2'
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            
            <input
                name='save'
                type='submit'
                value='Save'
                className='w-full my-2 bg-slate-700 text-white rounded-md'
                onClick={saveNote}
            />

            <button
                name='view'
                className='w-full my-2 bg-slate-700 text-white rounded-md'
                onClick={ viewNotes}
            > View Note
            </button>
            <button
                name='remove'
                className='w-full my-2 bg-slate-700 text-white rounded-md'
                onClick={removeNote}
            > Remove Note
            </button>
        </div>
    )
}

export default Note

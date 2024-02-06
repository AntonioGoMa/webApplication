
/**
 * The Developer function displays information about a developer, including their name and student ID.
 *  It is used to render developer details as part of the footer.
 * 
 * The GetCountry function fetches and displays a list of countries, it includes a search input field to filter countries by name. 
 * The component renders a grid of country names and adapts the layout for different screen sizes.
 *
 * @author Antonio
 */
import { useEffect, useState } from 'react'


function Developer(props) {

    return (
        <section className='footer'>
            <p> {props.developer.studentName}</p>
            <p> {props.developer.studentID}</p>
            <p>Coursework assignment for KF6012 Web Application Integration, Northumbria University</p>
        </section>
    )
}

function Footer(props) {

    const [developer, setDeveloper] = useState([])

    useEffect(() => {
        fetch(`https://w20021570.nuwebspace.co.uk/coursework/api/developer`)
            .then(response => response.json())
            .then(data => {
                const dataArray = Array.isArray(data) ? data : [data]
                setDeveloper(dataArray)
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            })
    }, [])

    const developerJSX = developer.map((item) => (
        <Developer key={item.studentName} developer={item} />
    ))

    return (
        <footer className='bg-gradient-to-r from-blue-500 to-teal-400 p-4 shadow-lg '>
            <div className='mx-auto p-2 '>
                {developerJSX}
            </div>
        </footer>
    )
}

export default Footer
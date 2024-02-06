- Author - - - - - - - - - - - 

Module: KF6012
Name: Antonio Gorgan
Student ID: w20021570

- Part 1 Endpoints - 

* GET  developer *
endpoint is used to showcase developer name and student number
- link: https://w20021570.nuwebspace.co.uk/coursework/api/developer
- params: n/a

* GET  country *
endoint lists all the countries in the database with no duplicates along with the authors coming from that country and the city.
- link: https://w20021570.nuwebspace.co.uk/coursework/api/country
- params: n/a

* GET  preview *
preview endpoint generates random preview links set by the user
- link: https://w20021570.nuwebspace.co.uk/coursework/api/preview
- params: limit (https://w20021570.nuwebspace.co.uk/project/preview?limit=1), the paramater  
          defines an integer limit for the number items the can be in the response. Every link is shown in random order 

* GET  author *
author endpont is used to retrieve author details from the database, pubblications made by each authors and their institution.
- link: https://w20021570.nuwebspace.co.uk/coursework/api/author 
- params: 1. content (https://w20021570.nuwebspace.co.uk/coursework/api/author?content=96540) where a content id is specified the response
            should just contain details for authors of that content. 

          2. country(https://w20021570.nuwebspace.co.uk/coursework/api/author?country=japan) return only the details where there is affiliation 
          with the specified country.
          
          Paramters cannot work together. 

* GET  content *
content endpoint allow users to loof for a specific content type and showcase the contents from the database in a page of 20 items.
- link: https://w20021570.nuwebspace.co.uk/coursework/api/content 
- params: 1. page (https://w20021570.nuwebspace.co.uk/coursework/api/content?page=1)  parameter is used a ‘page’ of 20 results should be shown

          2. type (https://w20021570.nuwebspace.co.uk/coursework/api/content?type=paper)  parameter is used to get only content of the specified
           type should be returned.
          This parameter should use the type name not the type id. 

        Paramters can work either individually or together (https://w20021570.nuwebspace.co.uk/coursework/api/content?page=1&type=paper)
 
* GET  token *
token endpoint is used to generate a Bearer Token for authorsation purposes.
- link: https://w20021570.nuwebspace.co.uk/coursework/api/token
- params: Username and Password must be transmitted via authorization headers, endpoint must accept a username and password submitted in 
          the headers of the request. If the username and password are valid, a JWT should be created and returned 
          (if not, an appropriate response should be made). The token must contain the user’s id. The token should not contain 
          private data (such as a password) and should not be used to transfer data needed by the client. The token should expire 
          no more than 30 minutes after being issued.

* GET || POST || DELETE   note *
note endpoint is used to allow users to make notes for content in the users database.
- link: https://w20021570.nuwebspace.co.uk/coursework/api/note
- params: 1. GET JWT Bearer token must be transmitted via authorization bearer token (Bearer Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNzA1MzM2NzQyfQ.
          oKmKVcvUXiixtBVPqm31Sek3M03uaEAgHN4WtN1u0-g). Additionaly, if contentID (https://w20021570.nuwebspace.co.uk/coursework/api/note?contentID=1) 
          is specified in the link request only the content with that contentID is returned, otherwise all notes the user has are returned.  

          2. POST (Bearer Token = {token}, Body:form-data = key:contentID = value, value: note = value) create or update notes. 

          3. DELETE (Bearer Token = {token}, https://w20021570.nuwebspace.co.uk/coursework/api/note?contentID=1) contentID must be given when fetching
          the request. 


* GET  search *
search endpoint is used to get contents if they have a specific word in the title or abstract
- link: https://w20021570.nuwebspace.co.uk/coursework/api/search
- params search (https://w20021570.nuwebspace.co.uk/coursework/api/search?=search=human) paramter is used to allow users to search for a content
         by a word if the content has the inserted word either the title or the abstract

* GET || POST || DELETE  rate *
rate endpoint is used to allow users to rate a content in the users database
- link https://w20021570.nuwebspace.co.uk/coursework/api/rate
- params 1. GET JWT Bearer token must be transmitted via authorization bearer token (Bearer Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNzA1MzM2NzQyfQ.
          oKmKVcvUXiixtBVPqm31Sek3M03uaEAgHN4WtN1u0-g). Additionaly, if contentID (https://w20021570.nuwebspace.co.uk/coursework/api/rate?contentID=1) 
          is specified in the link request only the content with that contentID is returned, otherwise all ratings the user has are returned.  

          2. POST (Bearer Token = {token}, Body:form-data = key:contentID = value, value: rate = value) to create a rate. 

          3. DELETE (Bearer Token = {token}, https://w20021570.nuwebspace.co.uk/coursework/api/note?contentID=1) contentID must be given when fetching
          the request to delete a rating

Part 2 - Web Application: - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Link to the website : https://w20021570.nuwebspace.co.uk/coursework/app/home

*Home Page* uses the developer endpoint for the footer and the preview endpoint to display a link for a random vide. 

*Country Page* uses the country endoint to display countries in the database, when clicked on a country more information is shown 
               such as every author from that country and their cities. 

*Content Page* uses the content and author endpoints to show the content title, content abstract, type of content, authors, institutions, and 
             awards. There are 20 contents per page, and using the search endoint, users can look after a content based on a word in its title 
             or abstract. Select menu is also available, furthermore when users are signed in, they can view a note by clicking on view note, 
             add/update a note by typing into the text area by clicking save and delete a note. Similarly a user can rate a content by clicking on 
             the amount of stars (1 to 5). If users want to delete their feedback, they can click on the star again to delete. Endpoints note and 
             rate have been use to implement those features. 

*Sign In* allow users to sign by getting a token through the token endpoint, once logged in users can sign out and be redirected to the homepage. 
          Additionaly after 30 minutes from the logged in, users will be prompted to log in again because their session expired, leading to the 
          homepage. 

*Not Found* page displays the "sadCat.jpg" picture with the message error "404 - Page Not Found". The pictue has been taken from a open source 
            website: https://www.pexels.com/. 

             

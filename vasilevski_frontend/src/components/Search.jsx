import React, {useState, useEffect} from 'react'

import MasonryLayout from './MasonryLayout'

import {client} from '../client'
import {feedQuery, searchQuery} from '../utils/data'
import Spinner from './Spinner'

const Search = ({searchTerm}) => {
  //We know that we need searchTerm as a prop if we look in our Pins component where we call Search 

  const [pins, setPins] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(searchTerm) {
      setLoading(true)
      const query = searchQuery(searchTerm.toLowerCase())
      client.fetch(query)
      .then((data) => {
        setPins(data)
        setLoading(false)
      })
      //If there is a searchTerm we setLoading to true, and pass searchTerm to lowercase and fetch the query
    } else {
      client.fetch(feedQuery)
      .then((data) => {
        setPins(data)
        setLoading(false)
      })
    }
    //Else if we dont have a searchTerm, we show pins of all categories and all searchterms and setLoading to false
  }, [searchTerm])
  //useEffect is going to change, every time searchTerm changes
  


  return (
    <div>
      {loading && <Spinner message='Searching for pins'/>}
      {/* If we are loading we call Spinner and a message */}
      {pins?.length !==0 && <MasonryLayout pins={pins}/>}
      {/* If pins is not 0 we show masonry layout and pass pins to it */}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        //Also if we have 0 pins and if search term is not empty (meaning we are searching for something but there are no pins), also if we are not currently loading, in that case we display a div 
        <div className='mt-10 text-center text-xl'>
          No Pins Found!
        </div>
      )}
    </div>
  )
}

export default Search
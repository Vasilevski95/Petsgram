import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
//we use this to find out what are the currently passed parameters, with that we can find out the category that the person is currently looking at

import {client} from '../client'
import { feedQuery, searchQuery } from '../utils/data'
//sanity client
import MasonryLayout from './MasonryLayout'
//grid (like pinterest)

import Spinner from './Spinner'
//loader



const Feed = () => {

  const [loading, setLoading] = useState(false)

  const [pins, setPins] = useState(null)

  const {categoryId} = useParams()
  //How do we know out category changed? We look at the url with this hook

  useEffect(() => {
    setLoading(true)
    if(categoryId) {
      const query = searchQuery(categoryId)

      client.fetch(query)
      .then((data) => {
        setPins(data)
        setLoading(false)
      })

      //client fetch provide in the query of the data we want to fetch, then we get the specific data back, and we want to set the pins to be equal to data, and this is going to do the logic of fetching all the pins (posts) of specific category. But now of course we have to make this work for all posts, not depending on specific category so we create new query in the data
      //If we are searching for a specific category
    } else {
      client.fetch(feedQuery)
      .then ((data) => {
        setPins(data)
        setLoading(false)
      })
      //We get all the pins
    }
    
  }, [categoryId])
  //We fetch the posts, and then turn on and turn off the loading, it's going to be called on start of application, and it's going to be called anytime that our category changes
  

  if(loading) return <Spinner message="We are adding new ideas to your feed!"/>
  // If we are loading give us the spinner with a message

  if (!pins?.length) return <h2>No pins avalilable</h2>

  return (
    <div>
      {pins && <MasonryLayout  pins={pins}/>}
    </div>
    //If pins exsist we can render the masonry layout, and we provide pins
  )
}

export default Feed
import React, {useState, useEffect} from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams, useNavigate } from 'react-router-dom'
import { GoogleLogout } from 'react-google-login'

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data'
import { client } from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'

const randomImage = 'https://source.unsplash.com/1600x900/?nature,animals'
//This url give us a random image from unsplash

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none'
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none'

const UserProfile = () => {

  const [user, setUser] = useState(null)

  const [pins, setPins] = useState(null)

  const [text, setText] = useState('Created') //Createc/Saved

  const [activeBtn, setActiveBtn] = useState('created')

  const navigate = useNavigate()

  const {userId} = useParams()

  useEffect(() => {
    const query = userQuery(userId)

    client.fetch(query)
      .then ((data) => {
        setUser(data[0])
      })
  }, [userId])
  //This useEffect is going to fetch our user data, we're going to call this whenever our userId changes [userId], we set up our query, which is equal to userQuery with the userId
  //We use client fetch pass in query, and get the data about specific user, and set user to be equal to (data[0]), because we are getting the array, and we only want the first user

  useEffect(() => {
    if(text === 'Created') {
      const CreatedPinsQuery = userCreatedPinsQuery(userId)
      //We get the created pins

      client.fetch (CreatedPinsQuery)
      //We pass in created pins query
      .then((data) => {
        setPins(data)
      })
    } else {
        const savedPinsQuery = userSavedPinsQuery(userId)
        //We get the saved pins
  
        client.fetch (savedPinsQuery)
        //We pass in saved pins query
        .then((data) => {
          setPins(data)
        })
    }
  }, [text, userId])

  //Depending on the state we need to show the created post or saved, so we need this useEffect, to fetch them. We have a callback function and in dependency array we have text and userId which means that useEffect is going to be recalled every time text or userId changes

  const logout = () => {
    localStorage.clear()
    //The clear() method removes all the Storage Object item for this domain.

    navigate('/Login')
    //After we logout we navigate to login
  }


  if(!user) {
  //We check if the user exist, so if user do not exist we return a spinner component with a message
    return <Spinner message="Loading profile..."/>
}

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img 
              src={randomImage}
              //We pass prop from above, which gives us random img
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
              alt='banner-pic'
            />
            {/* This image tag is always going to fetch random images from unsplash*/}
            <img 
              className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
              src={user.image}
              alt='user-pic'
              //This is clear, we render user image
            />
            <h1 className='font-bold text-3xl text-center mt-3'>
              {user.userName}
              {/* This is clear, we render username */}
            </h1>
            <div className=' absolute top-1 z-1 right-1 p-2'>
              {userId === user._id && (
                <GoogleLogout 
                clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                render={(renderProps) => (
                  <button
                    type='button'
                    className=' bg-white p-2 rounded-full cursor-pointer outline-none shadow-md font-bold opacity-70 hover:opacity-100'
                    
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}

                    
                  >
                    <AiOutlineLogout className='ml-4' color='red' fontSize={21}/> 
                    Logout 
                  </button>
                  
                )}
                  onLogoutSuccess={logout}
                  
                  cookiePolicy="single_host_origin"
              />
              )}
              {/* We check if userId is equal to our user id, in that case user can also logout from that profile */}
              
              
            </div>
          </div>
          <div className='text-center mb-7'>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveBtn('created')
              }}
              
              //It's going to have click propery, where it gets an event, and set text to be equal to contents of that button, and then we can switch setActiveBtn to be equal to 'created'
              className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
              //We must have a dynamic className (if activeBtn is equal to 'created' in that case we render activeBtnStyles, else we want to render notActiveBtnStyles)
              //activeBtnStyles and notActiveBtnStyles are the two string variables that must be created above
            >
              Created
            </button>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveBtn('saved')
              }}
              
              //It's going to have click propery, where it gets an event, and set text to be equal to contents of that button, and then we can switch setActiveBtn to be equal to 'created'
              className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
              //We must have a dynamic className (if activeBtn is equal to 'created' in that case we render activeBtnStyles, else we want to render notActiveBtnStyles)
              //activeBtnStyles and notActiveBtnStyles are the two string variables that must be created above
            >
              Saved
            </button>
          </div>
          
          {pins?.length ? (
          //Only if there are pins in that case we render pins, if someone didn't create any we show something else
          <div className='px-2'>
            <MasonryLayout pins={pins}/>
            {/* We pass in the pins so we can show them */}
          </div>
          ) : (
            <div className='flex justify-center font-bold items-center w-full text-xl mt-2'>
              No Pins Found!
            </div>
          )}
          


        </div>
      </div>
    </div>
  )
}

export default UserProfile
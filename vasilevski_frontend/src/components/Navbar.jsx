import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { IoMdAdd, IoMdSearch } from 'react-icons/io'

const Navbar = ({searchTerm, setSearchTerm, user}) => {   //We pass these three props

  const navigate = useNavigate()

  if(!user) return null
  //If the user do not exist we want to show null, else (we want to show navigation bar)

  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadown-sm'>
        <IoMdSearch fontSize={21} className="ml-1"/>
        <input 
          type='text'
          onChange={(e) => setSearchTerm(e.target.value)}
          //We provide the callback function, where we get the event (e) and then we call the setSearchTerm is equal to (e.target.value)
          placeholder='Search'
          value={searchTerm}
          onFocus={() => navigate('/search')}
          //If we do this, then we can move from basic feed, to our search feed
          className="p-2 w-full bg-white outline-none"
        />
      </div>
      <div className='flex gap-3'>
        <Link to={`user-profile/${user?._id}`} className='hidden md:block'>  
        {/* we need to provide the link to user profile, it is ${user?._id} because every user is different */}
          <img src={user.image} alt='user' className='w-14 h-12 rounded-lg' />
        </Link>
        <Link to='/create-pin' className="bg-black text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center"> 
        {/* this will lead to create-pin */}
          <IoMdAdd />
        </Link>
      </div>
    </div>
  )
}

export default Navbar
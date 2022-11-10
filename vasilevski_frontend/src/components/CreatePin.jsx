import React, {useState} from 'react'
import {AiOutlineCloudUpload} from 'react-icons/ai'
import {MdDelete} from 'react-icons/md'
import {useNavigate} from 'react-router-dom'

import {client} from '../client'
import Spinner from './Spinner'
import { categories } from '../utils/data'



const CreatePin = ({user}) => {

  const [title, setTitle] = useState('')

  const [about, setAbout] = useState('')

  const [destination, setDestination] = useState('')

  const [loading, setLoading] = useState(false)

  const [fields, setFields] = useState(false)

  const [category, setCategory] = useState(null)

  const [imageAsset, setImageAsset] = useState(null)

  const [wrongImageType, setWrongImageType] = useState(false)

  const navigate = useNavigate()


  const uploadImage = (e) => {
    //A function that accepts parameter e-event
    const {type, name} = e.target.files[0] //DESTRUCTURED
    //Through the input of type file you get the selected file like this
    if(type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff')
    //We check the type of selected file, and now we cover all image formats
    {
      setWrongImageType(false)
      //Then we set wrong image type to false, this means, that we uploaded specific type
      setLoading(true)

      client.assets
      //If we do have correct image type then we want to go into sanity client (client.assets)
      .upload('image', e.target.files[0], {contentType: type , filename: name}) //This is an object (contentType, filename)
      //.upload method has 3 parameters (hover on it to see)
      .then ((document) => {
        setImageAsset(document)
        setLoading(false)
        //We also have to get the file name, by getting the document back, and setImageAsset to document, loading is then false
      })
      .catch((error) => {
        console.log('Image upload error', error)
        //We call .catch if there is an error, if we upload correct image types, we shouldnt se any error
      })
    } else {
      setWrongImageType(true)
    }
    //In other case we set wrong image type to true
  }
  
  const savePin = () => {
    if(title && about && destination && imageAsset?._id) {
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
          _type: 'reference',
          _ref: imageAsset?._id
          }
          //Image is an object. The reason why we do this is because images are stored as assets, somewhere else on sanity system, so we are referencing that image (_ref: imageAsset?._id) and we are connecting it with our document
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id
        },
        category, 
      }

      client.create(doc)
        .then (() => {
          navigate('/')
        })
        //With client.create we pass on the document, and we create .then, once we create document, we navigate back to the home page (/)
    } else {
      setFields(true)
      setTimeout(() => setFields(false), 2000)
      //If all of the fields are not set then we type ELSE, and in else we setFields (so we can type) and setTimeout (in miliseconds, and setFields back to false after 2 seconds)
    }
  //If title, about, destination, image asset has the id, and category exsist, we need to take this fields and form a document (if key and the value are named the same you dont have to write title:title,)
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please fill in all the fields.</p>
      )}
      {/* If there are fields, then we want to render an error message, which is going to be a paragraph */}
      <div className=" flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5  w-full">
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>
            {loading && <Spinner />}
            {/* If we are currently loading, in that case we want to show a spinner component */}
            {wrongImageType && <p>Wrong image type</p>}
            {/* If we have wrong image type, we want to show paragraph */}
            {!imageAsset ? (
              <label>
                <div className='flex flex-col items-center justify-center h-full'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold text-2xl'>
                      <AiOutlineCloudUpload />
                    </p>
                    <p className='text-lg'>Click to upload</p>
                  </div>
                  <p className='mt-32 text-gray-400'>
                    Use high-quality JPG, SVG, PNG, GIF less than 20 MB
                  </p>
                </div>
                <input
                  type='file'
                  name='upload-image'
                  onChange={uploadImage}
                  className='w-0 h-0'
                />
              </label>
            //If there is no image asset currently entered, we want to show a field to input that image   
            ) : (
              <div className='relative h-full'>
                <img src={imageAsset?.url} alt='uploaded-pic' className='h-full w-full'/>
                <button
                  type='button'
                  className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                  onClick={() => setImageAsset(null)}
                  //If we click on that image we get a callback function that will setImageAsset back to null, meaning we can upload another pic if we click there
                >
                  <MdDelete />
                </button>
              </div>
              //We want to show the image we uploaded
            )}
            
          </div>
        </div>

        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
          <input 
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            //Callback function where we get the event, and we want to call setTitle
            placeholder="Add your title here"
            className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2'
          />
          {user && (
            <div className='flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg'>
              <img 
              src={user.image}
              className="w-10 h-10 rounded-full"
              alt='user-profile'
              />
              <p className='font-bold'>{user.userName}</p>
              {/* If we have access to the user object in that case we want to show user image */}
            </div>
          )}
          <input 
            type='text'
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            //Callback function where we get the event, and we want to call setTitle
            placeholder="What is your pin about"
            className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
          />
          <input 
            type='text'
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            //Callback function where we get the event, and we want to call setTitle
            placeholder="Add a destination link"
            className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
          />

          <div className='flex flex-col'>
            <div className='mb-2 font-semibold text-lg sm:text-xl'>
              <p>Choose Pin Category</p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                //Callback function where we get the event, and we want to call setCategory
                className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'
              >
                <option value="other" className='bg-white'>Select Category</option>

                {categories.map((category) =>(
                  <option className='text-base border-0 outline-none capitalize bg-white text-black' value={category.name}>{category.name}</option>
                ))}
                {/* Option with a value other, and we map our categories there */}
              </select>
            </div>

            <div className='flex justify-end items-end mt-5 '>
              <button
                type='button'
                onClick={savePin}
                className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-non'
              >
                Save Pin
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default CreatePin
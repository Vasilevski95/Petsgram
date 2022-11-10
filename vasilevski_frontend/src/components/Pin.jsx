import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { client, urlFor } from '../client';

const Pin = ({ pin }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  const navigate = useNavigate();

  const { postedBy, image, _id, destination } = pin;

  const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

  //This gives us acces to a user info
  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload();
      });
  };

  let alreadySaved = pin?.save?.filter((item) => item?.postedBy?._id === user?.googleId);

  //We loop over the saved posts and his google id is already there in the people who liked post
  //We must wrap everything in parentheses, and then .length
  //On the bottom of this code you have explanation
  //To implement the logic we have to add !! in the beginning (this will turn our statement return into a boolean value)

  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

  const savePin = (id) => {
    if (alreadySaved?.length === 0) {
      setSavingPost(true);

      client
        .patch(id)
        //we patch the specific id
        .setIfMissing({ save: [] })
        //we can initiate the save array to be the empty array
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          //this generates unique id
          userId: user?.googleId,
          //we have user id of the person who liked the post
          postedBy: {
            _type: 'postedBy',
            _ref: user?.googleId,
          },
          //postedBy - meaning who liked the post
          //we want to insert, after and 'save[-1]' - at the end
        }])
        .commit()
        //since commit returns a promise, we can call .then
        .then(() => {
          window.location.reload();
          setSavingPost(false);
          //with this we reload our window
        });
    }
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        // on mouse property, in there we call callback function, it sets the state of setPostHovered, if its hovered than its true. (Other properties have the same logic)
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        // If the user clicks, we want to navigate to pin-detail
        className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
          {image && (
        <img className="rounded-lg w-full " src={(urlFor(image).width(250).url())} alt="user-post" /> )}
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: '100%' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  //This allows us to download specific image
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                    //We do this because if you don't and click on something its going to trigger all other effects, but in this case we just want to download (we dont want to be redirected to image, and with this function its not going to propagate further to the image, just download)
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                ><MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved?.length !== 0 ? (
                <button type="button" className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">
                  {pin?.save?.length}  Saved
                  {/* save?.length - we want to know how many people saved */}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {pin?.save?.length}   {savingPost ? 'Saving' : 'Save'}
                </button>
                
              )}
              {/* Is it already saved? If it's already saved, in that case we want to show btn (saved), if it's not alreadySaved we wanna show btn (save) */}
            </div>
            <div className=" flex justify-between items-center gap-2 w-full">
              {destination?.slice(8).length > 0 ? (
                <a
                  href={destination}
                  target="_blank"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  rel="noreferrer"
                >
                  {' '}
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 20 ? destination.slice(8, 20) : destination.slice (8)}
                  {/* if link is larger than 20 characters we slice it from 8-20 (from 0-8 is https://), else we slice it from 8 to the end */}
                </a>
              ) : undefined}
              {
              postedBy?._id === user?.googleId && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePin(_id);
                }}
                className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
              >
                <AiTwotoneDelete />
              </button>
              )}
            </div>
            {/* To check whether we have a destination url */}
          </div>
        )}
      </div>
      <Link to={`/user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center">
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user-profile"
          //This will show a profile picture of the user who uploaded the image
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
        {/* This will show who uploaded the image (username) */}
      </Link>
    </div>
    //we get whole data about images
    //src - sanity way of fetching the images, and the image will be optimized for this specific width
    //urlFor - is a small utility function we created once we connected to sanity client, and this image will be coming from a pin, we are passing the pin through props and we can destructure few things out of it (:)
  );
};

export default Pin;

/*Example how filter function works
Lets say usersId is 1, and the array of people who already like the post are [2,3,1]
1 [2,3,1] -> So if we apply the filter and we search for item.postedBy._id === user.googleId -> this filter will return an array of just those who like it [1]
After that we apply .length -> [1].length -> 1
If we have false case for example 
4 [2,3,1] -> [4].length -> [] is an empty array and the answer is 0
So now we have:
1 [2,3,1] -> [1].length -> 1 -> !1 - negative of 1 is false, !false negative of false -> true  (1 coresponds to true)
4 [2,3,1] -> [].length -> 0 -> !0 - negative of 0 is true, !true negative of true -> false (0 coresponds to false)
*/

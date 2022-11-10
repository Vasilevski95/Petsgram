import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  //We access the pin detail component with this hook using react-router-dom, if you go back to pins you can see that we use pinId is set as dynamic parameter, and right here you can fetch it by using useParams

  const [pins, setPins] = useState();

  const [pinDetail, setPinDetail] = useState();

  const [comment, setComment] = useState('');

  const [addingComment, setAddingComment] = useState(false);


  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPinDetail(data[0]);
        
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);
          client.fetch(query1).then((res) => {
            setPins(res);
          });
          //If data exists in that case we fetch even more details about that pin (we change const to let), because now we call it with the actual data we received
          //And client.fetch with the new query, and .then where we get the response and when we get it, we want to setPins to be equal to that response 
        }
      });
    }
    //If we do have query we then call client.fetch and we pass that query, then we get the data, if that is succesfull we setPinDetail to be equal to (data[0]), because this by default returns an array of pins
  };
  //Function that fetches all pin details from sanity

  //(GLOBAL EXPLANATION: THE WAY THIS WORKS, WE ARE FIRST GETTING ONE INDIVIDUAL PIN, AND WE ARE SETTING IT TO PIN DETAIL, BUT THEN LATER ON, WE WANT TO GET ALL RELATED PINS TO THAT PIN, THESE ARE SIMILAR PINS, MAYBE SIMIRAL TITLE, BUT GENERALY THAT HAS THE SAME CATEGORY AS OUR OWN CURRENT PIN. SO THIS IS USED FOR RECOMMENDATIONS OF OTHER SIMILAR PINS)

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  };

  //If there is comment you set adding to true, and if we have a comment we call sanity client. We use patch method, because we patch a specific pin, and if we dont have any comments already, we setIfMissing comments to an empty array

  if (!pinDetail) {
    return (
      <Spinner message="Showing pin" />
    );
  }
  //If no pinDetail (if it hasn't been fetched yet) we return spinner with a message


  return (
    <>
      {pinDetail && (
        <div className="flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
          <div className="flex justify-center items-center md:items-start flex-initial">
            <img
              className="rounded-t-3xl rounded-b-lg"
              src={(pinDetail?.image && urlFor(pinDetail?.image).url())}
              //If there is a pinDetail image, we want to call utility function
              alt="user-post"
            />
          </div>
          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <a
                  href={`${pinDetail.image.asset.url}?dl=`}
                  //This allows us to download specific image
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                    //We do this because if you don't and click on something its going to trigger all other effects, but in this case we just want to download (we dont want to be redirected to image, and with this function its not going to propagate further to the image, just download)
                  }}
                  className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                {pinDetail.destination?.slice(8, 35)}
              </a>
            </div>
            <div>
              <h1 className="text-4xl font-bold break-words mt-3">
                {pinDetail.title}
              </h1>
              <p className="mt-3">{pinDetail.about}</p>
            </div>
            <Link to={`/user-profile/${pinDetail?.postedBy._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
              <img src={pinDetail?.postedBy.image} className="w-10 h-10 rounded-full" alt="user-profile" />
              <p className="font-bold">{pinDetail?.postedBy.userName}</p>
              {/* This will show who uploaded the image (username) */}
            </Link>
            <h2 className="mt-5 text-2xl">Comments</h2>
            <div className="max-h-370 overflow-y-auto">
              {pinDetail?.comments?.map((item) => (
                //(WE PUT QUESTION MARKS BECAUSE SOME OF OUR PINS WONT HAVE COMMENTS IN THE FIRST PLACE, when you are not sure if an object has some properties use (?))
                //We loop over our comments, by maping, we get an individual comment, and then for each comment we render a div, we also have index item coming from out loop
                <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={item.comment}>
                  <img
                    src={item.postedBy?.image}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                    //This will show a profile picture of the user who uploaded the image
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{item.postedBy?.userName}</p>
                    <p>{item.comment}</p>
                    {/* We just pass props, by who it is posted by, and what is the comment */}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user._id}`}>
                <img src={user.image} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
                {/* This will show a profile picture of the user who uploaded the image */}
              </Link>
              {/* Link to the user profile who posted this specific pin */}
              {/* We need to add pinDetail.postedBy to pass that specific prop */}  
              <input
                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? 'Posting...' : 'Posted'}
                 {/* If we are adding a comment we can say 'Posting...' :(or) 'Posted' */}
              </button>
            </div>
          </div>
        </div>
      )}
      {pins?.length > 0 && (
        //This is a ternary! If pins are more than 0, its going to say 'more like this'
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} />
        //To show pins we have to call masonry layout component and pass the prop pins
      ) : (
        //Else, if we dont have any pins we show message
        <Spinner message="Loading more pins" />
      )}
    </>
    //If we have last div somewhere else, not at the end like in this case, we have to wrap everything with <> </>
  );
};

export default PinDetail;
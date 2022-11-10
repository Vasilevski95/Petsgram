export const categories = [
  {
    name: "Cats",
    image:
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    name: "Dogs",
    image:
      "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80",
  },
  {
    name: "Birds",
    image:
      "https://images.unsplash.com/photo-1612024782955-49fae79e42bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    name: "Rabbits",
    image:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    name: "Horses",
    image:
      "https://images.unsplash.com/photo-1603989888581-3115416784fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=675&q=80",
  },
  {
    name: "Ferrets",
    image:
      "https://images.unsplash.com/photo-1615087240969-eeff2fa558f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
  },
  {
    name: "Fishes",
    image:
      "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=712&q=80",
  },
  {
    name: "Hamsters",
    image:
      "https://images.unsplash.com/photo-1512483652399-7a1f99aa0dd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80",
  },
  {
    name: "Others",
    image: "https://images.unsplash.com/photo-1497005367839-6e852de72767?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1167&q=80"
  }
];

export const userQuery = (userId) => {
  const query = `*[_type == 'user' && _id == '${userId}']`;

  return query;
};
//We create query for user data

export const searchQuery = (searchTerm) => {
  const query = `*[_type == 'pin' && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
        image {
            asset -> {
                url
            }
        },
        _id,
        destination,
        postedBy -> {
            _id,
            userName,
            image
        },
        save[] {
            _key,
            postedBy -> {
                _id,
                userName,
                image
            },
        },
    }`;
  return query;
};

//We create query for search query (GROQ)
//(*) represents every document in your dataset
//It's going to search through title, category and about

export const feedQuery = `*[_type == 'pin'] | order(_createdAt desc) {
    image {
        asset -> {
            url
        }
    },
    _id,
    destination,
    postedBy -> {
        _id,
        userName,
        image
    },
    save[] {
        _key,
        postedBy -> {
            _id,
            userName,
            image
        },
    },
}`;

//We create a new query to get all the posts from the feed, it's not a function because we dont need any specific parameters, it's just query itself, in {} we specify what data do we need from all pins that we get

export const pinDetailQuery = (pinId) => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
        image{
            asset->{
            url
            }
        },
        _id,
        title, 
        about,
        category,
        destination,
        postedBy->{
            _id,
            userName,
            image
        },
        save[]{
            postedBy->{
            _id,
            userName,
            image
        },
        },
        comments[]{
            comment,
            _key,
            postedBy->{
            _id,
            userName,
            image
            },
        }
    }`;
  return query;
};

export const pinDetailMorePinQuery = (pin) => {
  const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]{
        image{
            asset->{
            url
        }
        },
        _id,
        destination,
        postedBy->{
            _id,
            userName,
            image
        },
        save[]{
            _key,
            postedBy->{
            _id,
            userName,
            image
            },
        },
        }`;
  return query;
};

export const userCreatedPinsQuery = (userId) => {
  const query = `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc){
    image{
    asset->{
        url
    }
    },
    _id,
    destination,
    postedBy->{
    _id,
    userName,
    image
    },
    save[]{
    postedBy->{
        _id,
        userName,
        image
    },
    },
}`;
  return query;
};

export const userSavedPinsQuery = (userId) => {
  const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
      image{
        asset->{
          url
        }
      },
      _id,
      destination,
      postedBy->{
        _id,
        userName,
        image
      },
      save[]{
        postedBy->{
          _id,
          userName,
          image
        },
      },
    }`;
  return query;
};

db.movies.aggregate([ 
  { $match: { awards: { $regex: /^Won/i } } }, 
  { $match: { awards: { $regex: /Oscar/i } } }, 
  { $project : { "awards":1, title:1, _id:0, "imdb.rating":1 } },
  {
    $group:
    {
      _id: null,
      maxVotes: { $max: "$imdb.rating" },
      minVotes: { $min: "$imdb.rating" },
      average_rating: { $avg: "$imdb.rating" },
      stdDevSamp: { $stdDevSamp: "$imdb.rating" },
      stdDevPop: { $stdDevPop: "$imdb.rating" },
    }
  },
]).pretty()

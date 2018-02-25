```
db.movies.aggregate([
{ $project : {_id:0, cast:1, "imdb.rating":1} },
{ $unwind: "$cast" },
{
  $group: {
    _id: "$cast",
    average: { $avg: "$imdb.rating" },
    numFilms: { $sum: 1 }
  }
},
{ $sort: {numFilms: -1} },
])

{ "_id" : "John Wayne", "average" : 6.424299065420561, "numFilms" : 107 }
{ "_id" : "G�rard Depardieu", "average" : 6.468478260869565, "numFilms" : 93 }
{ "_id" : "Michael Caine", "average" : 6.506024096385542, "numFilms" : 84 }
{ "_id" : "Christopher Lee", "average" : 6.134146341463414, "numFilms" : 82 }
{ "_id" : "Robert De Niro", "average" : 6.693150684931507, "numFilms" : 79 }
{ "_id" : "Jackie Chan", "average" : 6.352112676056338, "numFilms" : 75 }
{ "_id" : "James Mason", "average" : 6.75, "numFilms" : 70 }
{ "_id" : "Nicolas Cage", "average" : 6.09516129032258, "numFilms" : 68 }
{ "_id" : "Bette Davis", "average" : 7.310294117647059, "numFilms" : 68 }
{ "_id" : "Gene Hackman", "average" : 6.518461538461538, "numFilms" : 65 }
{ "_id" : "Anthony Quinn", "average" : 6.746031746031746, "numFilms" : 63 }
{ "_id" : "Susan Sarandon", "average" : 6.4896551724137925, "numFilms" : 62 }
{ "_id" : "Samuel L. Jackson", "average" : 6.315789473684211, "numFilms" : 62 }
{ "_id" : "Vincent Price", "average" : 6.725806451612903, "numFilms" : 62 }
{ "_id" : "Harvey Keitel", "average" : 6.350819672131147, "numFilms" : 62 }
{ "_id" : "Lionel Barrymore", "average" : 6.7918032786885245, "numFilms" : 61 }
{ "_id" : "Donald Sutherland", "average" : 6.33, "numFilms" : 61 }
{ "_id" : "Humphrey Bogart", "average" : 7.181666666666667, "numFilms" : 60 }
{ "_id" : "James Stewart", "average" : 7.131666666666666, "numFilms" : 60 }
{ "_id" : "Kirk Douglas", "average" : 6.725, "numFilms" : 60 }
```

---

```
db.movies.aggregate([
{ $project : {_id:0, cast:1, "imdb.rating":1} },
{ $unwind: "$cast" },
{
  $group: {
    _id: "$cast",
    average: { $avg: "$imdb.rating" },
    numFilms: { $sum: 1 }
  }
},
{ $sort: {numFilms: -1} },
{ $project: { _id: 1,numFilms:1,
              average: { 
                          $divide: [
                                    { $subtract: [ 
                                                  {$multiply: ["$average", 10] } , 
                                                  {$mod: [{$multiply: ["$average", 10] }, 1 ] } 
                                                  ]
                                    }, 
                                    10
                                    ]
                          } 
            } 
}
])

{ "_id" : "John Wayne", "numFilms" : 107, "average" : 6.4 }
{ "_id" : "G�rard Depardieu", "numFilms" : 93, "average" : 6.4 }
{ "_id" : "Michael Caine", "numFilms" : 84, "average" : 6.5 }
{ "_id" : "Christopher Lee", "numFilms" : 82, "average" : 6.1 }
{ "_id" : "Robert De Niro", "numFilms" : 79, "average" : 6.6 }
{ "_id" : "Jackie Chan", "numFilms" : 75, "average" : 6.3 }
{ "_id" : "James Mason", "numFilms" : 70, "average" : 6.7 }
{ "_id" : "Nicolas Cage", "numFilms" : 68, "average" : 6 }
{ "_id" : "Bette Davis", "numFilms" : 68, "average" : 7.3 }
{ "_id" : "Gene Hackman", "numFilms" : 65, "average" : 6.5 }
{ "_id" : "Anthony Quinn", "numFilms" : 63, "average" : 6.7 }
{ "_id" : "Susan Sarandon", "numFilms" : 62, "average" : 6.4 }
{ "_id" : "Samuel L. Jackson", "numFilms" : 62, "average" : 6.3 }
{ "_id" : "Vincent Price", "numFilms" : 62, "average" : 6.7 }
{ "_id" : "Harvey Keitel", "numFilms" : 62, "average" : 6.3 }
{ "_id" : "Lionel Barrymore", "numFilms" : 61, "average" : 6.7 }
{ "_id" : "Donald Sutherland", "numFilms" : 61, "average" : 6.3 }
{ "_id" : "Humphrey Bogart", "numFilms" : 60, "average" : 7.1 }
{ "_id" : "James Stewart", "numFilms" : 60, "average" : 7.1 }
{ "_id" : "Kirk Douglas", "numFilms" : 60, "average" : 6.7 }
```

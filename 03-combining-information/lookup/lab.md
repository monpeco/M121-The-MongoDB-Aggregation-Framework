```
db.air_alliances.aggregate([
{
  $lookup: {
    from: "air_routes",
    localField: "airlines",
    foreignField: "airline.name",
    as: "airlines__",
  }
},
{ $project: { _id:0, name:1, airplane: "$airlines__.airplane"  } },
{ $unwind: "$airplane" },
{ $match :  
    { $and: [ { airplane: { $in: [ /747/, /380/ ] } } ] }
},
{
  $group : {
   _id :  "$name",
   count: { $sum: 1 }
  }
},
]).pretty()

{ "_id" : "SkyTeam", "count" : 16 }
{ "_id" : "Star Alliance", "count" : 11 }
{ "_id" : "OneWorld", "count" : 11 }
```
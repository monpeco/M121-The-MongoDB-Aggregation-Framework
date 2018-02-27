var cursor = db.air_alliances.aggregate([
{
  $lookup: {
    from: "air_routes",
    localField: "airlines",
    foreignField: "airline.name",
    as: "airlines__",
  }
},
{ $project: { _id:0  } },
]);

while(cursor.hasNext()){
    printjson(cursor.next());
}
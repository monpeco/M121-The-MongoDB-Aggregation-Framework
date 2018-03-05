var cursor = db.air_routes.aggregate([
{ $match: {"src_airport": { $in: ["JFK", "LHR"] }, "dst_airport": { $in: ["JFK", "LHR"] }}},
{ $project: {name:1, airlineName: "$airline.name", src_airport:1, dst_airport:1} },
])
while(cursor.hasNext()){
    printjson(cursor.next());
}
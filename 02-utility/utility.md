### m121 $addFields

https://youtu.be/yo4N7P5n-io

The `$addFields`

Is similar to `$project`
* `$addFields` only allow us to modify the incoming pipelines with new computed fields or to modify existing fields
* In `$project`, once we perform a transformation or retain a field the we must specify all fields we wish to retain (this can become tedious)

**Lets perform a transformation**

```
db.solarSystem.aggregate([
{
  $project: { gravity: "$gravity.value" }
}
]).pretty()
{ "_id" : ObjectId("5543654645456454"), "gravity" : 9.8 }
```


**Lets remove _id and add name**

```
db.solarSystem.aggregate([
{
  $project: { _id:0, gravity: "$gravity.value", name:1 }
}
]).pretty()
{ "gravity" : 9.8, "name" : "Earth" }
```

**Now we want to retain other fields**
```
db.solarSystem.aggregate([
{
  $project: { 
    _id:0, 
    gravity: "$gravity.value", 
    name:1,
    meanTemperature:1,
    density:1,
    mass: "$mass.value",
    radius: "$radius.value",
    sma: "$sma.value"
  }
}
]).pretty()

{
  "name" : "Earth",
  "meanTemperature" : 15,
  "gravity" : 9.8,
  "mass" : 5.9723e+24,
  "raduis" : 6378.137,
  "sma" : 149600000
 }
```

**If we use $addFields**

```
db.solarSystem.aggregate([
{
  $addFields: { 
    gravity: "$gravity.value", 
    mass: "$mass.value",
    radius: "$radius.value",
    sma: "$sma.value"
  }
}
]).pretty()

{
  "_id" : ObjectId("5543654645456454"),
  "name" : "Earth",
  "type" : "Terrestrial plane",
  "orderFromSun" : 3,
  "meanTemperature" : 15,
  "gravity" : 9.8,
  "mass" : 5.9723e+24,
  "raduis" : 6378.137,
  "sma" : 149600000,
  "orbitalPeriod" : { "value":1, "units":"years" },
 }
```

**In this way, we remove unwanted fields at begining, and add new fiels in every stage (without the need of select all over again)**

```
db.solarSystem.aggregate([
  $project: { 
    _id:0, 
    name:1,
    gravity : 1,
    mass: 1,
    raduis: 1,
    sma: 1
  },
  {
    $addFields: { 
      gravity: "$gravity.value", 
      mass: "$mass.value",
      radius: "$radius.value",
      sma: "$sma.value"
    }
  }
]).pretty()
```

let's now discuss another transformative
stage add fields add fields is extremely
similar to project with one key
difference as the name implies add
fields adds fields to a document while
with project we can selectively remove
and retain fields add fields only allows
you to modify the incoming pipeline
documents with new computed fields or to
modify existing fields oftentimes we
will want to derive a new field or
change existing fields and the
requirement and project that once we'll
perform a transformation or retain a
field then we must specify all fields we
wish to retain can become tedious let's
look at an example first we'll look at
project let's just extract the data from
the gravity value field and brief centre
to the top-level gravity field as
expected we get the results back with
the underscore ID field and the gravity
field we just calculated now let's
remove the underscore ID field and add
the name field for easier reference
alright this is pretty good but what if
we also want to keep the temperature
density mass radius and SMA fields as we
can see in order to keep the information
we want we had to be explicit specifying
which fields to retain along with
performing our transformations as said
this can become tedious incomes add
fields if we substitute add fields for
project and execute the following
pipeline we can see that we indeed
perform the desired transformations
however we do not remove any fields from
the original document instead we append
new transformation fields to the
document ok one last example by
combining project with add fields we
remove the annoyance of explicitly
needing to remove or retain fields in
this example with project we're
selecting the fields that we wish to
retain and in add fields we are
performing a transformation on those
pre-selected fields
there's no need to go one by one and
remover retained fields while performing
our transformations this is a style
choice and can prevent having to
repeatedly specify which fields to
retain in larger pipelines when
performing many various calculations
let's see it in action as we can see we
were attained the specified fields and
performed the specified transformation

---

### m121 geoNear

https://youtu.be/N-sXnY_tfYU

`$geoNeo`

* Work with GeoJSON data
* Is the aggregation framework solution to perform geoqueries within the aggregation pipeline.
* Within a pipeline `$geoNeo` must be the first stage on the pipeline.
* We cannot use the `$near` predicate in the `query` field, though it wouldn't really make much sense to do so.
* So, if we already hace `$near` operator available for `find` operations, whay do we need an aggregation framework stage like `$geoNeo`?
* `$geoNeo` can be used in charted collections, whereas `$near` can't.
* Any query using `$near` can not use other special indexes, like `$text`, for example.
* `$geoNeo` requieres that the collection we are preforming our aggregations on to have one and only one goeindex.

```
$geoNear: {
  near : <required, the location to search near>,
  distanceField : <required, field to insert in returned documents>,
  minDistance : <optional, in meters>,
  maxDistance : <optional, in meters>,
  query : <optional, allows querying source documents>,
  includeLocs : <optional, used to identify which location was used>,
  limit : <optional, the maximum number of documents to return>,
  num : <optional, same as limit>,
  spherical : <required, required to signal whether using a 2dphere index>,
  distanceMultiplier : <optional, the factor to multiply all distances>
}
```

**Look for locations near MongoDB Headquarters in NYC**
```
db.nycFacilities.aggregate([
{
  $geoNear: {
    near: {
      type: "Point",
      coordinates: [-73.9876, 40.7573]
    },
    distanceField: "distanceFromMongoDB",
    spherical: true
  }
}
]).pretty()

{
  "_id" : ObjectId("5543654645456454"),
  "name" : "42nd St Dev/Timessquare",
  "address" : { "number":"582", "street":"7 Avenue" },
  "borough" : "Manhattn",
  ...
  "distanceFromMongoDB" : 163.15988
 }
```

**Look 5 nearest hospital to MongoDB Headquarters**
```
db.nycFacilities.aggregate([
{
  $geoNear: {
    near: {
      type: "Point",
      coordinates: [-73.9876, 40.7573]
    },
    distanceField: "distanceFromMongoDB",
    spherical: true,
    query: { type:"Hospital" },
    limit: 5
  }
}
]).pretty()

{
  "_id" : ObjectId("5543654645456454"),
  "name" : "Belvue hosp Ctr",
  "address" : { "number":"430", "street":"1 Avenue" },
  "borough" : "Manhattn",
  ...
  "distanceFromMongoDB" : 2376.15988
 }
```


**Remember**

* The collection can have one and only one 2dshpere index.
* If using 2dshpere, the distance is returned in meters. If using legacy coordinates, the distance is returned in radians.
* `$geoNear` must be the first stage in an aggregation pipeline.

**Lecture Notes**

[`$geoNear` documentation page.](https://docs.mongodb.com/manual/reference/operator/aggregation/geoNear/)

let's take a break from transformation
for a moment and discuss a useful
utility stage if we work with geo JSON
data geo near geo near is the
aggregation framework solution to
performing geo queries within the
aggregation pipeline within a pipeline
jr. must be the first stage in a
pipeline also of note we cannot use the
dolly near predicate in the query field
there wouldn't really make much sense to
do so so if we already have duller near
operator available for fund operations
why do we need an aggregation stage like
geo near geo near can be used on charted
collections or as dollar near can't
additionally any query using della near
cannot use other special indexes like
dullard text for example one last thing
jr. requires that the collection we're
performing our aggregations on to have
one and only one geo index here is the
structuring arguments for jr. as we can
see it can take a lot of arguments the
only if you're a required required
arguments are near distance field and
spherical near is the point we'd like to
search near results will be ordered from
closest to furthest from this location
distance field is the argument with
supply that will be inserted into return
documents giving us the distance from
the location to the location we
specified in near spherical is the last
required argument specify true if the
index is a 2d sphere otherwise false
during this lesson we'll be using a 2d
sphere index let's go ahead and execute
a jr. aggregation I'm going to search
for locations near the MongoDB
headquarters in New York City here I've
specified my three required arguments
near distance field and spherical
well we got a ton of results so we can
see it works whoever it's not very
useful in its current state let's look
at those optional arguments in greater
detail to learn how to make this
aggregation much more targeted min
distance and max distance specified the
closest and farthest results we want
query allows us to specify conditions
that each document must meet and uses
the same query operator syntax as match
include locks would allow us to show
what location was used in the document
if it has more than one location for our
data set this isn't necessary as each
document only has one location and
remember jr. requires that we have
exactly one 2ds fear index in the
collection limit and num are
functionally identical and are used to
limit the number of documents returned
lastly distance multiplier is used to
convert distance results from radians
into whatever unit we need should we be
using legacy geospatial data so let's
clean up our aggregation and fetch
useful results I'd like to find the five
nearest hospitals to the MongoDB
headquarters
here I'm added the optional query field
has specified that it should be type
Hospital and here I've added the
optional limit field and specified itis
v much better we got the five nearest
places some matched a hospital and we
can see that our distances in meters and
that's it for geo near there's just a
few things to remember the collection
can have one and only one duty sphere
index if using TD sphere the distance of
returned in meters if using legacy
coordinates the distance is returned in
radians and jr. must be the first stage
in an aggregation pipeline


---


```
db.movies.aggregate([
  { $project: { _id:0, title:1, cast : 1, countries: 1,"tomatoes.viewer.rating": 1} },
  { $match : {"tomatoes.viewer.rating" : {$gte : 3} } },
  { $match : { countries: "USA"}} ,
  {
    $addFields: { 
      arr_favs: { $setIntersection: [ "$cast", favorites ] } 
    }
  },
  { $match : {arr_favs : {$ne : null} } },
  { $match : {arr_favs : {$ne : []} } },
  { $addFields: { num_favs: { $size: "$arr_favs" } } },
  { $sort : {num_favs: -1 , "tomatoes.viewer.rating":-1, title:-1}},
        { $skip : 24} ,
        { $limit : 1} 
])  
```
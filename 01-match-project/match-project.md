### m121 $match Filtering Documents Lesson 1.4

https://youtu.be/J3GrISCyK-8

### $match

* Since is an aggregation operator, we must prepen a `$`
* It can be used in multiple time, and virtully every other stage can be used after it.
* Think as a filter, not a find
* It Uses standart MongoDB query operators
* The only limitation are, we can use `$where` operator, and if we use the `$test` operator the `$match` stage must be the first stage of the pipeline.
* If `$match` stage is the first of the pipeline, it can take advantege of indexes
* `$match` does not allow for projection

Example:

```
db.solarSystem.aggregate([
  { $match: { type: { $ne:"Star"} } }
]).pretty()
```

Lets add another stage (to count the planets):

```
db.solarSystem.aggregate([
  { $match: { type: { $ne:"Star"} }},
  { $count: "planets" }
])
```

**Key things to Remember**

* A `$match` stage may contain a `$text` query operator, but it must be the first stage in the pipeline
* `$match` should come early in the aggregation pipeline
* You cannot use `$where` with `$match`
* `$match` uses the same query syntax as find


[`$match` documentation page](https://docs.mongodb.com/manual/reference/operator/aggregation/match/)

Please connect to the class Atlas cluster through the mongo shell. The full command is:


    mongo "mongodb://cluster0-shard-00-00-jxeqq.mongodb.net:27017,cluster0-shard-00-01-jxeqq.mongodb.net:27017,cluster0-shard-00-02-jxeqq.mongodb.net:27017/aggregations?replicaSet=Cluster0-shard-0" --authenticationDatabase admin --ssl -u m121 -p aggregations --norc
    


now that we've discussed the concept of
what pipelines are and have given you an
overview of aggregation and structure
and syntax as time we learn about one of
the most important stages match the
match States is vital to a successful
and performant pipeline he should come
as early as possible and you are free to
use as many match stages as necessary in
your pipeline here is the basic syntax
for mesh since it is an aggregation
operator we've repend a dollar sign to
the name again Manish may be used
multiple times and virtually every other
stage can be used after it with a few
exceptions that we'll cover later in the
course instrumental in understanding
match in the context of an aggregation
pipeline I invite you to think of mantas
filter rather than a find we can figure
the filters in our match stage and as
documents flow in only those that meet
our criteria are passed further in the
pipeline here our match stage will only
let circles and stars through mass use a
standard MongoDB read operation query
syntax we can perform matches based on
comparison logic arrays and much more
the only limitations are we can't use
the dollar wear operator and if we want
to use the dollar test operator the
matched stage must be the first stage in
a pipeline if match is the first stage
it can take advantage of indexes which
increase the speed of our queries again
mat should come early in our pipelines
as a reminder in for reference you can
find a link to this page just below the
video we encourage you to bookmark this
page for future reference here's an
example of mashing use if I ask you the
following aggregation which filters the
solar system collection allowing all the
documents what types that don't equal
star thrill I can see that I get the
results I expected to show that match
eases the MongoDB query syntax unless he
is find to see if we get identical
results the same results let's observe
this another way first let's count the
number of documents what types the don't
equal star it should be 8
now let's see em and documents make it
through our match stage I'm going to use
a utility station in this example called
count that you'll learn about later here
we can see that 8 documents passed
through our aggregation sorry Pluto
lastly mash does not have any mechanism
for projection with find we can do
something like this if we want to
project out the end of score ID field
although this may seem like a limitation
we will soon learn about a powerful
station allows us to do this and much
much more and that's it for match again
we encourage you to think of match as
more of the filter than a find once
documents are in an aggregation pipeline
and we're shaping them with new fields
and new data will be using match heavily
to keep filtering documents out some key
things to remember a match stage may
contain a dollar text query operator but
it must be the first stage in a pipeline
match come early in an aggregation
pipeline you cannot use dollar where
with match and match uses the same query
syntax as find

MongoDB Enterprise Cluster0-shard-0:PRIMARY> load('validateLab1.js');
true
MongoDB Enterprise Cluster0-shard-0:PRIMARY> validateLab1(pipeline)
Answer is 15
MongoDB Enterprise Cluster0-shard-0:PRIMARY> 


---

### m121 project

https://youtu.be/W91hvEKEk2E

* Dont think is the project funcionality available with the `find` query language.
* Not only can we selectively remove and retain fields, we can reassign existing ones and derive entirely new fields.
* Think is like `map` function that applies some transformation among a collection (if `$match` is like a filter method, `$project` is like `map`).

**Basic structure**
db.solarSystem.aggregate([{ $project: {...} }])

**Add one field (and remove _id)**
db.solarSystem.aggregate([{ 
    $project: {_id:0, name:1} 
}])

**Add two fields (and dont remove _id)**
db.solarSystem.aggregate([{ 
    $project: {name:1, gravity:1} 
}])

**Add nested field**
db.solarSystem.aggregate([{ 
    $project: {_id:0, name:1, "gravity.value":1} 
}])
{ "name" : "Sun", "gravity" : { "value" : 274 } }

**Rename a nested field**
db.solarSystem.aggregate([{ 
    $project: {_id:0, name:1, gravity : "$gravity.value"} 
}])
{ "name" : "Sun", "gravity" : 274 }

**Same, but with a new name**
db.solarSystem.aggregate([{ 
    $project: {_id:0, name:1, surfaceGravity : "$gravity.value"} 
}])
{ "name" : "Sun", "surfaceGravity" : 274 }

**How to all $multiply**
{ $multiply : [ gravityRatio, weightOnEarth ] }
{ $multiply : [ gravityRatio, 86 ] }

**How to all $divide**
{ $divide : [ "$gravity.value", gravityOnEarth ] }
{ $divide : [ "$gravity.value", 9.8 ] }

**How to calculate myWeith on every planet (Important!) **
db.solarSystem.aggregate([{
  $project : {
    _id:0,
    name:1,
    myWeight: { $multiply : [ 
                            { $divide: ["$gravity.value", 9.8]} ,
                            86 
                           ] }
  }
}])

{ "name" : "Sun", "myWeight" : 2404.48 }


Things to Remember

* Once we specify one field to retain, we must specify all fields we want to retain. The `_id` fields is the only exception to this.
* Beyond simply removing and retaining fields, `$project` lets us add new fields.
* `$project` can be used as many times as required within an Aggregation pipeline.
* `$project` can be used to reassign values to existing fields name and to derive entirely new fields.

**Lecture Notes**
[`$project` documentation page](https://docs.mongodb.com/manual/reference/operator/aggregation/project/).

the next stage we'll learned about is
project project like match is a vital
stage to thoroughly understand to be
successful with the aggregation
framework please don't think of project
like the projection functionality
available with a find query operator
while it is true project is much much
more not only can we selectively remove
and retain fields we can reassign
existing field values and derive
entirely new fields
a common method or function available in
many programming languages is map it is
a higher-order function that applies
some transformation among a collection
if match is like a filter method project
this like map here is the basic syntax
for project we prepend a dollar sign to
signify that it is an aggregation
operator then open up with a curly brace
and close with the curly brace between
these two braces is where we use
aggregation expressions and perform
field logic more on that soon here is
that we'd specify values to remove and
retain just like the projection
functionality available with the find
query operator this specifies the wish
to remove the underscore ID and retain
the name field notices since we have
specified a value to retain we must
specify each value we wish to retain
let's also keep the gravity field so we
can see some difference in Braille data
and of course an exception here we can
say we're getting the name and the
gravity field but we're also getting the
underscore ID field the undescribed e
field is the only field that we must
explicitly remove all others will be
removed when we specify at least one
field to retain also it looks like
whoever put this data together uses the
International System of Units so let's
also just get the value an error one
thing to keep in mind once we start
diving into documents selecting on
subfields we must surround our arguments
with quotes there the data we wanted
project is already showing to be pretty
useful but so far it appears to be
identical to a projection available with
the fine query operator
let's start exploring what makes project
so powerful instead of returning a sub
document with just the value field lets
directly assign the value to the gravity
field here we can see that we are indeed
reassigned in the gravity field to now
contain the information that was
available at gravity value for
prepending gravity value with a dollar
sign this is one of the many aggregation
expressions and we're directing the
aggregation framework to look for in
fishing the information the document at
gravity dot value or a field path
expression as discussed in the
aggregation structure and syntax lesson
this is one of the ways we reference
documents for information we can also
create a new field called surface
gravity this isn't just renaming in the
gravity field
it's creating an entirely new field very
powerful and we'll be using this
functionality a lot through the course
let's have a bit of fun and use the
aggregation framework to calculate a
value I'd like to see what my weight
would be on each main body in the solar
system I'm going to have to use an
expression to accomplish this we'll
cover expressions in much greater detail
shortly but I'm going to break this down
Sissis our first time seeing it and the
syntax can catch people off-guard I
weigh about 86 kilograms looking at our
previous results it looks like if I
divide the gravity of a body by the
gravity of Earth and then multiply that
value by my weight I can find out how
much I'd weigh on every main body we're
going to have to use an expression to
accomplish this the first expression I'm
going to use is the multiply arithmetic
expression multiplied takes an array of
values and multiplies them together so I
know I need to multiply my weight times
the ratio of a specific planets gravity
divided by the Earth's gravity that will
look something like this I know my
weight is about 86 kilograms so I can
just hard code that for now to calculate
the gravity ratio I'll need to use the
divided arithmetic expression divide
takes an array of two values and divides
the first by the second with in divide
I'll need to reference the information
at the value subfield within gravity
let's see what this would look like here
we're using a field path expression to
refer to information within the document
specifically the information found at
the value field within the gravity field
I know the gravity of Earth is around
9.8 meters per second per second so I'll
just hard code that in so putting it all
together we have the following all of
this is assigned to a new field we
create called my weight awesome we can
see ID weigh about thirty two point five
kilograms on Mars and two thousand four
hundred four kilograms on the Sun for a
beginning to see the power of project
project is a powerful stage of the
aggregation framework not only can we
remove and retain fields we can derive
new fields and reassign existing fields
project may be used as many times as
desired within an aggregation pipeline
and it should be used aggressively to
trim data out of documents that isn't
required in order to keep our pipelines
performant some key things to remember
once we specify one field to retain we
must specify all fields we want to
retain the underscore ID field is the
only exception to this beyond simply
removing and retaining fields project
lets us add new fields project can be
used as many times as required within an
aggregation pipeline and finally project
can be used to reassign values to
existing field names and to derive
entirely new fields
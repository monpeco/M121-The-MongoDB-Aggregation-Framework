### m121 $group stage

https://youtu.be/YLi-_t2iD4A

```
coins : [
  { denomination : 0.01 },
  { denomination : 0.25 },
  { denomination : 0.10 },
  { denomination : 0.05 },
  { denomination : 0.25 },
  ...
]

$group : { _id : "$denomination" }
```

**Using $group**

```
db.movies.aggregate([
  {
    $group: {
      _id : "$year",
      num_films_in_year: { $sum: 1 }
    }
  }
])

{ "_id" : 2019, "num_films_in_year" : 1 }
{ "_id" : 2017, "num_films_in_year" : 42 }
```

**Group based on number of Directos**

```
db.movies.aggregate([
  {
    $group: {
      _id : {
          numDirectors : {
              $cond: [{ $isArray: "$directors" }, { $size: "$directors" }, 0]
          }
      },
      numFilms: { $sum: 1},
      averageMetacritic: { $avg: "$metacritic" }
    }
  },
  { 
    $sort: { "_id.numDirectors":-1 } 
  }
])
```

Documents with the same number of directors will be group together, and all 
documents without directors or with an empty array of directors will be 
group as well.

```
{ "_id" : { "numDirectors" : 44 }, "numFilms" : 1, "averageMetacritic" : null }
{ "_id" : { "numDirectors" : 30 }, "numFilms" : 1, "averageMetacritic" : 53 }
{ "_id" : { "numDirectors" : 26 }, "numFilms" : 1, "averageMetacritic" : 71 }
```

**Count**


```
db.movies.aggregate([
  {
    $group: {
      _id : null,
      count: { $sum: 1 }
    }
  }
])

{ "_id" : null, "count" : 44497 }
```

**Average**

Filter the documents that have metacritic (number greater or equal to 0)

```
db.movies.aggregate([
  { 
    $match: { metacritic: { $gte : 0} } 
  },
  {
    $group: {
      _id : null,
      averageMetacritic: { avg: "$metacritic" }
    }
  }
])

{ "_id" : null, "averageMetacritic" : 44497 }
```


### Sumary

* `_id` is where to specify what incoming documents shoud be grouped on
* Can use all accumulator expressions within `$group`
* `$group` can be used multiple times within a pipeline
* It can be necessary to sanitize incoming data


the next stage we'll learn about is the
dollar group stage key to our
comprehension of group is to understand
the one required argument the underscore
ID field of this stage the expression or
expressions we specify to underscore ID
becomes the criteria the group stage
uses to categorize and bundle documents
together in this picture we're grouping
coins based on their denomination so the
expressions specified the underscore ID
would be the denomination filled path
let's be this in action using real data
alright let's group documents in our
movies collection based on the value
they have in their year filled by
grouping we can see we have
fundamentally changed the structure of
the resulting documents group matched
them based on the value of the year
filled documents with identical values
got bundled together and each unique
value produced an output document that
shows us the values or value we grouped
on by itself this may or may not be
useful depending on the use case and
just grouping on one expression is
functionally equivalent to using the
distincts command let's explore the
other powerful feature of the group
stage the ability to use aggregation
accumulator expressions we could specify
additional fields we want to calculate
in the group stage and as many as we're
required to accomplish our goal here we
are going to group on the value of year
as before we also calculate a new field
called
num films in year using the dollar sum
accumulator expression each time group
categorizes as a document for us this
sum expression gets called since we
specified a value of 1 each matching
document is going to sum 1 to the value
of num films in year let's see it in
action the same results as before with
the addition of the number fill in year
field we can see that there was only one
document with a value 1874 in the year
field while there were 2058 documents
with the value 2014 quite a busy year
let's perform the same aggregation with
the source stage appended to the end to
order our results great
we can start to get an indication that
is a year value increases we have more
documents in our collection this brings
up an important point about the
expression we specify to underscore ID
document values used in the expression
must resolve to the same value or
combination of values a larder for
documents to match let's look at an
example here
we're using the size expression to get
the value of the Directors array I'm
wrapping it in this dollar conn
conditional expression because with the
value was specified a size doesn't
evaluate to an array or as missing signs
will error so if director's is an array
return the size of directorís otherwise
0 as documents flow in this will be
evaluated and documents with the same
number of Directors will be grouped
together all documents without director
information or with an empty array for
directors will be grouped as well we
call the field num directors but could
have given it any name we want it when
documents are grouped together we'll
calculate a field called num films and
just count how many documents match
while also average the Metacritic
information and assign that to a field
called average Metacritic for all the
matching documents in a group again we
could have specified any name freemium
films or average Metacritic lastly would
just sort documents in descending order
let's see it in action Wow a film with
44 directors but the average Metacritic
is null let's explore this by looking at
the document alright
scanning the document we can see that
the Metacritic field is missing entirely
this illustrates an important concept is
crucial to understand the type of data
coming in to properly interpret the
results will calculate and we may be
required to sanitize our input in some
way to calculate result at all
accumulator expressions will ignore
documents with a value at the specified
field that isn't of the type the
expression expects or if the value is
missing if all documents encounter to
have an incorrect data type or a missing
value for the desired field the
expression
will result in known okay we're gaining
and good understanding of how both the
expressions supplied to the underscore
ID field groups documents and how
expressions specified to our
accumulators work but what if we wanted
to group all documents rather than just
a subset by convention we've specified
null or an empty string as the argument
to underscore ID before we run this
pipeline let's set an expectation I
expect the value of count to be equal to
the number of documents in the movies
collection
let's test alright forty-four thousand
four hundred ninety seven and the total
number of documents again forty four
thousand four hundred ninety seven an
exact match rather than duplicating
functionality in a very unwise way let's
do something that is useful for all
documents let's calculate the average
Metacritic rating here we use a math
stage to filter documents out with the
Metacritic that isn't greater than or
equal to zero
documents missing Metacritic information
or with a non numeric value at that
field won't make it through and we can
see the average Metacritic rating among
all documents that had Metacritic
information is around fifty six point
nine three and that covers the group
stage let's summarize undescribed ii is
where we specify what incoming documents
should be grouped on we can use all
accumulator expressions of a thin group
group can be used multiple times within
a pipeline and it may be necessary to
sanitize incoming data

---

### m121 accumulator project

https://youtu.be/iAC3CPW08rk

> Examples missing

let's take a moment to learn about using
accumulator expressions with the project
stage knowledge of how to use these
expressions can greatly simplify our
work one important thing to keep in mind
is that accumulator expressions within
project we're over an array within the
given document they do not carry values
forward to each document encountered
let's suppose we have a collection named
example with the schema if we perform
this aggregation this will be the result
an output document for every input
document with the average of that
documents data field for this lesson
we're going to explore this data set
it's the average monthly low and high
temperature for the United States as
well as monthly ice cream consumer price
index and sales information and here's
what the data looks like in our
collection we can see we have a trends
array with documents that contain all
the information we'll need easy enough
to work with let's go ahead and find the
maximum and minimum values for the
average high temperature we'll explore
two different methods to find the
maximum first we'll use the dollar
reduce expression to manually find the
maximum before I run this let's break it
down here I'm specifying the reduce
expression reduce takes an array as a
simple argument here for the argument to
initial value the value our accumulator
will begin with we're specifying
negative infinity I hope we'll never
have a monthly average high temperature
of negative infinity but in all
seriousness we're using negative
infinity because any reasonable value we
encounter should be greater lastly with
specified the logic to the in field here
this is using the dollar common
conditional operator and saying if
dollar dollar this dot average high
temperature is greater than the value
which is held in our accumulator then
return this dot an average high
temperature otherwise just return the
value back
so compare the current value against the
accumulator value and if it's greater
we're
place it with the value we just
encountered otherwise we'll just keep
using our current max value notice the
devil dollar signs these are temporary
variables is defined for use only within
the dollar reduce expression as we
mentioned in the aggregation structure
and syntax lesson dollar this refers to
the current element in the array dollar
value refers to the accumulator value it
will do this for every element in the
array okay let's run this and we see the
max I was 87 wow that was pretty
complicated let's look at an easier way
to accomplish this I think we can all
agree that this is much simpler we use
the dollar max group accumulator
expression to get the information we
want and again we get max high of 87
okay let's get the minimum average
temperature here we use the dollar min
accumulator expression and we can see
our max low oops 27 all right we now
know how to use Max and min we can also
calculate averages and standard
deviations let's calculate the average
consumer price index for ice cream as
well as the standard deviation here
we're calculating both in one pass for
the average CPI filled with specified
the dollar AVG average expression
telling it to average of the values in
the ice cream CPI field in the trends
array and here the CPI deviation is
calculated almost identically except
we're using the population standard
deviation we're using standard deviation
pop because we're looking at the entire
set of data however as this was only a
sample of our data we'd use the sample
standard deviation expression great we
concede that the average consumer price
index was 221 point to 75 and the
standard deviation was around six point
six three we could use this information
to find data that is outside norms to
point to areas that might need special
analysis the last accumulator expression
I'd like to show is dollar sum
as the name implies some sums up the
values of an array we can see that the
yearly sales were 1601 million and that
covers accumulator expressions available
with them project here are a few things
to keep in mind the available
accumulator expressions in project are
some average max-min standard deviation
population and standard deviation sample
within project these expressions will
not carry their value forward and
operate across multiple documents for
this we need to use the unwind stage and
group accumulator expressions for more
complex calculations as handy to know
how to use dollar reduce and dollar map

---

### m121 unwind

https://youtu.be/LPSfinOVqhw

### $unwind

Example:

```
{
  "title" : "The Martian",
  "genres" : [ "Action", "Adventure", "Sci-Fi" ]
}
```

With `$unwind` will produce

```
{
  "title" : "The Martian",
  "genres" : "Action"
}
{
  "title" : "The Martian",
  "genres" : "Adventure"
}
{
  "title" : "The Martian",
  "genres" : "Sci-Fi"
}
```

In this example:

```
{
  "title" : "Batman Begins",
  "likes" : [ "Action", "Adventure" ]
}
```

With `$unwind` will produce

```
{
  "title" : "Batman Begins",
  "likes" : "Action"
}

{
  "title" : "Batman Begins",
  "likes" : "Adventure"
}
```

In the group example, if we would try this:
```
$group : {
  _id : {
    title: "$title",
    genre: "$genre",
  }
}
```

Will produce

```
{                                      {
  "title" : "Star Trek",                 "title" : "Star Trek",
  "genre" : [                            "genre" : [ 
    "Adventure",              <>           "Action", 
    "Action"                               "Adventure"
  ]                                      ] 
}                                      }

```

Let see a real example:

```
db.movies.aggregate([
{
  $match: {
    "imdb.rating": { $gt: 0 },
    year: { $gte: 2010, $lte: 2015 },
    runtime: { $gte: 90 }
  }
},
]) // 6035 docs
```

```
db.movies.aggregate([
{
  $match: {
    "imdb.rating": { $gt: 0 },
    year: { $gte: 2010, $lte: 2015 },
    runtime: { $gte: 90 }
  }
},
{
  $unwind: "$genres"
}
]) // 12075 docs
```

```
db.movies.aggregate([
{
  $match: {
    "imdb.rating": { $gt: 0 },
    year: { $gte: 2010, $lte: 2015 },
    runtime: { $gte: 90 }
  }
},
{
  $unwind: "$genres"
},
{
  $group: {
    _id: {
      year: "$year",
      genre: "$genres"
    },
    average_rating: { $avg: "$imdb.rating" }
  }
},
{
  $sort: { "_id.year": -1, average_rating: -1 }
}
]) // 134 docs

{ "_id" : { "year" : 2015, "genre" : "Biography" }, "average_rating" : 7.423404255319149 }
{ "_id" : { "year" : 2015, "genre" : "News" }, "average_rating" : 7.4 }
{ "_id" : { "year" : 2015, "genre" : "Documentary" }, "average_rating" : 7.387012987012986 }
{ "_id" : { "year" : 2015, "genre" : "Animation" }, "average_rating" : 7.107692307692308 }
{ "_id" : { "year" : 2015, "genre" : "Music" }, "average_rating" : 7.015000000000001 }
{ "_id" : { "year" : 2015, "genre" : "Sport" }, "average_rating" : 6.94 }
...

```

We just want a single doc per year, with the highest rating genre:

```
db.movies.aggregate([
{
  $match: {
    "imdb.rating": { $gt: 0 },
    year: { $gte: 2010, $lte: 2015 },
    runtime: { $gte: 90 }
  }
},
{
  $unwind: "$genres"
},
{
  $group: {
    _id: {
      year: "$year",
      genre: "$genres"
    },
    average_rating: { $avg: "$imdb.rating" }
  }
},
{
  $sort: { "_id.year": -1, average_rating: -1 }
},
{
  $group: {
    _id: "$_id.year",
    genre: { $first: "$_id.genre" },
    average_rating: { $first: "$average_rating" },
  }
}
]) // 6 docs

{ "_id" : 2010, "genre" : "News", "average_rating" : 7.65 }
{ "_id" : 2011, "genre" : "Documentary", "average_rating" : 7.262857142857143 }
{ "_id" : 2015, "genre" : "Biography", "average_rating" : 7.423404255319149 }
{ "_id" : 2014, "genre" : "Documentary", "average_rating" : 7.212587412587413 }
{ "_id" : 2013, "genre" : "Documentary", "average_rating" : 7.158196721311475 }
{ "_id" : 2012, "genre" : "Talk-Show", "average_rating" : 8.2 }

```

```
db.movies.aggregate([
{
  $match: {
    "imdb.rating": { $gt: 0 },
    year: { $gte: 2010, $lte: 2015 },
    runtime: { $gte: 90 }
  }
},
{
  $unwind: "$genres"
},
{
  $group: {
    _id: {
      year: "$year",
      genre: "$genres"
    },
    average_rating: { $avg: "$imdb.rating" }
  }
},
{
  $sort: { "_id.year": -1, average_rating: -1 }
},
{
  $group: {
    _id: "$_id.year",
    genre: { $first: "$_id.genre" },
    average_rating: { $first: "$average_rating" },
  }
},
{
  $sort: { _id: -1}
}
]) // 6 docs

{ "_id" : 2015, "genre" : "Biography", "average_rating" : 7.423404255319149 }
{ "_id" : 2014, "genre" : "Documentary", "average_rating" : 7.212587412587413 }
{ "_id" : 2013, "genre" : "Documentary", "average_rating" : 7.158196721311475 }
{ "_id" : 2012, "genre" : "Talk-Show", "average_rating" : 8.2 }
{ "_id" : 2011, "genre" : "Documentary", "average_rating" : 7.262857142857143 }
{ "_id" : 2010, "genre" : "News", "average_rating" : 7.65 }

```

**Short form**

    $unwind: <field path>
    
**Long form**

    $unwind: {
      path: <field path>,
      includeArrayIndex: <string>,
      preserveNullAndEmptyArrays: <boolean>  //Null, missing or empty array
    }
    
    
**Highlights**

* $unwind only works on array values
* There are two forms for `$unwind`, short form and long form
* Using `$unwind` on large collections with big documents may lead to performance issues



let's learn about another useful
aggregation stage the dollar on one
stage dollar and wine lists unwanted an
array field creating a new document for
every entry where the field value is now
each entry let's visualize this with an
example if I had the following scheme on
the Left title and genres and unlined
on the genres field I'll get back
documents on the right what am I saying
that I'm generating and document for
each array entry when it was all tight
and well embedded why might this be
useful one example is when we'd like to
group on individual entries in the grip
lesson we grouped movies based on the
year and we tried to group on year and
genres we would have gotten back many
distinct entries because within Group a
razor mashed on pure equality not
equivalents so this array of adventure
action would not match this array of
action-adventure all right
let's use unwind for something real
let's find the most popular genres by
year from 2010 to 2015 with in the
movies collection I'm going to go ahead
and limit this and say that I'm only
considering entries with a runtime of 90
minutes or greater and for popularity
I'll use a value in IMDB rating okay
let's break this down here we begin with
the mash stage ensuring we have an IMDB
rating value by specifying that it must
be greater than zero and filtering
documents based on year and a run time
then we unwind the genres array creating
a new document for each entry in the
original array then we'll group on the
year and then now single value genres
field and use the average expression to
calculate the average rating from IMDB
top rating
finally we sort first on the year
descending and then the average rating
descending let's test it out hmm it's
close but not quite there yet we can see
we're getting the most popular genre by
year but we're getting all results back
we just want a single document
with the highest-rated genre there are
many ways to accomplish this let's look
at one of the most simple okay let's
examine this new pipeline it's identical
to the previous one with the addition of
these two stages the previous pipeline
was returning in the format we wanted
there were just too many documents being
returned here in this additional group
stage group documents together based on
their year as since they're already
sorted in the order we need we just take
the first value we encounter for the
genre and the average rating then we
finished with the sort to make sure that
they're returned in the order we want
let's see if it works excellent one
document per year with the highest rated
genre in that year okay we've seen how
unone works no there's a few less things
to cover we've been using the short form
for unwind here's the long form for
contrast in the long form we specified
the array we want to unwind by providing
a field path expression to the path
argument we can provide a string to
include a ray index this will create an
another field in the document with
whatever name we specify with the value
set to the index of the element in the
original array lastly we can provide a
true or frost volume to resolve noland
empty arrays true we'll create an entry
with an empty array of the value
specified in the path is either null
missing or an empty array one more thing
of note if the documents in our
collection are very large and we need to
use and wined we may exceed the default
memory limit of the aggregation
framework as always naturally retain
only the information needed with project
and remember that we can specify to
allow disk use and that covers unwind
we've learned a lot let's recap on a few
things
unwind only works on an array of values
there are two forms for unwind the
short-form and long-form using unwind on
large collections with big documents may
lead to performing issues

---

### m121 lookup

https://youtu.be/s1KD_Qt7vY4

```
$lookup: {
  from: <collection to join>,     //The collection cannot be sharded and must exists within the same database
  localField: <field from the input documents>,   //The field in the working collection where we express the aggregation command that we want to compare to
  foreignField: <field from the documents of the "from" collection>,    // The field that we want to compare from in the collection we specified in "from"
  as: <output array field>  // The new field that will contains any matches between `localField` and `foreignField`
}
```

* `$lookup` will form a strict equality comparison
* The `as` will overwrite any existents field with that same name
* The result will be an array with the matches, and if there is not matches will return an empty array


Example:

**working documents: air_airlines**
```
{
  name: "Penguin Air",
  country: "Antartica",
  ...
}
{
  name: "Delta Air Lines",
  country: "United States",
  ...
}
{
  name: "Lufthansa",
  country: "Germany",
  ...
}
```

**air_alliances**

```
{
  name: "Star Alliance",
  airlines: ["Lufthansa", ...],
  ...
}
{
  name: "SkyTeam",
  airlines: ["Delta Air Lines", ...],
  ...
}
```

With this parameters:

```
from: "air_alliances"
localField: "name"        // Can be an array or a single value
foreignField: "airlines"  // Can be an array or a single value
as: "alliance"
```

That will produce:

```
{
  name: "Penguin Air",
  country: "Antartica",
  alliance: []
  ...
}
{
  name: "Delta Air Lines",
  country: "United States",
  alliance: [ { name: "SkyTeam", ... } ],
  ...
}
{
  name: "Lufthansa",
  country: "Germany",
  alliance: [ { name: "Star Alliance", ... } ]

  ...
}
```

* Oftentimes after a `$lookup`, we want to follow it a `$match` stage ti filter documents out.
* `$lookup` retrieves the entire document that matched, not just the field we specified (the `foreignField`).

**Lets look the air_alliances collection**

```
{
  "name" : "Star Alliance",
  "airlines": [
    "Air Canada",
    "Adria Airways",
    ...
  ]
}
```

**Lets look the air_airlines collection**

```
{
  "airline" : 4,
  "name": "Lufthansa",
  ...
}
```

**Lets build the pipeline:**

```
db.air_alliances.aggregate([
{
  $lookup: {
    from: "air_airlines",
    localField: "airlines",
    foreignField: "name",
    as: "airlines",
  }
}
])

{
  "name" : "Star Alliance",
  "airlines": [
    {
      name: "Delta Air Lines",
      country: "United States",
      alliance: [ { name: "SkyTeam", ... } ],
      ...
    }
    ...
  ]
}
```

### Sumary

* The `from` collection cannot be sharded.
* The `from` collection must be in the same database.
* The values in `localField` and `foreignField` are matched on equality.
* `as` can be any name, but if it exits in the working document that field will be overwritten.



now it's time we learned about looking a
powerful stage lets you combine
information from two collections for
those with some knowledge of sequel
lookup as effectively a left outer join
if that didn't make any sense don't
worry let's break it down in database
terms a left outer join commands all
documents or entries on the left with
mashing documents or entries from the
right so a left outer join with B would
look like this the lookup stage has this
form the front field here is the
collection from which we want to look up
documents keep in mind the collection
you specify in the from field cannot be
shorted and must exist within the same
database local field here is the field
in the working collection where we
express the aggregation command that we
want to compare to foreign field here is
the field one to compare from in the
collection we specified and from lookup
will form a strict equality comparison
and the as field here is the new field
name we specify that will show up in our
documents that contains any matches
between local field and foreign field
all matches would put in an array in
this field if there were no matches the
field will contain an empty array let's
visualize this in an example suppose
we're aggregating over an airline's
collection and we want to fetch which
Alliance the airline belongs to as the
argument from with specify air alliances
next we would specify name as the
argument to local field the value we
want to compare to the argument to local
field can resolve to either an array or
a single value then with specify
Airlines as the argument to foreign
field the value we want to compare from
the argument foreign field can also
resolve to either an array or a single
volume we can see the based on the
argument so far penguin air won't match
anything Delta Airlines will match
SkyTeam and Lufthansa will match Star
Alliance those matches were brought into
the current document as
Alliance we could have given any string
value we wanted but keep in mind that if
we specify a name that already exists in
the working document that field will be
overridden
notice here that because the document
with name penguin Aaron did not have any
results there is an empty array
oftentimes after a lookup want to follow
with a match stage to filter documents
out another thing to know
lookup retrieves the entire document
that matched not just the field was
specified to form field all right let's
look at lookup in actual use let's
combine information from the air
Airlines collection with the air
alliance's collection putting all the
airline information within the Alliance
document first let's look at the schema
in our Airlines this collection okay
the data we need for a local field is in
the Airlines field let's look at the
airline schema so we know what value to
use as the foreign field alright easy
enough
it looks like the information we need
for foreign field is in the name field
that should be all the information we
need let's build the pipeline alright we
specify air Airlines to the from field
Airlines as the local field name is the
foreign field and here we chose to
overwrite the Airlines field with the
information we get back it makes sense
we'll be replacing the names with entire
documents let's see the output pretty
cool we can see that lookup did just
what we expected it to do we could
follow this with some projections or
even another lookup stage to perform
some powerful reshaping and analysis but
for now that's enough we've covered a
lot of information in this lesson lookup
is a powerful stage that can help reduce
Network requests and combine information
from different collections together for
powerful and deep analysis here are a
few things to keep in mind the from
field cannot be shortened the from
collection must be in the same database
the values in local field and foreign
field are matched on equality and the
ask can be any name but if it exists in
the working document that field will be
overwritten


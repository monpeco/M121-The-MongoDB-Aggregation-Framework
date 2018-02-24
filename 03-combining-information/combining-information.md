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
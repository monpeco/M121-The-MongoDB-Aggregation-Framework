### m201 - Lesson 4.9 Aggregation Performance

https://youtu.be/BlPqPoyWk1k

* Index usage
* Memory Constraints

# Index usage

**Realtime processing**

* Provide data for applications
* Query performance is more important

**Batch processing**

* Provide data for analytics
* Query performance is less important


* Some stages (operator) are able to work with indexes, some other are not
* Once the server encounters a stage that is not able to work with indexes, the rest of the pipeline will not be able to work with indexes
* Fortunetely, the query optimizer will try to move forward a stage that can be moved to use indexes
* To determinate how the aggregation queries are executed, we can pass the ` { explain: true } ` document

***Lets asume***

```
db.orders.createIndex({ cust_id: 1 })
```

```
db.orders.aggregate([
  { $match : { cust_id: "287"} }, // Use indexes, and is specially true if it is at the beginning of the pipeline
  ...
])
```

```
db.orders.aggregate([
  ...
  { $sort: }, // Similarly, allways goint to want to put sort in the front of the pipeline
  ...
])
```

```
db.orders.aggregate([
  ...
  { $limit: }, // We want the limit and the sort be near each other and at the front of the pipeline
  { $sort: },  // When this happens, the server is able to do a top-k sort (allocate mem for the final number of documents)
  ...          // This can happend even without indexes
])
```

optimizations like
this are performed by the query
optimizer whenever possible but there's
a chance that
optimization can change the outputted
results then the **query engine will not
perform this kind of optimization** 


### Memory Constraints

* Result are subject to 16MB document (not apply to the flow through the pipeline)
* The best way to mitigate memory constraints is with `$limit` and `$project`
* Each stage in the pipeline has a limit of 100MB of RAM
  - Use indexes
  - `{allowDiskUse: true}` as last resource
    * `{allowDiskUse: true}` doesn't work with `$graphlookup`



in this lesson we're going to talk about
aggregation performance and specifically
we're going to discuss how we can
utilize indexes when we run aggregation
queries and we're also discussed some of
the memory constraints that apply to
aggregation and MongoDB before we get
into these different topics I first want
to point out that there are two
high-level categories of aggregation
queries first of all there are real time
processing queries and then there are
batch process queries real time is in
quotes here because you can never have
truly real time processing there will
always be some kind of delay between
when a query is executed and what query
response real time processing is so that
we can provide data to applications
this means that performance is more
important a user is going to perform
some kind of action the actions going to
trigger an aggregation query and then
the results of that query need to be
provided back to the user in a
reasonable amount of time with batch
processing on the other hand we're
generally talking about doing
aggregation to provide analytics and
since we're providing analytics that
means that these jobs are typically ran
on some kind of periodic basis and the
results are not expected until minutes
hours or even days later from when that
query was actually ran this means that
query performance is less important than
with real-time processing throughout
this lesson we're going to focus on the
first type real-time processing now some
of these principles will also apply to
the batch processing category but for
the most part will be discussing
strategies to optimize aggregation
performance for real-time processing now
with that out of the way let's go ahead
and discuss the meat of this lesson
index usage for aggregation queries now
as you come to learn in this course
indexes are a viable part of good query
performance and the same idea applies to
a Kuragin queries basically we want to
ensure that our aggregation queries are
able to use indexes as much as possible
now naturally since aggregation is a bit
different than your typical fine query
determining index usage is a bit
different as well with an aggregation
query we form a pipeline a different
aggregation operators which transform
our data into the format that we desire
now some of
aggregation operators are able to use
indexes and some of them are not but
more importantly since data moves
through our pipeline from the first
operator to the last once the server
encounters a stage that is not able to
use indexes all the following stages
will no longer be able to use indexes
either fortunately for us the query
optimizer tries it's best to detect when
a stage can be moved forward so that
indexes can be utilized but if you
understand the underlying principles of
how this works you can be more confident
in your query performance and you'll
have to rely less on the query optimizer
in order for us to determine how
aggregation query czarek executed and
whether or not indexes are being
utilized we can pass the explained true
document as an option to the aggregation
method this will produce an explained
output similar to what your we are used
to seeing with fine now for the rest of
the examples we're gonna be dealing with
this hypothetical orders collection and
we're going to go ahead and assume that
we have an index on customer ID
unsurprisingly the dollar sign match
operator is able to utilize indexes this
is especially true if it's at the
beginning of a pipeline you'll see a
natural theme here that we want to see
operators that use indexes at the front
of our pipelines similarly we're also
going to want to put sort stages as
close to the front as possible we saw
with fine queries how serious our
performance can be degraded when sorting
isn't able to use an index for this
reason we want to make sure that our
sort stages come before any kind of
transformations so we can make sure that
we utilize indexes for sorting if you're
doing a limit and doing a sort you want
to make sure that they're near each
other and at the front of the pipeline
when this happens the server is able to
do a topcase sort this is when the
server is able to only allocate memory
for the final number of documents in
this case 10 this can happen even
without indexes this is one of the most
highly performant non index situations
that you can be in optimizations like
this are performed by the query
optimizer whenever possible but there's
a chance that
optimization can change the outputted
results then the query engine will not
perform this kind of optimization that's
why understanding these underlying
principles is important now those are
the basic aggregation optimizations that
you can do now let's discuss some of the
memory constraints that you should be
aware of when doing aggregation first of
all your results are all subject to the
sixteen megabytes document limit they
exist in MongoDB aggregation generally
outputs a single document and that
single document will be successful to
this limit now this limit does not apply
the documents as they slow through the
pipeline as you transform documents they
can actually exceed the 16 megabyte
limit but whatever is actually returned
will still fall under the 16 megabyte
limit the best way to mitigate this
issue is by using dollars name limit and
dollar sign project to reduce your
resulting the document size another
limitation that you're gonna want to be
aware of is that for each stage in our
pipeline there's a 100 megabyte limit of
RAM usage now the absolute best way to
mitigate this is to ensure that your
largest stages are able to utilize
indexes this will reduce your memory
requirements so the indexes are
generally much smaller than the
documents they reference moreover with
sorting they reduce memory requirements
because you don't need to allocate extra
memory for that sorting now if you're
still running into this 100 megabyte
limit even if you're using indexes then
there's an additional way to get around
it and that is by specifying allowed
this skews true on your aggregation
query this will allow you to spill to
disk rather than doing everything in
memory now this is important to
understand that this is a absolute last
resort measure hard drives are thousands
of times slower to access the memory so
by splitting to disk you're going to see
serious performance digression and some
situations is this necessary but you
need to be aware that this will
seriously decrease performance since
allowed excuse true will seriously
impact performance you'll see this more
often on the batch processing kind of
jobs rather than real-time processing
last thing I want to point out here is
that allow disk usage does not work with
Dalton graphs look up now that's because
Dalton graph look up doesn't currently
support spilling to disk let's recap
what we've learned so in this lesson we
discussed some of the different
optimization strategies for utilizing
indexes with requir ease for aggregation
and we also discussed some of the memory
constraints that apply to aggregation
and how you can mitigate and get around
those issues


---

### M201 Lesson 5.5 - Aggregation Pipeline on a Sharded Cluster

https://youtu.be/foaDAuafa4w

* How it works
* Where operations are completed
* Optimizations


On a sharded cluster this will find just in one shard

```
db.restaurants.aggregate([
  { $match: { 'address.state': 'NY' } },
  {
    $group: {
      _id: '$address.state',
      avgStars: { $avg: '$stars'}
    }
  }
])
```


But this will find just in all shards

```
db.restaurants.aggregate([
  {
    $group: {
      _id: '$address.state',
      avgStars: { $avg: '$stars'}
    }
  }
])
```

This involves that the merging of the data happen on a random shard

But this is not true when we have:

* `$out`
* `$facet`
* `$lookup`
* `$graphLookup`

In this cases, the merge happens in the primary shard

### Aggregation Optimizations

```
db.restaurants.aggregate([
  { $sort: { 'stars': -1 } },
  { $match: { 'cuisine': 'Sushi' } },
])
```

Will be optimized:

```
db.restaurants.aggregate([
  { $match: { 'cuisine': 'Sushi' } }, // To reduce the amount of document that need to be moved (specially useful in sharded clusters)
  { $sort: { 'stars': -1 } },
])
```


Similiarly:

```
db.restaurants.aggregate([
  { $skip: 10 },
  { $limit: 5 },
])
```

```
db.restaurants.aggregate([
  { $limit: 15 },  // reduce the number of documents that need to be examinated
  { $skip: 10 },
])
```

Also combines stages:

```
db.restaurants.aggregate([
  { $limit: 10 },
  { $limit: 5 },
])
```

```
db.restaurants.aggregate([
  { $limit: 15 },
])
```

Same thing with `$skip` and `$match`

in this lesson we're going to talk about
the aggregation pipeline on a chartered
cluster specifically we're discuss how
it works where operations are completed
and we'll also look into how pipelines
are optimized to perform well on charted
clusters let's go ahead and talk about
how aggregation works in shard cluster
when we run aggregation queries on a
replica set or standalone Mongo D it's
much easier for the server to reason
about because all the data is located in
one place in a shorter cluster since our
data is partitioned across different
shards this becomes slightly more
difficult fortunately MongoDB has some
good tricks up its sleeve to address
these issues for example here we have
the simple aggregation query when I'm
using match to find all the restaurants
in New York State I'm then using group
to group by each state and then average
the amount of stars for that given state
this is my shard keys on state all of
the restaurants in New York are going to
be on the same shard this means that the
server is able to simply route the
aggregation query to that shard where it
can run the aggregation and return the
results back to the among us and then
back to the client
very straightforward now look at this
example I've changed the query slightly
so we're no longer using the match stage
so now we're talking about all documents
in our started collection now since
these documents are spread across
multiple shards we're going to need to
do some computing on each shard but then
we'll also need to somehow get all of
those results to one place where we can
merge the results together in this case
our pipeline needs to be split the
server will determine which stages need
to be executed on each shard and then
what stages need to be executed on a
single shard one of the results from the
other shards will be merged together
generally merging will happen on a
random shard but there are certain
circumstances where this is not the case
this isn't the case when we use dollars
an ounce or facet or lookup or graph
lookup for these queries the primary
shard will do the work of merging our
results and this is important to
understand because if we're running
these operations very frequently then
one of our shards the primary shard will
be under a lot more load than the rest
of our cluster degrading the benefits of
our horizontal scaling under these
specific
you can mitigate this issue by using a
machine with more resources for your
primary shard
there are also some cool optimizations
that the server will try to perform that
you should be aware of most of these
will also apply when you're not charting
but are still helpful to know take this
example here we have a sort followed by
a match now the query optimizer will
move the match in front of the sort to
reduce the number of documents that need
to be sorted this is particularly useful
in charted clusters when we have a split
in our pipeline and when you want to
reduce the amount of data being
transferred over the wire chart merging
shard similarly we can reduce the number
of documents that we need to examine by
moving the limit after a skip in front
of it notice that the query planner
updates the values accordingly to
support this optimization other than
moving stages around the server is also
able to combine certain stages together
here we're gonna see where we're
combining two limits into one same thing
with skip and finally we're seeing the
same thing with match now all these
optimizations will automatically be
attempted by the query optimizer that
being said I think it's important to
point out these optimizations so you can
more carefully consider your own
aggregation pipelines and their
performance implications and that should
give you a good overview of the
aggregation pipeline on a chartered
cluster let's recap what we learned we
discussed how the aggregation pipeline
works on a sharted environment and
specifically we looked at where the
different operations happen when we're
using sharding and finally we looked at
some optimizations that the server will
try to do when running aggregation
queries



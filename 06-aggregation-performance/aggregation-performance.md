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

**Lecture Notes**
Note: At 3:05, the two $limit stages will actually coalesce to one limit stage of $limit: 5, not $limit: 15 as displayed in the video.

You can learn more about aggregation in a sharded cluster by visiting the [Aggregation Pipeline and Sharded Collections section of the MongoDB Manual](https://docs.mongodb.com/manual/core/aggregation-pipeline-sharded-collections/).



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


---

### m121 pipeline optimization part 1

https://youtu.be/jQu96KOQv4k

let's talk about pipeline optimization
we've already learned about using match
and source stages early to use indexes
using limit and source stages to produce
top k results and how to allow the use
of more than 100 megabytes of memory
let's dive further and look at pipelines
themselves and how they might be
optimized let's consider the following
aggregation that gets the length movie
titles to begin with vowels and sorts
them by the frequency so we begin with
our match stage looking for titles the
begin with a vowel ignoring the case we
then project our title size composing
size and split together and splitting
the title on spaces in our group stage
we're grouping like documents together
based on that title size we just
calculated and getting a count finally
we're gonna sort in descending direction
so the highest frequency should be
coming back first we run this to get an
idea of the results ok we can see that
the most common length for a movie title
appears to be 3 words and there were
1450 documents that fell into this group
we can also see that the most uncommon
lengths for a movie title is 17 words
with only one document in this group
let's now examine the explain
information for this aggregation okay so
we have the same pipe plan as before but
this time we're appending explained true
to get the explained output let's take a
look at the results there is a lot of
interesting information here we can see
what our query was the fields that were
kept which happened to be title and
unsubscribe D and then the query planner
a little further down we can also see
the winning plan the use of fetch stage
followed by an index scan we can
probably do a little better than this
because we know that we have an index
that should support this query we can
also see the stages that were executed
here's our converted project stage where
we see undescribed een true this is
implicit remember the title size where
we calculated the size of our title and
then we can see our group and our sort
along with the sort key pretty
interesting information so let's see if
we can do better our goal is to try and
get this to be a covered query meaning
there is no fetch stage okay so this
aggregation pipeline is nearly identical
to the first one we had except I'm
explicitly getting rid of the end of
scribe D field remember the project
stage implicitly keeps it unless we tell
it not to let's see if we get the same
results and we do indeed get the same
results as before where it looks like
movies with a link the three words have
the most occurrence with 1450 documents
okay we verified the same results let's
check the explained output to see if
we've improved our query performance at
all again the same pipeline we just used
also projecting out underscore ID just
adding the explained true option to the
aggregation function and looking at the
explained plan we see again we have the
same querying on the cursor this time
the fields are different we're keeping
the title and projecting away underscore
ID let's go ahead and go down to the
winning plan to see if we avoided that
fetch stage all right
so looking at our winning plan we can
see it's much better I can see there's
no fetch stage so our match stage was
indeed covered when we see a fest stage
it means MongoDB had to go to the
document for more information rather
than just using information from the
index alone of some interest here we can
also see that underscore ID was now
projected as false this is because we
explicitly provided that information so
let's see if we can do even better okay
so here's our new modified pipeline
where we have the same mesh stage
however this time we have no project
stage instead we perform the logic we
need within group and then sort on those
results let's see it in action
all right pretty cool we got the same
results three words count of 1,450
documents let's check the explained
output to see the difference between
this pipe line and our previous pipe
line
alright let's look at the explained
output we can see that the query is the
same we can see that the fields are the
same as well title one underscore ID is
zero how did the aggregation framework
know to do this when we didn't specify a
project stage let's cover that in a
moment down in a winning plan we can see
there was no fetch stage which meant
that this is a covered query if we
scroll all the way down to the bottom to
look at the rest of our pipeline stages
we can see the next stage after our
query is group then our sort and we're
done a key takeaway here is to avoid
needless projects as we saw the
aggregation framework assumed we knew
what we were doing with each project
however if the aggregation framework can
determine the shape of the final
document based only on initial input
internally it will project away
unnecessary fields that was a mouthful
so let me explain that in a little more
detail in the first math stage the only
field we cared about was the title in
the group stage again the only field we
care about is the title we use this
composition of expressions to get the
number of words and the title but we can
do that in line by evaluating first
split in the title on spaces into an
array and then getting in the size of
the array there's no need for an
intermediary project stage because we
can just calculate that value in line
here this is a very powerful feature we
should always strive to let the
optimizer work for us additionally this
removes the stage that ultimately is
timed at the pipeline
let's think about that so we have a
hundred thousand documents in our movies
collection in the match we filter down
to ten thousand
now in group we have 10,000 documents
come through and then sort we have maybe
15 right well with that intermediary
project stage that we really didn't need
we had a hundred thousand come in then
we have ten thousand and we'd send all
ten thousand through that in your meter
project before they get to the group
stage
that's ten thousand additional
iterations that we just avoided so as a
general rule don't project unless you
are doing some real work in the stage
and remember that ad Fields is available
okay one last note before we move on we
could replace group and sort by sort by
count it really is the same under the
hood it just saves us on typing keep
that in mind


---

### m036 Pipeline optimization part 2

https://youtu.be/5WZ3Q3BZEU4


all right let's now discuss another
common operation that developers
encounter when using a one to end
pattern like the attribute or the subset
patterns such as stocks traded in a
given moment or the top 20 customer
reviews for a product how do we
efficiently work with that data if we'd
like to perform some aggregation
framework analysis let's imagine we're
working with documents of this schema
that is tracking all buy and sell
transactions on our trading platform
we'd like to analyze how many total
transactions we have as well as how many
buys and sells were performed per
timestamp and then use this data later
in our pipeline in other words we want
to group data in the document not across
documents let's take a look at the
collection and think about how we might
accomplish this okay so we have our time
stamp and then we have our trays array
with many many documents okay this might
be our first approach where we unwind
the trades array and then group on the
time and the action getting account and
then group again just on the time and
pushing the action and the count for
that type of action into an array and
then getting the total number of actions
we've performed per that timestamp so we
should get total actions per document
with the individual numbers of buy and
sell actions let's test it up okay we
can see that it's the same pipeline as
that from the previous slide we unwind
the trades array group on the timestamp
and the action and then group again just
on the timestamp we've added this sort
stage here just to ensure we get
consistent ordering for comparison later
on alright it gives us the results we
expected total actions and the number of
buy and sell actions per document this
is a visual representation of the
previous pipeline the black squares are
our documents if we start with four
documents
and unwind a field with just three
interests per document we now have 12
documents we then group our documents
twice to produce the desired results
ending up with the same number of
documents we started with this should
start to feel horribly inefficient sadly
it gets worse let's examine how this
inefficiency impacts operations in
chardon environment each shard performs
the unwind initial processing for the
first group stage will be done on the
shards but the final grouping has to
happen in a single location every other
stage including the entirety of the
second group would then take place on
that location
imagine if three or four other stages
followed when not grouping across
documents this causes needless overhead
in network traffic and causes all stage
after the group to be run in the
location of the merge rather than remain
distributed here we've shown that the
grouping is happening on chart a in
reality it could happen anywhere at
random in our cluster so we really need
a way to iterate over the array and
perform our desired logic within the
document thankfully we have Map Reduce
filter and the key milena expressions
available in the project stage to remedy
this problem let's examine this pipeline
we'll get the size of the resultant
arrays by filtering to remove the action
we don't want for that field in this
case we only and allowed documents
through that had the by action here the
cell action lastly we'll just get the
size of the trigger a to get how many
total trays we had now this seems almost
too simple so let's look at it in action
again this is the same pipeline as on
the previous slide the sort stage is
added just to ensure we get consistent
results so that we can do comparisons
later awesome functionally identical
results and not argue that this format
is easier to reason about
let's look at the previous output to
compare and here are the results from
that previous pipeline where we used the
double group we can see the information
we still want is embedded within this
actions array this is a visualization of
our new pipeline our new pipeline
produced functionally identical results
but visually what you see in the
execution is much different rather than
performing unnecessary work and possibly
moving and collapsing our pipeline to a
single location causing a slowdown and
extra network usage we retain the same
number of documents performing the work
in a targeted manner and in place and
then the shard environment the benefits
are tangible as well we've kept all work
distributed among the shards all right
but wait but wait that's all fun for
essentially binary input when we want to
count the occurrence of something but
what if we want to do something more
meaningful what if we'd like to find how
many times a specific stock was bought
sold and what the total price was for
each let's find that information out
from MongoDB stock again Map Reduce
filter and the him later expressions
available on project stage are amazing
tools so this is one example pipeline
that would produce those results for us
first we specify the reduce expression
as the input array we'll go ahead and
filter the Trey's array filtering out
any stock ticker that isn't equal to
MongoDB the initial value and the value
that will be used as the accumulator
value dollar dollar value we're going to
specify this document with two keys buy
and sell that are each documents with
keys of total count and total value here
in in is our logic we start with this
conditional expression where we check if
this dot action is equal to buy remember
dollar dollar this refers to the current
element of the input array
remember we filtered that so we know
we're only gonna get documents that had
MDB as the ticker symbol so if it is a
buy action we modify the total count by
adding one $2 dollar value by no account
remember dollar dollar value refers to
the accumulator which we set initially
to be this value right here we also
modify total value by adding this dot
price $2 dollar value by total value and
if this was a buy action we don't modify
cell in any way we just reassign it back
to itself if it is a sell action we
essentially do the same thing adding one
to cell total count and adding this dot
price to sell total value and then
finally reassigning buy back to itself
because this was a cell we can see that
based on manga to be only the buy total
account was 10 and the self total
countless five for this specific
document we can also see the dollar
value associated with all the
transactions again we see 22 and 19 and
the value associated alright we've
covered a lot of information in this
lesson let's go ahead and summarize what
we talked about first avoid unnecessary
stages the aggregation framework can
project feels automatically if the final
shape of the output document can be
determined from initial input second
using human ladder expressions as well
as dollar map dollar produce and dollar
filter expressions in project stages
before an unwind if possible again this
only applies if you need to group within
a document
not among your documents lastly every
high order array function can be
implemented without reduce if the
provided expressions do not meet your
needs



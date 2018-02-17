### m121 $match Filtering Documents Lesson 1.4

https://youtu.be/J3GrISCyK-8



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
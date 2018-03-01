### $redact

https://youtu.be/51ftKpXn3iU

[`$redact`](https://docs.mongodb.com/manual/reference/operator/aggregation/redact/) documentation page.

### Sumary

* `$$DESCEND` - retain the field at the current evaluated level except for subdocuments and arrays
* `$$PRUNE` - exclude all fields at the current document level without further inspection
* `$$KEEP` - retain all fields at the current document level without further inspection

Take this example:
```
{
  $cond: [{ $in: [<userAccess>, "$acl"] }, $$DESCEND, $$PRUNE]
}
```

If evaluated in this document:

```
acl: ["HR", "Managment"],
employee_compensation: {
  acl: ["Finance", "Managment"],
  salary: 15584
  programs: {
    acl: ["Finance", "Executive"],
    spp: 0.06
  }
}
```

Will produce this:

```
acl: ["HR", "Managment"],
employee_compensation: {
  acl: ["Finance", "Managment"],
  salary: 15584



}
```

* `$$KEEP` and `$$PRUNE` automatically apply to all levels below the evaluated level
* `$$DESCEND` retains the current level and evaluates the next level down
* `$redact` is not for restricting access to a collection



let's learn about one of the stages in
the aggregation framework that can help
us protect information from unauthorized
access the redact state the redact stage
as the following form the expression can
be any expression or combination of
expressions but must ultimately resolve
to one of three values descend prune and
keep okay at first these seem pretty
cryptic so let's examine what each of
them does first let's look at prune and
keep prune and keep our inverse of each
other
prune will exclude all fields at the
current document level without further
inspection while keep will retain all
fields at the current document level
without further inspection so what do we
mean by further inspection let's look at
this example document from the employees
collection each colored square
represents a document level specifying
keep or prune at any given document
level will perform the Associated action
and automatically apply this action to
all levels of the document let's look at
this example document from the employees
collection each colored square
represents a document level specifying
keep or prune at any given document
level will perform The Associated action
and automatically apply this action to
all document levels below the level we
specified ok so let's look at descend
descend retains the field at the current
document level being evaluated except
for sub documents and arrays of
documents it will instead traverse down
evaluating each level let's visualize
how to send that would operate over this
document given this conditional
expression determining whether the
volume of user access is in the ACL
array we start with the entire document
and compare whether management is an ACL
since it is a descent into the sub
document at employee compensation here
we now evaluate whether management is
a CL which it is so we descend further
at this level upon evaluation prune is
returned because of the ACL and this
level does not include management this
level and any subsequent levels if there
were any would not be returned to the
user it's as if this field doesn't exist
at all let's look at this in action we
set up our user access variable and then
the pipeline ensuring we only have
access document levels we should
excellent we can see that we are indeed
only getting back document levels where
management was in the ACL or a the
redact stage can be useful for
implementing access control lists though
it is not the only way to limit access
to information as we'll learn later in
the course any user who has access to a
collection to perform this type of
aggregation can also perform other read
operations so the redact stage is not
sufficient for collection and field
level restrictions lastly if comparing
to a field in the document the field
must be present at every level of using
descend or the expression must count for
and decide what to do with fields
missing if we don't take any of these
precautions redact is likely a terror
let's summarize some key points keep and
prune automatically apply to all levels
below the evaluated level descend
retains the current level and evaluates
the next level down and redact is not
for restricting access to a collection
remember if a user has access to perform
an aggregation on a collection they have
access to read that collection


---


### m121 $out

https://youtu.be/jC4oMA0riWo

### Sumary

* Will create a new collection of overwrite an existing collection if specified
* Honors indexes on existing collections
* Will not create or overwrite data if pipelines errors
* Creates collections in the same database as the source collections
 

Let's learn about a useful stage for persisting
the results of an aggregation, the $out stage.
The $out stage has the following form.
We specify the name of the output collection that we want.
The out stage must be the last stage in the pipeline.
As such, it can't be used within a facet.
MongoDB will create the collection
with the name specified if none exists.
Otherwise it will overwrite an existing collection
if an existing collection name is specified.
Now there's a few things to know.
It will only create the new collection
within the same database.
If an existing collection is replaced,
any indexes that existed on the original collection
will still be in place.
If the pipeline errors, it will not create or overwrite
a collection.
This also means that the output from out must honor index
restrictions, such as unique indexes,
can include the _id field.
So this aggregation here where we match every document,
perform some grouping operation, unwind to create many
documents, and then try an output to a new collection
would fail because it would result in many documents with
the same _id value.
And that covers the $out stage.
This stage is very useful for performing
an aggregation against existing data to do a migration,
seed a collection with useful data,
or distribute snapshots of data for analysis.
Here are a few things to remember about the $out stage.
It will create a new collection or overwrite an existing
collection if specified.
It honors indexes on existing collections.
It will not create or overwrite data if pipeline errors.
And it creates collections in the same database as the source
collection.

---

### m121 views

https://youtu.be/2BEw9CdRjoY

* Vertical slicing => `$project`
* Horizontal slicing => `match`

We can perform:

* `db.view.find()`
* `db.view.findOne()`
* `db.view.count()`
* `db.view.distinct()`
* `db.view.aggregate()`

**Restrinctions**

* No write operations
* No index operations (create, update)
* No renaming
* Collation restrictions
* No mapReduce
* No `$text`
* No `geoNear` or `$geoNear`
* `find()` operations with projection operators are not permitted
  - `$`
  - `$elemMatch`
  - `$slice`
  - `$meta`

* View definitions are public
* Avoid referring to sensitive fields within the pipeline that defines a view


let's now discuss a powerful feature of
MongoDB views MongoDB enables non
materialized views meaning they are
computed every time a read operation is
performed against that view there are a
way to use an aggregation pipeline as a
collection from the user perspective
views are perceived as collections with
some key differences we'll go over later
in the lesson so what might views be
useful for suppose were a large
financial institution with customers of
different tiers we've just recently
launched a big promotion and are
conducting a phone campaign we've hired
a temporary staffing agency with several
regional offices we'll assign a
different tier to each recent law office
this is a sample of one record from our
customers collection as we can see there
are sensitive and potentially biasing
information that we do not want to allow
access to you views allow us to create
vertical and horizontal slices of our
collection what do we mean by a
horizontal and vertical slice vertical
slicing is performed through the use of
a project stage and other similar stages
that change the shape of the document
being returned here we vertically sliced
our document to only retain the account
type field vertical slices will change
the shape being returned but not the
number of documents being returned
horizontal slicing is performed through
the use of matched stages we select only
a subset of documents based on some
criteria here we horizontally slice our
collection with the value of the account
type in fact the documents that are
grayed out would not be operated on at
all by the following project stage we
could further slice of data horizontally
by only selecting accounts that had a
specified minimum balance and there with
an undesired age range and you get the
idea it may even be necessary to use an
intermediary shaken stage to calculate a
value that we wish to filter documents
on horizontal slices will affect the
number of documents returned not their
shape let's look at another example of
this with documents that have the
following schema we'd like to vertically
slice the documents to remove sensitive
information as well as make the name and
gender information available but present
it in a more formal format for the call
center employees we'd also like to
horizontally slice our collection by
filtering out documents you do not have
an account type of bronze here's an
example creating a view that performs
both horizontal and vertical slicing to
make data available for the call center
we're going to assign bronze tier
members we specify the name of the view
the source collection and then the
pipeline that will get stored to compute
this view within the pipeline we perform
our initial horizontal slice with a
match stage selecting only bronze tier
members then within the project stage we
perform our vertical slicing retaining
fields we want and reassigning the name
field with a more formally formatted
name you can see this view in action
yourself let's run the command to get
collection information for the current
database here we see information about
every collection I've already created
three views bronze banking silver
banking and gold banking we can see they
show up just like collections except
their type of view and then the options
we can see the view that they are on and
the pipeline that defines them you won't
be able to create views on the class
Atlas cluster if you'd like to see these
views in action and how restrictive they
can be along with proper role based
access control the login credentials are
contained in the handout in this lesson
if you'd like to learn more about role
based access control refer to our
security course which is linked below
this video views can be created in two
different ways we have the shell helper
method DB tech create view in which I
already saw and the create collection
method here a view consists in the name
a source collection and aggregation
pipeline and if required as
specific collation in essence when we
call of you will be executing the
aggregation pipeline that is used to
define the view view meta information to
include the pipeline that computes the
view is stored in the system dot views
collection let's look at this
information again we can see the same
information we saw before with the gate
collection infos command but now only
for our views hopefully this illustrates
that the only information stored about a
view is the name the source collection
the pipeline that defines it and
optionally the collation all collection
read operations are available as views
and yes we can perform aggregations on
these two views do have some
restrictions no write operations these
are read-only and computed when we issue
a read operation against them they are a
reflection of the defined aggregation on
the source collection no index
operations since the views use the
source collection to get their data the
index operations need to be performed on
that source collection the usable use
the source collections indexes during
their creation no renaming view names
are immutable so they cannot be renamed
that said we can always drop a view and
created again with a new pipeline
without affecting io of the server no
dollar text the text query operator can
only be used in the first stage of an
aggregation pipeline and a view will ask
you the defined pipeline first this
query operator cannot be used in a view
no jr. or the jr. stage same as with
text jr. is required to be the first
stage of our pipeline collation
restrictions do use have collation
restrictions such as views do not
inherit the default collation of the
source collection as specified there are
other collation specific concerns which
you can read about but following the
link below this video lastly find
operations where the following
projection operators are not permitted
we're moving and retaining fields is
allowed
but trying to use any of these operators
will fail view definitions are public
any role that can list collections on
our database can see a view definition
as we saw earlier avoid referring to
sensitive information within the
defining pipeline alright that sums up
views here are a few things to remember
views contain no data themselves they're
created on demand and reflect the data
in the source collection user read-only
write operations two views will error
views have some restrictions they must
abide by the rules of the aggregation
framework and cannot contain to find
projection operators horizontal slicing
is performed with the matched stage
reducing the number of documents that
are returned vertical slicing is
performed what they project or other
shaping stage modifying individual
documents



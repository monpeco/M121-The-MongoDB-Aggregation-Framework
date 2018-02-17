### Introduction to the MongoDBn and the Aggregation Framework

https://youtu.be/tdHJpbyPK2g

---

### m121 Course Atlas Requirements

https://youtu.be/cMZWZT09t0U


**Lecture Notes**

To connect to M121 course [Atlas Cluster](https://www.mongodb.com/cloud/atlas), using the mongo shell, 
you will need to use the following connection command:

    mongo "mongodb://cluster0-shard-00-00-jxeqq.mongodb.net:27017,cluster0-shard-00-01-jxeqq.mongodb.net:27017,cluster0-shard-00-02-jxeqq.mongodb.net:27017/aggregations?replicaSet=Cluster0-shard-0" --authenticationDatabase admin --ssl -u m121 -p aggregations --norc

Once you've connected, list the existing collections of the aggregations database. Your output should be similar to this one:

```
Cluster0-shard-0:PRIMARY> show collections
air_airlines
air_alliances
air_routes
bronze_banking
customers
employees
exoplanets
gold_banking
icecream_data
movies
nycFacilities
silver_banking
solarSystem
stocks
system.views
```

before we dive into the chorus let's
discuss some prerequisites and walk
through connecting to the infrastructure
that is going to support the class the
course prerequisites are minimal all
that is required is a modern 64-bit
operating system and mininet connection
and your participation one note
you'll also need to be able to make a
TCP connection on port 27 zero one seven
this is easy to test visit parkways net
: two seven zero one seven you should
see a page that looks a lot like this
and make sure that you see something
like this here that says you've reached
this page on port two seven zero one
seven if you don't see this page please
contact your network administrator about
opening up this sport additionally make
sure you post in the forums so that we
can help you until this issue is
resolved as you see myself and other
instructors use new aggregation
operators throughout the course you are
highly encouraged to pause the video and
follow along all collections will
perform operations on will be available
to you in the class Atlas cluster so
what's that 'less Atlas is MongoDB is
cloud hosting service will let MongoDB
worry about optimizing storage security
and backing up our data for this course
signing up for Atlas is easy and free
visit MongoDB com4 slash cloud four
slash Atlas and click the get started
free button after clicking the button go
ahead and fill out your information and
click get started free again and for now
that's it
we'll be revisiting Atlas later on in
the course next lesson sure we have
money to be installed visit MongoDB comm
and click the download button navigate
over to enterprise and select the
download dis appropriate for your
operating system enterprise is free to
test and evaluate so we'll be using it
throughout the course while that's
downloading
let's click resources and documentation
click on tutorials and click MongoDB
Enterprise scroll down and find the
tutorial for installing MongoDB
Enterprise on your specific operating
system lastly
we need to test our connection to the
class Atlas cluster open a terminal and
paste the information you find below
this video go ahead and type show D B's
to see all of the available databases
available on the cluster
typing show collections will show
collections within the aggregations
database and that's it for the course
prerequisites and connecting to Atlas


---

### m121 MongoDB Aggregation Pipelines

https://youtu.be/5_oSSbQpGSM


pipelines the Alerus mentioned pipelines
quite a bit throughout the course so
let's take a few minutes to discuss what
they are pipelines can be thought of as
a conveyor belt in the factory along the
line there are different assembly
stations these assembly stations or
stages depending on what we want to
accomplish we may have only one stage or
may have many stages pipelines work like
this
documents represented by these squares
in our pipeline and begin to flow into
our first stage this stage is called
match which you'll be introduced to you
very soon we've set this stage up so the
only red and blue squares make it
through next they flow through our
pipeline and enter the second stage in
this example we'll call this stage
project we set this stage up to
transform our squares and circles this
is a small representation of the power
of the aggregation framework offers we
can transform our data in almost any way
we desire we'll be covering the project
stage in great detail in later lessons
this stage represents one of the many
powerful analysis stages available and
it is called group here we have
configured the stage to gather all the
documents that are flowing into it and
produce a single document that gives us
the ratio of red to blue circles we'll
cover group and many other powerful data
analysis stages later in the course
there you have it a high-level overview
of what pipelines are at the most basic
level there are a composition of stages
from one to many that we can arrange and
configure in almost any way we like the
aggregation framework provides many
stages to allow us to filter and
transform our data all we have to do is
compose the pipeline some key takeaways
to remember pipelines are a composition
of stages stages are configurable to
produce desired transformations
documents flow through the stages like
parson in an assembly line or water
through a pipe finally with only a few
exceptions which we'll cover later
stages can be arranged in any way we
like and as many as we require


---

### m121 aggregation structure and syntax

https://youtu.be/SYtRQ5crN6U

[Aggregation Pipeline Quick Reference](https://docs.mongodb.com/manual/meta/aggregation-quick-reference/)

**Operators**

* Operators are the query operators or aggregation stages, `$match`, `$project`, `$in`, `$gte`, `$lte`
* Operator appear in the **key** position of a document.

**Expressions**

* Expressions act a lot like functions, we provide arguments and they provide a computed output, `$gt`, `"$numberOfMoons"`
* Allways appear in a value position

**Important**

* Field Path: `"$fieldName" ("$numberOfMoons")`

Is use to access a field in the document

* System Variable: `"$$UPPERCASE" ("$$CURRENT")`

Is used to access system level variable

* User Variable: `"$$foo"`

Is used to access user level variable

**Aggregation Structure and Syntax Rules:**

* Pipelines are always an array of one o more stages
* Stages are composed of one or more aggregation operators of expressions
  - Expressions may take a single argument or an array of arguments. This is expression dependant.




let's take a few minutes to talk about
the structure and syntax of the
aggregation framework the aggregation
framework has a simple and reliable
structure and repeatable syntax
pipelines may contain one or more stages
each stage is a JSON object of key value
pairs with only a few exceptions we can
have as many stages as we like
additionally options may be passed in
for example specifying whether to allow
disk use for large aggregations or to
view the explained plan of the
aggregation to see whether it is using
indexes or if the server optimize the
pipeline let's take a look at a very
simple but very real pipeline and
discuss the syntax here we have a match
stage that checks whether the
atmospheric composition contains oxygen
or not and if the mean temperature falls
within this range then we have a project
stage that reshapes the document and
calculates the new value more on this in
a moment lastly this is our options
object each stage is composed of other
operators or expressions as we continue
through the course you'll be introduced
in many of these make sure you bookmark
the aggregation pipeline quick reference
page link below this video
throughout the course we'll be using the
terms operator and expression and it's
vital that you can quickly access the
documentation for these so what's an
operator for this course when we say
operators we mean other query operators
or aggregation stages in this example
dollar matched in dollar project or
aggregation operators and dollar in
dollar GTE and dollar ltée our query
operators as a general rule operators
always appear in the key position of a
document dollar match is a little
special and we'll learn about it later
what's an expression expressions act a
lot like functions we provide arguments
and they provide a computed output and
just like functions expressions can be
composed its form powerful new data
transformations MongoDB provides
expressions for working with and
producing values from many types of
values in the project stage dollar GT is
an expression
this arguments are supplied in this
array this dollar number of moons
surrendered by the quotes is also an
expression that you'll learn about in a
moment and easy way to remember how to
use expressions is it will always appear
in a value position let's run this now
to see the output here we see the result
of the calculated field it looks like
Earth is the only planet that has oxygen
as a relatively comfortable temperature
and it does indeed have news one more
important thing to cover we may
encounter syntax like this the first is
a field path expression it's used to
access the value of a field in the
document like number of moons in the
first example the second with two dollar
signs followed by an uppercase word is a
system-level variable dollar current
refers to the current document and you
can find the meaning of others on the
quick reference page the last with two
dollar Suns followed by a lowercase word
is a user variable some expressions let
us temporarily bind a value to a name or
provide us a special name to access some
data and there we go the aggregation
framework structure and syntax we highly
recommend you use an editor that has
bracket matching block striking your
pipelines to make noticing errors easier
there's just a few things to remember
pipelines are always an array of one or
more stages stages are composed of one
or more aggregation operators or
expressions expressions may take a
single argument or an array of arguments
see in the next lesson
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
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
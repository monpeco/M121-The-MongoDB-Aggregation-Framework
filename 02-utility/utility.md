### m121 $addFields

https://youtu.be/yo4N7P5n-io

The `$addFields`

Is similar to `$project`
* `$addFields` only allow us to modify the incoming pipelines with new computed fields or to modify existing fields
* In `$project`, once we perform a transformation or retain a field the we must specify all fields we wish to retain (this can become tedious)

**Lets perform a transformation**

```
db.solarSystem.aggregate([
{
  $project: { gravity: "$gravity.value" }
}
]).pretty()
{ "_id" : ObjectId("5543654645456454"), "gravity" : 9.8 }
```


**Lets remove _id and add name**

```
db.solarSystem.aggregate([
{
  $project: { _id:0, gravity: "$gravity.value", name:1 }
}
]).pretty()
{ "gravity" : 9.8, "name" : "Earth" }
```

**Now we want to retain other fields**
```
db.solarSystem.aggregate([
{
  $project: { 
    _id:0, 
    gravity: "$gravity.value", 
    name:1,
    meanTemperature:1,
    density:1,
    mass: "$mass.value",
    radius: "$radius.value",
    sma: "$sma.value"
  }
}
]).pretty()

{
  "name" : "Earth",
  "meanTemperature" : 15,
  "gravity" : 9.8,
  "mass" : 5.9723e+24,
  "raduis" : 6378.137,
  "sma" : 149600000
 }
```

**If we use $addFields**

```
db.solarSystem.aggregate([
{
  $addFields: { 
    gravity: "$gravity.value", 
    mass: "$mass.value",
    radius: "$radius.value",
    sma: "$sma.value"
  }
}
]).pretty()

{
  "_id" : ObjectId("5543654645456454"),
  "name" : "Earth",
  "type" : "Terrestrial plane",
  "orderFromSun" : 3,
  "meanTemperature" : 15,
  "gravity" : 9.8,
  "mass" : 5.9723e+24,
  "raduis" : 6378.137,
  "sma" : 149600000,
  "orbitalPeriod" : { "value":1, "units":"years" },
 }
```

**In this way, we remove unwanted fields at begining, and add new fiels in every stage (without the need of select all over again)**

```
db.solarSystem.aggregate([
  $project: { 
    _id:0, 
    name:1,
    gravity : 1,
    mass: 1,
    raduis: 1,
    sma: 1
  },
  {
    $addFields: { 
      gravity: "$gravity.value", 
      mass: "$mass.value",
      radius: "$radius.value",
      sma: "$sma.value"
    }
  }
]).pretty()
```

let's now discuss another transformative
stage add fields add fields is extremely
similar to project with one key
difference as the name implies add
fields adds fields to a document while
with project we can selectively remove
and retain fields add fields only allows
you to modify the incoming pipeline
documents with new computed fields or to
modify existing fields oftentimes we
will want to derive a new field or
change existing fields and the
requirement and project that once we'll
perform a transformation or retain a
field then we must specify all fields we
wish to retain can become tedious let's
look at an example first we'll look at
project let's just extract the data from
the gravity value field and brief centre
to the top-level gravity field as
expected we get the results back with
the underscore ID field and the gravity
field we just calculated now let's
remove the underscore ID field and add
the name field for easier reference
alright this is pretty good but what if
we also want to keep the temperature
density mass radius and SMA fields as we
can see in order to keep the information
we want we had to be explicit specifying
which fields to retain along with
performing our transformations as said
this can become tedious incomes add
fields if we substitute add fields for
project and execute the following
pipeline we can see that we indeed
perform the desired transformations
however we do not remove any fields from
the original document instead we append
new transformation fields to the
document ok one last example by
combining project with add fields we
remove the annoyance of explicitly
needing to remove or retain fields in
this example with project we're
selecting the fields that we wish to
retain and in add fields we are
performing a transformation on those
pre-selected fields
there's no need to go one by one and
remover retained fields while performing
our transformations this is a style
choice and can prevent having to
repeatedly specify which fields to
retain in larger pipelines when
performing many various calculations
let's see it in action as we can see we
were attained the specified fields and
performed the specified transformation
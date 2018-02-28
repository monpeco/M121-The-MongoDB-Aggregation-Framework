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



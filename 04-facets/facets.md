### Intro to facets

https://youtu.be/3rtlD2CSvx4

many use cases require the ability to
manipulate inspect and analyze data
across multiple dimensions
apart from this these use cases often
require that this data characterization
meets strict application nacelles
service level agreements to enable
responsive interfaces in MongoDB 3.4 we
are introducing support for faceted
navigation enabling developers to click
on create an interface that
characterizes query results across
multiple dimensions facets application
users can then narrow their query
results by selecting a facet value as a
subsequent filter providing an intuitive
interface to exploring a dataset faceted
navigation is heavily used for browsing
data catalogs and grouping data in
analytics use cases combining faceted
navigation with the functionality of the
MongoDB aggregation framework provides a
powerful way to manipulate data and
analyze it extending mom-to-be usage to
a wider range of applications with
minimum overhead what is faceting
fastening is a popular analytics
capability that allows users to explore
data by applying multiple filters and
characterizations using this approach an
application classifiers each information
elements along multiple explicit
dimensions called facets enabling the
classifications to be accessed and
ordered in multiple ways for example
let's consider a user catalog for a
popular social media site like LinkedIn
in this example let's do a search on the
catalogue this search is looking for
users with the term MongoDB somewhere in
their profile the initial result set
returned is roughly 200k users the
location and current company facets can
be used to further narrow down the
result set according to certain criteria
for example if a user choose to limit
the result set to only users in the
United States then the result set will
narrow down to near 60 2k users facets
among to be are implemented using the
aggregation framework and comprehend a
few different stages we will be covering
single facet queries manual and
automatic bucketing and rendering
multiple facets
I'll ask ourselves busy
working with facets


---

### 15 1 simple query facets 2

https://youtu.be/NMyDE4oWwpg

so let's get started working with facets
and explored in new functionality the
304 brings now to get a better picture
what we are going to do let's imagine
the following scenario let's imagine
that we have an application that has
some sort of search bar where we can
look for things like MongoDB for example
once we press the enter button looking
for this particular keyword or term we
are generally prompt with some listed
results man some attributes in my
indication of things related with this
term giving the catalogue that we are
searching on but we also might have some
sort of filters or characterization for
the search term in combination with
several different dimensions that this
information that we are storing the
catalog of this application might have
so to explain this very well we're going
to be using a very dear data set to you
guys that we've been exploring
throughout the course the data set that
we're going to be looking into is the
company's data set that you can find on
our startups database with this we're
going to be exploring this data sets as
a catalog of companies and how we can
organize search and find information and
get facets out of the data stored in
that particular collection so let's get
started by looking to one single
document inside this company's data set
as usual can find a bunch of information
from external links to awards and
milestones and acquisitions and a bunch
of other information related to one
single company listed on this that is it
now what might have is the need for us
to search on a bunch of different
dimensions and for that's going to be
using a very straightforward search
terms like for example in the
description and overview for companies
which are in some way related with
networking to express the tacori we're
going to be creating a text index on
description and over
you and if you want to find the
companies that have a keyword networking
in their field I think description or
overview we can use it by simply showing
the query where companies can aggregate
a match on text searching for term
network once we do this we get a list of
results now let's assume that the
application of our building our
corporate catalog not only wants to give
end user the result sets but also to
render a facet describing the category
code now this is a field that will tell
us the type of company or sector on
which this particular company is
operating on so basically for that
particular functionality we now can use
sort by counts so if I can't will allow
us to create the facets by category on
the list the results that the previous
stage match will provide so for all the
companies that will include network key
word on their description or overview
those will be piped into a sort by
accounts where we're going to be
grouping the category code once we run
this we have a full list with their
count and sorted of the sectors of
activity where we can find companies in
this case we can have web with 788
companies listed software with 463 and
so forth so sort by count groups
incoming documents coming from our match
query based on their specified
expression search for network and then
computes the count of the documents in
which distinct group and sort by its
count each group is the document with
two fields and underscore ID specifying
the value at which we are grouping and
account determining the number of
documents that match
that group if you want the same result
but let's say with instead of having the
breakdown per category we want it for
office location city something like that
we could run the an aggregation pipeline
that's a little bit more elaborate than
this simple one let's say for example
what we want is still search for all
companies that have network key words on
their description / overview but then
given that offices is an array of
different locations that we might have
we might want to unwind that particular
array and then match the offices which
do have a city so they have this city
value different thence empty for all
that let's sort by count on the
different offices City values that we
find so there we go we now have a list
of documents specifying the value of the
office city in this case for example San
Francisco with a count of 245 New York
will have 218 London Los Angeles Palo
Alto and so on so this is also to
demonstrate that we can have elaborate
pipelines that would filter project
match group determine the list of
documents then then we can use to sort
by and count giving one of the
attributes that is coming with the
result sets to this last stage of the
pipeline in essence with this
aggregation query we can have the
breakdown of companies proceeding that
match networking or in this case network
in their description overview


---



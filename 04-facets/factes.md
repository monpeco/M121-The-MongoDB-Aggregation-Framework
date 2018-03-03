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
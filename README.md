# About

This is a nodejs client package for [Factual's public API](http://developer.factual.com/display/docs/Factual+Developer+APIs+Version+3).

*   [Read](http://developer.factual.com/display/docs/Core+API+-+Read): Search the data
*   [Schema](http://developer.factual.com/display/docs/Core+API+-+Schema): Get table metadata
*   [Facets](http://developer.factual.com/display/docs/Core+API+-+Facets): Count group of data
*   [Crosswalk](http://developer.factual.com/display/docs/Places+API+-+Crosswalk): Get third-party IDs
*   [Resolve](http://developer.factual.com/display/docs/Places+API+-+Resolve): Enrich your data and match it against Factual's

# Install

`````bash
$ npm install factual-api
`````

# Get Start

It is required to have your own api key/secret, you can get them from [factual](https://www.factual.com/api-keys/request)

Then include this driver in your projects:
`````javascript
var Factual = require('factual-api');
var factual = new Factual('YOUR_KEY', 'YOUR_SECRET');
`````

## Read
`````javascript
// Fulltext search doc:
// http://developer.factual.com/display/docs/Core+API+-+Search+Filters
factual.get('/t/places?q=starbucks&include_count=true', function (error, res) {
  console.log("show "+ res.included_rows +"/"+ res.total_row_count +" rows:", res.data);
});

// Row Filters doc:
// http://developer.factual.com/display/docs/Core+API+-+Row+Filters
factual.get('/t/places?q=starbucks&filters={"region":"CA"}', function (error, res) {
  console.log(res.data);
});

factual.get('/t/places?q=starbucks&filters={"$or":[{"region":{"$eq":"CA"}},{"locality":"newyork"}]}', function (error, res) {
  console.log(res.data);
});

// Geo filter doc:
// http://developer.factual.com/display/docs/Core+API+-+Geo+Filters
factual.get('/t/places?q=starbucks&geo={"$circle":{"$center":[34.041195,-118.331518],"$meters":1000}}', function (error, res) {
  console.log(res.data);
});
`````

## Schema
For schema, you only need to specify the table:
`````javascript
factual.get('/t/places/schema', function (error, res) {
  console.log(res.view);
});
`````

## Facets
`````javascript
// show top 5 cities that have more than 20 starbucks in california
factual.get('/t/places/facets?q=starbucks&filters={"region":"CA"}&select=locality&min_count=20&limit=5', function (error, res) {
  console.log(res.data);
});
`````

## Crosswalk
Query with factual id, and only show entites from yelp and foursquare:
`````javascript
factual.get('/places/crosswalk?factual_id=57ddbca5-a669-4fcf-968f-a1c8210a479a&only=yelp,foursquare', function (error, res) {
  console.log(res.data);
});
`````

Or query with an entity from foursquare:
`````javascript
factual.get('/places/crosswalk?namespace=foursquare&namespace_id=4ae4df6df964a520019f21e3', function (error, res) {
  console.log(res.data);
});
`````

## Resolve
Resolve the entity from name and address:
`````javascript
factual.get('/places/resolve?values={"name":"huckleberry","address":"1014 Wilshire Blvd"}', function (error, res) {
  console.log(res.data);
});
`````
Resolve from name and location
`````javascript
factual.get('/places/resolve?values={"name":"huckleberry","latitude":34.023827,"longitude":-118.49251}', function (error, res) {
  console.log(res.data);
});
`````

## Debug
Set debug mode to show debug information(request url, response json, etc)
`````javascript
// start debug mode
factual.startDebug();
// stop debug mode 
factual.stopDebug();
`````

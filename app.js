/* importing the modules
========================
 express : for routing and res and req,
 bodyParser : for parsing the req data,
 newapi     : newsapi for working with api
 */
const express = require('express');
const bodyParser = require('body-parser');
const NewsApi = require('newsapi');
const util = require('util');
const path = require('path');

// : newsapi key
const newsapi = new NewsApi('2423f327cbe642c2adf3d84887fad51d');

// : path to public
var publicPath = path.join(__dirname + '/public');

// : initiating the app instance
const app = express();

// : setting the view engine
app.set('view engine', 'ejs');

// # middle ware
app.use(bodyParser.urlencoded({extended: true}));

// # middle ware : static files
app.use(express.static(publicPath));
console.log(publicPath);

// @route : '/'
// @desc  : shows the index page
// @access: public
app.get('/', function(req, res, next) {
  // showing the sources
  newsapi.v2
    .sources({
      langauge: 'en',
    })
    .then(data => {
      // render the data to the main.ejs
      res.render('main', {data: data});
    })
    .catch(err => {
      // loging the error
      console.log(err);
    });
});

// @route : '/headlines'
// @desc  : shows the root page
// @access: public
app.get('/headlines', function(req, res, next) {
  // : news api top headlines
  newsapi.v2
    .topHeadlines({
      country: 'us',
    })
    .then(response => {
      // : response render index ejs
      res.render('index', {data: response});
    })
    .catch(err => {
      // : if error log the error
      console.log(err);
    });
});

// @route : '/sources/:id/show'
// @desc  : show the headlines of specific source
// access : public
app.get('/sources/:id/show', function(req, res, next) {
  console.log(req.params);
  // : news api source headlines
  newsapi.v2
    .topHeadlines({
      sources: `${req.params.id}`,
    })
    .then(data => {
      res.render('show', {data: data, source: data.articles[0].source});
    })
    .catch(err => {
      console.log(err);
    });
});

// @route : '/search'
// @desc : show the search result
// @access: public
app.get('/search', function(req, res, next) {
  let para = {
    q: req.query.search,
    langauge: req.query.lang,
    sortBy: req.query.sort,
  };
  if (para.q === '') {
    para.q = 'barcelona';
  }
  newsapi.v2
    .everything(para)
    .then(response => {
      res.render('index', {data: response});
    })
    .catch(err => {
      console.log(err);
    });
});

// @route : '/country'
// @desc  : display countries
// @access: public
app.get('/country', function(req, res, next) {
  res.render('country');
});

// @route : '/country/:id'
// @desc  : display country headlines
// @access: public
app.get('/country/:id', function(req, res, next) {
  para = {
    country: req.params.id,
    pageSize: 30,
  };
  newsapi.v2
    .topHeadlines(para)
    .then(response => {
      res.render('countryHeadlines', {data: response.articles});
    })
    .catch(err => {
      console.log(err);
    });
});
let port = process.env.PORT || 3000;
// : listen to port : 3000
app.listen(port, function() {
  console.log('app start and runnning..');
  console.log('app start and running on : 3000');
});

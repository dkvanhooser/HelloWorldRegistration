var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

//validation
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

var validate = require('express-validation');
var userValidation = require('./validation/user.js');
var Joi = require('joi');

//db
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Das boot123',
  database : 'registration'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
});

var insertUserStatement = "insert into users values(?, ? , ?, ?, ?, ?, ?, 'US' , NOW());";
var selectUserStatement = 'Select * from users;';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//routing
app.get('/', function(req, res) {
  res.render('index');
});

app.post('/register', function(req, res, next) {
	const result = Joi.validate(req.body, userValidation);
	if(result.error){
		next(result.error);
	} else {
		var inserts = [req.body.firstName, req.body.lastName, req.body.address1, req.body.address2, req.body.city, req.body.state, req.body.zipCode];
		var statement = mysql.format(insertUserStatement, inserts);
		connection.query(statement, function (err, rows, fields) {
  			if (err) {
  				throw err
  			}else{
  				res.render('confirmation');
  			}
		});
	}
});

app.get('/users', function(req, res, next) {
	connection.query(selectUserStatement, function (err, rows, fields) {
  		if (err) throw errs;
		res.render('registrations', { users: rows });	
		});
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

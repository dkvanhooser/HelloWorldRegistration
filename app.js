var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Joi = require('joi');
 
var userSchema = Joi.object().keys({
    firstName: Joi.string().alphanum().min(2).max(30).required(),
    lastName: Joi.string().alphanum().min(2).max(30).required(),
    address1: Joi.string().alphanum().min(3).max(50).required(),
    address2: Joi.string().alphanum().min(3).max(50).required(),
    city: Joi.string().alphanum().min(2).max(30).required(),
    state: Joi.string().alphanum().min(2).max(2).required(),
    zipCode: Joi.string().regex(/^\d{5}(?:[-\s]\d{4})?$/).alphanum().min(5).max(10).required(),
});

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));


//db connection
var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Das boot123',
  database : 'registration'
});


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
	const result = Joi.validate(req.body, userSchema);

	if(result.error){
		next(result.error);
	} else {
		var insertUserStatement = "insert into users values('" + req.body.firstName + "', '" + req.body.lastName + "' , '" + req.body.address1 + "', '" + req.body.address2 + "' , '" + req.body.city +"', '" + req.body.state + "', '" + req.body.zipCode +"', 'US' , NOW());";

		connection.query(insertUserStatement, function (err, rows, fields) {
  			if (err) {
  				throw err
  			}else{
  				res.render('confirmation');
  			}
		});
	}
});

app.get('/users', function(req, res, next) {
	var selectUserStatement = 'Select * from users;';
	var users = ["WOOF"];
	connection.query(selectUserStatement, function (err, rows, fields) {
		users = rows;
	    console.log("users:")
		console.log(users);
  		if (err) throw errs;
		res.render('registrations', {users});	
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

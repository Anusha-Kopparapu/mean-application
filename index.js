// executed simple node example with express and nodemon with out angular
var express = require('express');
var app = express();
app.get('/', function(req, res){
   res.send("Hello world!");
});
//executed express routing with out angular 
app.get('/hello', function(req, res){
   res.send("You just called the get method at '/hello'!\n");
});

//Executing routing express.router
    var adminRouter = express.Router();
 
  
  adminRouter.use(function(req, res, next) {

 	
 	 	console.log(req.method, req.url);

 	
 	next(); 
 });
   // need to check in (http://localhost:1337/admin)
  adminRouter.get('/', function(req, res) {
  	res.send('I am admin!');
  });
 
 // need to check in (http://localhost:1337/admin/users)
 adminRouter.get('/users', function(req, res) {
 	res.send('I show all the users!');
 });

 //route parameters
 // need to check in  (http://localhost:1337/admin/users/name)
 adminRouter.get('/users/:name', function(req, res) {
	res.send('hello ' + req.params.name + '!');
 });

 // need to check in  (http://localhost:1337/admin/posts)
 adminRouter.get('/posts', function(req, res) {
 	res.send('I will post you all the updates!');
 });
 app.use('/admin', adminRouter); 
 // apply the routes to our application app.use('/admin', adminRouter);
 app.listen(3000);
console.log('server running on the port 3000!');
 

 
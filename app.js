require('dotenv').config();

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seed");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user");
//require the routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

//first create yelp_camp then use it
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
//change the range into a bigger one
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); // seed the database

app.use(require("express-session")({
	secret:"Haochen Li can make it into Facebook",
	resave :false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//add a middleware into app so that add the user into user obj then next()
// add currentUser into every template
//notice that for every ele in this section, the ele can be directly used in ejs without passing into they will keep empty unless we pass something into
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	// add flash message into every template so that every page may use them
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})
// add the prefix so that reduce the further url
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app.listen(3000, function(){
	console.log("the yelp camp server has started!!!");
})
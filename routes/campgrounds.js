var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index")
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);
//INDEX route - shows all campground
router.get("/", function(req, res){
	// req.user is the name of the user!!!
	Campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err);
		}else{
		//req.user is req's attr to show the current user
			res.render("campgrounds/index", {campgrounds:allcampgrounds, currentUser: req.user, page: 'campgrounds'});
		}
	});
	// res.render("campgrounds", {campgrounds:campgrounds});
});
//the name of post is the same with get they are different and since they are related wo that they should be the same method same url to post the content
//CREATE Route - add new camp to DB
//CREATE - add new campground to DB
//CREATE - add new campground to DB
router.post("/", middleware.isLogIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  if(req.body.location){
	  geocoder.geocode(req.body.location, function (err, data) {
	 
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
  }else{
	  //var newCampground = {name: name, image: image, description: desc, author:author, location: null, lat: null, lng: null}
	  var newCampground = {name: name, image: image, description: desc, author:author};
	  Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  }
});
//page to shows the form !!!
//NEW show form to create new (render the form page which is connected to post page) 
router.get("/new", middleware.isLogIn, function(req, res){
	res.render("campgrounds/new");
});
//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
	//id has no "_", foundCampground is the found result
	//change the id of comments into the string
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			res.render("campgrounds/show", {campground:foundCampground});
		}
	});
	//find the campground with provided ID
	// res.send("this will be the show page one day!!");
});
// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground:foundCampground});
	});
});

// UPDATE 
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});
//DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
	if(err){
		res.redirect("/campgrounds");
	}else{
		res.redirect("/campgrounds");
	}
	})
})


module.exports = router;
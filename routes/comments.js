var express = require("express");
//make the id can be passed through
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index")

// only log in may add the new comment
router.get("/new", middleware.isLogIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground:campground});
		}
		
		
	});
	//res.render("comments/new");
});
// incase anyone use postman to send the post request such as postman
router.post("/",middleware.isLogIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					
					console.log(err);
				}else{
					//add the username and id to comment
					//save comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					// console.log(campground);
					//_id is the attr in DB id is attr of params
					// console.log(comment);
					req.flash("success", "Success add the comment")
					res.redirect("/campgrounds/" + campground._id);
				}
		});
		}
	});
})
//EDIT
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
	//id has been defined in advance with previous id ele 
	Comment.findById(req.params.comment_id, function(err, founfComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit", {campground_id:req.params.id, comment:founfComment});
		}
	});
})
//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, uodatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});
//COMMENTS DESTROY ROUTES
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	//findbyid and remove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Commment success deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router;
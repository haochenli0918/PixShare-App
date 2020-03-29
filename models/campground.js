var mongoose = require("mongoose");
var campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	location: String,
	lat:Number,
	lng:Number,
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	},
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]
});
//create the model notice the collection name will be Campground, then lower case plus one "s", so it is campgrounds
module.exports = mongoose.model("Campground", campgroundSchema);
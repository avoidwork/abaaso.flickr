$.on("render", function(){
	// Getting the CSS skin
	var uri;
	switch (true) {
		case this.client.mobile:
		case this.client.table:
		default:
			uri = "assets/default.css";
	}
	this.get(uri, function(arg){ $.css(arg); });

	// Setting up Flickr
	this.flickr.config.id      = "";
	this.flickr.config.key     = "";
	this.flickr.config.sets    = [""];
	this.flickr.config.timeout = 10000;

	// Uncomment the line below
	//this.flickr.init();
});
$.on("render", function(){
	switch (true) {
		case this.client.mobile:
		case this.client.table:
			return undefined;
	}

	// Setting up Flickr
	this.flickr.config.id      = "63182296@N00";
	this.flickr.config.key     = "38d4dace912074353e60918d64aac446";
	this.flickr.config.sets    = ["72157626821186687"];
	this.flickr.config.timeout = 10000;

	// Uncomment the line below
	this.flickr.init();
});
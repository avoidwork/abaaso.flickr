/**
 * Retrieves a photoset from Flickr
 *
 * @param {Number} set Set ID
 */
flickr.prototype.init = function (set) {
	if (this.id === null || this.key === null) throw Error($.label.error.invalidArguments);

	var self     = this,
	    i        = set || (self.sets.length > 1 ? $.random(self.sets.length) : 0),
	    deferred = $.promise(),
	    uri      = api.set.replace("{{KEY}}", this.key).replace("{{ID}}", this.sets[i]);

	// Disabling observer
	$.observer.discard(true);

	// Setting up deferred Object
	deferred.then(function (arg) {
		// Decorating set
		self.data[self.loaded] = arg.photo;
		
		// Enabling observer
		$.observer.discard(false);

		// Loading images
		arg.photo.each(function (i) {
			self.load(i);
		});

		return arg;
	}, function (arg) {
		$.observer.discard(false);
		$.error(arg);
		return arg;
	});

	// Setting loaded set
	this.loaded = this.sets[i];

	// Setting up data store
	$.store(this, null, {key: "id", source: "photoset", ignore: "sizes"});
	this.data.setUri(uri, deferred);
};

/**
 * Retrieves sizes for a photo from the set
 * 
 * @param  {Object}  photo Photo record to display
 * @return {Object}        Photo record to display
 */
flickr.prototype.load = function (photo) {
	if (typeof photo === "undefined" || typeof photo.key === "undefined") return;

	var self  = this,
	    uri   = api.sizes.replace("{{KEY}}", this.key).replace("{{ID}}", photo.key),
	    index = this.data.keys[photo.key].index,
	    fn, r, img;

	fn = function (arg) {
		r = self.data.get(index);
		r.data.sizes = arg.sizes.size.clone();
		self.fire("flickrImage", r);
	};

	if (typeof photo.data.sizes === "undefined") uri.jsonp(fn, function () { $.fire("error"); }, "jsoncallback");
	return photo;
};

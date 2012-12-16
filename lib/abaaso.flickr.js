/**
 * abaaso.flickr
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2012 Jason Mulligan
 * @license BSD-3 <https://github.com/avoidwork/abaaso.flickr/blob/master/LICENSE>
 * @link https://github.com/avoidwork/abaaso.flickr
 * @module abaaso.flickr
 * @version 1.4.0
 */

(function (global) {
"use strict";

/**
 * Flickr factory
 * 
 * @param  {Object} config [Optional] Configuration to apply
 * @return {Object}        Instance of flickr
 */
flickr = function (config) {
	var self     = this;

	self.id      = null;
	self.key     = null;
	self.loaded  = null;
	self.photo   = null;
	self.sets    = [];
	self.timer   = null;
	self.timeout = 15000;

	$.merge(self, config);
};

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

/**
 * API end points
 * 
 * @type {Object}
 */
var api = {
	set   : "http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key={{KEY}}&photoset_id={{ID}}&format=json&jsoncallback=?",
	sizes : "http://api.flickr.com/services/rest/?&method=flickr.photos.getSizes&api_key={{KEY}}&photo_id={{ID}}&format=json&jsoncallback=?"
};

/**
 * Initializes the module
 * 
 * @param  {Object} abaaso Instance of abaaso
 * @return {Object}        Module
 */
init = function (abaaso) {
	$ = global[abaaso.aliased];
	return abaaso.module("flickr", flickr);
};

// AMD & Window supported
if (typeof define === "function") define(["abaaso"], function (abaaso) { return init(abaaso); });
else abaaso.on("init", function () { return init(abaaso); }, "abaaso.flickr");
})(this);

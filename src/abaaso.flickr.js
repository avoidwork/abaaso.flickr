/**
 * Copyright (c) 2011 - 2012, Jason Mulligan <jason.mulligan@avoidwork.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of abaaso.flickr nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL JASON MULLIGAN BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * abaaso.flickr
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @link http://avoidwork.com
 * @requires abaaso 2.4.1
 * @version 1.4.beta
 */
(function (global) {
	"use strict";

	var $, flickr, init;


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
		if (config instanceof Object) $.iterate(config, function (v, k) { self[k] = v; });
		return self;
	};

	/**
	 * Retrieves a photoset from Flickr
	 */
	flickr.prototype.init = function () {
		if (this.id === null || this.key === null) throw Error($.label.error.invalidArguments);

		var self = this,
		    i    = (self.sets.length > 1) ? Math.floor(Math.random() * self.sets.length + 1) : 0,
		    uri  = "http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=" + self.key + "&photoset_id=" + self.sets[i] + "&format=json&jsoncallback=?";

		self.loaded = self.sets[i];

		// Setting up a data store
		$.store(self);
		self.on("afterDataSet", function (r) { this.load(r); }, "photo").on("afterDataSync", function (data) { this.data[this.loaded] = data.photo; }, "photoset");
		self.data.source = "photoset";
		self.data.key    = "id";
		self.data.uri    = uri;
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
		    uri   = "http://api.flickr.com/services/rest/?&method=flickr.photos.getSizes&api_key=" + this.key + "&photo_id=" + this.key + "&format=json&jsoncallback=?",
		    index = self.data.keys[photo.key].index,
		    fn, r, img;

		fn = function (arg) {
			r = self.data.get(index);
			r.data.sizes = arg.sizes.size.clone();
			self.data.set(r.key, r.data, true);
			self.fire("flickrImage", r);
		};

		if (typeof photo.data.sizes === "undefined") uri.jsonp(fn, function () { $.fire("error"); }, "jsoncallback");
		return photo;
	};

	init = function (abaaso) {
		$ = global[abaaso.aliased];
		return abaaso.module("flickr", flickr);
	};

	// AMD support
	typeof define === "function" ? define(["abaaso"], function (abaaso) { return init(abaaso); }) : abaaso.on("init", function () { return init(abaaso); }, "abaaso.flickr");
})(this);

/**
 * Copyright (c) 2011, Jason Mulligan <jason.mulligan@avoidwork.com>
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
 * @requires abaaso 1.9
 * @version 1.3
 */
(function (window) {
	"use strict";

	var flickr = (function () {
		var $ = window[abaaso.aliased],
		    config, display, init, key, load, next, prev;

		config = {
			data    : {},
			id      : null,
			key     : null,
			photo   : null,
			loaded  : null,
			timer   : null,
			timeout : 30000,
			sets    : [""],
			slide   : false,
			version : "1.3"
		};

		/**
		 * Displays a photo from the set
		 *
		 * @param {Integer} index  Index of photo
		 */
		display = function (index) {
			if (index != config.photo) return;

			clearTimeout(config.timer);

			var  self  = $.flickr,
			     r     = self.data.get(index).data,
			     obj   = $("#photo"),
			     img   = $.create("img", {style:"display:none;", src: r.sizes.last().source}, obj);

			obj.css("opacity", 0);

			img.on("load", function(){
				this.un("load");
				obj.css("background-image", "url(" + this.src + ")");
				this.destroy();
				obj.css("opacity", 1);
				if (self.config.slide === true) $.flickr.config.timer = setTimeout(function(){ self.next.call(self); }, $.flickr.config.timeout);
			});
		};

		/**
		 * Retrieves a photoset from Flickr
		 */
		init = function () {
			if (config.id === null || config.key === null)
					throw Error($.label.error.invalidArguments);

			var self = $.flickr,
			    i    = (config.sets.length > 1) ? Math.floor(Math.random() * config.sets.length + 1) : 0,
			    uri  = "http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=" + config.key + "&photoset_id=" + config.sets[i] + "&format=json&jsoncallback=?",
			    fn, index;

			config.loaded = config.sets[i];

			if (typeof $("#year") !== "undefined") $("#year").text(new Date().getFullYear());

			// UI listeners
			$.on(document, "keydown", function (e) { key(e); });
			$.on(document, "keyup", function (e) { $(".click").removeClass("click"); });
			$("#next").on("click", function (e) { next(e); });
			$("#prev").on("click", function (e) { prev(e); });
			$("#play").on("click", function (e) {
				var fn = function () {
					next();
					config.timer = setTimeout(fn, config.timeout);
				};

				switch (true) {
					case config.slide:
						clearTimeout(config.timer);
						config.timer = null;
						break;
					default:
						fn();
				}
				config.slide = !config.slide;
			});

			// Setting up a data store
			$.store(self);
			self.on("afterDataSet", function(r) { load(r, false); }, "photo")
			    .on("afterDataSync", function(data) {
			    	config.data[config.loaded] = data.photo;
			    	index = next();
			    	delete abaaso.flickr.init;
			    }, "photoset");

			self.data.source = "photoset";
			self.data.key    = "id";
			self.data.uri    = uri;
		};

		/**
		 * Keypress handler
		 * 
		 * @param {Object} e Keyboard event
		 * @return {Object} Keyboard event
		 */
		key = function (e) {
			var code = (e.keyCode) ? e.keyCode : e.charCode;
			switch (code) {
				case 37:
				case 40:
					prev();
					$("#prev").addClass("click");
					break;
				case 38:
				case 39:
					next();
					$("#next").addClass("click");
					break;
			}
			return e;
		};

		/**
		 * Retrieves sizes for a photo from the set
		 * 
		 * @param  {Object}  photo Photo record to display
		 * @param  {Boolean} show  [Optional] Defaults to true, will display the photo
		 * @return {Object} Photo record to display
		 */
		load = function (photo, show) {
			if (typeof photo === "undefined" || typeof photo.key === "undefined") return next();

			show   = (show !== false);
			var self  = $.flickr,
			    uri   = "http://api.flickr.com/services/rest/?&method=flickr.photos.getSizes&api_key=" + config.key + "&photo_id=" + photo.key + "&format=json&jsoncallback=?",
			    index = self.data.keys[photo.key].index,
			    fn, r;

			switch (true) {
				case typeof photo.data.sizes === "undefined":
					fn = function(arg) {
						r = self.data.get(index);
						r.data.sizes = arg.sizes.size.clone();
						self.data.set(r.key, r.data, true);
						if (show === true) display(index);
					};
					uri.jsonp(fn);
					break;
				case show:
					display(index);
					break;
			}

			return photo;
		};

		/**
		 * Displays the next image in the set
		 * 
		 * @param  {Object} e Window event
		 * @return {Undefined} undefined
		 */
		next = function (e) {
			var self = $.flickr,
			    i    = (config.photo === null) ? Math.floor(Math.random() * self.data.records.length + 1) : parseInt(config.photo) + 1;

			if (i > self.data.total) i = 0;
			config.photo = i;
			load(self.data.get(i));
			return i;
		};

		/**
		 * Displays the previous image in the set
		 * 
		 * @param  {Object} e Window event
		 * @return {Undefined} undefined
		 */
		prev = function (e) {
			var self = $.flickr,
			    i = (config.photo === null) ? Math.floor(Math.random() * self.data.records.length + 1) : parseInt(config.photo) - 1;

			if (i < 0 ) i = self.data.total - 1;
			config.photo  = i;
			load(self.data.get(i));
			return i;
		};

		// @constructor
		return {
			config  : config,
			display : display,
			init    : init,
			key     : key,
			load    : load,
			next    : next,
			prev    : prev
		};
	}),
	fn = function () { abaaso.module("flickr", flickr()); };

	// AMD support
	typeof define === "function" ? define("abaaso.flickr", ["abaaso"], fn) : abaaso.on("render", fn, "abaaso.flickr");
})(window);

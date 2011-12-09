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
 * @requires abaaso 1.7.5
 * @version 1.0
 */
$.on("init", function(){
	$.module("flickr", {
		config : {
			data    : {},
			id      : null,
			key     : null,
			photo   : null,
			loaded  : null,
			timer   : undefined,
			timeout : 30000,
			sets    : [""],
			slide   : false
		},

		/**
		 * Displays a photo from the set
		 *
		 * @param {Integer} index  Index of photo
		 */
		display : function(index) {
			if (index != this.config.photo) return;

			clearTimeout(this.config.timer);

			var  self  = this,
			     r     = self.data.get(index).data,
			     obj   = $("#photo"),
			     img   = $.create("img", {style:"display:none;", src: r.sizes.last().source}, obj);

			obj.css("opacity", 0);

			img.on("load", function(){
				this.un("load");
				obj.style.backgroundImage = "url(" + this.src + ")";
				this.destroy();
				obj.css("opacity", 1);
				if (self.config.slide === true) self.config.timer = setTimeout(function(){ self.next.call(self); }, self.config.timeout);
			});
		},

		/**
		 * Retrieves a photoset from Flickr
		 */
		init : function() {
			if (this.config.id === null || this.config.key === null)
					throw Error($.label.error.invalidArguments);

			var self = this,
			    i    = (self.config.sets.length > 1) ? Math.floor(Math.random() * self.config.sets.length + 1) : 0,
			    uri  = "http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=" + self.config.key + "&photoset_id=" + self.config.sets[i] + "&format=json&jsoncallback=?",
			    key, fn, index;

			self.config.loaded = self.config.sets[i];

			if (typeof $("#year") !== "undefined") $("#year").text(new Date().getFullYear());

			// UI listeners
			$.on(document, "keydown", this.key, "keyboard", this);
			$("#next").on("click", this.next, "next", this);
			$("#prev").on("click", this.prev, "prev", this);
			$("#slideshow").on("click", function(){
				switch (true) {
					case this.config.slide:
						$("#slideshow").update({innerHTML: "Start"});
						this.config.slide = false;
						clearTimeout(this.config.timer);
						break;
					default:
						$("#slideshow").update({innerHTML: "Stop"});
						this.config.slide = true;
						this.next();
				}
			}, "slideshow", this);

			// Setting up a data store
			$.store(this);
			this.on("afterDataSet", function(r) { this.load(r, false); }, "photo")
			    .on("afterDataSync", function(data) {
			    	var o = this.parentNode;
			    	o.config.data[o.config.loaded] = data.photo;
			    	index = o.next();
					delete o.init;
			    }, "photoset", this.data);

			this.data.source = "photoset";
			this.data.key    = "id";
			this.data.uri    = uri;
		},

		/**
		 * Keypress handler
		 * 
		 * @param {Object} e Keyboard event
		 * @return {Object} Keyboard event
		 */
		key : function(e) {
			var code = (e.keyCode) ? e.keyCode : e.charCode;
			switch (code) {
				case 37:
				case 40:
					this.prev();
					break;
				case 38:
				case 39:
					this.next();
					break;
			}
			return e;
		},

		/**
		 * Retrieves sizes for a photo from the set
		 * 
		 * @param  {Object}  photo    Photo record to display
		 * @param  {Boolean} display  [Optional] Defaults to true, will display the photo
		 * @return {Object} Photo record to display
		 */
		load : function(photo, display) {
			if (typeof photo === "undefined" || typeof photo.key === "undefined") return this.next();

			display   = (display !== false);
			var uri   = "http://api.flickr.com/services/rest/?&method=flickr.photos.getSizes&api_key=" + this.config.key + "&photo_id=" + photo.key + "&format=json&jsoncallback=?",
			    index = this.data.keys[photo.key].index,
			    self  = this, fn;

			switch (true) {
				case typeof photo.data.sizes === "undefined":
					fn = function(arg) {
						self.data.get(index).data.sizes = [].concat(arg.sizes.size);
						if (display === true) self.display(index);
					};
					uri.jsonp(fn);
					break;
				case display:
					this.display(index);
					break;
			}

			return photo;
		},

		/**
		 * Displays the next image in the set
		 */
		next : function() {
			var i = (this.config.photo === null) ? Math.floor(Math.random() * this.data.records.length + 1) : parseInt(this.config.photo) + 1;
			if (i > this.data.records.length) i = 0;
			this.config.photo = i;
			this.load(this.data.get(i));
			return i;
		},

		/**
		 * Displays the previous image in the set
		 */
		prev : function() {
			var i = (this.config.photo === null) ? Math.floor(Math.random() * this.data.records.length + 1) : parseInt(this.config.photo) - 1;
			if (i < 0 ) i = this.data.total - 1;
			this.config.photo  = i;
			this.load(this.data.get(i));
			return i;
		},

		version : "1.0"
	});
}, "abaaso.flickr");

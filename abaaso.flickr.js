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
 *     * Neither the name of Jason Mulligan nor the
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
 * Note: Internet Explorer 8 is not supported
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @link http://avoidwork.com
 * @requires abaaso 1.7.010
 * @requires abaaso.fx 1.1
 * @version 1.0.tech
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
			     img   = $.create("img", {style:"display:none;", src: r.sizes.last().source}, obj),
			     cover = $("#cover");

			obj.css("opacity", 0);
			cover.addClass("loading");

			img.on("load", function(){
				this.un("load");
				cover.removeClass("loading");
				obj.style.backgroundImage = "url(" + this.src + ")";
				this.destroy();
				obj.css("opacity", 1);
				if (self.config.slide === true) self.config.timer = setTimeout(function(){ self.next.call(self); }, self.config.timeout);
			});
		},

		/**
		 * Displays or hides the image grid
		 *
		 * @param {Boolean} visible  Display or hide the grid
		 * @param {Object} Image grid
		 */
		grid : function(visible) {
			var obj  = typeof $("#grid") !== "undefined" ? $("#grid") : $.create("div", {id: "grid", "class" : "right"}).hide(),
			    self = this,
			    anchor, thumb, i, nth;

			self.grid.resize = function() {
				if (/left|right/.test(this.className)) this.style.height = ($.client.size.y - 75) + "px"
			}

			if (obj.childNodes.length === 0 && !self.data.total > 0) {
				this.grid.resize.call($("#grid"));
				$.on("resize", function(){ this.grid.resize.call($("#grid")); }, "grid", this)

				nth = self.data.total;
				for (i = 0; i < nth; i++) {
					obj.create("a", {id: "grid-" + i})
					   .on("click", function(){
					   		self.config.photo = parseInt(this.id.replace(/grid-/, ""));
					   		self.display(this.id.replace(/grid-/, ""));
						})
					   .create("img", {src: self.data.get(i).data.sizes.first().source});
				}
			}

			visible ? obj.show() : obj.hide();
			return obj;
		},

		/**
		 * Retrieves a photoset from Flickr
		 */
		init : function() {
			if (this.config.id === null || this.config.key === null || ($.client.ie && $.client.version == 8))
					throw Error($.label.error.invalidArguments);

			cover.addClass("loading");

			var self = this,
			    i    = (self.config.sets.length > 1) ? Math.floor(Math.random() * self.config.sets.length + 1) : 0,
			    uri  = "http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=" + self.config.key + "&photoset_id=" + self.config.sets[i] + "&format=json&jsoncallback=?",
			    key, fn, index;

			self.config.loaded = self.config.sets[i];
			if (typeof $("#year") !== "undefined") $("#year").text(new Date().getFullYear());

			// UX listeners
			switch (true) {
				case $.client.mobile || $.client.tablet:
					// $("#nav").hide();
					// break;
				default:
					$("#next").on("click", function(){ this.next(); }, "next", this);
					$("#prev").on("click", function(){ this.prev(); }, "prev", this);
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
			}

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
		 */
		key : function(e) {
			var unicode = (e.keyCode) ? e.keyCode : e.charCode;
			switch (unicode) {
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

		version : "1.0.beta"
	});
}, "abaaso.flickr");

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
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2011 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @link http://avoidwork.com
 * @requires abaaso 1.6.003
 * @requires abaaso.fx 1.1
 * @version 1.0
 */
abaaso.on("ready", function(){
	abaaso.un("ready", "abaaso.flickr");

	abaaso.define("flickr", {
		config   : {
			data : {},
			id   : null,
			key  : null,
			photo  : null,
			loaded : null,
			sets : [""]
		},

		/**
		 * Displays a photo from the set
		 *
		 * @param index {Integer} Index of photo
		 */
		display : function(index){
			if (index != this.config.photo) { return; }

			var r  = this.data.get(index).data,
			   img = abaaso.create("img", {style:"display:none;", "class": "photo", src: r.sizes.last().source}, $("#photo"));

			img.on("load", function(){
				($(".photo").length > 1) ? $(".photo:first").destroy() : void(0);
				this.style.display = "block";
				abaaso.flickr.resize(abaaso.client.size);
				this.un("load").opacity(0).fade(1000);
			});
		},

		/**
		 * Retrieves a photoset from Flickr
		 */
		init : function(){
			try {
				switch (true) {
					case (this.config.id === null):
					case (this.config.key === null):
						throw Error(abaaso.label.error.invalidArguments)
				}

				var self = this,
				    i    = (self.config.sets.length > 1) ? Math.floor(Math.random() * self.config.sets.length + 1) : 0,
				    uri  = "http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=" + self.config.key + "&photoset_id=" + self.config.sets[i] + "&format=json&jsoncallback=?",
				    key, fn, index;

				self.config.loaded = self.config.sets[i];

				$("#year").text(new Date().getFullYear());

				// UX listeners
				$("#next").on("click", function(){ this.next(); }, "next", this);
				$("#prev").on("click", function(){ this.prev(); }, "prev", this);
				abaaso.on("resize", function(arg){ this.resize(arg); }, "photo", this);

				fn = function(arg){
					try {
						self.config.data[self.config.loaded] = arg.photoset.photo;
						abaaso.store(self, self.config.data[self.config.loaded]);
						index = self.next();
						for (var i = 0, loop = self.data.records.length; i < loop; i++) {
							if (i == index) { continue; }
							self.load(self.data.records[i].data, i, false);
						}
						delete self.init;
					}
					catch (e) {
						abaaso.error(e, arguments, this);
						self.init();
					}
				}

				// Displays a random photo in the set, builds a grid
				abaaso.jsonp(uri, fn, "jsoncallback");
			}
			catch (e) {
				abaaso.error(e, arguments, this);
			}
		},

		/**
		 * Keypress handler
		 */
		key : function(e){
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
		},

		/**
		 * Retrieves sizes for a photo from the set
		 * 
		 * @param photo {Object} Photo object to display
		 */
		load : function(photo, index, display){
			display = display || true;
			var uri = "http://api.flickr.com/services/rest/?&method=flickr.photos.getSizes&api_key=" + this.config.key + "&photo_id=" + photo.id + "&format=json&jsoncallback=?",
			    self = this, fn;

			if (typeof photo.sizes == "undefined") {
				fn = function(arg){
					photo.sizes = [].concat(arg.sizes.size);
					(display === true) ? self.display(index) : void(0);
				};
				abaaso.jsonp(uri, fn, "jsoncallback");
			}
			else {
				(display === true) ? self.display(index) : void(0);
			}
		},

		/**
		 * Displays the next image in the set
		 */
		next : function(){
			var i = (this.config.photo === null) ? Math.floor(Math.random() * this.data.records.length + 1)
			                                     : parseInt(this.config.photo) + 1;

			(i > this.data.records.length) ? i = 0 : void(0);
			this.config.photo  = i;
			this.load(this.data.get(i).data, i);
			return i;
		},

		/**
		 * Displays the previous image in the set
		 */
		prev : function(){
			var i = (this.config.photo === null) ? Math.floor(Math.random() * this.data.records.length + 1)
			                                     : parseInt(this.config.photo) - 1;

			(i < 0 ) ? i = this.data.records.length : void(0);

			this.config.photo  = i;
			this.load(this.data.get(i).data, i);
			return i;
		},

		/**
		 * Resizes the photo container
		 */
		resize : function(size){
			var p = $("#photo"),
			    c = $("#cover");

			p.style.height = size.y;
			p.style.width  = size.x;
			c.style.height = size.y;
			c.style.width  = size.x;
		},

		version : "1.0"
	});
}, "abaaso.flickr", abaaso);

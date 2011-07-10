/**
 * abaaso.flickr
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2011 avoidwork inc.
 * @link http://avoidwork.com
 * @requires abaaso 1.6.003
 * @version 1.0
 */

abaaso.on("ready", function(){
	abaaso.define("flickr", {
		config   : {
			data : {},
			id   : "",
			key  : "",
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
}, "gui");

// Starting the GUI
abaaso.on("render", function(){ abaaso.flickr.init(); }, "gui");
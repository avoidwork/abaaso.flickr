/**
 * API end points
 * 
 * @type {Object}
 */
var api = {
	set   : "http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key={{KEY}}&photoset_id={{ID}}&format=json&jsoncallback=?",
	sizes : "http://api.flickr.com/services/rest/?&method=flickr.photos.getSizes&api_key={{KEY}}&photo_id={{ID}}&format=json&jsoncallback=?"
};

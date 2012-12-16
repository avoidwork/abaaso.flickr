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

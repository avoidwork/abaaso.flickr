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

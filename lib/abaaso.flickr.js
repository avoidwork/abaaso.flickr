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
if (typeof define === "function") define(["abaaso"], function (abaaso) { return init(abaaso); })
else abaaso.on("init", function () { return init(abaaso); }, "abaaso.flickr");
})(this);

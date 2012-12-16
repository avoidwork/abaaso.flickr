// AMD & Window supported
if (typeof define === "function") define(["abaaso"], function (abaaso) { return init(abaaso); });
else abaaso.on("init", function () { return init(abaaso); }, "abaaso.flickr");
})(this);

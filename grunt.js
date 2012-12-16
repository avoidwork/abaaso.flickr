module.exports = function (grunt) {
	grunt.initConfig({
		pkg : "<json:package.json>",
		meta : {
			  banner : "/**\n" + 
					   " * <%= pkg.name %>\n" +
					   " *\n" +
					   " * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n" +
					   " * @copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
					   " * @license <%= pkg.licenses[0].type %> <<%= pkg.licenses[0].url %>>\n" +
					   " * @link <%= pkg.homepage %>\n" +
					   " * @module <%= pkg.name %>\n" +
					   " * @version <%= pkg.version %>\n" +
					   " */"
		},
		concat: {
		  dist: {
			src : [
				"<banner>",
				"src/intro.js",
				"src/core.js",
				"src/prototype.js",
				"src/api.js",
				"src/init.js",
				"src/outro.js"
			],
			dest : "lib/<%= pkg.name %>.js"
		  }
		},
		min : {
			"lib/abaaso.flickr.min.js" : ["<banner>", "lib/abaaso.flickr.js"]
		},
		test : {
			files : ["test/**/*.js"]
		}
	});

	grunt.registerTask("default", "concat min test");
};
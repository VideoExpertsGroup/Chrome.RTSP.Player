var copy = require('directory-copy')
var replace = require("replace");
var Promise = require('promise');
var mkdirp = require('mkdirp');
var CleanCSS = require('clean-css');
var copyfiles = require('copyfiles');
const trash = require('trash');
//var fs = require('fs')
var UglifyJS = require("uglify-js");
var childProcess = require('child_process');
var execFile = childProcess.execFile;
var fs = require('fs-extra')
var ok = "Done.";
var fail = "Fail.";

// detect version
var version = 'unknown';
var pattern = new RegExp(/^[\d]+\.[\d]+\.[\d]+$/);
process.argv.forEach(function (val, index, array) {
	if(pattern.test(val)){
		version = val;
	}
});

var tasks = [];
tasks.push(function (resolve, reject) {
  console.log("Building version of " + version);
  resolve();
});

tasks.push(function (resolve, reject) {
	if (!fs.existsSync('dist')) {
		console.log("Make directory 'dist'");
		mkdirp('dist/pnacl', function (err) {
			if (err){
				reject(err)
			}else{
				resolve("OK");
			}
		});
	}else{
		resolve("OK");
	}
});

tasks.push(function (resolve, reject) {
	var filename = 'dist/vxgplayer-' + version + '.min.css';
	console.log("Make minifier from 'src/vxgplayer.css' to '" + filename + "'... ");
	var cleancss = new CleanCSS().minify(['src/vxgplayer.css']);
	fs.writeFile(filename, cleancss.styles, function (err) {
		if (err) reject(err); else resolve("OK");
	});
});

tasks.push(function (resolve, reject) {
	var filename = 'dist/demo.min.css';
	console.log("Make minifier version from 'src/demo.css' to '" + filename + "' ... ");
	var cleancss = new CleanCSS().minify(['src/demo.css']);
	fs.writeFile(filename, cleancss.styles, function (err) {
		if (err) reject(err); else resolve("OK");
	});
});

tasks.push(function (resolve, reject) {
	var filename = 'dist/zenburn.min.css';
	console.log("Copy css-file from 'src/zenburn.min.css' to '" + filename + "' ... ");
	fs.readFile('src/zenburn.min.css', 'utf8', function (err,data) {
		if (err) {
			reject(err)
		}else{
			fs.writeFile(filename, data, function (err) {
				if (err) reject(err); else resolve("OK");
			});
		};
	});
});

tasks.push(function (resolve, reject) {
	var files = []
	files.push(__dirname + '/dist/vxgplayer-' + version + '.min.js')
	files.push(__dirname + '/dist/vxgplayer-' + version + '.js')
	files.push(__dirname + '/dist/pnacl')
	
	console.log("Removing files \n\t" + files.join("\n\t"));
	trash(files).then(function(){
		resolve("OK");
	});
});

function replaceVersionInJS(code){
	code = code.replace(/window.vxgplayer.version="([ .A-Za-z0-9]+)"/gi,'window.vxgplayer.version="' + version + '"');
	return code;
}

tasks.push(function (resolve, reject) {
	var filename = 'dist/vxgplayer-' + version + '.min.js';
	console.log("Minifier js-file from 'src/vxgplayer.js' to '" + filename + "' ... ");
	var result = UglifyJS.minify("src/vxgplayer.js");
	result.code = replaceVersionInJS(result.code);
	fs.writeFile(filename, result.code, function (err) {
		if (err) reject(err); else resolve("OK");
	});
});

tasks.push(function (resolve, reject) {
	var filename = 'dist/vxgplayer-' + version + '.js';
	console.log("Copy js-file from 'src/vxgplayer.js' to '" + filename + "' ... ");
	fs.readFile('src/vxgplayer.js', 'utf8', function (err,data) {
		if (err) {
			reject(err)
		}else{
			data = replaceVersionInJS(data);
			fs.writeFile(filename, data, function (err) {
				if (err) reject(err); else resolve("OK");
			});
		};
	});
});

tasks.push(function (resolve, reject) {
	var filename = 'dist/vxgplayer-' + version + '.min.js';
	console.log("Copy js-file from 'src/vxgplayer.js' to '" + filename + "' ... ");
	fs.readFile('src/vxgplayer.js', 'utf8', function (err,data) {
		if (err) {
			reject(err)
		}else{
			data = replaceVersionInJS(data);
			fs.writeFile(filename, data, function (err) {
				if (err) reject(err); else resolve("OK");
			});
		};
	});
});

tasks.push(function (resolve, reject) {
	var filename = 'dist/highlight.min.js';
	console.log("Copy js-file from 'src/highlight.min.js' to '" + filename + "' ... ");
	fs.readFile('src/highlight.min.js', 'utf8', function (err,data) {
		if (err) {
			reject(err)
		}else{
			fs.writeFile(filename, data, function (err) {
				if (err) reject(err); else resolve("OK");
			});
		};
	});
});

var index_html;

tasks.push(function (resolve, reject) {
	console.log("Read index.html from 'src/index.html' ... ");
	fs.readFile('src/index.html', 'utf8', function (err,data) {
		if (err) {
			reject(err)
		}else{
			index_html = data;
			resolve("OK");
		};
	});
});

tasks.push(function (resolve, reject) {
	console.log("Generate html from API.md and replace {{{content}}} in index.html ... ");
	fs.readFile('API.md', 'utf8', function (err,data) {
		if (err) {
			reject(err)
		}else{
			md_parser = require("node-markdown").Markdown;
			api_html = md_parser(data);
			var re = /\{\{\{content\}\}\}/gi;
			index_html = index_html.replace(re, api_html);
			resolve("OK");
		};
	});
});

tasks.push(function (resolve, reject) {
	console.log("Replacing in index.html"
		+ "\n\t'vxgplayer.css' -> 'vxgplayer-" + version + ".min.css'"
		+ "\n\t'vxgplayer.zip' -> 'vxgplayer-" + version + ".zip'" 
		+ "\n\t'vxgplayer.js' -> 'vxgplayer-" + version + ".min.js'" 
		+ "\n\t'%vxg_version%' -> '" + version + "'");
	index_html = index_html.replace('%vxg_version%', version);
	index_html = index_html.replace('vxgplayer.css', "vxgplayer-" + version + ".min.css");
	index_html = index_html.replace('vxgplayer.css', "vxgplayer-" + version + ".min.css");
	index_html = index_html.replace('vxgplayer.zip', "vxgplayer-" + version + ".zip");
	index_html = index_html.replace('vxgplayer.zip', "vxgplayer-" + version + ".zip");
	index_html = index_html.replace('vxgplayer.js', "vxgplayer-" + version + ".min.js");
	index_html = index_html.replace('vxgplayer.js', "vxgplayer-" + version + ".min.js");
	resolve("OK");
});

tasks.push(function (resolve, reject) {
	console.log("Write index.html to 'dist/index.html' ...");
	var mod_index_html = index_html.replace(/<!--DIST:-->[ ]*/gi,'')
	mod_index_html = mod_index_html.replace(/\n.*<!--DEMO:-->[ ]*<div .*div>[ ]*\r*\n*/gi,'')
	fs.writeFile('dist/index.html', mod_index_html, function (err) {
		if (err) reject(err); else resolve("OK");
	});
	resolve("OK");
});

tasks.push(function (resolve, reject) {
	console.log("Write index.html to 'dist/index_forzip.html' ...");
	
	var mod_index_html = index_html.replace(/<!--DEMO:-->[ ]*/gi,'')
	mod_index_html = mod_index_html.replace(/\n.*<!--DIST:-->[ ]*<div .*div>[ ]*\r*\n*/gi,'')
	mod_index_html = mod_index_html.replace('demo.min.css','http://rtpstream.com/nacl_player_api/demo.min.css');
	mod_index_html = mod_index_html.replace('zenburn.min.css','http://rtpstream.com/nacl_player_api/zenburn.min.css');
	mod_index_html = mod_index_html.replace('highlight.min.js','http://rtpstream.com/nacl_player_api/highlight.min.js');
	fs.writeFile('dist/index_forzip.html', mod_index_html, function (err) {
		if (err) reject(err); else resolve("OK");
	});
	resolve("OK");
});


tasks.push(function (resolve, reject) {
	console.log("Copy 'src/pnacl' to 'dist/pnacl' ...");
	if (!fs.existsSync( __dirname + '/dist/pnacl/Release')) {
		console.log("Make directory "+__dirname + '/dist/pnacl');
		mkdirp( __dirname + '/dist/pnacl', function (err) {
			if (err){
				reject(err)
			}else{
				resolve("OK");
			}
		});
	}else{
		resolve("OK");
	}
});

tasks.push(function (resolve, reject) {
	console.log("Copy file media_player.nmf' ...");
	fs.copy(__dirname +'/src/pnacl/Release/media_player.nmf', __dirname + '/dist/pnacl/Release/media_player.nmf',
      function (err) {
		if (err) reject(err); else resolve("OK");
	});
});

tasks.push(function (resolve, reject) {
	console.log("Copy file media_player.pexe' ...");
	fs.copy(__dirname +'/src/pnacl/Release/media_player.pexe', __dirname + '/dist/pnacl/Release/media_player.pexe',
      function (err) {
		if (err) reject(err); else resolve("OK");
	});
});

tasks.push(function (resolve, reject) {
	var filename = 'dist/vxgplayer-' + version + '.zip';
	console.log("Build zip '" + filename + "' ...");
	
	//batch files
	var zipfiles = [
		{source : 'dist/vxgplayer-' + version + '.js',target:'vxgplayer-' + version + '.js'},
		{source : 'dist/vxgplayer-' + version + '.min.js',target:'vxgplayer-' + version + '.min.js'},
		{source : 'dist/vxgplayer-' + version + '.min.css',target:'vxgplayer-' + version + '.min.css'}
	];

	var result_dirs = [];
	var result_files = [];
	var tmp_dirs = [];
	tmp_dirs.push('dist/pnacl');
	while(tmp_dirs.length > 0){
		var dir = tmp_dirs[0];
		tmp_dirs = tmp_dirs.slice(1,0);
		var trg = dir.replace('dist/','');
		zipfiles.push({target: trg});
		var files = fs.readdirSync(dir);
		for(var i = 0; i < files.length; i++){
			var fn = dir + '/' + files[i];
			var src = dir + '/' + files[i];
			var trg = src.replace('dist/','');
			if(fs.lstatSync(fn).isDirectory()){
				tmp_dirs.push(fn);
			}else{
				zipfiles.push({
					source: src,
					target: trg
				});
			}
		}
	}

	var zip = new require('node-zip')();
	for(var el in zipfiles){
		if(zipfiles[el].source){
			console.log("\t file: " + zipfiles[el].target + " (from " + zipfiles[el].source + ")");
			zip.file(zipfiles[el].target, fs.readFileSync(zipfiles[el].source));
		}else{
			console.log("\t dir: " + zipfiles[el].target);
		}
	}
	
	var data = zip.generate({base64:false,compression:'DEFLATE'});
	fs.writeFileSync(filename, data, 'binary');
	resolve("OK");
});

tasks.push(function (resolve, reject) {
	var filename = 'dist/vxgplayer-' + version + '.zip';
	console.log("Build zip '" + filename + "' from ");
	//batch add files
	var zipfiles = [
		{source : 'dist/index_forzip.html',target:'index.html'},
		{source : 'dist/vxgplayer-' + version + '.js',target:'vxgplayer-' + version + '.js'},
		{source : 'dist/vxgplayer-' + version + '.min.js',target:'vxgplayer-' + version + '.min.js'},
		{source : 'dist/vxgplayer-' + version + '.min.css',target:'vxgplayer-' + version + '.min.css'}
	];

	var result_dirs = [];
	var result_files = [];
	var tmp_dirs = [];
	tmp_dirs.push('dist/pnacl');
	while(tmp_dirs.length > 0){
		var dir = tmp_dirs[0];
		tmp_dirs = tmp_dirs.slice(1,0);
		var trg = dir.replace('dist/','');
		zipfiles.push({target: trg});
		var files = fs.readdirSync(dir);
		for(var i = 0; i < files.length; i++){
			var fn = dir + '/' + files[i];
			var src = dir + '/' + files[i];
			var trg = src.replace('dist/','');
			if(fs.lstatSync(fn).isDirectory()){
				tmp_dirs.push(fn);
			}else{
				zipfiles.push({
					source: src,
					target: trg
				});
			}
		}
	}

	var zip = new require('node-zip')();
	for(var el in zipfiles){
		if(zipfiles[el].source){
			console.log("\t file: " + zipfiles[el].target + " (from " + zipfiles[el].source + ")");
			zip.file(zipfiles[el].target, fs.readFileSync(zipfiles[el].source));
		}else{
			console.log("\t dir: " + zipfiles[el].target);
		}
	}

	var data = zip.generate({base64:false,compression:'DEFLATE'});
	fs.writeFileSync(filename, data, 'binary');
	resolve("OK");
});

tasks.push(function (resolve, reject) {
	var files = []
	files.push(__dirname + '/dist/index_forzip.html')
	console.log("Removing temporary files \n\t" + files.join("\n\t"));
	trash(files).then(function(){
		resolve("OK");
	});
})

// run order tasks
var currentTask = 0;
function runNextTask(){
	var prom = new Promise(tasks[currentTask]);
	prom.then(function(){
		currentTask++;
		if(currentTask < tasks.length) {
			runNextTask();
		}else{
			console.log('Done.');	
		}
	},function(err){
		console.log('Fail.\n' + err);
	});
}
runNextTask();


/*
 * "new-build": "node build.js",
    "build": "npm-run-all mkdirs build-css build-js build-js-min build-js-min1 build-index0 build-index1 build-index3 build-index4 sync-fold$
    "copy-pnacl": "node build.js",
    "build-zip": "cd dist/ && trash vxgplayer-%npm_package_version%.zip && bestzip vxgplayer-%npm_package_version%.zip vxgplayer-%npm_packag$
    "build-zip-demo": "cd demo/ && trash vxgplayer-$npm_package_version.zip && bestzip vxgplayer-$npm_package_version.zip vxgplayer-$npm_pac$
    "sync-folders": "copyfiles dist/*.css demo/ && copyfiles dist/*.js demo/ && copyfiles dist/*.html demo/",
    "cleanup-indexhtml-dist": "replace '.*<!--DEMO:-->.*' '' dist/index.html",
    "cleanup-indexhtml-demo": "replace '.*<!--DIST:-->.*' '' demo/index.html"

 * */

// var replace = require("replace");
// replace({ regex: "foo", replacement: "bar", paths: ['dist/index.html'], silent: true });

/*





copy(
    { src: __dirname + '/pnacl_demo'
    , dest: __dirname + '/demo/pnacl'
    , excludes: [ /^\./ ] // Exclude hidden files 
    }
  , function () {
    console.log('Copy done!')
  })

trash([__dirname + '/dist/vxgplayer-1.7.38.zip', __dirname + '/demo/vxgplayer-1.7.38.zip']).then(() => {
	console.log('Removed zip from dist and demo');
});


*/

// cd dist/ && trash vxgplayer-%npm_package_version%.zip && bestzip vxgplayer-%npm_package_version%.zip vxgplayer-%npm_package_version%.css vxgplayer-%npm_package_version%.min.js vxgplayer-%npm_package_version%.js pnacl && cd ..

// cd dist/ && trash vxgplayer-%npm_package_version%.zip && bestzip vxgplayer-%npm_package_version%.zip vxgplayer-%npm_package_version%.css vxgplayer-%npm_package_version%.min.js vxgplayer-%npm_package_version%.js pnacl && cd ..

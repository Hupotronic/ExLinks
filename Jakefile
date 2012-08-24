function hereDoc(f) { /* From http://stackoverflow.com/a/5571069 */
  return f.toString().
      replace(/^[^\/]+\/\*!?/, '').
      replace(/\*\/[^\/]+$/, '');
}

var fs = require('fs'),
	uglify = require('uglify-js'),
	VERSION = '2.0.0',
	HEADER = hereDoc(function() {/*!
// ==UserScript==
// @name           4chan ExLinks
// @namespace      hupotronic
// @author         Hupo
// @version        #VERSION#
// @description    Makes exhentai/e-hentai links more useful.
// @include        http://boards.4chan.org/*
// @include        https://boards.4chan.org/*
// @include        http://archive.foolz.us/*
// @include        https://archive.foolz.us/*
// @updateURL      http://userscripts.org/scripts/source/135734.user.js
// @run-at         document-start
// ==/UserScript==
	*/}),
	JAKEFILE = 'Jakefile',
	INFILE = 'exlinks.js',
	OUTFILE = '4chan-exlinks.user.js',
	CHANGELOG = 'changelog',
	LATEST = 'latest.js';
	
desc('Default task.');
task('default', [], function() {
	var help = hereDoc(function() {/*!
ExLinks building options:
    'help'            - Shows this help.
    'build'           - Build the script.
    'dev' [chrome]    - Developer mode for continous building.
                        If 'chrome' is specified as an argument,
                        updates the userscript in Chrome automatically.
    
	*/});
	//HEADER = HEADER.replace('#VERSION#',VERSION);
	//console.log(HEADER);
	console.log(help)
});


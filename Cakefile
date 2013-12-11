{log}    = console
{exec}   = require 'child_process'
fs       = require 'fs'
{minify} = require 'html-minifier'
ugly     = require 'uglify-js'

VERSION   = '2.2.2'
HEADER    = """
// ==UserScript==
// @name           ExLinks
// @namespace      hupotronic
// @author         Hupo
// @version        #{VERSION}
// @description    Makes e-hentai/exhentai links more useful.
// @include        http://boards.4chan.org/*
// @include        https://boards.4chan.org/*
// @include        http://archive.foolz.us/*
// @include        https://archive.foolz.us/*
// @include        http://beta.foolz.us/*
// @include        https://beta.foolz.us/*
// @include        http://boards.38chan.net/*
// @updateURL      https://github.com/Hupotronic/ExLinks/raw/stable/ExLinks.user.js
// @downloadURL    https://github.com/Hupotronic/ExLinks/raw/stable/ExLinks.user.js
// @run-at         document-start
// ==/UserScript==
"""

CAKEFILE  = 'Cakefile'
INFILE    = 'exlinks.js'
ELEMENTS  = './elements'
IMAGES    = './images'
IMAGEJSON = 'images.json'
STYLEFILE = 'style.css'
OUTFILE   = 'ExLinks.user.js'
LATEST    = 'latest.js'
CHANGELOG = 'changelog'

option '-o', '--output [output]', 'Specify output location.'
option '-u', '--uglify [uglify]', 'Minify with UglifyJS. Options: "mangle,squeeze"'
option '-v', '--version [version]', 'Release version.'

task 'build', (options) ->
	jsp = ugly.parser
	pro = ugly.uglify
	OUTPUT = options.output || OUTFILE
	html = {}
	store = (path) ->
		dest = {}
		files = fs.readdirSync path
		for file in files
			ext = file.split '.'
			input = fs.readFileSync path+'/'+file, 'utf8'
			input = minify input, { removeComments: true, collapseWhitespace: true }
			input = input.replace /\#{([^}]*)}/g, "'+$1+'"
			dest[ext[0]] = input
		return dest
	html = store ELEMENTS
	input = fs.readFileSync INFILE, 'utf8'
	images = fs.readFileSync IMAGEJSON, 'utf8'
	style = fs.readFileSync STYLEFILE, 'utf8'
	style = minify style, { collapseWhitespace: true }
	stylebuf = new Buffer style, 'utf8'
	styleb64 = stylebuf.toString('base64')
	input = input.replace "\#DETAILS\#", html.details
	input = input.replace "\#ACTIONS\#", html.actions
	input = input.replace "\#OPTIONS\#", html.options
	input = input.replace "img = {}", "img = #{images}"
	input = input.replace "css = '';", "css = 'data:text/css;base64,#{styleb64}';"
	input = input.replace /\/\*jshint.*\*\//, ''
	if options.uglify
		{uglify} = options
		uopts = uglify.split ','
		ast = jsp.parse input
		if uopts[0] == 'mangle'
			ast = pro.ast_mangle(ast)
		if uopts[1] == 'squeeze'
			ast = pro.ast_squeeze(ast)
		input = pro.gen_code(ast)
	input = "\n"+HEADER+"\n"+input
	fs.writeFileSync OUTPUT, input, 'utf8', (err) ->
		throw err if err
	log 'Build successful!'

task 'images', (options) ->
	OUTPUT = options.output || IMAGEJSON
	images = {}
	store = (path) ->
		dest = {}
		files = fs.readdirSync path
		for file in files
			ext = file.split '.'
			if ext.length == 2 and ext[1] == 'png'
				image = new Buffer (fs.readFileSync path+'/'+file, 'binary'), 'binary'
				image_b64 = 'data:image/png;base64,'+image.toString('base64')
				dest[ext[0]] = image_b64
		return dest
	images = store IMAGES
	# images.ratings = store IMAGES+'/ratings'
	# images.categories = store IMAGES+/categories'

	fs.writeFileSync OUTPUT, JSON.stringify(images), 'utf8', (err) ->
		throw err if err
	log 'Image data rebuilt successfully!'

task 'dev', (options) ->
	invoke 'build'
	fs.watchFile INFILE, interval: 250, (curr, prev) ->
		if curr.mtime > prev.mtime
			invoke 'build'
	fs.watchFile './elements/details.htm', interval: 250, (curr, prev) ->
		if curr.mtime > prev.mtime
			invoke 'build'
	fs.watchFile './elements/actions.htm', interval: 250, (curr, prev) ->
		if curr.mtime > prev.mtime
			invoke 'build'
	fs.watchFile './elements/options.htm', interval: 250, (curr, prev) ->
		if curr.mtime > prev.mtime
			invoke 'build'
	fs.watchFile './style.css', interval: 250, (curr, prev) ->
		if curr.mtime > prev.mtime
			invoke 'build'
###
task 'release', (options) ->
	{version} = options
	unless version
		console.warn 'Version argument not specified. Exiting.'
		return
	regexp = RegExp VERSION, 'g'
	for file in [CAKEFILE, INFILE, OUTFILE]
		data = fs.readFileSync file, 'utf8'
		fs.writeFileSync file, data.replace regexp, version
		data = fs.readFileSync CHANGELOG, 'utf8'
		fs.writeFileSync CHANGELOG, data.replace 'master', "master\n\n#{version}"
		exec "git commit -am 'Release #{version}.'"
		exec "git tag -a #{version} -m '#{version}'"
		exec "git tag -af stable -m '#{version}'"
###
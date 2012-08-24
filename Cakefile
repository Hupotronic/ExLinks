{log}    = console
{exec}   = require 'child_process'
fs       = require 'fs'
{minify} = require 'html-minifier'
ugly     = require 'uglify-js'
finder   = require 'findit'

VERSION   = '2.0.0'
HEADER    = """

// ==UserScript==
// @name           4chan ExLinks
// @namespace      hupotronic
// @author         Hupo
// @version        #{VERSION}
// @description    Makes exhentai/e-hentai links more useful.
// @include        http://boards.4chan.org/*
// @include        https://boards.4chan.org/*
// @include        http://archive.foolz.us/*
// @include        https://archive.foolz.us/*
// @updateURL      http://userscripts.org/scripts/source/135734.user.js
// @run-at         document-start
// ==/UserScript==

"""

INFILE    = 'exlinks.js'
ELEMENTS  = './elements'
IMAGES    = './images'
IMAGEJSON = 'images.json'
OUTFILE   = 'ExLinks.user.js'
LATEST    = 'latest.js'
CHANGELOG = 'CHANGELOG'

option '-o', '--output [PATH]', 'Specify output location.'

task 'build', (options) ->
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
	input = input.replace "\#DETAILS\#", html.details
	input = input.replace "\#ACTIONS\#", html.actions
	input = input.replace "\#OPTIONS\#", html.options
	input = input.replace "img = {}", "img = #{images}"
	input = input.replace /\/\*jshint.*\*\//, ''
	input = HEADER+input
	fs.writeFileSync OUTPUT, input, 'utf8', (err) ->
		throw err if err
	log 'Build successful!'

option '-o', '--output [PATH]', 'Specify output file.'

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
	images.ratings = store IMAGES+'/ratings'
	images.categories = store IMAGES+'/categories'

	fs.writeFileSync OUTPUT, JSON.stringify(images), 'utf8', (err) ->
		throw err if err
	log 'Image data rebuilt successfully!'
	
option '-b', '--browser [PATH]', 'Specify path to browser userscript storage location for instant reloading.'

task 'dev', (options) ->
	invoke 'build'
	fs.watchFile INFILE, interval: 250, (curr, prev) ->
		if curr.mtime > prev.mtime
			invoke 'build'
			if options.browser
				log options.browser

###
option '-v', '--version [VERSION]', 'Release a new version.'

task 'release', (options) ->
  {version} = options
  return log 'ERROR! No version provided.' unless version
  data = fs.readFileSync SCRIPT, 'utf8'
  fs.writeFileSync SCRIPT, data.replace /(\/\s@version\s+|VERSION\s+=\s\")[\d\.]+/g, "$1#{version}", 'utf8', (err) ->
  throw err if err
  data = fs.readFileSync CHANGELOG, 'utf8'
  fs.writeFileSync CHANGELOG, data.replace 'master', "master\n\n#{version}", 'utf8', (err) ->
  throw err if err
  exec "cake build && git commit -am 'Release #{version}'"
###
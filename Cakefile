{log}  = console
{exec} = require 'child_process'
fs     = require 'fs'
min    = require 'html-minifier'
ugly   = require 'uglify-js'

CAKEFILE  = 'Cakefile'
VERSION   = '2.0.0'
INFILE    = 'exlinks.js'
ELEMENTS  = 'elements/'
IMAGES    = 'images/'
IMAGEJSON = 'images.json'
OUTFILE   = 'ExLinks.user.js'
LATEST    = 'latest.js'
CHANGELOG = 'CHANGELOG'
HEADER    = """
// ==UserScript==
// @name           4chan ExLinks
// @namespace      hupotronic
// @author         Hupo
// @version        2.0.0
// @description    Makes exhentai/e-hentai links more useful.
// @include        http://boards.4chan.org/*
// @include        https://boards.4chan.org/*
// @include        http://archive.foolz.us/*
// @include        https://archive.foolz.us/*
// @updateURL      http://userscripts.org/scripts/source/135734.user.js
// @run-at         document-start
// ==/UserScript==
"""

option '-o', '--output [DIR]', 'Specify output location.'

task 'build', (options) ->
  OUTPUT = options.output || INFILE
  css = fs.readFileSync STYLE, 'utf8'
  css = css.replace /(\/\*[^\*]+\*\/|\t|\r|\n|\s{4})/g, ''
  css = css.replace /;}/g, '}'
  css = css.replace /\s(\+|\?|:|(?:!|=)==)(?:\s|\n)/g, '$1'
  ujs = fs.readFileSync INFILE, 'utf8'
  fs.writeFileSync OUTPUT, ujs.replace /css\s=.+;/, "css = \"#{css}\";", 'utf8', (err) ->
    throw err if err
  log 'Build Successful!'

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
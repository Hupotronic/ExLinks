/*jshint eqnull:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, curly:true, browser:true, devel:true, maxerr:50 */
(function() {
	"use strict";
	var fetch, defaults, conf, regex, img, d, t, $, $$,
		UI, Cache, API, Database, Options, Sauce, Filter, Parser, Config, Main;
	
	fetch = {
		original: {site: "Original"},
		geHentai: {site: "g.e-hentai.org"},
		exHentai: {site: "exhentai.org"}
	};	
	defaults = { 
		main: {
			General: {
				'Automatic Processing':        ['checkbox', true,  'Get data and format links automatically.'],
				'Gallery Details':             ['checkbox', true,  'Show gallery details for link on hover.'],
				'Gallery Actions':             ['checkbox', true,  'Generate gallery actions for links.'],
				'ExSauce':                     ['checkbox', true,  'Add ExSauce lookup to images.'],
				'Filter':                      ['checkbox', true,  'Use the highlight filter on gallery information.'],
				'Smart Links':                 ['checkbox', false, 'All links lead to E-Hentai unless they have fjording tags.'],
				'Disable Local Storage Cache': ['checkbox', false, 'If set, Session Storage is used for caching instead.'],
				'Populate Database on Load':   ['checkbox', false, 'Load all cached galleries to database on page load.']
			},
			Actions: {
				'Show by Default':             ['checkbox', false, 'Show gallery actions by default.'],
				'Hide in Quotes':              ['checkbox', true,  'Hide any open gallery actions in inline quotes.'],
				'Torrent Popup':               ['checkbox', true,  'Use the default pop-up window for torrents.'],
				'Archiver Popup':              ['checkbox', true,  'Use the default pop-up window for archiver.'],
				'Favorite Popup':              ['checkbox', true,  'Use the default pop-up window for favorites.'],
				'Favorite Autosave':           ['checkbox', false, 'Autosave to favorites. Overrides normal behavior.']
			}
		},
		favorite: {
			'Favorite Category': [UI.favorite, 0, 'The category to use.'],
			'Favorite Comment': [UI.textbox, '', 'The comment to use.']
		},
		domains: {
				'Gallery Link':         ['domain', fetch.original, 'The domain used for the actual link. Overriden by Smart Links.'],
				'Torrent Link':         ['domain', fetch.original, 'The domain used for the torrent button in Actions.'],
				'Hentai@Home Link':     ['domain', fetch.original, 'The domain used for the Hentai@Home button in Actions.'],
				'Archiver Link':        ['domain', fetch.original, 'The domain used for the Archiver button in Actions.'],
				'Uploader Link':        ['domain', fetch.original, 'The domain used for the Uploader button in Actions.'],
				'Favorites Link':       ['domain', fetch.original, 'The domain used for the Favorite button in Actions.'],
				'Stats Link':           ['domain', fetch.original, 'The domain used for the Stats button in Actions.'],
				'Tag Links':            ['domain', fetch.original, 'The domain used for tag links in Actions.']
		},
		filter: {
			'Name Filter': ['textarea', [
				'# Highlight all doujinshi and manga galleries with (C82) in the name:',
				'# /\\(C82\\)/;only:doujinshi,manga;link:yes;color:#FF0000'
			].join('\n')],
			'Tag Filter': ['textarea', [
				'# Highlight "english" and "translated" tags in non-western non-non-h galleries:',
				'# /english|translated/;not:western,non-h;color:#0069B6',
				'# Highlight all non-english language tags in doujinshi/manga/artistcg/gamecg galleries:',
				'# /korean|chinese|italian|vietnamese|thai|spanish|french|german|portuguese|russian|dutch|hungarian|indonesian|finnish|rewrite/;only:doujinshi,manga,artistcg,gamecg;color:#FF000',
				'# Highlight the link for galleries tagged with "touhou project":',
				'# /touhou project/;link:yes,color:#FF3300'
			].join('\n')],
			'Uploader Filter': ['textarea', [
				'# Highlight links for galleries uploaded by "ExUploader"',
				'# /ExUploader/;link:yes;color:#FFFFFF'
			].join('\n')]
		},
		sauce: {
			'Site to Use':              ['saucedomain', fetch.exHentai, 'The domain to use for showing results. Filters out fjorded content if set to E-Hentai.'],
			'Inline Sauce':             ['checkbox', true,  'Shows the results inlined rather than opening the site. Works with Smart Links.'],
			'Search Expunged':          ['checkbox', false, 'Search expunged galleries as well.'],
			'Use Custom Label':         ['checkbox', false,  'Use a custom label instead of the site name (e-hentai/exhentai).'],
			'Custom Label Text':        ['textbox', 'exsauce']
		}
	};	
	regex = {
		url: /(http:\/\/)?g?\.?e[\-x]hentai\.org\/[^\ \n]*/,
		site: /(g\.e\-hentai\.org|exhentai\.org)/,
		type: /t?y?p?e?[\/|\-]([gs])[\/|\ ]/,
		uid: /uid\-([0-9]+)/,
		token: /token\-([0-9a-z]+)/,
		page: /page\-([0-9a-z]+)\-([0-9]+)/,
		gid: /\/g\/([0-9]+)\/([0-9a-z]+)/,
		sid: /\/s\/([0-9a-z]+)\/([0-9]+)\-([0-9]+)/,
		fjord: /(bestiality|incest|lolicon|shotacon|toddlercon)/
	};
	conf = {};
	img = {};

	/* 
	A whole bunch of code lifted pretty much straight from 4chan X.
	Stripped and extended to only contain the necessary functionality for ExLinks.
	Loosely follows the jQuery API:	http://api.jquery.com/ (Not chainable)
	*/
	d = document;
	t = { /* time units */
		SECOND: 1000,
		MINUTE: 1000 * 60,
		HOUR: 1000 * 60 * 60,
		DAY: 1000 * 60 * 60 * 24
	};
	$ = function(selector, root) {
		if(root == null) {
			root = d.body;
		}
		return root.querySelector(selector);
	};
	$$ = function(selector, root) {
		if(root == null) {
			root = d.body;
		}
		return Array.prototype.slice.call(root.querySelectorAll(selector));
	};
	$.extend = function(object, properties) {
		var key, val;
		for (key in properties)
		{
			if( properties.hasOwnProperty(key) ) // speedup
			{
				val = properties[key];
				object[key] = val;
			}
		}
	};
	$.extend($, {
		ready: function(fc) {                  /* run function 'fc' when document is ready */
			var cb;
			if (/interactive|complete/.test(d.readyState))
			{
				return setTimeout(fc);
			}
			cb = function()
			{
				$.off(d, 'DOMContentLoaded', cb);
				return fc();
			};
			return $.on(d, 'DOMContentLoaded', cb);
		},
		dedup: function(array) {               /* remove duplicates from an array */
			var out = [], obj = {};
			for ( var i = 0; i < array.length; i++ )
			{
				obj[array[i]] = 0;
			}
			for ( var j in obj )
			{
				if( obj.hasOwnProperty(j) ) { out.push(j); }
			}
			return out;
		},
		dedupg: function(array) {              /* remove duplicates from a gallery array */
			var out = [], obj = {};
			for ( var i = 0; i < array.length; i++ )
			{
				obj[array[i]] = 0;
			}
			for ( var j in obj )
			{
				if( obj.hasOwnProperty(j) ) { out.push(j); }
			}
			return out;
		},
		id: function(id) {                     /* get element by id */
			return d.getElementById(id);
		},
		nodes: function(nodes) {               /* merge nodes into an element */
			var frag, node, _i, _len;
			if (!(nodes instanceof Array))
			{
				return nodes;
			}
			frag = d.createDocumentFragment();
			for (_i = 0, _len = nodes.length; _i < _len; _i++)
			{
				node = nodes[_i];
				frag.appendChild(node);
			}
			return frag;
		},
		tnodes: function(node) {               /* get textNodes of element */
			var tn = [], ws = /^\s*$/, getTextNodes;
			getTextNodes = function(node) {
				var cn;
				for ( var i = 0; i < node.childNodes.length; i++ )
				{
					cn = node.childNodes[i];
					if (cn.nodeType === 3)
					{
						if(!ws.test(cn.nodeValue))
						{
							tn.push(cn);
						}
					} else
					if (cn.nodeType === 1)
					{
						if(cn.tagName === 'SPAN' || cn.tagName === 'P')
						{
							getTextNodes(cn);
						}
					}
				}
			};
			getTextNodes(node);
			return tn;
		},
		add: function(parent, children) {      /* insert 'children' to the end of 'parent' */
			return parent.appendChild($.nodes(children));
		},
		prepend: function(parent, children) {  /* insert 'children' to the beginning of 'parent' */
			return parent.insertBefore($.nodes(children), parent.firstChild);
		},
		after: function(root, el) {            /* insert 'el' after 'root' */
			return root.parentNode.insertBefore($.nodes(el), root.nextSibling);
		},
		before: function(root, el) {           /* insert 'el' before 'root' */
			return root.parentNode.insertBefore($.nodes(el), root);
		},
		replace: function(root, el) {          /* replace 'root' with 'el' */
			return root.parentNode.replaceChild($.nodes(el), root);
		},
		textreplace: function(str, replace) {  /* run text replacement on string */
			var text = str;
			for ( var i = 0; i < replace.length; i++ )
			{
				text = text.replace(replace[i][0],replace[i][1]);
			}
			return text;
		},
		tn: function(s) {                      /* create textNode */
			return d.createTextNode(s);
		},
		el: function(tag, properties) {        /* create element */
			var el;
			el = d.createElement(tag);
			if (properties)
			{
				$.extend(el, properties);
			}
			return el;
		},
		rm: function(el) {                     /* remove element */
			return el.parentNode.removeChild(el);
		},
		on: function(el, events, handler) {    /* add event handler(s) */
			var event, _i, _len, _ref;
			_ref = events.split(' ');
			for (_i = 0, _len = _ref.length; _i < _len; _i++)
			{
				event = _ref[_i];
				el.addEventListener(event, handler, false);
			}
		},
		off: function(el, events, handler) {   /* remove event handler(s) */
			var event, _i, _len, _ref;
			_ref = events.split(' ');
			for (_i = 0, _len = _ref.length; _i < _len; _i++)
			{
				event = _ref[_i];
				el.removeEventListener(event, handler, false);
			}
		}
	});
	
	UI = {
		html: {
			details: function(data) { return '#DETAILS#'; },
			actions: function(data) { return '#ACTIONS#'; },
			options: function(data) { return '#OPTIONS#'; }
		},
		details: function(uid) {
			var data, replace, frag, jtitle, date, tags;
			
			data = Database.get(uid);
			replace = [
				['#THUMB#',             data.thumb],
				['#CATEGORY_IMAGE#',    img.categories[data.category]],
				['#CATEGORY#',          data.category],
				['#RATING_IMAGE#',      img.ratings[Math.round(data.rating*2)]],
				['#RATING#',            data.rating],
				['#VOTES#',             data.votes],
				['#FILES#',             data.files],
				['#SIZE#',              data.size],
				['#TORRENTS#',          data.torrents],
				['#TITLE#',             data.title],
				['#JTITLE#',            jtitle],
				['#USER#',              data.user],
				['#DATE#',              date],
				['#TAGS#',              tags]
			];
			frag = d.createDocumentFragment();
			frag.innerHTML = $.textreplace(UI.html.details, replace);
			
			return frag;
		},
		actions: function(uid,eid) {
		
		},
		button: function(link,eid) {
			var button;
			button = $.el('a',{
				id: 'exbutton-'+eid,
				className: 'exlink exbutton_processlink',
				innerHTML: UI.button.text(link.href),
				href: link.href
			});
			button.style.marginRight = '4px';
			button.style.textDecoration = 'none';
			button.setAttribute('target','_blank');
			$.before(link,button);
		},
		options: function() {
		
		},
		toggle: function(e) {
		
		},
		show: function(e) {
		
		},
		hide: function(e) {
		
		},
		move: function(e) {
		
		},
		init: function() {
			$.extend(UI.button, {
				text: function(url) {
				
				}
			});
		}
	};	
	API = {
		s: {},
		g: {},
		queue: function(type) {
			if(type === 's') {
				for ( var k in API.g ) {
					if( API.s[k] ) {
						delete API.s[k];
					}
				}
				return Object.keys(API.s).length;
			} else
			if(type === 'g') {
				return Object.keys(API.g).length;
			}
			return 0;
		},
		request: function(type,hash) {
			var xhr, request;
			if(type === 's') {
				request = {
					"method": "PID",
					"type": "token",
					"IDs": []
				};
				for( var j in API.s ) {
					request.IDs.push = [
						parseInt(j,10),
						API.s[j][0],
						parseInt(API.s[j][1],10)
					];
				}
			} else
			if(type === 'g') {
				request = {
					"method": "GID",
					"type": "meta",
					"IDs": []
				};
				for ( var k in API.g ) {
					request.IDs.push = [
						parseInt(k,10),
						API.g[k]
					];
				}
			}
			if(type === 'i') {
				request = {
					"method": "SHA1",
					"type": "meta",
					"fileopts": {
						"fs_covers": 0,
						"fs_exp": (conf['Search Expunged'] ? 1 : 0)
					},
					"filehash": hash
				};
			}
			if(request) {
				xhr = new XMLHttpRequest();
				xhr.open('POST', 'http://api.e-hentai.org');
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.onreadystatechange = function() {
					if(xhr.readyState === 4 && xhr.status === 200)
					{
						API.response(type,JSON.parse(xhr.responseText));
					}
				};
				xhr.send(JSON.stringify(request));
			}
		},
		response: function(type,json) {
			var arr;
			if(type === 's') {
				arr = json.gToken;
				for ( var i = 0; i < arr.length; i++ )
				{
					API.queue.add('g',arr[i].GID,arr[i].gKey);
				}
				API.clear('s');
			} else
			if(type === 'g') {
				arr = json.gMetaData;
				for ( var j = 0; j < arr.length; j++ )
				{
					Database.set(arr[j].data);
					Main.queue.add(arr[j].data.GID);
				}
			} else
			if(type === 'i') {
				// ExSauce stuff
			}
			Main.update();
		},
		init: function() {
			$.extend(API.queue, {
				add: function(type,uid,token,page) {
					if(type === 's') {
						API.s[uid] = [token,page];
					}
					if(type === 'g') {
						API.g[uid] = token;
					}
				},
				clear: function(type) {
					API[type] = {};
				}
			});
		}
	};
	Database = {}; $.extend(Database, {
		get: function(uid) {
			var data;
			if(Database[uid])
			{
				return Database[uid];
			} else {
				data = Cache.get(uid);
				if(data) {
					Database.set(data);
					return data;
				} else {
					return false;
				}
			}
		},
		set: function(data) {
			var uid = data.GID;
			Database[uid] = data;
			Cache.set(data);
		},
		usage: function(uid) {
			if(!Database.usage.data[uid]) {
				Database.usage.data[uid] = 0;
			}
			return Database.usage.data[uid]++;
		},
		init: function() {
			if(conf['Disable Local Storage Cache']) {
				Cache = sessionStorage;
			} else {
				Cache = localStorage;
			}
			$.extend(Database.usage, {
				data: {}
			});
			$.extend(Cache, {
				get: function(uid) {
					var key, json;
					key = 'exlinks-gallery-'+uid;
					json = Cache.getItem(key);
					if(json) {
						json = JSON.parse(json);
						if ( Date.now() > json.added + json.TTL )
						{
							Cache.removeItem(key);
							return false;
						} else {
							return JSON.parse(json.data);
						}
					} else {
						return false;
					}
				},
				set: function(data) {
					var key, TTL, date;
				},
				load: function() {
					var key, data;
					
					for ( var i = 0; i < Cache.length; i++ )
					{
						key = Cache.key(i);
						if( key.match('exlinks-gallery') )
						{
							data = Cache.get(key.match(/[0-9]+/));
							if(data)
							{
								Database.set(data);
							}
						}
					}
				}
			});
			if(conf['Populate Database on Load']) {
				Cache.load();
			}
		}
	});
	Parser = {
		posts: 'blockquote',
		links: '.exlink',
		unprocessed: function(uid) {
			return '.uid-'+uid+':not(.processed)';
		},
		linkify: function(post) {
			var nodes, node, text, match, links, link,
				linknode, sp, ml, tn, tl, tu;
			nodes = $.tnodes(post);
			for ( var i = 0; i < nodes.length; i++ )
			{
				node = nodes[i];
				text = node.textContent;
				match = text.match(regex.url);
				tl = null;
				linknode = (match) ? [] : null;
				while( match )
				{
					sp = text.search(regex.url);
					ml = match[0].length-1;
					tn = $.tn(text.substr(0,sp));
					tl = text.substr(sp+ml+1,text.length);
					tu = $.el('a', {
						href: match[0],
						innerHTML: match[0],
						className: 'exlink gallerylink unprocessed'
					});
					linknode.push(tn);
					linknode.push(tu);
					text = tl;
					match = text.match(regex.url);
				}
				if(tl) { linknode.push(tl); }
				if(linknode) { $.replace(node, linknode); }
			}
			links = $$('.gallerylink',post);
		}
	};
	Config = {
		site: function() {
			var curSite, curDocType, curType;
			curSite = document.URL;
			curDocType = document.doctype;
			curType = [
				"<!DOCTYPE ",
				curDocType.name,
				(curDocType.publicId ? ' PUBLIC "' + curDocType.publicId + '"' : ''),
				(!curDocType.publicId && curDocType.systemId ? ' SYSTEM' : ''), 
				(curDocType.systemId ? ' "' + curDocType.systemId + '"' : ''),
			'>'].join('');
			if(curSite.match('archive.foolz.us'))
			{
				if(curType.match('<!DOCTYPE html>'))
				{
					Parser.posts = '.text';
					Parser.links = 'a:not(.backlink)';
				}
			}
		},
		save: function() {
		
		},
		load: function() {
			
		}
	};
	Main = {
		format: function() {
		
		},
		queue: function() {
			var arr = [], i = 0,
				obj = Main.queue.list;
			for ( var k in obj ) {
				arr[i++] = parseInt(k,10);
			}
			return arr;
		},
		update: function() {
			var queue = Main.queue();
			if(API.queue('s')) {
				API.request('s');
			} else
			if(API.queue('g')) {
				API.request('g');
			}
			if(queue.length) {
				Main.format(queue);
				Main.queue.clear();
			}
		},
		process: function(el) {
			var posts, post, links, link, images, image,
				type, uid, check, match, token, page;
			posts = $$(Parser.posts,el);
			for ( var i = 0; i < posts.length; i++ )
			{
				post = posts[i];
				if(post.innerHTML.match(regex.url))
				{
					if(!post.classList.contains('exlinkified'))
					{
						Parser.linkify(post);
						post.classList.add('exlinkified');
					}
					links = $$('.exlink',post);
					for ( var j = 0; j < links.length; j++ )
					{
						link = links[j];
						if(link.classList.contains('extoggle')) {
							$.on(link,'click',UI.toggle);
						}
						if(link.classList.contains('exfetch')) {
							$.on(link,'click',UI.single);
						}
						if(link.classList.contains('processed')) {
							$.on(link,'mouseover',UI.show);
							$.on(link,'mouseout',UI.hide);
							$.on(link,'mousemove',UI.move);
						}
						if(link.classList.contains('unprocessed')) {
							type = link.className.match(regex.type);
							uid = link.className.match(regex.uid);
							token = link.className.match(regex.token);
							page = link.className.match(regex.page);
							if(type === 's')
							{
								check = Database.get(uid);
								if(check) {
									type = 'g';
									token = check.gKey;
									link.classList.remove('type-s');
									link.classList.add('type-g');
									link.classList.add('token-'+token);
								} else {
									API.queue.add('s',uid,page[0],page[1]);
								}
							}
							if(type === 'g')
							{
								
							}
						}
					}
				}
				
			}
			
			Main.update();
		},
		dom: function(e) {
			if(e.target.nodeName === 'DIV')
			{
				if(!e.target.classList.contains('exblock'))
				{
					Main.process(e.target);
				}
			}	
		},
		ready: function() {
			Config.site();
			Main.process(d);
			$.on(d,'DOMNodeInserted',Main.dom);
		},
		init: function() {
			Config.load();
			Database.init();
			API.init();
			UI.init();
			$.extend(Main.queue, {
				list: {},
				add: function(uid) {
					Main.queue.list[uid] = true;
				},
				clear: function() {
					Main.queue.list = {};
				}
			});
			$.ready(Main.ready);
		}
	};	
	
	Main.init();
// copy that
}).call(this);
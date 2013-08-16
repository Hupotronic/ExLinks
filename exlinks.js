/*jshint eqnull:true, noarg:true, noempty:true, eqeqeq:true, bitwise:false, strict:true, undef:true, curly:true, browser:true, devel:true, maxerr:50 */
(function() {
	"use strict";
	var fetch, options, conf, tempconf, pageconf, regex, img, cat, d, t, $, $$,
		Debug, UI, Cache, API, Database, Hash, SHA1, Sauce, Filter, Parser, Options, Config, Main;
	
	img = {};
	cat = {
		"Artist CG Sets": {"short": "artistcg",  "name": "Artist CG"  },
		"Asian Porn":     {"short": "asianporn", "name": "Asian Porn" },
		"Cosplay":        {"short": "cosplay",   "name": "Cosplay"    },
		"Doujinshi":      {"short": "doujinshi", "name": "Doujinshi"  },
		"Game CG Sets":   {"short": "gamecg",    "name": "Game CG"    },
		"Image Sets":     {"short": "imageset",  "name": "Image Set"  },
		"Manga":          {"short": "manga",     "name": "Manga"      },
		"Misc":           {"short": "misc",      "name": "Misc"       },
		"Non-H":          {"short": "non-h",     "name": "Non-H"      },
		"Private":        {"short": "private",   "name": "Private"    },
		"Western":        {"short": "western",   "name": "Western"    }
	};
	fetch = {
		original: {value: "Original"},
		geHentai: {value: "g.e-hentai.org"},
		exHentai: {value: "exhentai.org"}
	};
	options = {
		general: {
			'Automatic Processing':        ['checkbox', true,  'Get data and format links automatically.'],
			'Gallery Details':             ['checkbox', true,  'Show gallery details for link on hover.'],
			'Gallery Actions':             ['checkbox', true,  'Generate gallery actions for links.'],
			'Smart Links':                 ['checkbox', false, 'All links lead to E-Hentai unless they have fjording tags.'],
			'ExSauce':                     ['checkbox', true,  'Add ExSauce reverse image search to posts. Disabled in Opera.']
			/*'Filter':                      ['checkbox', true,  'Use the highlight filter on gallery information.'],*/
		},
		actions: {
			'Show by Default':             ['checkbox', false, 'Show gallery actions by default.'],
			'Hide in Quotes':              ['checkbox', true,  'Hide any open gallery actions in inline quotes.'],
			'Torrent Popup':               ['checkbox', true,  'Use the default pop-up window for torrents.'],
			'Archiver Popup':              ['checkbox', true,  'Use the default pop-up window for archiver.'],
			'Favorite Popup':              ['checkbox', true,  'Use the default pop-up window for favorites.']
			/*'Favorite Autosave':         ['checkbox', false, 'Autosave to favorites. Overrides normal behavior.']*/
		},
		/*favorite: {
			'Favorite Category':           ['favorite', 0, 'The category to use.'],
			'Favorite Comment':            ['textbox', 'ExLinks is awesome', 'The comment to use.']
		},*/
		sauce: {
			'Inline Results':              ['checkbox', true,  'Shows the results inlined rather than opening the site. Works with Smart Links.'],
			'Show Results by Default':     ['checkbox', true,  'Open the inline results by default.'],
			'Hide Results in Quotes':      ['checkbox', true,  'Hide open inline results in inline quotes.'],
			'Show Short Results':          ['checkbox', true,  'Show gallery names when hovering over the link after lookup (similar to old ExSauce).'],
			'Search Expunged':             ['checkbox', false, 'Search expunged galleries as well.'],
			'Lowercase on 4chan':          ['checkbox', true,  'Lowercase ExSauce label on 4chan.'],
			'No Underline on Sauce':       ['checkbox', false,  'Force the ExSauce label to have no underline.'],
			'Use Custom Label':            ['checkbox', false, 'Use a custom label instead of the site name (e-hentai/exhentai).'],
			'Custom Label Text':           ['textbox', 'ExSauce', 'The custom label.'],
			'Site to Use':                 ['saucedomain', fetch.exHentai, 'The domain to use for the reverse image search.']
		},
		domains: {
			'Gallery Link':                ['domain', fetch.original, 'The domain used for the actual link. Overriden by Smart Links.'],
			'Torrent Link':                ['domain', fetch.original, 'The domain used for the torrent link in Actions.'],
			'Hentai@Home Link':            ['domain', fetch.original, 'The domain used for the Hentai@Home link in Actions.'],
			'Archiver Link':               ['domain', fetch.original, 'The domain used for the Archiver link in Actions.'],
			'Uploader Link':               ['domain', fetch.original, 'The domain used for the Uploader link in Actions.'],
			'Favorite Link':               ['domain', fetch.original, 'The domain used for the Favorite link in Actions.'],
			'Stats Link':                  ['domain', fetch.original, 'The domain used for the Stats link in Actions.'],
			'Tag Links':                   ['domain', fetch.original, 'The domain used for tag links in Actions.']
		},
		debug: {
			'Debug Mode':                  ['checkbox', false, 'Enable debugger and logging to browser console.'],
			'Disable Local Storage Cache': ['checkbox', false, 'If set, Session Storage is used for caching instead.'],
			'Populate Database on Load':   ['checkbox', false, 'Load all cached galleries to database on page load.']
		}/*
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
		},*/
	};	
	regex = {
		url: /(https?:\/\/)?(forums|gu|g|u)?\.?e[\-x]hentai\.org\/[^\ \n<>\'\"]*/,
		protocol: /https?\:\/\//,
		site: /(g\.e\-hentai\.org|exhentai\.org)/,
		type: /t?y?p?e?[\/|\-]([gs])[\/|\ ]/,
		uid: /uid\-([0-9]+)/,
		token: /token\-([0-9a-f]+)/,
		page: /page\-([0-9a-f]+)\-([0-9]+)/,
		gid: /\/g\/([0-9]+)\/([0-9a-f]+)/,
		sid: /\/s\/([0-9a-f]+)\/([0-9]+)\-([0-9]+)/,
		fjord: /abortion|bestiality|incest|lolicon|shotacon|toddlercon/
	};
	t = {
		SECOND: 1000,
		MINUTE: 1000 * 60,
		HOUR: 1000 * 60 * 60,
		DAY: 1000 * 60 * 60 * 24
	};
	d = document;
	conf = {};
	tempconf = {};
	pageconf = {};
	
	/*
		Inspired by 4chan X and jQuery API:
		http://api.jquery.com/
		Functions are not chainable.
	*/
	$ = function(selector, root) {
		if(root == null) { root = d.body; }
		return root.querySelector(selector);
	};
	$$ = function(selector, root) {
		if(root == null) { root = d.body; }
		return Array.prototype.slice.call(root.querySelectorAll(selector));
	};
	$.extend = function(obj, properties) {
		for ( var k in properties ) {
			obj[k] = properties[k];
		}
	};
	$.extend($, {
		clamp: function(val,min,max) {
			if(val < min) {
				return min;
			} else
			if(val > max) {
				return max;
			} else {
				return val;
			}
		},
		elem: function(arr) {
			var frag = d.createDocumentFragment();
			for ( var i = 0, ii = arr.length; i < ii; i++ )
			{
				frag.appendChild(arr[i]);
			}
			return frag;
		},
		frag: function(content) {
			var frag, div;
			frag = d.createDocumentFragment();
			div = $.create('div', {
				innerHTML: content
			});
			for ( var i = 0, ii = div.childNodes.length; i < ii; i++ ) {
				frag.appendChild(div.childNodes[i].cloneNode(true));
			}
			return frag;
		},
		textnodes: function(elem) {
			var tn = [], ws = /^\s*$/, getTextNodes;
			getTextNodes = function(node) {
				var cn;
				for ( var i = 0, ii = node.childNodes.length; i < ii; i++ )
				{
					cn = node.childNodes[i];
					if(cn.nodeType === 3)
					{
						if(!ws.test(cn.nodeValue))
						{
							tn.push(cn);
						}
					} else
					if(cn.nodeType === 1)
					{
						if(cn.tagName === 'SPAN' || cn.tagName === 'P' || cn.tagName === 'S')
						{
							getTextNodes(cn);
						}
					}
				}
			};
			getTextNodes(elem);
			return tn;
		},
		id: function(id) {
			return d.getElementById(id);
		},
		prepend: function(parent, child) {
			return parent.insertBefore(child, parent.firstChild);
		},
		add: function(parent, child) {
			return parent.appendChild(child);
		},
		before: function(root, elem) {
			return root.parentNode.insertBefore(elem, root);
		},
		after: function(root, elem) {
			return root.parentNode.insertBefore(elem, root.nextSibling);
		},
		replace: function(root, elem) {
			return root.parentNode.replaceChild(elem, root);
		},
		remove: function(elem) {
			return elem.parentNode.removeChild(elem);
		},
		tnode: function(text) {
			return d.createTextNode(text);
		},
		create: function(tag, properties) {
			var elem = d.createElement(tag);
			if(properties) {
				$.extend(elem, properties);
			}
			return elem;
		},
		on: function(elem, eventlist, handler) {
			var event;
			if(eventlist instanceof Array) {
				for ( var i = 0, ii = eventlist.length; i < ii; i++ ) {
					event = eventlist[i];
					elem.addEventListener(event[0],event[1],false);
				}
			} else {
				elem.addEventListener(eventlist,handler,false);
			}
		},
		off: function(elem, eventlist, handler) {
			var event;
			if(eventlist instanceof Array) {
				for ( var i = 0, ii = eventlist.length; i < ii; i++ ) {
					event = eventlist[i];
					elem.removeEventListener(event[0],event[1],false);
				}
			} else {
				elem.removeEventListener(eventlist,handler,false);
			}
		}
	});
	Debug = {
		on: false,
		timer: {},
		value: {},
		init: function() {
			if(conf['Debug Mode'] === true) {
				Debug.on = true;
			}
			$.extend(Debug.timer, {
				start: function(name) {
					if(Debug.on) {
						Debug.timer[name] = Date.now();
					}
				},
				stop: function(name) {
					if(Debug.on) {
						Debug.timer[name] = Date.now() - Debug.timer[name];
						return Debug.timer[name]+'ms';
					}
				}
			});
			$.extend(Debug.value, {
				add: function(name,value) {
					if(Debug.on) {
						if(!Debug.value[name]) {
							Debug.value[name] = 0;
						}
						if(value) {
							Debug.value[name] += value;
						} else {
							Debug.value[name]++;
						}
					}
				},
				get: function(name) {
					if(Debug.on) {
						var ret = Debug.value[name];
						Debug.value[name] = 0;
						return ret;
					}
				},
				set: function(name,value) {
					if(Debug.on) {
						Debug.value[name] = value;
					}
				}
			});
		},
		log: function(arr) {
			if(Debug.on) {
				var log;
				if(arr instanceof Array) {
					log = arr;
				} else {
					log = [arr];
				}
				for ( var i = 0, ii = log.length; i < ii; i++ )
				{
					console.log('ExLinks '+Main.version+':',log[i]);
				}
			}
		}
	};
	UI = {
		html: {
			details: function(data) { return '#DETAILS#'; },
			actions: function(data) { return '#ACTIONS#'; },
			options: function()     { return '#OPTIONS#'; },
			stars:   function(data) {
				var str = '', star = '',
					tmp, rating = Math.round(parseFloat(data,10)*2);
				for ( var i = 0; i < 5; i++ ) {
					tmp = $.clamp(rating - (i*2),0,2);
					switch(tmp) {
						case 0: star = 'none'; break;
						case 1: star = 'half'; break;
						case 2: star = 'full';
					}
					str += '<div class="exr'+(i+1)+' star-'+star+'"></div>';
				}
				return str;
			}
		},
		details: function(uid) {
			var data, date, div, frag, taglist, tagspace, tag, content;
			data = Database.get(uid);
			if(data.title_jpn) {
				data.jtitle = '<br /><span class="exjptitle">'+data.title_jpn+'</span>';
			} else {
				data.jtitle = '';
			}
			date = new Date(parseInt(data.posted,10)*1000);
			data.datetext = UI.date(date);
			data.visible = data.expunged ? 'No' : 'Yes';
			taglist = [];
			for ( var i = 0, ii = data.tags.length; i < ii; i++ )
			{
				tag = $.create('a', {
					innerHTML: data.tags[i],
					className: "exlink extag",
					href: 'http://exhentai.org/tag/'+data.tags[i].replace(/\ /g,'+')
				});
				if( i < ii-1 ) { tag.innerHTML += ","; }
				taglist.push(tag);
			}
			div = $.frag(UI.html.details(data));
			content = div.firstChild;
			tagspace = $('.extags',div);
			content.setAttribute('style','display: table !important;');
			$.add(tagspace,$.elem(taglist));
			frag = d.createDocumentFragment();
			frag.appendChild(div);
			d.body.appendChild(frag);
		},
		actions: function(data,link) {
			var uid, token, key, date, taglist, user, sites, tag, tagstring, button, div, tagspace, frag, content;
			
			tagstring = data.tags.join(',');

			if(conf['Smart Links'] === true) {
				if(tagstring.match(regex.fjord)) {
					if(link.href.match('g.e-hentai.org')) {
						link.href = link.href.replace('g.e-hentai.org','exhentai.org');
						button = $.id(link.id.replace('gallery','button'));
						button.href = link.href;
						button.innerHTML = UI.button.text(link.href);
					}
				} else {
					if(link.href.match('exhentai.org')) {
						link.href = link.href.replace('exhentai.org','g.e-hentai.org');
						button = $.id(link.id.replace('gallery','button'));
						button.href = link.href;
						button.innerHTML = UI.button.text(link.href);
					}
				}
			}
			uid = data.gid;
			token = data.token;
			key = data.archiver_key;
			date = new Date(data.date);
			taglist = [];
			data.size = Math.round((data.filesize/1024/1024)*100)/100;
			data.datetext = UI.date(date);
			sites = [
				Config.link(link.href,conf['Torrent Link']),
				Config.link(link.href,conf['Hentai@Home Link']),
				Config.link(link.href,conf['Archiver Link']),
				Config.link(link.href,conf['Favorite Link']),
				Config.link(link.href,conf['Uploader Link']),
				Config.link(link.href,conf['Stats Link']),
				Config.link(link.href,conf['Tag Links'])
			];
			for ( var i = 0, ii = data.tags.length; i < ii; i++ )
			{
				tag = $.create('a', {
					innerHTML: data.tags[i],
					className: "exlink extag",
					href: 'http://'+sites[6]+'/tag/'+data.tags[i].replace(/\ /g,'+')
				});
				if( i < ii-1 ) { tag.innerHTML += ","; }
				taglist.push(tag);
			}
			if(data.uploader) {
				user = data.uploader;
			} else {
				user = 'Unknown';
			}
			data.url = {
				ge: "http://g.e-hentai.org/g/"+uid+"/"+token+"/",
				ex: "http://exhentai.org/g/"+uid+"/"+token+"/",
				bt: "http://"+sites[0]+"/gallerytorrents.php?gid="+uid+"&t="+token,
				hh: "http://"+sites[1]+"/hathdler.php?gid="+uid+"&t="+token,
				arc: "http://"+sites[2]+"/archiver.php?gid="+uid+"&token="+token+"&or="+key,
				fav: "http://"+sites[3]+"/gallerypopups.php?gid="+uid+"&t="+token+"&act=addfav",
				user: "http://"+sites[4]+"/uploader/"+user.replace(/\ /g,'+'),
				stats: "http://"+sites[5]+"/stats.php?gid="+uid+"&t="+token
			};
			if(data.url.arc.match("g.e-hentai.org")) {
				if(tagstring.match(regex.fjord)) {
					data.url.arc = data.url.arc.replace('g.e-hentai','exhentai');
				}
			}
			frag = d.createDocumentFragment();
			div = $.frag(UI.html.actions(data));
			content = div.firstChild;
			content.id = link.id.replace('exlink-gallery','exblock-actions');
			if(conf['Show by Default'] === false) {
				content.setAttribute('style','display: none !important;');
			} else {
				content.setAttribute('style','display: table !important;');
			}
			tagspace = $('.extags',div);
			$.add(tagspace,$.elem(taglist));
			frag.appendChild(div);
			return frag;
		},
		button: function(url,eid) {
			var button;
			button = $.create('a',{
				id: eid.replace('gallery','button'),
				className: 'exlink exbutton exfetch',
				innerHTML: UI.button.text(url),
				href: url
			});
			button.style.marginRight = '4px';
			button.style.textDecoration = 'none';
			button.setAttribute('target','_blank');
			return button;
		},
		toggle: function(e) {
			var actions, style;
			e.preventDefault();
			actions = $.id(e.target.id.replace('exlink-button','exblock-actions'));
			style = actions.getAttribute('style');
			if(style.match('table')) {
				style = style.replace('table','none');
			} else
			if(style.match('none')) {
				style = style.replace('none','table');
			}
			actions.setAttribute('style',style);
		},
		show: function(e) {
			var uid, details, style;
			uid = e.target.className.match(regex.uid)[1];
			details = $.id('exblock-details-uid-'+uid);
			if(details) {
				style = details.getAttribute('style');
				style = style.replace('none','table');
				details.setAttribute('style',style);
			} else {
				UI.details(uid);
			}
		},
		hide: function(e) {
			var uid, details, style;
			uid = e.target.className.match(regex.uid)[1];
			details = $.id('exblock-details-uid-'+uid);
			if(details) {
				style = details.getAttribute('style');
				style = style.replace('table','none');
				details.setAttribute('style',style);
			} else {
				UI.details(uid);
			}
		},
		move: function(e) {
			var uid, details;
			uid = e.target.className.match(regex.uid)[1];
			details = $.id('exblock-details-uid-'+uid);
			if(details) {
				if(details.offsetWidth + e.clientX+20 < window.innerWidth - 8)
				{
					details.style.left = (e.clientX+12) + 'px';
				} else {
					details.style.left = (window.innerWidth - details.offsetWidth - 16) + 'px';
				}
				if(details.offsetHeight + e.clientY+22 > window.innerHeight)
				{
					details.style.top = (e.clientY-details.offsetHeight-8) + 'px';
				} else {
					details.style.top = (e.clientY+22) + 'px';
				}
			}
		},
		popup: function(e) {
			e.preventDefault();
			var w = 400, h = 400, type, link = e.target;
			type = link.href.match(/gallerytorrents|gallerypopups|archiver/)[0];
			if(type === "gallerytorrents") {
				w = 610;
				h = 590;
			} else
			if(type === "gallerypopups") {
				w = 675;
				h = 415;
			} else
			if(type === "archiver") {
				w = 350;
				h = 320;
			}
			if(type) {
				window.open(link.href,"_pu"+(Math.random()+"").replace(/0\./,""),"toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width="+w+",height="+h+",left="+((screen.width-w)/2)+",top="+((screen.height-h)/2));
			}
		},
		date: function(d) {
			var pad = function(n) {
				return n<10 ? '0'+n : n;
			};
			return [
				d.getUTCFullYear()+'-',
				pad(d.getUTCMonth()+1)+'-',
				pad(d.getUTCDate())+' ',
				pad(d.getUTCHours())+':',
				pad(d.getUTCMinutes())
			].join('');
		},
		init: function() {
			$.extend(UI.button, {
				text: function(url) {
					if(url.match('exhentai.org')) {
						return '[Ex]';
					} else
					if(url.match('g.e-hentai.org')) {
						return '[EH]';
					} else {
						return false;
					}
				}
			});
		}
	};
	API = {
		s: {},
		so: {},
		g: {},
		go: {},
		timer: window.setTimeout,
		cooldown: 0,
		working: false,
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
			var xhr, request, limit = 0, json;
			if(type === 's') {
				request = {
					"method": "gtoken",
					"pagelist": []
				};
				for ( var j in API.s ) {
					if(limit < 25) {
						request.pagelist.push([
							parseInt(j,10),
							API.s[j][0],
							parseInt(API.s[j][1],10)
						]);
						limit++;
					} else {
						API.queue.add('so',j,API.s[j][0],API.s[j][1]);
					}
				}
			} else
			if(type === 'g') {
				request = {
					"method": "gdata",
					"gidlist": []
				};
				for ( var k in API.g ) {
					if(limit < 25) {
						request.gidlist.push([
							parseInt(k,10),
							API.g[k]
						]);
						limit++;
					} else {
						API.queue.add('go',k,API.g[k]);
					}
				}
			}
			if(request) {
				if(!API.working && Date.now() > API.cooldown) {
					API.working = true;
					API.cooldown = Date.now();
					Debug.timer.start('apirequest');
					Debug.log(['API Request',request]);
					xhr = new XMLHttpRequest();
					xhr.open('POST', 'http://g.e-hentai.org/api.php');
					xhr.setRequestHeader('Content-Type', 'application/json');
					xhr.onreadystatechange = function() {
						if(xhr.readyState === 4 && xhr.status === 200)
						{
							json = JSON.parse(xhr.responseText);
							if(!json) {
								json = {};
							}
							if(Object.keys(json).length > 0) {
								Debug.log(['API Response, Time: '+Debug.timer.stop('apirequest'),json]);
								API.response(type,json);
							} else {
								Debug.log('API Request error. Waiting five seconds before trying again. (Time: '+Debug.timer.stop('apirequest')+')');
								Debug.log(xhr.responseText);
								/*API.cooldown = Date.now() + (5 * t.SECOND);*/
								API.timer(Main.update, 5000);
							}
						}
					};
					xhr.send(JSON.stringify(request));
				}
			}
		},
		response: function(type,json) {
			var arr;
			if(type === 's') {
				arr = json.tokenlist;
				for ( var i = 0, ii = arr.length; i < ii; i++ )
				{
					API.queue.add('g',arr[i].gid,arr[i].token);
				}
				API.queue.clear('s');
				if(Object.keys(API.so).length) {
					API.s = API.so;
					API.queue.clear('so');
				}
				API.working = false;
			} else
			if(type === 'g') {
				arr = json.gmetadata;
				for ( var j = 0, jj = arr.length; j < jj; j++ )
				{
					Database.set(arr[j]);
					Main.queue.add(arr[j].gid);
				}
				API.queue.clear('g');
				if(Object.keys(API.go).length) {
					API.g = API.go;
					API.queue.clear('go');
				}
				API.working = false;
			}
			Main.update();
		},
		init: function() {
			$.extend(API.queue, {
				add: function(type,uid,token,page) {
					if(type === 's') {
						API.s[uid] = [token,page];
					} else
					if(type === 'so') {
						API.so[uid] = [token,page];
					} else
					if(type === 'g') {
						API.g[uid] = token;
					} else
					if(type === 'go') {
						API.go[uid] = token;
					}
				},
				clear: function(type) {
					API[type] = {};
				}
			});
		}
	};
	Cache = {
		init: function() {
			if(conf['Disable Local Storage Cache'] === true) {
				Cache.type = sessionStorage;
			} else {
				Cache.type = localStorage;
			}
			var key, json;
			for(var i = 0, ii = Cache.type.length, res = []; i < ii; i++) {
				key = Cache.type.key(i);
				if(key.match(/exlinks-(gallery|md5|sha1)/)) {
					json = Cache.type.getItem(key);
					json = JSON.parse(json);
					if(Date.now() > json.added + json.TTL) {
						res.push(key);
					}
				}
			}
			console.log(res);
			for(i = 0, ii = res.length; i < ii; i++) {
				Cache.type.removeItem(res[i]);
			}
		},
		get: function(uid,type) {
			var key, json;
			if(!type) {
				type = 'gallery';
			}
			key = Main.namespace+type+'-'+uid;
			json = Cache.type.getItem(key);
			if(json) {
				json = JSON.parse(json);
				if(Date.now() > json.added + json.TTL)
				{
					Cache.type.removeItem(key);
					return false;
				} else {
					return json.data;
				}
			} else {
				return false;
			}
		},
		set: function(data,type,hash,ttl) {
			var key, keyid, TTL, limit, date, value;
			if(!type) {
				type = 'gallery';
				keyid = data.gid;
				limit = Date.now() - (12 * t.HOUR);
				date = new Date(parseInt(data.posted,10)*1000);
				if(date > limit) {
					TTL = date - limit;
				} else {
					TTL = 12 * t.HOUR;
				}
			} else {
				keyid = hash;
				TTL = ttl;
			}
			key = Main.namespace+type+'-'+keyid;
			value = {
				"added": Date.now(),
				"TTL": TTL,
				"data": data
			};
			Cache.type.setItem(key,JSON.stringify(value));
		},
		load: function() {
			var key, data;
			
			for ( var i = 0, ii = Cache.type.length; i < ii; i++ )
			{
				key = Cache.type.key(i);
				if( key.match(Main.namespace+'gallery') )
				{
					data = Cache.get(key.match(/[0-9]+/));
					if(data)
					{
						Database.set(data);
					}
				}
			}
		}
	};
	Database = {}; $.extend(Database, {
		check: function(uid) {
			var data;
			if(Database[uid]) {
				return Database[uid].token;
			} else {
				data = Cache.get(uid);
				if(data) {
					Database.set(data);
					return data.token;
				} else {
					return false;
				}
			}
		},
		get: function(uid/*,debug*/) {
			var data;
			/* Use this if you want to break database gets randomly for debugging */
			/*if(debug === true) {
				if(Math.random() > 0.8) {
					return false;
				}
			}*/
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
			var uid = data.gid;
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
			$.extend(Database.usage, {
				data: {}
			});
			if(conf['Populate Database on Load'] === true) {
				Cache.load();
			}
		}
	});
	Hash = {
		md5: {},
		sha1: {},
		get: function(hash,type) {
			var result;
			if(Hash[type][hash]) {
				return Hash[type][hash];
			} else {
				result = Cache.get(hash,type);
				if(result) {
					Hash[type][hash] = result;
					return result;
				} else {
					return false;
				}
			}
		},
		set: function(data,type,hash) {
			var ttl;
			if(type === 'md5') {
				ttl = 365 * t.DAY;
			} else {
				ttl = 12 * t.HOUR;
			}
			Cache.set(data,type,hash,ttl);
		}
	};
	SHA1 = {
		/*
			SHA-1 JS implementation originally created by Chris Verness
			http://www.movable-type.co.uk/scripts/sha1.html
		*/
		data: function(image) {
			var string = '';
			for ( var i = 0, ii = image.length; i < ii; i++ ) {
					string += String.fromCharCode(image[i].charCodeAt(0) & 0xff);
			}
			return string;
		},
		f: function(s, x, y, z) {
			switch (s)
			{
				case 0: return (x & y) ^ (~x & z);
				case 1: return x ^ y ^ z;
				case 2: return (x & y) ^ (x & z) ^ (y & z);
				case 3: return x ^ y ^ z;
			}
		},
		ROTL: function(x, n) {
			return (x << n) | (x >>> (32-n));
		},
		hex: function(str) {
			var s = '', v;
			for ( var i = 7; i >= 0; i-- ) {
				v = (str >>> (i*4)) & 0xf;
				s += v.toString(16);
			}
			return s;
		},
		hash: function(image) {
			var H0, H1, H2, H3, H4, K, M, N, W, T,
				a, b, c, d, e, s, l, msg;
				
			K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
			msg = SHA1.data(image) + String.fromCharCode(0x80);
			
			l = msg.length / 4 + 2;
			N = Math.ceil(l / 16);
			M = [];
			
			for ( var i = 0; i < N; i++ ) {
				M[i] = [];
				for ( var j = 0; j < 16; j++ ) {
					M[i][j] = (msg.charCodeAt(i*64+j*4) << 24) | (msg.charCodeAt(i*64+j*4+1) << 16) |
							(msg.charCodeAt(i*64+j*4+2) << 8)  | (msg.charCodeAt(i*64+j*4+3));
				}
			}
			
			M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14]);
			M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;
			
			H0 = 0x67452301;
			H1 = 0xefcdab89;
			H2 = 0x98badcfe;
			H3 = 0x10325476;
			H4 = 0xc3d2e1f0;
			
			W = [];
			
			for ( var k = 0; k < N; k++ )
			{
				for ( var m = 0;  m < 16; m++ ) {
					W[m] = M[k][m];
				}
				for ( var n = 16; n < 80; n++ ) {
					W[n] = SHA1.ROTL(W[n-3] ^ W[n-8] ^ W[n-14] ^ W[n-16], 1);
				}
				
				a = H0;
				b = H1;
				c = H2;
				d = H3;
				e = H4;
				
				for ( var t = 0; t < 80; t++ )
				{
					s = Math.floor(t/20);
					T = (SHA1.ROTL(a,5) + SHA1.f(s,b,c,d) + e + K[s] + W[t]) & 0xffffffff;
					e = d;
					d = c;
					c = SHA1.ROTL(b, 30);
					b = a;
					a = T;
				}
				
				H0 = (H0+a) & 0xffffffff;
				H1 = (H1+b) & 0xffffffff;
				H2 = (H2+c) & 0xffffffff;
				H3 = (H3+d) & 0xffffffff;
				H4 = (H4+e) & 0xffffffff;
			}
			
			return SHA1.hex(H0) + SHA1.hex(H1) + SHA1.hex(H2) + SHA1.hex(H3) + SHA1.hex(H4);
		}
	};
	Sauce = {
		UI: {
			toggle: function(e) {
				e.preventDefault();
				var a = e.target, results, style, sha1, hover;
				results = $.id(a.id.replace('exsauce','exresults'));
				sha1 = a.getAttribute('data-sha1');
				style = results.getAttribute('style');
				if(style.match('table')) {
					style = style.replace('table','none');
					if(conf['Show Short Results'] === true) {
						$.on(a,[
							['mouseover',Sauce.UI.show],
							['mousemove',Sauce.UI.move],
							['mouseout',Sauce.UI.hide]
						]);
					}
				} else
				if(style.match('none')) {
					style = style.replace('none','table');
					if(conf['Show Short Results'] === true) {
						$.off(a,[
							['mouseover',Sauce.UI.show],
							['mousemove',Sauce.UI.move],
							['mouseout',Sauce.UI.hide]
						]);
						hover = $.id('exhover-'+sha1);
						hover.setAttribute('style','display: none !important;');
					}
				}
				results.setAttribute('style',style);
			},
			show: function(e) {
				var a, sha1, hover;
				a = e.target;
				sha1 = a.getAttribute('data-sha1');
				hover = $.id('exhover-'+sha1);
				if(hover) {
					hover.setAttribute('style','display: table !important;');
				} else {
					Sauce.UI.hover(sha1);
				}
			},
			hide: function(e) {
				var a, sha1, hover;
				a = e.target;
				sha1 = a.getAttribute('data-sha1');
				hover = $.id('exhover-'+sha1);
				if(hover) {
					hover.setAttribute('style','display: none !important;');
				} else {
					Sauce.UI.hover(sha1);
				}
			},
			move: function(e) {
				var a, sha1, hover;
				a = e.target;
				sha1 = a.getAttribute('data-sha1');
				hover = $.id('exhover-'+sha1);
				if(hover) {
					hover.setAttribute('style','display: table !important;');
					hover.style.left = (e.clientX+12) + 'px';
					hover.style.top = (e.clientY+22) + 'px';
				} else {
					Sauce.UI.hover(sha1);
				}
			},
			hover: function(sha1) {
				var hover, result;
				hover = $.create('div',{
					className: 'exblock exhover post reply',
					id: 'exhover-'+sha1
				});
				result = Hash.get(sha1,'sha1');
				for ( var i = 0, ii = result.length; i < ii; i++ ) {
					hover.innerHTML += '<a class="exsauce-hover" href="'+result[i][0]+'">'+result[i][1]+'</a>';
					if(i < ii-1) {
						hover.innerHTML += '<br />';
					}
				}
				hover.setAttribute('style','display: table !important;');
				$.add(d.body,hover);
			}
		},
		format: function(a, result) {
			var count = result.length,
				results, parent, post;
			a.classList.add('sauced');
			a.textContent = Sauce.text('Found: '+count);
			if(count) {
				if(conf['Inline Results'] === true) {
					$.on(a,'click',Sauce.UI.toggle);
					results = $.create('div',{
						className: 'exblock exresults',
						id: a.id.replace('exsauce','exresults'),
						innerHTML: '<b>Reverse Image Search Results</b> | View on: <a href="'+a.href+'">'+Sauce.label(true)+'</a><br />'
					});
					if(conf['Show Results by Default'] === true) {
						results.setAttribute('style', 'display: table !important;');
					} else {
						results.setAttribute('style', 'display: none !important;');
					}
					for ( var i = 0, ii = result.length; i < ii; i++ ) {
						results.appendChild($.tnode(result[i][0]));
						if(i < ii-1) {
							results.appendChild($.create('br'));
						}
					}
					if(Config.mode === '4chan') {
						parent = a.parentNode.parentNode.parentNode;
						post = $(Parser.postbody, parent);
						$.before(post,results);
					}
					Main.process([results]);
				}
				if(conf['Show Results by Default'] === false) {
					if(conf['Show Short Results'] === true) {
						$.on(a,[
							['mouseover',Sauce.UI.show],
							['mousemove',Sauce.UI.move],
							['mouseout',Sauce.UI.hide]
						]);
					}
				}
			}
			Debug.log('Formatting complete.');
		},
		lookup: function(a, sha1) {
			var response, links, link, result = [], count;
			a.textContent = Sauce.text('Checking');
			
			GM_xmlhttpRequest({
				method: "GET",
				url: a.href,
				onload: function(x) {
					response = $.frag(x.responseText);
					links = $$('div.it5 a, div.id2 a',response);
					count = links.length;
					for ( var i = 0; i < count; i++ ) {
							link = links[i];
							result.push([link.href,link.innerHTML]);
					}
					Hash.set(result,'sha1',sha1);
					Debug.log('Lookup successful. Formatting.');
					if(conf['Show Short Results']) {
						Sauce.UI.hover(sha1);
					}
					Sauce.format(a, result);
				}
			});
		},
		hash: function(a, md5) {
			var image, sha1;
			image = a.href;
			Debug.log('Fetching image ' + image);
			a.textContent = Sauce.text('Loading');
			GM_xmlhttpRequest(
			{
				method: "GET",
				url: image,
				overrideMimeType: "text/plain; charset=x-user-defined",
				headers: { "Content-Type": "image/jpeg" },
				onload: function(x) {
					a.textContent = Sauce.text('Hashing');
					sha1 = SHA1.hash(x.responseText);
					a.setAttribute('data-sha1',sha1);
					Hash.set(sha1,'md5',md5);
					Debug.log('SHA-1 hash for image: ' + sha1);
					Sauce.check(a);
				}
			});
		},
		check: function(a) {
			var md5, sha1, result;
			if(a.hasAttribute('data-sha1')) {
				sha1 = a.getAttribute('data-sha1');
			} else {
				md5 = a.getAttribute('data-md5');
				sha1 = Hash.get(md5,'md5');
			}
			if(sha1) {
				Debug.log('SHA-1 hash found.');
				a.setAttribute('data-sha1',sha1);
				a.href = 'http://'+conf['Site to Use'].value+'/?f_shash='+sha1+'&fs_similar=0';
				if(conf['Search Expunged'] === true) {
					a.href += '&fs_exp=1';
				}
				a.setAttribute('target','_blank');
				result = Hash.get(sha1,'sha1');
				if(result) {
					Debug.log('Cached result found. Formatting.');
					Sauce.format(a, result);
				} else {
					Debug.log('No cached result found. Performing a lookup.');
					Sauce.lookup(a, sha1);
				}
			} else {
				Debug.log('No SHA-1 hash found. Fetching image.');
				Sauce.hash(a, md5);
			}
		},
		click: function(e) {
			e.preventDefault();
			var a = e.target;
			$.off(a,'click',Sauce.click);
			Sauce.check(a);
		},
		label: function(siteonly) {
			var site, label = 'ExSauce';
			site = conf['Site to Use'];
			if(site.value === 'exhentai.org') {
				label = 'ExHentai';
			} else {
				label = 'E-Hentai';
			}
			if(!siteonly) {
				if(conf['Use Custom Label'] === true) {
					label = conf['Custom Label Text'];
				}
			}
			if(Config.mode === '4chan') {
				if(conf['Lowercase on 4chan'] === true) {
					label = label.toLowerCase();
				}
			}
			return label;
		},
		text: function(text) {
			if(Config.mode === '4chan') {
				if(conf['Lowercase on 4chan'] === true) {
					return text.toLowerCase();
				} else {
					return text;
				}
			}
		}
	};
	Parser = {
		postbody: 'blockquote',
		prelinks: 'a:not(.quotelink)',
		links: '.exlink',
		image: '.file',
		unformatted: function(uid) {
			var result = [], links = $$('a.uid-'+uid);
			for ( var i = 0, ii = links.length; i < ii; i++ )
			{
				if(links[i].classList.contains('exprocessed')) {
					result.push(links[i]);
				}
			}
			return result;
		},
		linkify: function(post) {
			var nodes, node, text, match, ws = /^\s*$/,
				linknode, sp, ml, tn, tl, tu, wbr;
			nodes = $.textnodes(post);
			if(nodes) {
				for ( var i = 0, ii = nodes.length; i < ii; i++ )
				{
					node = nodes[i];
					wbr = node.nextSibling;
					wbr = wbr ? wbr.tagName : null;
					if (wbr === "WBR" && regex.url.test(node.textContent)) {
						node.parentNode.removeChild(node.nextSibling);
						if(nodes[i+1]) {
							node.textContent += nodes[i+1].textContent;
							nodes[i+1].textContent = "";
						}
					}
					text = node.textContent;
					match = text.match(regex.url);
					tl = null;
					linknode = (match) ? [] : null;
					while( match )
					{
						sp = text.search(regex.url);
						ml = match[0].length-1;
						tn = $.tnode(text.substr(0,sp));
						tl = text.substr(sp+ml+1,text.length);
						tu = $.create('a');
						tu.className = 'exlink exgallery exunprocessed';
						if(!match[0].match(regex.protocol)) {
							tu.href = 'http://'+match[0];
							tu.innerHTML = 'http://'+match[0];
						} else {
							tu.href = match[0];
							tu.innerHTML = match[0];
						}
						tu.setAttribute('target','_blank');
						tu.style.textDecoration = 'none';
						if(tn.length > 0) {
							if(!ws.test(tn.nodeValue)) {
								linknode.push(tn);
							}
						}
						linknode.push(tu);
						text = tl;
						match = text.match(regex.url);
					}
					if(tl) {
						if(tl.length) {
							linknode.push($.tnode(tl));
						}
					}
					if(linknode) {
						$.replace(node, $.elem(linknode));
					}
				}
			}
		}
	};
	Options = {
		save: function(e) {
			e.preventDefault();
			Config.save();
			$.remove($.id('exlinks-overlay'));
			d.body.style.overflow = 'visible';
		},
		close: function(e) {
			e.preventDefault();
			tempconf = JSON.parse(JSON.stringify(pageconf));
			$.remove($.id('exlinks-overlay'));
			d.body.style.overflow = 'visible';
		},
		toggle: function(e) {
			var option, type, domain, value;
			domain = {
				"1": fetch.original,
				"2": fetch.geHentai,
				"3": fetch.exHentai
			};
			option = e.target;
			type = option.getAttribute('type');
			if(type==='checkbox') {
				value = option.checked ? true : false;
				tempconf[option.name] = value;
			} else
			if(type==='domain' || type==='saucedomain') {
				tempconf[option.name] = domain[option.value];
			} else
			if(type==='text') {
				tempconf[option.name] = option.value;
			}
		},
		open: function() {
			var gen, overlay, over, frag;
			pageconf = JSON.parse(JSON.stringify(tempconf));
			overlay = $.frag(UI.html.options());
			over = overlay.firstChild;
			frag = d.createDocumentFragment();
			frag.appendChild(overlay);
			$.add(d.body,frag);
			$.on($.id('exlinks-options-save'),'click',Options.save);
			$.on($.id('exlinks-options-cancel'),'click',Options.close);
			$.on(over,'click',Options.close);
			$.on($.id('exlinks-options'),'click',function(e){e.stopPropagation();});
			d.body.style.overflow = 'hidden';
			gen = function(target,obj)
			{
				var desc, tr, type, value, sel;
				for ( var i in obj ) {
					desc = obj[i][2];
					type = obj[i][0];
					value = tempconf[i];
					tr = $.create('tr');
					if(type === 'checkbox') {
						if(value) {
							sel = ' checked';
						} else {
							sel = '';
						}
						tr.innerHTML = [
							'<td style="padding:3px;">',
							'<input style="float:right;margin-right:2px;" type="checkbox" id="'+i+'" name="'+i+'"'+sel+' />',
							'<label for="'+i+'"><b>'+i+':</b> '+desc+'</label>',
							'</td>'
						].join('');
						$.on($('input',tr),'change',Options.toggle);
					} else
					if(type === 'domain') {
						tr.innerHTML = [
						'<td style="padding:3px;">',
						'<select name="'+i+'" type="domain" style="font-size:0.92em!important;float:right;width:18%;">',
							'<option value="1"'+(value.value==='Original'?' selected':'')+'>Original</option>',
							'<option value="2"'+(value.value==='g.e-hentai.org'?' selected':'')+'>g.e-hentai.org</option>',
							'<option value="3"'+(value.value==='exhentai.org'?' selected':'')+'>exhentai.org</option></select>',
						'<b>'+i+':</b> '+desc+'</td>'
						].join('');
						$.on($('select',tr),'change',Options.toggle);
					}
					if(type === 'saucedomain') {
						tr.innerHTML = [
						'<td style="padding:3px;">',
						'<select name="'+i+'" type="domain" style="font-size:0.92em!important;float:right;width:18%;">',
							'<option value="2"'+(value.value==='g.e-hentai.org'?' selected':'')+'>g.e-hentai.org</option>',
							'<option value="3"'+(value.value==='exhentai.org'?' selected':'')+'>exhentai.org</option></select>',
						'<b>'+i+':</b> '+desc+'</td>'
						].join('');
						$.on($('select',tr),'change',Options.toggle);
					}
					if(type === 'textbox') {
						tr.innerHTML = [
						'<td style="padding:3px;">',
						'<input style="float:right;padding-left:5px;width:18%;font-size:0.92em!important;" type="text" id="'+i+'" name="'+i+'" value="'+value+'" />',
						'<b>'+i+':</b> '+desc+'</td>'
						].join('');
						$.on($('input',tr),'input',Options.toggle);
					}
					$.add(target,tr);
				}
			};
			gen($.id('exlinks-options-general'),options.general);
			gen($.id('exlinks-options-actions'),options.actions);
			gen($.id('exlinks-options-sauce'),options.sauce);
			gen($.id('exlinks-options-domains'),options.domains);
			gen($.id('exlinks-options-debug'),options.debug);
		},
		init: function() {
		var oneechan = $.id('OneeChanLink'),
			chanss = $.id('themeoptionsLink'),
			chanx3 = d.documentElement.classList.contains("fourchan-x"),
			conflink, conflink2, arrtop, arrbot;
			conflink = $.create('a', { title: 'ExLinks Settings', className: 'exlinksOptionsLink' });
			$.on(conflink,'click',Options.open);
			if(Config.mode === '4chan')
			{
				if(chanx3) {
						d.dispatchEvent(new CustomEvent("AddMenuEntry", {
						detail: {
							el: conflink,
							order: 112,
							type: "header"
						}
					}));
				}
				if(oneechan) {
					conflink.setAttribute('style','position: fixed; background: url('+img.options+'); top: 108px; right: 10px; left: auto; width: 15px; height: 15px; opacity: 0.75; z-index: 5;');
					$.on(conflink,[
						['mouseover',function(e){e.target.style.opacity = 1.0;}],
						['mouseout',function(e){e.target.style.opacity = 0.65;}]
					]);
					$.add(d.body,conflink);
				} else
				if(chanss) {
					conflink.innerHTML = 'Ex';
					conflink.setAttribute('style','background-image: url('+img.options+'); padding-top: 15px !important; opacity: 0.75;');
					$.on(conflink,[
						['mouseover',function(e){e.target.style.opacity = 1.0;}],
						['mouseout',function(e){e.target.style.opacity = 0.65;}]
					]);
					$.add($.id('navtopright'),conflink);
				} else {
					conflink.innerHTML = 'ExLinks Settings';
					conflink.setAttribute('style',conflink.getAttribute('style')+' cursor: pointer');
					conflink2 = conflink.cloneNode(true);
					$.on(conflink2,'click',Options.open);
					arrtop = [$.tnode('['),conflink,$.tnode('] ')];
					arrbot = [$.tnode('['),conflink2,$.tnode('] ')];
					$.prepend($.id('navtopright'),$.elem(arrtop));
					$.prepend($.id('navbotright'),$.elem(arrbot));
				}
			} else
			if(Config.mode === 'fuuka')
			{
				conflink.innerHTML = 'exlinks options';
				conflink.setAttribute('style','cursor: pointer; text-decoration: underline;');
				arrtop = [$.tnode(' [ '),conflink,$.tnode(' ] ')];
				$.add($('div'),$.elem(arrtop));
			} else
			if(Config.mode === 'foolz')
			{
				conflink.innerHTML = 'ExLinks Options';
				conflink.setAttribute('style','cursor: pointer;');
				arrtop = [$.tnode(' [ '),conflink,$.tnode(' ] ')];
				$.add($('.letters'),$.elem(arrtop));
			}
		}
	};
	Config = {
		mode: '4chan',
		link: function(url,opt) {
			var site;
			if(opt.value === "Original")
			{
				if(url.match('exhentai.org'))
				{
					site = 'exhentai.org';
				}
				else if(url.match('g.e-hentai.org'))
				{
					site = 'g.e-hentai.org';
				} else {
					site = false;
				}
			}
			else if(opt.value === "exhentai.org")
			{
				site = 'exhentai.org';
			}
			else if(opt.value === "g.e-hentai.org")
			{
				site = 'g.e-hentai.org';
			} else {
				site = 'exhentai.org';
			}
			return site;
		},
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
					Config.mode = 'foolz';
					Parser.postbody = '.text';
					Parser.prelinks = 'a:not(.backlink)';
					Parser.image = '.thread_image_box';
				} else {
					Config.mode = 'fuuka';
					Parser.image = '.thumb';
				}
			}
		},
		save: function() {
			for ( var i in options ) {
				for ( var k in options[i] ) {
					localStorage.setItem(Main.namespace+'user-'+k,JSON.stringify(tempconf[k]));
				}
			}
		},
		init: function() {
			var temp, option;
			for ( var i in options ) {
				for ( var k in options[i] ) {
					temp = localStorage.getItem(Main.namespace+'user-'+k);
					if(temp) {
						temp = JSON.parse(temp);
						conf[k] = temp;
					} else {
						option = JSON.stringify(options[i][k][1]);
						conf[k] = JSON.parse(option);
						localStorage.setItem(Main.namespace+'user-'+k,option);
					}
				}
			}
			if(navigator.userAgent.match('Presto')) {
				conf.ExSauce = false;
			}
			tempconf = JSON.parse(JSON.stringify(conf));
		}
	};
	Main = {
		namespace: 'exlinks-',
		version: '2.1.12',
		check: function(uid) {
			var check, links, link, type, token, page;
			check = Database.check(uid);
			if(!check) {
				links = Parser.unformatted(uid);
				for ( var i = 0, ii = links.length; i < ii; i++ )
				{
					link = links[i];
					type = link.className.match(regex.type)[1];
					if(type === 's') {
						page = link.className.match(regex.page);
					} else
					if(type === 'g') {
						token = link.className.match(regex.token);
						break;
					}
				}
				if(type === 's') {
					API.queue.add('s',uid,page[1],page[2]);
					return [uid,type];
				} else
				if(type === 'g') {
					API.queue.add('g',uid,token[1]);
					return [uid,type];
				}
			} else {
				Main.queue.add(uid);
				return [uid,'f'];
			}
		},
		format: function(queue) {
			Debug.timer.start('format');
			Debug.value.set('failed',0);
			
			var uid, links, link, button, data, actions, failed = {}, failure, failtype=[];
			for ( var i = 0, ii = queue.length; i < ii; i++ )
			{
				uid = queue[i];
				data = Database.get(uid);
				links = Parser.unformatted(uid);
				if(data) {
					Debug.value.add('formatlinks');
					for ( var k = 0, kk = links.length; k < kk; k++ )
					{
						link = links[k];
						button = $.id(link.id.replace('gallery','button'));
						link.innerHTML = data.title;
						$.off(button,'click',Main.singlelink);
						if(conf['Gallery Details'] === true) {
							$.on(link,[
								['mouseover',UI.show],
								['mouseout',UI.hide],
								['mousemove',UI.move]
							]);
						}
						if(conf['Gallery Actions'] === true) {
							$.on(button,'click',UI.toggle);
						}
						actions = UI.actions(data,link);
						$.after(link,actions);
						actions = $.id(link.id.replace('exlink-gallery','exblock-actions'));
						if(conf['Torrent Popup'] === true) {
							$.on($('a.extorrent',actions),'click',UI.popup);
						}
						if(conf['Archiver Popup'] === true) {
							$.on($('a.exarchiver',actions),'click',UI.popup);
						}
						if(conf['Favorite Popup'] === true) {
							$.on($('a.exfavorite',actions),'click',UI.popup);
						}
						/*
						if(conf.Filter) {
							// Filter.process(actions);
						}*/
						link.classList.remove('exprocessed');
						link.classList.add('exformatted');
						button.classList.remove('exfetch');
						button.classList.add('extoggle');
					}
				} else {
					Debug.value.add('failed');
					failed[uid] = true;
				}
			}
			Main.queue.clear();
			Debug.log('Formatted IDs: '+Debug.value.get('formatlinks')+' OK, '+Debug.value.get('failed')+' FAIL. Time: '+Debug.timer.stop('format'));
			if(Object.keys(failed).length) {
				for ( var j in failed ) {
					failure = Main.check(parseInt(j,10));
					failtype.push(failure[0]);
					failtype.push(failure[1]);
				}
				Debug.log([failtype]);
				Main.update();
			}
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
			if(!API.working) {
				if(API.queue('s')) {
					API.request('s');
				} else
				if(API.queue('g')) {
					API.request('g');
				}
			}
			if(queue.length) {
				Main.format(queue);
				Main.queue.clear();
			}
		},
		singlelink: function(e) {
			e.preventDefault();
			var link;
			link = $.id(e.target.id.replace('button','gallery'));
			Main.single(link);
			Main.update();
			
		},
		single: function(link) {
			var type, uid, token, page, check;
			type = link.className.match(regex.type)[1];
			uid = link.className.match(regex.uid)[1];
			token = link.className.match(regex.token);
			page = link.className.match(regex.page);
			if(type === 's')
			{
				check = Database.check(uid);
				if(check) {
					type = 'g';
					token = check;
					link.classList.remove('type-s');
					link.classList.remove('page-'+page[1]+'-'+page[2]);
					link.classList.add('type-g');
					link.classList.add('token-'+token);
					Main.queue.add(uid);
				} else {
					API.queue.add('s',uid,page[1],page[2]);
				}
			}
			if(type === 'g')
			{
				check = Database.check(uid);
				if(check) {
					Main.queue.add(uid);
				} else {
					API.queue.add('g',uid,token[1]);
				}
			}
		},
		process: function(posts) {
			var post, file, info, sauce, exsauce, md5, sha1, results, hover, saucestyle,
				actions, style, prelinks, prelink, links, link, site,
				type, gid, sid, uid, button, usage;
			
			Debug.timer.start('process');
			Debug.value.set('post_total',posts.length);
			
			for ( var i = 0, ii = posts.length; i < ii; i++ )
			{
				post = posts[i];
				if(conf.ExSauce === true) {
					// Needs redoing to make life easier with archive
					if(!post.classList.contains('exresults')) {
						if($(Parser.image, post.parentNode)) {
							if(Config.mode === '4chan') {
								file = $(Parser.image, post.parentNode);
								if(file.childNodes.length > 1) {
									info = file.childNodes[0];
									md5 = file.childNodes[1].firstChild.getAttribute('data-md5');
									if(md5) {
										md5 = md5.replace('==','');
										sauce = $('.exsauce',info);
										if(!sauce) {
											exsauce = $.create('a', {
												textContent: Sauce.label(),
												className: 'exsauce',
												id: 'exsauce-'+post.id,
												href: file.childNodes[1].href
											});
											if(conf['No Underline on Sauce']) {
												exsauce.classList.add('exsauce-no-underline');
											}
											exsauce.setAttribute('data-md5',md5);
											$.on(exsauce,'click',Sauce.click);
											$.add(info,$.tnode(" "));
											$.add(info,exsauce);
										} else {
											if(!sauce.classList.contains('sauced')) {
												$.on(sauce,'click',Sauce.click);
											} else {
												sha1 = sauce.getAttribute('data-sha1');
												if(conf['Show Short Results'] === true) {
													if(conf['Inline Results'] === true) {
														results = $.id(sauce.id.replace('exsauce','exresults'));
														saucestyle = results.getAttribute('style');
														if(saucestyle.match('none')) {
															$.on(sauce,[
																['mouseover',Sauce.UI.show],
																['mousemove',Sauce.UI.move],
																['mouseout',Sauce.UI.hide]
															]);
														}
													} else {
														$.on(sauce,[
															['mouseover',Sauce.UI.show],
															['mousemove',Sauce.UI.move],
															['mouseout',Sauce.UI.hide]
														]);
													}
												}
												if(conf['Inline Results'] === true) {
													$.on(sauce,'click',Sauce.UI.toggle);
													if(conf['Hide Results in Quotes'] === true) {
														results = $.id(sauce.id.replace('exsauce','exresults'));
														results.setAttribute('style','display: none !important;');
													}
												}
											}
										}
									}
								}
							} else
							if(Config.mode === 'fuuka') {
								// A WORLD OF PAIN
							} else
							if(Config.mode === 'foolz') {
								// AWAITS
							}
						}
					}
				}
				if(post.innerHTML.match(regex.url))
				{
					Debug.value.add('posts');
					
					if(conf['Hide in Quotes']) {
						actions = $$('.exactions',post);
						for ( var h = 0, hh = actions.length; h < hh; h++ )
						{
							style = actions[h].getAttribute('style');
							if(style.match('inline-block')) {
								style = style.replace('inline-block','none');
							}
							actions[h].setAttribute('style',style);
						}
					}
					if(!post.classList.contains('exlinkified'))
					{
						Debug.value.add('linkified');
						
						prelinks = $$(Parser.prelinks,post);
						if(prelinks) {
							for ( var k = 0, kk = prelinks.length; k < kk; k++ )
							{
								prelink = prelinks[k];
								if(prelink.href.match(regex.url)) {
									prelink.classList.add('exlink');
									prelink.classList.add('exgallery');
									prelink.classList.add('exunprocessed');
									prelink.style.textDecoration = 'none';
									prelink.setAttribute('target','_blank');
								}
							}
						}
						Parser.linkify(post);
						post.classList.add('exlinkified');
					}
					links = $$('a.exlink',post);
					for ( var j = 0, jj = links.length; j < jj; j++ )
					{
						link = links[j];
						if(link.classList.contains('exbutton')) {
							if(link.classList.contains('extoggle')) {
								if(conf['Gallery Actions'] === true) {
									$.on(link,'click',UI.toggle);
								}
							}
							if(link.classList.contains('exfetch')) {
								$.on(link,'click',Main.singlelink);
							}
						}
						if(link.classList.contains('exaction')) {
							if(link.classList.contains('extorrent')) {
								if(conf['Torrent Popup'] === true) {
									$.on(link,'click',UI.popup);
								}
							}
							if(link.classList.contains('exarchiver')) {
								if(conf['Archiver Popup'] === true) {
									$.on(link,'click',UI.popup);
								}
							}
							if(link.classList.contains('extorrent')) {
								if(conf['Favorite Popup'] === true) {
									$.on(link,'click',UI.popup);
								}
							}
						}
						if(link.classList.contains('exgallery')) {
							if(link.classList.contains('exunprocessed')) {
								site = conf['Gallery Link'];
								if(site.value !== "Original") {
									if(!link.href.match(site.value)) {
										link.href = link.href.replace(regex.site,site.value);
									}
								}
								type = link.href.match(regex.type);
								if(type) {
									type = type[1];
								}
								if(type === 's') {
									sid = link.href.match(regex.sid);
									if(sid) {
										link.classList.add('type-s');
										link.classList.add('uid-'+sid[2]);
										link.classList.add('page-'+sid[1]+'-'+sid[3]);
										uid = sid[2];
									} else {
										type = null;
									}
								} else
								if(type === 'g') {
									gid = link.href.match(regex.gid);
									if(gid) {
										link.classList.add('type-g');
										link.classList.add('uid-'+gid[1]);
										link.classList.add('token-'+gid[2]);
										uid = gid[1];
									} else {
										type = null;
									}
								}
								link.classList.remove('exunprocessed');
								if(type) {
									link.classList.add('exprocessed');
									usage = Database.usage(uid);
									link.id = 'exlink-gallery-uid-'+uid+'-'+usage;
									button = UI.button(link.href,link.id);
									$.on(button,'click',Main.singlelink);
									$.before(link,button);
								} else {
									link.classList.remove('exgallery');
								}
							}
							if(link.classList.contains('exprocessed')) {
								if(conf['Automatic Processing'] === true) {
									Main.single(link);
									
									Debug.value.add('processed');
								}
							}
							if(link.classList.contains('exformatted')) {
								if(conf['Gallery Details'] === true) {
									$.on(link,[
										['mouseover',UI.show],
										['mouseout',UI.hide],
										['mousemove',UI.move]
									]);
								}
							}
						}
						if(link.classList.contains('exfavorite')) {
							if(conf['Favorite Autosave']) {
								$.on(link,'click',UI.favorite);
							}
						}
					}
				}	
				
			}
			Debug.log('Total posts: '+Debug.value.get('post_total')+' Linkified: '+Debug.value.get('linkified')+' Processed: '+Debug.value.get('posts')+' Links: '+Debug.value.get('processed')+' Time: '+Debug.timer.stop('process'));
			Main.update();
		},
		dom: function(e) {
			var node = e.target, nodelist = [];
			if(node.nodeName === 'DIV') {
				if(node.classList.contains('postContainer')) {
					nodelist.push($(Parser.postbody,node));
				} else
				if(node.classList.contains('inline')) {
					nodelist.push($(Parser.postbody,node));
				}
			} else
			if(node.nodeName === 'ARTICLE') {
				if(node.classList.contains('post')) {
					nodelist.push($(Parser.postbody,node));
				}
			}
			if(nodelist.length) {
				Main.process(nodelist);
			}
		},
		observer: function(m) {
			var nodes, node, nodelist = [];
			m.forEach(function(e) {
				if(e.addedNodes) {
					nodes = e.addedNodes;
					for ( var i = 0, ii = nodes.length; i < ii; i++ )
					{
						node = nodes[i];
						if(node.nodeName === 'DIV') {
							if(node.classList.contains('postContainer')) {
								nodelist.push($(Parser.postbody,node));
							} else
							if(node.classList.contains('inline')) {
								nodelist.push($(Parser.postbody,node));
							}
						} else
						if(node.nodeName === 'ARTICLE') {
							if(node.classList.contains('post')) {
								nodelist.push($(Parser.postbody,node));
							}
						}
					}
				}
			});
			if(nodelist.length) {
				Main.process(nodelist);
			}
		},
		ready: function() {
			var css, font, style;
			Debug.timer.start('init');
			Config.site();
			Options.init();
			css = '';
			font = $.create('link', {
				rel: "stylesheet",
				type: "text/css",
				href: "//fonts.googleapis.com/css?family=Source+Sans+Pro:900"
			});
			style = $.create('link', {
				rel: "stylesheet",
				type: "text/css",
				href: css
			});
			$.add(d.head,font);
			$.add(d.head,style);
			Debug.log('Initialization complete. Time: '+Debug.timer.stop('init'));
			var nodelist = $$(Parser.postbody),
				MutationObserver, updater,
				updater_config = { childList: true, subtree: true };
			Main.process(nodelist);
			MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
			if(MutationObserver) {
				updater = new MutationObserver(Main.observer);
				updater.observe(d.body, updater_config);
			} else {
				$.on(d.body,'DOMNodeInserted',Main.dom);
			}
			$.off(d,'DOMContentLoaded',Main.ready);
		},
		init: function() {
			Config.init();
			Debug.init();
			Cache.init();
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
			$.on(d,'DOMContentLoaded',Main.ready);
		}
	};
	
	Main.init();
	
})();
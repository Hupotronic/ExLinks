
// ==UserScript==
// @name           ExLinks
// @namespace      hupotronic
// @author         Hupo
// @version        2.1.1
// @description    Makes e-hentai/exhentai links more useful.
// @include        http://boards.4chan.org/*
// @include        https://boards.4chan.org/*
// @include        http://archive.foolz.us/*
// @include        https://archive.foolz.us/*
// @updateURL      https://github.com/Hupotronic/ExLinks/raw/stable/ExLinks.user.js
// @downloadURL    https://github.com/Hupotronic/ExLinks/raw/stable/ExLinks.user.js
// @run-at         document-start
// ==/UserScript==
﻿
(function() {
	"use strict";
	var fetch, options, conf, tempconf, pageconf, regex, img, cat, d, t, $, $$,
		Debug, UI, Cache, API, Database, Hash, SHA1, Sauce, Filter, Parser, Options, Config, Main;
	
	img = {"options":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADLSURBVDhPY2CAgvT0dAUgdiACK8D0gOm0tLQeIP4P1EgQg9SB1IM1gmyECUBtRzUZ1WUgtTCLFECaHaC2YtWE4kQky0D6UDQDDXGEugLkNBAuIUoz1O8wzcrompD5UJcibMamGWQzEP8AYj4gPgLEXVB1oIDFqRnkZGUgZgHiR0C8F4hfALEQMZrhzgZqSIb6vxzmdGKdLQS18RLU+dhthsY3emh3QZ3NAaUnwNIFRlThC2HkZIzsbPJTGHLaRksgsISCjYakbUpyFQCv+BgrcF6dawAAAABJRU5ErkJggg==","ratings":{"0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAOCAYAAACfOxrCAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADRSURBVEhL7ZfRDYMwDESZhAEYoqMwCqMwCqN0lJYciiVj2XH44xCWokTh/dzZccgw5DEVZKkD61awsbn6Qsxl/OvAuhVsbGrAWIhNGYA19rxgY1PxAHRGsypgY8MsQoic+a/KvhiAPfmuZwYW2qIKPgz5OIJF+FNmaAwD7qwXTPiRsdDWrAA4Y5tZlHk0RLipm+Td2VS8lIbX0Kw4uRLZ2K7un1WBvg7Z2NeAHgdsWSPj9qxHR+DubI/+0w+QdE57Q3gGMLBdBkSPGm+fjT0ZsAMrU9VEHy0wuwAAAABJRU5ErkJggg==","1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAOCAMAAACo5erwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACHUExURQAAAAAAAAAAAAAAAC0fAgAAAC8gAgAAADIiAgAAADYlAwAAAAAAADwpA0MuAwAAAAAAAEcxBH9SD4FTD4dZEopcE5FjFZNlFppqGJ9vGqZ1Had3Ha18H7SCIrmHI8WRKMyYKs+bK9KMG9ijL9qaKeGkM+KmNeOoN+euPemwP+23RvC7SvfGVaYkwEEAAAAQdFJOUwAeKj5GXl9+hJ63vt7e+P7XXqtKAAAAt0lEQVQoz6WT2xKCMAxEKVCQhmLwLt5vCOL/f5+WtrRvxHGfznRntjvJJAiMEpmGBsOUjk7igtwgRzoOissbAuuRAZLRK3Cubew3n4zmdyFleWoR81QpVz4FuW0xqfaH46vDnxXZBsWubrt3/zZ19ihmzE2wanQDiMDa4+jNUWyfTatHw61PQH+Jm0etQxkM+aPoB6zu638CxOK6LGFoCET0AmbzImaZ8TNGRKdEysTciD4UGip9ADJzH3U5Ln9YAAAAAElFTkSuQmCC","2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAOCAMAAACo5erwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAC9UExURQAAAAAAAAAAAAAAAC0fAgAAAC8gAiEWAQAAADIiAhUOAQAAADYlAwAAADIjAgAAADwpA0MuAwAAAAAAAAwIABkRAUEtA0cxBH9SD4FTD4RWEIdZEolbEopcE49gFJFjFZNkFpNlFpdnF5pqGJprGJ9vGqFxG6Z1Had3Ha18H7SCIrmHI7+NJsWRKMyYKs+IF8+bK9KMG9iWJdijL9qaKdubKt6fLuGkM+KmNeOoN+euPemwP+23RvC7SvfGVf/oz90AAAATdFJOUwAeKj5GXl9gfoSVnre+xd7e+P5G+mmrAAAA8ElEQVQoz52TWXOCMBSFjYJiSTQ02uC+VXGvdQMC+P9/loUkkCfC9DxkvpmbOffkZm6tJtTEuCmwbln1qlgIXs5QoEmIWRVzGfR2oUaGABGCQDVUApwD/wSlv+ygRdEdYkxPETtSjDsfVjetd61U5WjKFG1vtz/EScz2O2/dJ9XVkAmcbRAlryQKHpuvXl7+JBq0QTFBj6UJ/A1tIVlGDR0qc4TrkEUsfH5DPiE+JS2qn7jyA/+5/PtIgHJ/LaoGs/tifp3+2wCOfieUjn+G/AkI5WFLUTFwB45hOK6bGdgA2OJqORbim5SdfFGyU4up3ijyKtQYbQ3VAAAAAElFTkSuQmCC","3":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAOCAMAAACo5erwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAC6UExURQAAAAAAAAAAAAAAAC0fAgAAAC8gAi4fAgAAADIiAgAAADYlAwAAAAAAADwpAz4qAz4rAz4rA0MuAwAAAAAAAEYwA0cxBH9SD4FTD4RWEIdZEolbEopcE49gFJFjFZNkFpNlFpdnF5pqGJprGJ9vGqFxG6Z1Had3Ha18H7SCIrmHI7+NJsWRKMyYKs+IF8+bK9KMG9iWJdijL9qaKdubKt6fLuGkM+KmNeOoN+euPemwP+23RvC7SvfGVf0ToTsAAAAUdFJOUwAeKj5GXl98foSet77e3uTk5fj++gHqYAAAAQVJREFUKM+V09tywiAQBmDRRNOA1EZKerbamqrV2pOJxPT9X6uBBcKFwfa/yHwz7OzukKHT0elT2reMuprd6ASb4O0GW7JQM2QnaBPwzy0PDBlBiogwP50FNkW+xoZmQj3KTz0dU8rXpXjl9PxiJMnYMJIZytJWhmaLs2yxXB2qg1guMiD7W3pmg+SlKKufqiy+55eK6njcVB5njJobzITcIJ/zgaI8Jj1iKlvo3CN+3otS7HdPGAi3FJrSNro/cZYX+W5a/0hF6I+IHXWcboOHr8fJx71qUPPfDfDN+x3nt2/XGEjsssRHp0F6lQRBkqYYiGJdGiMfm8BLUl+gei7wZjyU+QWMqi+HmOAR+QAAAABJRU5ErkJggg==","4":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAOCAMAAACo5erwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADMUExURQAAAAAAAAAAAAAAAC0fAgAAAC8gAiEWAS4fAgAAADIiAhUOAQAAADYlAwAAADIjAgAAADwpAz4qAz4rAz4rA0MuAwAAAAAAAAwIABkRAUEtA0YwA0cxBH9SD4FTD4RWEIdZEolbEopcE49gFJFjFZNkFpNlFpdnF5pqGJprGJ9vGqFxG6Z1Had3Ha18H7SCIrmHI7+NJsWRKMyYKs+IF8+bK9KMG9iWJdijL9qaKdubKt6fLuGkM+KmNeOoN+euPemwP+23RvC7SvfGVScirZUAAAAXdFJOUwAeKj5GXl9gfH6ElZ63vsXe3uTk5fj+X3hDtgAAAQlJREFUKM+V09tSwjAQBmACDVolkYA1HlIRVESooCCeaEmp7/9OktIkOzTW8b/ofBfb3Z1kUqsVaTLWLLPu+/VK2pDlgpSJOceVNPHEx1J4+0SUc4oqCBZYJPGc7HM7Sg9zs5hOGBPzVL4I1jntarKTY7+tStu+ioNYb3EUTWfPm2wjZ9MIcHzB/0hDbxA8JWn2naXJ1+TK8vLcVJ5xF1vInmAk1dh4Ig4tD6iupA0nwTmS8Vqmcr16JJBYl+JfCC9xFCfx6mF7e4CImlFuwgZ3n8P799u8geE/GpCbt4EQ/dcegVTLUmr2LhM0CK8DzwvCkEBiddCoVfzloM3u+eRfwN2byb9uqvwAfIo7KE0+sZ8AAAAASUVORK5CYII=","5":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAOCAMAAACo5erwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAC6UExURQAAAAAAAAAAAAAAAC0fAgAAAC8gAi4fAgAAADIiAgAAADYlAwAAAAAAADwpAz4qAz4rAz4rA0MuAwAAAAAAAEYwA0cxBH9SD4FTD4RWEIdZEolbEopcE49gFJFjFZNkFpNlFpdnF5pqGJprGJ9vGqFxG6Z1Had3Ha18H7SCIrmHI7+NJsWRKMyYKs+IF8+bK9KMG9iWJdijL9qaKdubKt6fLuGkM+KmNeOoN+euPemwP+23RvC7SvfGVf0ToTsAAAAUdFJOUwAeKj5GXl98foSet77e3uTk5fj++gHqYAAAAQZJREFUKM+N09tywiAQBmDRxKZZpG1KSU9qT6baau3JRGJ8/9dSCCQEmE7/C+a7YNkdGHo9lSEhQx+jvmI/8rENrFfgIw0VQ+pjk4B9r1ngIcVIEmHqoTHAqsiX4KFuduzqoeoOhLBlyd8ZObs4t0jpKBIZiaouQz3FaTZfvO2qHV/MM4f0jwz0BMlrUVb7qix+Z1c25c7LtshgjNobzLhom8/YiU2xEw+wLjJp3CO8bHnJt5tncFhfWKirOjQf8Skv8s3j8fVs1q0QbroaNA+Y/DxMv8ayqsv/HQC3n/eM3X3cgEPczI0dGgek10kQJGkKDlGsqmLksE39feTqUP6c+vvYFDkAqCc3/Wn6FlkAAAAASUVORK5CYII=","6":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAOCAMAAACo5erwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADMUExURQAAAAAAAAAAAAAAAC0fAgAAAC8gAiEWAS4fAgAAADIiAhUOAQAAADYlAwAAADIjAgAAADwpAz4qAz4rAz4rA0MuAwAAAAAAAAwIABkRAUEtA0YwA0cxBH9SD4FTD4RWEIdZEolbEopcE49gFJFjFZNkFpNlFpdnF5pqGJprGJ9vGqFxG6Z1Had3Ha18H7SCIrmHI7+NJsWRKMyYKs+IF8+bK9KMG9iWJdijL9qaKdubKt6fLuGkM+KmNeOoN+euPemwP+23RvC7SvfGVScirZUAAAAXdFJOUwAeKj5GXl9gfH6ElZ63vsXe3uTk5fj+X3hDtgAAAQZJREFUKM+F09lWwjAQBmACDVJlIhFrXFJ3BaGCgrjRklLf/50kpWnmSFr/i5zvZpYmp41GkTbn7Vo2fb+5SxtYzKGWVAi6yzKe/FxIr4aECcHIX6IF5kk8gxpuppq5iMV04FzOUvUq+dFx30F+eOD3dFXP1zGkZov9aDJ9WWdrNZ1Ebo7OhCsts0HwnKTZT5Ym3+MLJ89Py6ITW98l9gYjpWfFY9lxco+ZItayRPcIo5VK1Wr5BBWkpopi4kccxkm8HGyezE3CyqmIuMH91+PDx11e5eJ/DeD6/VbKm7crqKDem7HyEwqiBuFl4HlBGEIFqb5z0i0aGNps/5n8dHP7++Qnos4vYfBE0asS4CcAAAAASUVORK5CYII=","7":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAOCAMAAACo5erwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAC6UExURQAAAAAAAAAAAAAAAC0fAgAAAC8gAi4fAgAAADIiAgAAADYlAwAAAAAAADwpAz4qAz4rAz4rA0MuAwAAAAAAAEYwA0cxBH9SD4FTD4RWEIdZEolbEopcE49gFJFjFZNkFpNlFpdnF5pqGJprGJ9vGqFxG6Z1Had3Ha18H7SCIrmHI7+NJsWRKMyYKs+IF8+bK9KMG9iWJdijL9qaKdubKt6fLuGkM+KmNeOoN+euPemwP+23RvC7SvfGVf0ToTsAAAAUdFJOUwAeKj5GXl98foSet77e3uTk5fj++gHqYAAAAQFJREFUKM+F03FXgjAQAHCnQ4mbq2gNS1PLJC3NsgSH9P2/lrCxofY87w/e7z242+1412hU0ea8fYF+s2LTd6wDVku4QOFV9ISjCyrXK0lxCkY0CROWBw0s02QBOO25RQPHLVDgXC4y9SH59e3NeQrR9cvolgUKeraLq3g2f9/lOzWfxRjFabRsB+FbmuV/eZb+Tu8R6qS7Oj8g9QRjVZ6VTGUHYZnEWszmH84RXrcqU9vNBDCa2Xm2wNEY5UuSJpvn4pchNKcS9r+B4v3wZzz6ftKfniVSAB6/BlL2Px8AI3NXYOzkChD1QkrDKAKMJKgKBMSwDrMz+olRL5HZJLdPe2aSQHMsU5PIAAAAAElFTkSuQmCC","8":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAOCAMAAACo5erwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADJUExURQAAAAAAAAAAAAAAAC0fAgAAAC8gAiEWAS4fAgAAADIiAhUOAQAAADYlAwAAADIjAgAAADwpAz4qAz4rAz4rA0MuAwAAAAwIABkRAUEtA0YwA0cxBH9SD4FTD4RWEIdZEolbEopcE49gFJFjFZNkFpNlFpdnF5pqGJprGJ9vGqFxG6Z1Had3Ha18H7SCIrmHI7+NJsWRKMyYKs+IF8+bK9KMG9iWJdijL9qaKdubKt6fLuGkM+KmNeOoN+euPemwP+23RvC7SvfGVbqNE7kAAAAWdFJOUwAeKj5GXl9gfH6ElZ63vsXe3uTk5fhyoc7hAAAA80lEQVQoz43T2VaDQAwGYKadoY6SsWMlLsG1ahdstbVuhQ7g+z+UFxUU9Bhy9d0k50/Oied9lW+t35YdrTtes2C1hLZUiKrZL+l1RbIdhUE0ohlgmSYLaEeFWI8gwVpaZO6R7MHh4H/a/T3dR0Tsa63KFLvxbP6QF7mbz2KWk2OsqlsmCO/TrPgosvR9esrx5KjqD8T3BWOXF7lLprTDsWfK/p93hMnGZW6zHgNPVQ6onZFGSZqs70jyFOZ3AE/S8O325uWaJM8/B8DF8xXR5dM58FSIaExjBYjOQinDKAKeCjEQIqgP2D6Kb63Pc/tJ1T99AjsETOLEMsW9AAAAAElFTkSuQmCC","9":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAOCAMAAACo5erwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAC3UExURQAAAAAAAAAAAAAAAC0fAgAAAC8gAi4fAgAAADIiAgAAADYlAwAAAAAAADwpAz4qAz4rAz4rA0MuAwAAAEYwA0cxBH9SD4FTD4RWEIdZEolbEopcE49gFJFjFZNkFpNlFpdnF5pqGJprGJ9vGqFxG6Z1Had3Ha18H7SCIrmHI7+NJsWRKMyYKs+IF8+bK9KMG9iWJdijL9qaKdubKt6fLuGkM+KmNeOoN+euPemwP+23RvC7SvfGVbKFEEwAAAATdFJOUwAeKj5GXl98foSet77e3uTk5fgBvXPGAAAA0klEQVQoz42TWxOCIBCF1bCsNSoJu9+zLM1uapj9/9+VWk7J054H5huYPRyWWUX5qk5pHY+GpsiCwAc8Ml2uJ/wacIJGZqpyAD+OPEAjq0QgQCn3EnHktNPropCxtmHoZYqms3cPz/Qp3L2DRFaoViawdnGSvtIkvm/7OCzqW+qvg47IL4i2vIHDvP6/j7B5iEQ8wjUgMTeotJGvojgKl9k/4VAKkG3Obov5ZVqcY1A2gNF5wvn4NAQkmtITwB5YhFi2DUhUW1WDz6AUKxI14ztPbxyqR0vFOTcgAAAAAElFTkSuQmCC","10":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAOCAMAAACo5erwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACcUExURQAAAC0fAi8gAi4fAjIiAjYlAzwpAz4qAz4rAz4rA0MuA0YwA0cxBH9SD4FTD4RWEIdZEolbEopcE49gFJFjFZNkFpNlFpdnF5pqGJprGJ9vGqFxG6Z1Had3Ha18H7SCIrmHI7+NJsWRKMyYKs+IF8+bK9KMG9iWJdijL9qaKdubKt6fLuGkM+KmNeOoN+euPemwP+23RvC7SvfGVdNFZEkAAAALdFJOUwBGX3yEt97k5OX4fmIk4AAAALBJREFUKM+d08kWgjAMBdAWSVQMziOgKIgTQ2n9/39zIUiXhre6q/Q1PRWiiYPo9GAXyFLowV8kPTKSbFoF0rJIgM3mdECkpFYXwuF49DcR2hZudIrP2mgVnyIOA7dt4B3L2rxNXb7CCYOe7DYYKW20KkIaMGjtEYJK1arKD8Ci/Yj7oizyHUkW7QHr53ZzX5Fk0brC/LYkWlxnwKI1wJ96Unq+Dyx2+f4OB9FhUQghPhJkOFnw8zHfAAAAAElFTkSuQmCC"}};
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
		url: /(http:\/\/)?(forums|gu|g|u)?\.?e[\-x]hentai\.org\/[^\ \n<>\'\"]*/,
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
						if(cn.tagName === 'SPAN' || cn.tagName === 'P')
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
			details: function(data) { return '<div id="exblock-details-uid-'+data.gid+'" class="exblock exdetails post reply post_wrapper"><div class="exthumbnail" style="background-image:url('+data.thumb+')">&nbsp;</div><div class="exsidepanel"><div class="btn btn-eh btn-'+cat[data.category].short+'"><div class="noise">'+cat[data.category].name+'</div></div><div class="exsidebarbox"><b>Rating:</b><br><img src="'+img.ratings[Math.round(parseInt(data.rating,10)*2)]+'" alt="'+data.rating+'"><br><span style="opacity: 0.65; font-size: 0.95em">(Avg. '+data.rating+')</span></div><div class="exsidebarbox"><b>Files:</b><br>'+data.filecount+' images<br><span style="opacity: 0.65; font-size: 0.95em">('+data.size+' MB)</span></div><div class="exsidebarbox"><b style="margin-right:4px">Torrents:</b>'+data.torrentcount+'</div><div class="exsidebarbox" style="margin-bottom: 0px"><b style="margin-right:4px">Visible:</b>'+data.visible+'</div></div><a class="exlink extitle uid-'+data.gid+'" href="#exdetails-'+data.gid+'">'+data.title+'</a>'+data.jtitle+'<br><br><span style="font-size:1.0em !important">Uploaded by<b class="exlink exuploader uid-'+data.gid+'" style="font-size:1.0em!important;margin:0 5px">'+data.uploader+'</b>on<b style="font-size:1.0em!important;margin: 0 5px">'+data.datetext+'</b></span><br><br><span class="extags uid-'+data.gid+'" style="font-size: 1.05em !important; display: inline !important"><b style="font-size:1.05em!important;margin-right:2px!important">Tags:</b></span><br style="clear: both"></div>'; },
			actions: function(data) { return '<div class="exblock exactions uid-'+data.uid+'"><table class="exactions-table" style="display: inline-block; vertical-align: top; width:100%"><tr><td style="vertical-align: top">'+data.category+' | '+data.filecount+' files | View on:<a href="'+data.url.ge+'" class="exaction" target="_blank" style="text-decoration: none !important; vertical-align: top; margin: 0 4px; margin-right: 0px">e-hentai</a><a href="'+data.url.ex+'" class="exaction" target="_blank" style="text-decoration: none !important; vertical-align: top; margin: 0 4px">exhentai</a>| Download via:<a href="'+data.url.bt+'" class="exlink exaction extorrent" target="_blank" style="margin-right: 0px">torrent['+data.torrentcount+']</a><a href="'+data.url.hh+'" class="exaction" target="_blank" style="margin-right: 0px">hentai@home</a><a href="'+data.url.arc+'" class="exlink exaction exarchiver" target="_blank">archiver</a>| Uploader:<a href="'+data.url.user+'" target="_blank" class="exlink exaction exuploader uid-'+data.gid+'">'+data.uploader+'</a>|<a href="'+data.url.fav+'" class="exlink exaction exfavorite" target="_blank">Favorite</a>|<a href="'+data.url.stats+'" class="exaction" target="_blank">Stats</a></td></tr></table><span class="extags uid-'+data.gid+'" style="display: inline-block !important"><b style="margin-right:2px!important">Tags:</b></span></div>'; },
			options: function()     { return '<div id="exlinks-overlay"><div id="exlinks-options" class="post reply"><div id="exlinks-options-nav" style="text-align:left"><div style="float: right"><div class="exlinks-options-button"><a id="exlinks-options-changelog" href="https://raw.github.com/hupotronic/ExLinks/master/changelog">Changelog</a></div><div class="exlinks-options-button"><a id="exlinks-options-issues" href="https://github.com/Hupotronic/ExLinks/issues">Issues</a></div><div class="exlinks-options-button"><a id="exlinks-options-save" href="">Save Settings</a></div><div class="exlinks-options-button"><a id="exlinks-options-cancel" href="">Cancel</a></div></div><a class="exlinks-options-title" href="http://hupotronic.github.com/ExLinks/">ExLinks</a><span class="exlinks-options-version">'+Main.version+'</span></div><div id="exlinks-options-content"><span class="exlinks-options-subtitle">General Settings</span><span style="float:right;padding-top:7px;margin-right:4px;opacity:0.6">Note: You must reload the page after saving for any changes to take effect.</span><br><table id="exlinks-options-general" class="exlinks-options-table"></table><span class="exlinks-options-subtitle">Gallery Actions</span><br><table id="exlinks-options-actions" class="exlinks-options-table"></table><span class="exlinks-options-subtitle">ExSauce Settings</span><span style="float:right;padding-top:7px;margin-right:4px;opacity:0.6">Note: ExSauce is currently not available in the Foolz archive.</span><br><table id="exlinks-options-sauce" class="exlinks-options-table"></table><span class="exlinks-options-subtitle">Domain Settings</span><table id="exlinks-options-domains" class="exlinks-options-table"></table><span class="exlinks-options-subtitle">Debugger Settings</span><table id="exlinks-options-debug" class="exlinks-options-table"></table></div></div></div>'; }
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
			
			if(conf['Smart Links'] === true) {
				tagstring = data.tags.join(',');
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
				arc: "http://"+sites[2]+"/archiver.php?gid="+uid+"&or="+key,
				fav: "http://"+sites[3]+"/gallerypopups.php?gid="+uid+"&t="+token+"&act=addfav",
				user: "http://"+sites[4]+"/uploader/"+user.replace(/\ /g,'+'),
				stats: "http://"+sites[5]+"/stats.php?gid="+uid+"&t="+token
			};
			
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
						innerHTML: '<b>ExSauce Reverse Image Search Results</b> | View on: <a href="'+a.href+'">'+Sauce.label(true)+'</a><br />'
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
					links = $$('div.it3 > a:not([rel="nofollow"]), div.itd2 > a:not([rel="nofollow"])',response);
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
				linknode, sp, ml, tn, tl, tu;
			nodes = $.textnodes(post);
			if(nodes) {
				for ( var i = 0, ii = nodes.length; i < ii; i++ )
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
						tn = $.tnode(text.substr(0,sp));
						tl = text.substr(sp+ml+1,text.length);
						tu = $.create('a');
						tu.className = 'exlink exgallery exunprocessed';
						if(!match[0].match('http://')) {
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
			conflink, conflink2, arrtop, arrbot;
			conflink = $.create('a', { title: 'ExLinks Options', className: 'exlinksOptionsLink' });
			$.on(conflink,'click',Options.open);
			if(Config.mode === '4chan')
			{
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
					conflink.innerHTML = 'ExLinks Options';
					conflink.setAttribute('style','cursor: pointer');
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
		version: '2.1.1',
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
			css = 'data:text/css;base64,LmJ0biB7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgKmRpc3BsYXk6IGlubGluZTsgcGFkZGluZzogNHB4IDE0cHg7IG1hcmdpbi1ib3R0b206IDA7ICptYXJnaW4tbGVmdDogLjNlbTsgZm9udC1zaXplOiAxNHB4OyBsaW5lLWhlaWdodDogMjBweDsgKmxpbmUtaGVpZ2h0OiAyMHB4OyBjb2xvcjogIzMzMzMzMzsgdGV4dC1hbGlnbjogY2VudGVyOyB0ZXh0LXNoYWRvdzogMCAxcHggMXB4IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC43NSk7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7IGN1cnNvcjogcG9pbnRlcjsgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjVmNTsgKmJhY2tncm91bmQtY29sb3I6ICNlNmU2ZTY7IGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtZ3JhZGllbnQobGluZWFyLCAwIDAsIDAgMTAwJSwgZnJvbSgjZmZmZmZmKSwgdG8oI2U2ZTZlNikpOyBiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudCh0b3AsICNmZmZmZmYsICNlNmU2ZTYpOyBiYWNrZ3JvdW5kLWltYWdlOiAtby1saW5lYXItZ3JhZGllbnQodG9wLCAjZmZmZmZmLCAjZTZlNmU2KTsgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgI2ZmZmZmZiwgI2U2ZTZlNik7IGJhY2tncm91bmQtaW1hZ2U6IC1tb3otbGluZWFyLWdyYWRpZW50KHRvcCwgI2ZmZmZmZiwgI2U2ZTZlNik7IGJhY2tncm91bmQtcmVwZWF0OiByZXBlYXQteDsgYm9yZGVyOiAxcHggc29saWQgI2JiYmJiYjsgKmJvcmRlcjogMDsgYm9yZGVyLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMSkgcmdiYSgwLCAwLCAwLCAwLjEpIHJnYmEoMCwgMCwgMCwgMC4yNSk7IGJvcmRlci1jb2xvcjogI2U2ZTZlNiAjZTZlNmU2ICNiZmJmYmY7IGJvcmRlci1ib3R0b20tY29sb3I6ICNhMmEyYTI7IC13ZWJraXQtYm9yZGVyLXJhZGl1czogNHB4OyAtbW96LWJvcmRlci1yYWRpdXM6IDRweDsgYm9yZGVyLXJhZGl1czogNHB4OyAqem9vbTogMTsgLXdlYmtpdC1ib3gtc2hhZG93OiBpbnNldCAwIDFweCAwIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKSwgMCAxcHggMnB4IHJnYmEoMCwgMCwgMCwgMC4wNSk7IC1tb3otYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMiksIDAgMXB4IDJweCByZ2JhKDAsIDAsIDAsIDAuMDUpOyBib3gtc2hhZG93OiBpbnNldCAwIDFweCAwIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKSwgMCAxcHggMnB4IHJnYmEoMCwgMCwgMCwgMC4wNSk7IH0gLm5vaXNlIHsgY29sb3I6ICNGRkZGRkYgIWltcG9ydGFudDsgbWFyZ2luOiAwOyBwYWRkaW5nOiAycHggMDsgbWFyZ2luLWJvdHRvbTogLTRweDsgYm9yZGVyLXJhZGl1czogNHB4OyBwb3NpdGlvbjogcmVsYXRpdmU7IHRvcDogLTJweDsgYmFja2dyb3VuZC1pbWFnZTogdXJsKGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBR1FBQUFBeUJBTUFBQUJZRzJPTkFBQUFBWE5TUjBJQXJzNGM2UUFBQUFSblFVMUJBQUN4and2OFlRVUFBQUFKY0VoWmN3QUFEc01BQUE3REFjZHZxR1FBQUFBYlVFeFVSZi8vL3dBQUFCOGZIejgvUDE5ZlgzOS9mNStmbjcrL3Y5L2YzMTlKTG9jQUFBQUpkRkpPVXdVSUNBZ0lDQWdJQ0FoL09mMEFBQVdZU1VSQlZFakhsWlU3ZDlWWUVvWDNsblNrRTFaZFBVTmRNTkNoWk1BUVNvQ3ZIVXB0L0FqUEJZTWRTc2F2VUxJdk5qOTdrcGxlTTJ2b3RkeGhSVlcxOXVORHExazFlQUtGeFJGNzErcmQ5bm1GdnEwdVRhRG14U1NBdUs5emU5bVdZNDhtdXdZL253Y1RPS0YxSW8yK2t2MUZtTlAyUngrbGhrd0xFU1k4UWNFY2VjSXpsZzRaNEpYNW1Ga0YvSzNLWFpYQW83U3RMTVlGMVErRktWMk5zdnU4d0xReTZDd09DNDNJdG9tZDB5UERuTUV2TkxNUCtWU21Jek5lTXJFMWJ0U3h1bC9YTVZ0Rkg1eUlTMXNIUE9PTnVsbUE3WTloOUNkZ3h5QlJ2dEpTcFZwRHU4d1h6NWkyQkJ2WHdpNlJPTStqNE9KTXJITzkxRk1ra3E2bWZhQkFrSkVCRjJNd2wrdEJvREdleDJ2THl2ZTF4VzBVTEozZURncUZTRXQ1Vk5lNVJ4R2VZckdHRDRraW9DeldtVjRBVFNXSXJncklwck1EeW4yc0tEcnBGL2JiMFI0VnhQYktBQm5oYXRrUGpFMFc0ai9DRW1pR3k2ZzZxajFCOHN3L2MwTGg4YjJUNTFLY3kzaExDSVE0YUJPWmNhcTJuN1h5NmgyWllsUjFJdEUwZk1pWVAxSW9aQ0JxeDh5RUZoVlVkK0VOVURjWFplckJ5TzRjOHZQZjZ3VU5jZkNNMFJWUTVNK1JLMUU2K0xOaVFyb0tVVGZVdUV4ZXBxRW1DUUJwRlA4N1pyRFM0STIvVWo3cmlncXZRNkxlSVR0TDdHRTRiZjJvQlYrK25mc293MkVqY1JCRTFvQUgvUSs1RncwTHRCdDRoSmIzOFB6MlAwWUJrTmxQalJiZnlIdjVXQ2VlNTI2REFVWEZKdCt6UHBhc0FBaFVDM3NEMkhjeC92a3pLQkVnTlpOVXZpUzlEWmN5SUxla3lIZE9WNlM0YTNVUzFDZXExWTR0YnF6L0VyWTdIbEprSmNxdUkzL1UxQjd5M2wxNys1SGQ1WmRnL3JvZjlPK2lqaHBLMWxsVmdhZDRPODVqOHlWTUtCQjVFUUtMYVVjV29HYWVOOGlIZEFHcUJZLzhGTzl4SjJqbFovRlByV25YOGxpVVRkZ3FVeklzVGxKMGtlU1NoUTRpajk1ZUcwcDZzaDE5cUVwUjRxNEYrRWE4MERpY2ZCSEE2MVFYUi9UeFRuSkcxMGh0TEM3RzRwMFk2VEtrcU5CaHFKNXROdVZ3aXdmUklWS0p6RllBTWNFWmlaK3BXcy9IcXdlRW1SVHRsRlo2UVlJZHY4QXpCcEsvRmsyRi9rUGt0cVpoMDJYbGZ2Wm0ybzJISzZpcytRMnpLbkVFN05DcitUQkgrU1JrZENwZGNqanJlRTJSTXlnYm44c29CMkNSYldRK2toS0MvK3VjMVoxMzBxSDdwTmFrTzFLQVM3UnNaUmk1SlFPSG14NXJiZ29lTUM4bEdlTW5HcTZIa1hCcVJYNHVYeG9DVzZWaVhxL3NuZUpCN1hnWDRGUkZPNUgxejdrekdBblBTamxYeHF2VStYRW1BamFIdkcwVTYrTU9VS1RsRGluRkhtWWp2OXBDeWowOHNWWTIwSzFUelJkQWhKckxsMDN5dVJIU2ZtVGswdEs3SGh3ZnJlUGY5QUljb1pkRHR5YmJIVjFpbWU5V3JOV0ZXeVNXZnhBVlVSWkpuTFVoWGtmMjhzd3NjT0JIeDRCQVAyemREQjRmZEoyWENId0NOLzFFdTR0SGVNRVVPR1hCckV6ajh2SkpkcS9uUStnTGVQRFJaUkhvcXlaOVJQa0Z0UDd0aldtSm9LRTRzMTNLVFFmT0Z4VkhFUzhFM3F0WUVML2RQYWhBL0MzWGdhNW91RmkxT3BiQVVLQTdGR3g4ekpNaHNqRlErNjAzV29HamZmY0R0TjhxMzJGdlhVZG1WREJSTlNKdUhvQW11NzdoM3Jrd3ZELzgxZ3pUdUZERmdaVUErMUYvQWhnUCt4aUxhRDBYQ3Q5S2kvOGkyaFBSakhwTklERmR2cUdFNlJWQTRaKytFK1Ztc05MYmpjNWVNSWlFRFA0ZFlFaVNjQ2RrNmpvZFpIOEtyRlFNUHZCWTFPV05OdmNTalJsaXV4TnJsYWgramJERTA4dm9MM1dJSTh3VkhGYmFZV3hJakVneTVhaWpTcWhtb00vdlkwdGRRU2ZJVzQ5d1p6WUNvaGRKSEtzaGdxd2JKckxEWG40dk12L2g2VmI3aXl4UzRNZ1pRQWdVVUtGMzExZ2pZRFZwN09jdzhEeW9VaGxjNm05b3NudWllZTZVNFVCSlVDMWtIQUJNUEc5dHV2WkFyMUZ3d1B1LzRvdmZwb2lUTVgza2s5OHhEeHNrb1pJUnB2Qytnd0pXMTFOUTdSK0x1WHNpenlFaWc4WDVXMUNpbkQxdzlzcTZ1QXRxQWNOSlRGWDFGalZKZmswQ2JZTlk4Y1JyeGlFVmhCZkRBOS8rQy93M1pOK01xQkhKQUFBQUFFbEZUa1N1UW1DQyk7IH0gLmJ0bi1laCB7IGZvbnQtZmFtaWx5OiAnU291cmNlIFNhbnMgUHJvJywgVGFob21hLCBzYW5zLXNlcmlmICFpbXBvcnRhbnQ7IGZvbnQtd2VpZ2h0OiA5MDA7IGZvbnQtc2l6ZTogMTJweDsgd2lkdGg6IDYycHg7IHBhZGRpbmc6IDJweCAwOyBjb2xvcjogI0ZGRkZGRiAhaW1wb3J0YW50OyBib3gtc2hhZG93OiAwLjBlbSAwLjBlbSAwLjVlbSByZ2JhKDAsMCwwLDAuNSk7IHRleHQtc2hhZG93OiAxcHggMXB4IDAgcmdiYSgwLDAsMCwwLjUpLCAwIDAgMC4zZW0gIzAwMDsgLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7IG1hcmdpbi1ib3R0b206IDlweDsgfSAuYnRuLWRvdWppbnNoaSB7IGJhY2tncm91bmQtY29sb3I6IGhzbCgwLCA5MiUsIDI3JSkgIWltcG9ydGFudDsgYmFja2dyb3VuZC1pbWFnZTogLWtodG1sLWdyYWRpZW50KGxpbmVhciwgbGVmdCB0b3AsIGxlZnQgYm90dG9tLCBmcm9tKCNmNzQwNDApLCB0bygjODQwNTA1KSk7IGJhY2tncm91bmQtaW1hZ2U6IC1tb3otbGluZWFyLWdyYWRpZW50KHRvcCwgI2Y3NDA0MCwgIzg0MDUwNSk7IGJhY2tncm91bmQtaW1hZ2U6IC1tcy1saW5lYXItZ3JhZGllbnQodG9wLCAjZjc0MDQwLCAjODQwNTA1KTsgYmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1ncmFkaWVudChsaW5lYXIsIGxlZnQgdG9wLCBsZWZ0IGJvdHRvbSwgY29sb3Itc3RvcCgwJSwgI2Y3NDA0MCksIGNvbG9yLXN0b3AoMTAwJSwgIzg0MDUwNSkpOyBiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudCh0b3AsICNmNzQwNDAsICM4NDA1MDUpOyBiYWNrZ3JvdW5kLWltYWdlOiAtby1saW5lYXItZ3JhZGllbnQodG9wLCAjZjc0MDQwLCAjODQwNTA1KTsgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KCNmNzQwNDAsICM4NDA1MDUpOyBib3JkZXItY29sb3I6ICM4NDA1MDUgIzg0MDUwNSBoc2woMCwgOTIlLCAxOC41JSk7IH0gLmJ0bi1tYW5nYSB7IGJhY2tncm91bmQtY29sb3I6IGhzbCgyMCwgMTAwJSwgMjQlKSAhaW1wb3J0YW50OyBiYWNrZ3JvdW5kLWltYWdlOiAta2h0bWwtZ3JhZGllbnQobGluZWFyLCBsZWZ0IHRvcCwgbGVmdCBib3R0b20sIGZyb20oI2ZmNzYzMiksIHRvKCM3YTI4MDApKTsgYmFja2dyb3VuZC1pbWFnZTogLW1vei1saW5lYXItZ3JhZGllbnQodG9wLCAjZmY3NjMyLCAjN2EyODAwKTsgYmFja2dyb3VuZC1pbWFnZTogLW1zLWxpbmVhci1ncmFkaWVudCh0b3AsICNmZjc2MzIsICM3YTI4MDApOyBiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWdyYWRpZW50KGxpbmVhciwgbGVmdCB0b3AsIGxlZnQgYm90dG9tLCBjb2xvci1zdG9wKDAlLCAjZmY3NjMyKSwgY29sb3Itc3RvcCgxMDAlLCAjN2EyODAwKSk7IGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KHRvcCwgI2ZmNzYzMiwgIzdhMjgwMCk7IGJhY2tncm91bmQtaW1hZ2U6IC1vLWxpbmVhci1ncmFkaWVudCh0b3AsICNmZjc2MzIsICM3YTI4MDApOyBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoI2ZmNzYzMiwgIzdhMjgwMCk7IGJvcmRlci1jb2xvcjogIzdhMjgwMCAjN2EyODAwIGhzbCgyMCwgMTAwJSwgMTUlKTsgfSAuYnRuLWFydGlzdGNnIHsgYmFja2dyb3VuZC1jb2xvcjogaHNsKDUyLCAxMDAlLCAyNCUpICFpbXBvcnRhbnQ7IGJhY2tncm91bmQtaW1hZ2U6IC1raHRtbC1ncmFkaWVudChsaW5lYXIsIGxlZnQgdG9wLCBsZWZ0IGJvdHRvbSwgZnJvbSgjZmZlOTViKSwgdG8oIzdhNmEwMCkpOyBiYWNrZ3JvdW5kLWltYWdlOiAtbW96LWxpbmVhci1ncmFkaWVudCh0b3AsICNmZmU5NWIsICM3YTZhMDApOyBiYWNrZ3JvdW5kLWltYWdlOiAtbXMtbGluZWFyLWdyYWRpZW50KHRvcCwgI2ZmZTk1YiwgIzdhNmEwMCk7IGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtZ3JhZGllbnQobGluZWFyLCBsZWZ0IHRvcCwgbGVmdCBib3R0b20sIGNvbG9yLXN0b3AoMCUsICNmZmU5NWIpLCBjb2xvci1zdG9wKDEwMCUsICM3YTZhMDApKTsgYmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQodG9wLCAjZmZlOTViLCAjN2E2YTAwKTsgYmFja2dyb3VuZC1pbWFnZTogLW8tbGluZWFyLWdyYWRpZW50KHRvcCwgI2ZmZTk1YiwgIzdhNmEwMCk7IGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgjZmZlOTViLCAjN2E2YTAwKTsgYm9yZGVyLWNvbG9yOiAjN2E2YTAwICM3YTZhMDAgaHNsKDUyLCAxMDAlLCAxMyUpOyB9IC5idG4tZ2FtZWNnIHsgYmFja2dyb3VuZC1jb2xvcjogaHNsKDgyLCA0MiUsIDE0JSkgIWltcG9ydGFudDsgYmFja2dyb3VuZC1pbWFnZTogLW1vei1saW5lYXItZ3JhZGllbnQodG9wLCAjOTZiYTU4LCAjMjczMjE0KTsgYmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1ncmFkaWVudChsaW5lYXIsIGxlZnQgdG9wLCBsZWZ0IGJvdHRvbSwgY29sb3Itc3RvcCgwJSwgIzk2YmE1OCksIGNvbG9yLXN0b3AoMTAwJSwgIzI3MzIxNCkpOyBiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudCh0b3AsICM5NmJhNTgsICMyNzMyMTQpOyBiYWNrZ3JvdW5kLWltYWdlOiAtby1saW5lYXItZ3JhZGllbnQodG9wLCAjOTZiYTU4LCAjMjczMjE0KTsgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KCM5NmJhNTgsICMyNzMyMTQpOyBib3JkZXItY29sb3I6ICMyNzMyMTQgIzI3MzIxNCBoc2woODIsIDQyJSwgNCUpOyB9IC5idG4td2VzdGVybiB7IGJhY2tncm91bmQtY29sb3I6IGhzbCg4MiwgMTAwJSwgMjQlKSAhaW1wb3J0YW50OyBiYWNrZ3JvdW5kLWltYWdlOiAtbW96LWxpbmVhci1ncmFkaWVudCh0b3AsICNjM2ZmNWIsICM0ZDdhMDApOyBiYWNrZ3JvdW5kLWltYWdlOiAtbXMtbGluZWFyLWdyYWRpZW50KHRvcCwgI2MzZmY1YiwgIzRkN2EwMCk7IGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtZ3JhZGllbnQobGluZWFyLCBsZWZ0IHRvcCwgbGVmdCBib3R0b20sIGNvbG9yLXN0b3AoMCUsICNjM2ZmNWIpLCBjb2xvci1zdG9wKDEwMCUsICM0ZDdhMDApKTsgYmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQodG9wLCAjYzNmZjViLCAjNGQ3YTAwKTsgYmFja2dyb3VuZC1pbWFnZTogLW8tbGluZWFyLWdyYWRpZW50KHRvcCwgI2MzZmY1YiwgIzRkN2EwMCk7IGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgjYzNmZjViLCAjNGQ3YTAwKTsgYm9yZGVyLWNvbG9yOiAjNGQ3YTAwICM0ZDdhMDAgaHNsKDgyLCAxMDAlLCAxMyUpOyB9IC5idG4tbm9uLWggeyBiYWNrZ3JvdW5kLWNvbG9yOiBoc2woMTg1LCA0NCUsIDI0JSkgIWltcG9ydGFudDsgYmFja2dyb3VuZC1pbWFnZTogLW1vei1saW5lYXItZ3JhZGllbnQodG9wLCAjNzNjMWM4LCAjMjI1MzU4KTsgYmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1ncmFkaWVudChsaW5lYXIsIGxlZnQgdG9wLCBsZWZ0IGJvdHRvbSwgY29sb3Itc3RvcCgwJSwgIzczYzFjOCksIGNvbG9yLXN0b3AoMTAwJSwgIzIyNTM1OCkpOyBiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudCh0b3AsICM3M2MxYzgsICMyMjUzNTgpOyBiYWNrZ3JvdW5kLWltYWdlOiAtby1saW5lYXItZ3JhZGllbnQodG9wLCAjNzNjMWM4LCAjMjI1MzU4KTsgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KCM3M2MxYzgsICMyMjUzNTgpOyBib3JkZXItY29sb3I6ICMyMjUzNTggIzIyNTM1OCBoc2woMTg1LCA0NCUsIDE0LjUlKTsgfSAuYnRuLWltYWdlc2V0IHsgYmFja2dyb3VuZC1jb2xvcjogaHNsKDIwOSwgNzQlLCAyMiUpICFpbXBvcnRhbnQ7IGJhY2tncm91bmQtaW1hZ2U6IC1tb3otbGluZWFyLWdyYWRpZW50KHRvcCwgIzU2YTBlNSwgIzBlMzk2MSk7IGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtZ3JhZGllbnQobGluZWFyLCBsZWZ0IHRvcCwgbGVmdCBib3R0b20sIGNvbG9yLXN0b3AoMCUsICM1NmEwZTUpLCBjb2xvci1zdG9wKDEwMCUsICMwZTM5NjEpKTsgYmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQodG9wLCAjNTZhMGU1LCAjMGUzOTYxKTsgYmFja2dyb3VuZC1pbWFnZTogLW8tbGluZWFyLWdyYWRpZW50KHRvcCwgIzU2YTBlNSwgIzBlMzk2MSk7IGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgjNTZhMGU1LCAjMGUzOTYxKTsgYm9yZGVyLWNvbG9yOiAjMGUzOTYxICMwZTM5NjEgaHNsKDIwOSwgNzQlLCAxMiUpOyB9IC5idG4tY29zcGxheSB7IGJhY2tncm91bmQtY29sb3I6IGhzbCgyNTksIDQxJSwgMjclKSAhaW1wb3J0YW50OyBiYWNrZ3JvdW5kLWltYWdlOiAtbW96LWxpbmVhci1ncmFkaWVudCh0b3AsICNhOTk2ZDMsICMzYTI4NjEpOyBiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWdyYWRpZW50KGxpbmVhciwgbGVmdCB0b3AsIGxlZnQgYm90dG9tLCBjb2xvci1zdG9wKDAlLCAjYTk5NmQzKSwgY29sb3Itc3RvcCgxMDAlLCAjM2EyODYxKSk7IGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KHRvcCwgI2E5OTZkMywgIzNhMjg2MSk7IGJhY2tncm91bmQtaW1hZ2U6IC1vLWxpbmVhci1ncmFkaWVudCh0b3AsICNhOTk2ZDMsICMzYTI4NjEpOyBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoI2E5OTZkMywgIzNhMjg2MSk7IGJvcmRlci1jb2xvcjogIzNhMjg2MSAjM2EyODYxIGhzbCgyNTksIDQxJSwgMTYlKTsgfSAuYnRuLWFzaWFucG9ybiB7IGJhY2tncm91bmQtY29sb3I6IGhzbCgzMjEsIDc2JSwgMjYlKSAhaW1wb3J0YW50OyBiYWNrZ3JvdW5kLWltYWdlOiAtbW96LWxpbmVhci1ncmFkaWVudCh0b3AsICNlYzc4YzMsICM3NDBmNTEpOyBiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWdyYWRpZW50KGxpbmVhciwgbGVmdCB0b3AsIGxlZnQgYm90dG9tLCBjb2xvci1zdG9wKDAlLCAjZWM3OGMzKSwgY29sb3Itc3RvcCgxMDAlLCAjNzQwZjUxKSk7IGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KHRvcCwgI2VjNzhjMywgIzc0MGY1MSk7IGJhY2tncm91bmQtaW1hZ2U6IC1vLWxpbmVhci1ncmFkaWVudCh0b3AsICNlYzc4YzMsICM3NDBmNTEpOyBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoI2VjNzhjMywgIzc0MGY1MSk7IGJvcmRlci1jb2xvcjogIzc0MGY1MSAjNzQwZjUxIGhzbCgzMjEsIDc2JSwgMTUlKTsgfSAuYnRuLW1pc2MgeyBiYWNrZ3JvdW5kLWNvbG9yOiBoc2woMzIxLCAwJSwgMjElKSAhaW1wb3J0YW50OyBiYWNrZ3JvdW5kLWltYWdlOiAtbW96LWxpbmVhci1ncmFkaWVudCh0b3AsICNiZmJmYmYsICMzNTM1MzUpOyBiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWdyYWRpZW50KGxpbmVhciwgbGVmdCB0b3AsIGxlZnQgYm90dG9tLCBjb2xvci1zdG9wKDAlLCAjYmZiZmJmKSwgY29sb3Itc3RvcCgxMDAlLCAjMzUzNTM1KSk7IGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KHRvcCwgI2JmYmZiZiwgIzM1MzUzNSk7IGJhY2tncm91bmQtaW1hZ2U6IC1vLWxpbmVhci1ncmFkaWVudCh0b3AsICNiZmJmYmYsICMzNTM1MzUpOyBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoI2JmYmZiZiwgIzM1MzUzNSk7IGJvcmRlci1jb2xvcjogIzM1MzUzNSAjMzUzNTM1IGhzbCgzMjEsIDAlLCA3LjUlKTsgfSAuZXhhY3Rpb25zLCAuZXhyZXN1bHRzIHsgbWF4LXdpZHRoOiAxMDAlOyB3aWR0aDogYXV0bzsgcGFkZGluZzogNHB4OyBtYXJnaW46IDNweCAwOyBib3JkZXItcmFkaXVzOiA0cHg7IGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwwLDAsMC4wNSkgIWltcG9ydGFudDsgfSAuZXhyZXN1bHRzIHsgcGFkZGluZzogNnB4OyB9IC5leGFjdGlvbnMtdGFibGUgeyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHZlcnRpY2FsLWFsaWduOiB0b3A7IHdpZHRoOiAxMDAlOyB9IC5leHNhdWNlLW5vLXVuZGVybGluZSwgLmV4c2F1Y2UtaG92ZXIgeyB0ZXh0LWRlY29yYXRpb246IG5vbmUgIWltcG9ydGFudDsgfSAuZXhhY3Rpb24geyB0ZXh0LWRlY29yYXRpb246IG5vbmUgIWltcG9ydGFudDsgdmVydGljYWwtYWxpZ246IHRvcDsgbWFyZ2luOiAwIDRweDsgfSAuZXh0YWcgeyBkaXNwbGF5OiBpbmxpbmUtYmxvY2sgIWltcG9ydGFudDsgdGV4dC1kZWNvcmF0aW9uOiBub25lICFpbXBvcnRhbnQ7IG1hcmdpbjogMHB4IDJweCAhaW1wb3J0YW50OyB9IC5leGRldGFpbHMgeyBmb250LXNpemU6IDEzcHggIWltcG9ydGFudDsgb3BhY2l0eTogMC45MzsgcG9zaXRpb246IGZpeGVkICFpbXBvcnRhbnQ7IHotaW5kZXg6IDk5OSAhaW1wb3J0YW50OyBwYWRkaW5nOiA4cHggIWltcG9ydGFudDsgYm9yZGVyLXJhZGl1czogOHB4ICFpbXBvcnRhbnQ7IHRleHQtYWxpZ246IGNlbnRlciAhaW1wb3J0YW50OyB3aWR0aDogNjAlICFpbXBvcnRhbnQ7IH0gLmV4aG92ZXIgeyBvcGFjaXR5OiAwLjkzOyBwb3NpdGlvbjogZml4ZWQgIWltcG9ydGFudDsgei1pbmRleDogOTk4ICFpbXBvcnRhbnQ7IHBhZGRpbmc6IDhweCAhaW1wb3J0YW50OyBib3JkZXItcmFkaXVzOiA0cHggIWltcG9ydGFudDsgd2lkdGg6IGF1dG8gIWltcG9ydGFudDsgfSAuZXhzaWRlcGFuZWwgeyBmbG9hdDogcmlnaHQ7IG1hcmdpbi1sZWZ0OiA4cHg7IGZvbnQtc2l6ZTogMTRweCAhaW1wb3J0YW50OyBsaW5lLWhlaWdodDogMS4wZW0gIWltcG9ydGFudDsgfSAuZXhzaWRlYmFyYm94IHsgd2lkdGg6IDY0cHg7IGZvbnQtc2l6ZTogMC44ZW07IGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwwLDAsMC4yKTsgYm9yZGVyLXJhZGl1czogNHB4OyBiYWNrZ3JvdW5kLWNsaXA6IHBhZGRpbmctYm94OyBib3gtc2hhZG93OiAwLjBlbSAwLjBlbSAwLjVlbSByZ2JhKDAsMCwwLDAuMik7IG1hcmdpbi1ib3R0b206IDlweDsgcGFkZGluZzogNHB4IDA7IH0gLmV4dGl0bGUgeyBmb250LXNpemU6IDEuNWVtICFpbXBvcnRhbnQ7IGZvbnQtd2VpZ2h0OiBib2xkICFpbXBvcnRhbnQ7IHRleHQtc2hhZG93OiAwLjFlbSAwLjFlbSAwLjRlbSByZ2JhKDAsMCwwLDAuMTUpICFpbXBvcnRhbnQ7IHRleHQtZGVjb3JhdGlvbjogbm9uZSAhaW1wb3J0YW50OyB9IC5leGpwdGl0bGUgeyBvcGFjaXR5OiAwLjU7IGZvbnQtc2l6ZTogMS4xZW07IHRleHQtc2hhZG93OiAwLjFlbSAwLjFlbSAwLjVlbSByZ2JhKDAsMCwwLDAuMikgIWltcG9ydGFudDsgfSAuZXhkZXRhaWxzIC5leHRhZyB7IGZvbnQtc2l6ZTogMS4wNWVtICFpbXBvcnRhbnQ7IH0gLmV4dGh1bWJuYWlsIHsgZmxvYXQ6IGxlZnQ7IGJhY2tncm91bmQtaW1hZ2U6IHVybCgje2RhdGEudGh1bWJ9KTsgbWFyZ2luLXJpZ2h0OiA4cHg7IHdpZHRoOiAxNDBweDsgaGVpZ2h0OiAyMDBweDsgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDsgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjsgYmFja2dyb3VuZC1wb3NpdGlvbjogMjUlIDAlOyB9ICNleGxpbmtzLW92ZXJsYXkgeyBwb3NpdGlvbjogZml4ZWQ7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IHRvcDogMDsgbGVmdDogMDsgdGV4dC1hbGlnbjogY2VudGVyOyBiYWNrZ3JvdW5kOiByZ2JhKDAsMCwwLDAuNSk7IHotaW5kZXg6IDEwMDA7IH0gI2V4bGlua3Mtb3B0aW9ucyB7IGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7IGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmOyBwb3NpdGlvbjogZml4ZWQgIWltcG9ydGFudDsgd2lkdGg6IDYwJSAhaW1wb3J0YW50OyBoZWlnaHQ6IDYwJSAhaW1wb3J0YW50OyB0b3A6IDE2JSAhaW1wb3J0YW50OyBsZWZ0OiAyMCUgIWltcG9ydGFudDsgcGFkZGluZzogOHB4ICFpbXBvcnRhbnQ7IHBhZGRpbmctdG9wOiAycHggIWltcG9ydGFudDsgYm9yZGVyLXJhZGl1czogNnB4ICFpbXBvcnRhbnQ7IHotaW5kZXg6IDEwMDEgIWltcG9ydGFudDsgdGV4dC1hbGlnbjogbGVmdCAhaW1wb3J0YW50OyBwYWRkaW5nLWJvdHRvbTogNjRweCAhaW1wb3J0YW50OyB9IC5leGxpbmtzLW9wdGlvbnMtYnV0dG9uIHsgbWFyZ2luOiA0cHggMnB4OyBkaXNwbGF5OiBpbmxpbmUtYmxvY2sgIWltcG9ydGFudDsgcGFkZGluZzogNHB4OyBiYWNrZ3JvdW5kOiByZ2JhKDAsMCwwLDAuMDUpOyBib3JkZXItcmFkaXVzOiAzcHg7IH0gLmV4bGlua3Mtb3B0aW9ucy10aXRsZSB7IGZvbnQtc2l6ZTogMi4wZW0gIWltcG9ydGFudDsgZm9udC13ZWlnaHQ6IGJvbGQgIWltcG9ydGFudDsgdGV4dC1kZWNvcmF0aW9uOiBub25lICFpbXBvcnRhbnQ7IH0gLmV4bGlua3Mtb3B0aW9ucy12ZXJzaW9uIHsgbWFyZ2luOiAwIDRweDsgb3BhY2l0eTogMC45OyB2ZXJ0aWNhbC1hbGlnbjogNzUlOyB0ZXh0LWRlY29yYXRpb246IG5vbmUgIWltcG9ydGFudDsgfSAjZXhsaW5rcy1vcHRpb25zLWNvbnRlbnQgeyBvdmVyZmxvdy15OiBzY3JvbGwgIWltcG9ydGFudDsgcGFkZGluZzogNHB4ICFpbXBvcnRhbnQ7IHRleHQtYWxpZ246IGxlZnQ7IGhlaWdodDogMTAwJTsgbWFyZ2luLXRvcDogMTZweCAhaW1wb3J0YW50OyB9IC5leGxpbmtzLW9wdGlvbnMtc3VidGl0bGUgeyBmb250LXNpemU6IDEuNWVtICFpbXBvcnRhbnQ7IGZvbnQtd2VpZ2h0OiBib2xkOyBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgfSAuZXhsaW5rcy1vcHRpb25zLW5vdGljZSB7IGZsb2F0OiByaWdodDsgcGFkZGluZy10b3A6IDdweDsgbWFyZ2luLXJpZ2h0OiA0cHg7IG9wYWNpdHk6IDAuNjsgfSAuZXhsaW5rcy1vcHRpb25zLXRhYmxlIHsgd2lkdGg6IDEwMCU7IGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwwLDAsMC4yKTsgYm9yZGVyLXJhZGl1czogNHB4OyBtYXJnaW46IDRweCAwOyB9IC5leGxpbmtzLW9wdGlvbnMtdGFibGUgdHI6bnRoLWNoaWxkKGV2ZW4pIHsgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDAsMCwwLjA1KTsgfSAuZXhsaW5rcy1vcHRpb25zLXRhYmxlIHRyOm50aC1jaGlsZChvZGQpIHsgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDAsMCwwLjAyNSk7IH0=';
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
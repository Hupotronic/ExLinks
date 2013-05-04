# This module interacts with the E-Hentai API.
require! {
  ls: './prelude-min.ls'
      './$.ls'
}

module.exports =
  s: {}
  g: {}
  queue: !(type, data, clear) ->

    if ls.empty data then return
    if clear then @[type] = []

    while typeof! data.0 == \Array
      @queue type, data.shift!

    if type == \s and @g[data.0]? then return
    
    @[type][data.0] = data

  build-request: (type) ->

    list = ls.split-at 25 (values @[type])
    @queue type, list.1, true

    req = switch type
    case \s
      method: \gtoken
      pagelist: list.0
    case \g
      method: \gidlist
      gidlist: list.0

  request: !(type) ->

    (err, result) <-! $.post {
      url: 'http://g.e-hentai.org/api.php'
      data: @build-request type
      data-type: \json
      content-type: \application/json
    }

    if err then
      log.error err




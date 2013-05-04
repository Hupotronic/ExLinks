# AJAX module.

d = document

defaults =
  type: \GET
  url: d.location.origin + d.location.pathname
  data: void
  content-type: void
  response-type: \text
  headers: {}


module.exports = 
  
  ajax: (settings = {}, fn) ->
    if not fn? then
      fn (new Error 'No callback specified for XHR'), void
      return

    r <<< defaults # import default settings
    r <<< settings # import user-defined settings

    xhr = new XMLHttpRequest!
    xhr.open r.type, r.url 
    
    switch r.response-type
    | \json     => use-json = true; xhr.response-type = \text
    | otherwise => xhr.response-type = r.response-type

    switch r.content-type
    | \json => r.headers['Content-Type'] = \application/json
    | \form => r.headers['Content-Type'] = \application/x-www-form-urlencoded
  
    if r.content-type is \json then
      r.data = JSON.stringify r.data
  
    for h, v of r.headers
      xhr.set-request-header h, v
  
    xhr.onreadystatechange = ->
      if xhr.ready-state is 4 and xhr.status is 200 then

        res = xhr.response

        if use-json then
        try
          res = JSON.parse res
        catch err
          fn err, void
          return

        fn void, res

      else
        fn (new Error xhr.status), void
        return
  
    xhr.send r.data

  get: (settings = {}, fn) ->
    @ajax settings, fn

  post: (settings = {}, fn) ->
    settings.type = \POST
    @ajax settings, fn
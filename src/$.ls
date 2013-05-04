# jQuery-inspired utility toolkit

require! ls: './prelude.ls'

d = document

$ = (selector, root = d.body) ->
  (Array::slice.call root.query-selector-all selector) <<< extend

extend =
  each: ->
    ls.each it, @

  prep: (elem) ->
    if not elem instanceof HTMLElement
    then elem = @node el

    if @length > 1
    then elem.clone-node true
    else elem

  node: (el) ->
     # to be done

  textnodes: ->
    ws    = /^\s*$/
    tags  = /^(SPAN|P|S)$/
    nodes = []

    @each !function walk
      for n in it.child-nodes
        switch n.node-type
        | 3 => nodes.push n if !ws.test  n.node-value
        | 1 => walk n       if tags.test n.tag-name

    nodes <<< extend

  prepend: (el) ->
    @each ~> 
      parent = it.parent-node
      parent.insert-before (@prep el), parent.first-child

  append: (el) ->
    @each ~>
      it.parent-node.append-child (@prep el)

  before: (el) ->
    @each ~>
      it.parent-node.insert-before (@prep el), it

  after: (el) ->
    @each ~>
      it.parent-node.insert-before (@prep el), it.next-sibling

  replace: (el) ->
    @each ~>
      it.parent-node.replace-child (@prep el), it

  remove: ->
    @each ~>
      it.parent-node.remove-child it

  clear: ->
    @each ~>
      while node = it.first-child
        it.remove-child node

  on: (evt, fn) ->
    @each ~>
      if not fn? and evt instanceof Object
      then for k, v of evt
        it.add-event-listener k, v, false
      else
        it.add-event-listener evt, fn, false

  off: (evt, fn) ->
    @each ~>
      if not fn? and evt instanceof Object
      then for k, v of evt
        it.remove-event-listener k, v, false
      else
        it.remove-event-listener evt, fn, false

$ <<< require './ajax.ls'

module.exports = $
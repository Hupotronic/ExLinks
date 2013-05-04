# Some global helper functions, inspired by prelude-ls.

module.exports =

  each: (fn, target) ->
    case target instanceof Array
      for v in target
        fn v
    case target instanceof Object
      for k of target
        fn target[k]

    target

  clamp: (val, min, max) ->
    | val < min => min
    | val > max => max
    | otherwise => val

  split-at: (num, head) ->
    tail = head.splice num
    [head tail]

  empty: ->
    switch typeof! it
    | \Array  => !it.length
    | \Object => !Object.keys it .length
    | \String => !it
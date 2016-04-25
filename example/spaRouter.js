var spaRouter = (function(window) {
  var _stateUrlMap = {},
      _templateCache = {},
      _currentState = '',
      _isHtml5Mode = true,
      _isInit = false,
      _rootView,
      _defaultState,
      _self

  function _getStateByUrl(url) {
    for (var state in _stateUrlMap) {
      if (_stateUrlMap[state].url === url) {
        return state
      }
    }
  }

  function _getUrlByState(state) {
    return _stateUrlMap[state].url
  }

  function _getTplUrlByState(state) {
    return _stateUrlMap[state].templateUrl
  }

  function _handleCurrentUrl() {
    var url = location.pathname

    go(_getStateByUrl(url))
  }

  function _handleLinkTag() {
    document.addEventListener('click', function(event) {
      var url

      if (event.target.tagName.toLowerCase() === 'a') {
        event.preventDefault()
        url = event.target.pathname
        go(_getStateByUrl(url), true)

        return false
      }
    })
  }

  function _ajax(url, resolve, reject) {
    var xhr = new XMLHttpRequest()

    xhr.onload = function() {
      resolve(xhr.responseText)
    }
    xhr.onerror = function() {
      // console.log('Ajax error')
      reject('Ajax error')
    }
    xhr.open('get', url)
    xhr.send()
  }

  function _getTplPromise(state) {
    var url = _getTplUrlByState(state)

    if (_templateCache.url) {
      return Promise.resolve(_templateCache.url)
    } else {
      return new Promise(function(resolve, reject) {
        _ajax(url, resolve, reject)
      })
    }
  }

  function _decomposeState(state) {
    var stateList = [],
        index = state.length

    do {
      state = state.slice(0, index)
      stateList.push(state)
      index = state.lastIndexOf('.')
    } while (index != -1)

    return stateList.reverse()
  }

  function _renderView(newState) {
    var stateList = _decomposeState(newState),
        innerView = _rootView

    stateList.reduce(function(prePromise, state) {
      var tplPromise = _getTplPromise(state)

      return prePromise.then(function() {
        return tplPromise.then(function(template) {
          innerView.innerHTML = template
          innerView = innerView.querySelector('[spa-view]')
        })
      })
    }, Promise.resolve())
  }

  function _concatUrlByState(state, url) {
    var index = state.lastIndexOf('.'),
        parentState

    if (index != -1) {
      parentState = state.slice(0, index)
      return _stateUrlMap[parentState].url + url
    } else {
      return url
    }
  }

  function init() {
    _isInit = true

    if (!window.history) {
      _isHtml5Mode = false
    }

    _rootView = document.querySelector('[spa-view]')

    _handleCurrentUrl()

    _handleLinkTag()
  }

  function state(state, config) {
    var url = _concatUrlByState(state, config.url)

    config.url = url

    _stateUrlMap[state] = config
  }

  function otherwise(state) {
    _defaultState = state
  }

  function go(state, isUrlChange) {
    var path,
        url

    if (!state || !(state in _stateUrlMap)) {
      if (_defaultState) {
        state = _defaultState
        isUrlChange = true
      } else {
        throw new Error('Invalid state')
      }
    }

    if (_currentState === state) {
      return
    }

    path = _getUrlByState(state)

    if (_isHtml5Mode) {
      if (isUrlChange) {
        window.history.pushState(null, null, path)
      }
    } else {
      url = window.location.origin + '#' + path

      if (window.location.href !== url) {
        window.location.href = url
      }
    }

    _currentState = state

    _renderView(_currentState)
  }

  function html5Mode(isHtml5Mode) {
    _isHtml5Mode = !!isHtml5Mode
  }

  function getCurrentState() {
    return _currentState
  }

  function getStates() {
    return Object.keys(_stateUrlMap)
  }

  function _beforeInit(fn) {
    return function() {
      if (!_isInit) {
        fn.apply(fn, arguments)
      }
    }
  }

  function _chainable(fn) {
    return function() {
      fn.apply(fn, arguments)
      return _self
    }
  }

  _self = {
    init: _beforeInit(init),
    state: _chainable(_beforeInit(state)),
    otherwise: _chainable(_beforeInit(otherwise)),
    html5Mode: _beforeInit(html5Mode),
    go: function(state) {
      go(state, true)
    },
    getCurrentState: getCurrentState,
    getStates: getStates
  }

  return _self

})(window)

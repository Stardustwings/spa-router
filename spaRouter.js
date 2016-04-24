spaRouter = function() {
  var _stateUrlMap = {},
      _templateCache = {},
      _currentState = '',
      _rootView = document.querySelector('[spa-view]')
      _defaultState


  function _getStateByUrl(url) {
    for (var state in _stateUrlMap) {
      if (_stateUrlMap[state].url === url) {
        return url
      }
    }
  }

  function _getUrlByState(state) {
    return _stateUrlMap[state].url
  }

  function _handleCurrentUrl() {
    var url = location.pathname

    go(_getStateByUrl(url))
  }

  function _handleLinkTag(event) {
    document.addEventListener('click', function(event) {
      var url

      if (event.target.tagName.toLowerCase() === 'a') {
        event.preventDefault()
        url = event.target.href
        go(_getStateByUrl(url))

        return false
      }
    })
  }

  // function _getStateDifference(lastState, currentState) {
  //   var lastStateList = lastState.split('.'),
  //       currentStateList = currentState.split('.'),
  //       lastLength = lastStateList.length,
  //       currentLength = currentStateList.length,
  //       index

  //   for (index = 0; index < lastLength && index < currentLength; index++)  {
  //     if (lastStateList[index] != currentStateList[index]) {
  //       index++
  //       break
  //     }
  //   }

  //   if (index === currentLength) {
  //     return {
  //       type: 'remove',
  //       removeCount: lastLength - index
  //     }
  //   } else if (index === lastLength) {
  //     return {
  //       type: 'add',
  //       baseStates: currentStateList.slice(0, index + 1),
  //       addedStates: currentStateList.slice(index)
  //     }
  //   } else {
  //     return {
  //       type: 'modify',
  //       removeCount: lastLength - index,
  //       addedStates: currentStateList.slice(index)
  //     }
  //   }
  // }

  // function _removeElement(element) {
  //   element.parentelement.removeChild(element)
  // }

  // function _replaceElement(newEle, oldEle) {
  //   oldEle.parentNode.replaceChild(newEle, oldEle)
  // }

  function _ajax(url, resolve, reject) {
    var xhr = new XMLHttpRequest()

    xhr.onload = function() {
      resolve(xhr.responseText)
    }
    xhr.onerror = function() {
      console.log('Ajax error')
      reject('Ajax error')
    }
    xhr.open('get', url)
    xhr.send()
  }

  function _getTplPromise(state) {
    var url = _getUrlByState(state)

    if (_templateCache.url) {
      return Promise.resolve(_templateCache.url)
    } else {
      return new Promise(function(resolve, reject) {
        _ajax(url, resolve, reject)
      })
    }
  }

  // function _addTemplate(template) {
  //   spaView = _currentTemplate.querySelector('[spa-view]')

  //   newSpaView = spaView.clone()
  //   newSpaView.innerHTML = template

  //   _replaceElement(newSpaView, spaView)
  //   _currentTemplate = newSpaView
  // }

  // function _removeTemplate(count) {
  //   var temp

  //   while(count--) {
  //     temp = _currentTemplate
  //     _currentTemplate = _currentTemplate.parentTemplate
  //   }

  //   _removeElement(temp)
  // }

  // function _addTemplateByState(baseStates, addedStates) {
  //   var base = baseStates.join('.'),
  //       stateList,
  //       template,
  //       spaView

  //   stateList = base.map(function(state) {
  //     base = base + '.' + state

  //     return base
  //   })

  //   stateList.reduce(function(prePromise, state) {
  //     var tplPromise = _getTplPromise(state)

  //     return prePromise.then(function() {
  //       return tplPromise.then(__addTemplate)
  //     })
  //   }, Promise.resolve())
  // }

  // function _renderViewByDifferece(difference) {
  //   switch (difference.type) {
  //     'remove':
  //       _removeTemplate(difference.removeCount)
  //       break
  //     'add':
  //       _addTemplateByState(difference.baseStates, difference.addedStates)
  //       break
  //     'modify':
  //       _removeTemplate(difference.removeCount)
  //       _addTemplateByState(difference.baseStates, difference.addedStates)
  //       break
  //   }
  // }

  // function _renderViewByState(lastState, currentState) {
  //   var difference = _getStateDifference(lastState, currentState)

  //   _renderViewByDifferece(difference)
  // }

  function _decomposeState(state) {
    var stateList = [],
        index = state.length

    do {
      state = state.slice(0, index)
      stateList.push(state)
    } while (index != -1)

    return stateList
  }

  function _renderView(newState) {
    var newRootView =  document.createElement('div').setAttribute('spa-view', ''),
        stateList = _decomposeState(newState),
        innerView = _rootView

    stateList.reduce(function(prePromise, state) {
      var tplPromise = _getTplPromise(state)

      return prePromise.then(function() {
        return tplPromise.then(function(template) {
          innerView.innerHTML(template)
          innerView = innerView.querySelector('[spa-view]')
        })
      })
    }, Promise.resolve())
  }

  function init() {
    _handleCurrentUrl()

    _handleLinkTag()
  }

  function state(state, config) {
    _stateUrlMap[state] = config
  }

  function otherwise(state) {
    _defaultState = state
  }

  function go(state) {
    var lastState

    if (!state || !(state in _stateUrlMap)) {
      if (_defaultState) {
        state = _defaultState
      } else {
        throw new Error('Invalid state')
      }
    }

    if (_currentState === state) {
      return
    }

    lastState = _currentState
    _currentState = state

    window.history.pushState(null, null, _getUrlByState(state))
    _renderView(_currentState)
  }

  function getCurrentState() {
    return _currentState
  }

  return {
    init: init,
    state: state,
    otherwise: otherwise,
    go: go,
    getCurrentState: getCurrentState
  }
}

## Introdution
A simple spa router that mimics angular's ui-router

## API
### init()
  Init the router
### state(config)
  Creates a new application state
### otherwise(state)
  Handles invalid routes by redirecting to the state provided
### html5Mode([Boolean])
  Html5Mode Off results in prepended '#'
### go(state)
  Transion to the state provided
### getCurrentState()
  return current state
### getStates()
  return all registered states

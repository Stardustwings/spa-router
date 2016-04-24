spaRouter
  .state('fruit', {
    url: '/fruit',
    templateUrl: 'partials/fruit.html'
  })
  .state('fruit.list1', {
    url: '/list1',
    templateUrl: 'partials/fruit-list1.html'
  })
  .state('fruit.list2', {
    url: '/list2',
    templateUrl: 'partials/fruit-list2.html'
  })
  .state('vegatable', {
    url: '/vegatable',
    templateUrl: 'partials/vegatable.html'
  })
  .state('vegatable.list1', {
    url: '/list1',
    templateUrl: 'partials/vegatable-list1.html'
  })
  .state('vegatable.list2', {
    url: '/list2',
    templateUrl: 'partials/vegatable-list2.html'
  })
  .otherwise('/fruit')

spaRouter.init()

export function RoutesConfig($stateProvider, $urlRouterProvider) {
	'ngInject';

	let getView = (viewName) => {
		return `./views/app/pages/${viewName}/${viewName}.page.html`;
	};

	$urlRouterProvider.otherwise('/');

    /*
        data: {auth: true} would require JWT auth
        However you can't apply it to the abstract state
        or landing state because you'll enter a redirect loop
    */

	$stateProvider
		.state('app', {
			abstract: true,
            data: {},
			views: {
				header: {
					templateUrl: getView('header')
				},
				footer: {
					templateUrl: getView('footer')
				},
				main: {}
			}
		})
		.state('app.landing', {
            url: '/',
            views: {
                'main@': {
                    templateUrl: getView('landing')
                }
            }
        })
        .state('app.login', {
			url: '/login',
			views: {
				'main@': {
					templateUrl: getView('login')
				}
			}
		})
        .state('app.register', {
            url: '/register',
            views: {
                'main@': {
                    templateUrl: getView('register')
                }
            }
        })
        .state('app.forgot_password', {
            url: '/forgot-password',
            views: {
                'main@': {
                    templateUrl: getView('forgot-password')
                }
            }
        })
        .state('app.reset_password', {
            url: '/reset-password/:email/:token',
            views: {
                'main@': {
                    templateUrl: getView('reset-password')
                }
            }
        })
        .state('profile', {
            abstract: true,
            url: '/me',
            data: {},
            views: {
                header: {},
                footer: {},
                main: {}
            },
            middleware: ['AuthMiddleware']
        })
        .state('profile.dashboard', {
            url: '',
            views: {
                'main@': {
                    templateUrl: getView('profile')
                }
            },
            middleware: ['AuthMiddleware']
        })
        .state('profile.dashboard.search', {
            url: '/search/:query?by',
            template: '<search-results></search-results>',
            middleware: ['AuthMiddleware'],
            params: {
                cache: null
            }
        })
        .state('profile.dashboard.settings', {
            url: '/settings?tab',
            template: '<settings></settings>',
            middleware: ['AuthMiddleware'],
        })
        .state('profile.dashboard.list', {
            url: '/:list',
            template: '<list-details></list-details>',
            middleware: ['AuthMiddleware']
        })
        .state('profile.dashboard.list.task', {
            url: '/task/:task',
            template: '',
            params: {
                previousState: ["$state", function ($state) {
                    return {
                        Name: $state.current.name,
                        Params: $state.params,
                        URL: $state.href($state.current.name, $state.params)
                    };
                }]
            },
            middleware: ['AuthMiddleware']
        });
}

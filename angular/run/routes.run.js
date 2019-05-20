export function RoutesRun($transitions, $injector, $rootScope, TMWService, User, $q, $auth) {
    'ngInject';

    let deleteSideBars = () => {
        const deferred = $q.defer();
        const dashboard =  {
            stop: () => {
                let el = document.getElementsByClassName('sidebar');
                if (el.length) {
                    angular.element(el)
                        .remove();
                }
                $rootScope.rightBar = false;
                TMWService.stop();
            }
        };

        $q.when(dashboard.stop())
            .then(() => deferred.resolve(), () => deferred.reject());

        return deferred.promise;
    };

    let startWatch = () => {
        User.get().then(user => {
            TMWService.start(user);
        }, () => {});
    };

    $transitions.onStart({}, function($transition$) {
        const toState = $transition$.$to();

        if (toState.includes.app) {
            deleteSideBars().then(() => {
                if ($auth.isAuthenticated()) {
                    $transition$.abort();
                    User.get().then(() => {
                        User.handleRedirect()
                    });
                }
            })
        }

        if (toState.includes.profile) {
            startWatch()
        }

        const callMiddlewares = (event, state) => {
            if(state && state.hasOwnProperty('self') && state.self.hasOwnProperty('middleware')){
                if (typeof toState.self.middleware === 'object') {
                    angular.forEach(state.self.middleware, function (middleWare) {
                        callMiddleware(middleWare, event);
                    });
                }
            }
        };

        const callMiddleware = (middleWare, event) => {
            try{
                $injector.get(middleWare).run(event, $transition$);
            }catch(e){
                // console.error('the factory : ' + middleWare + ' does not exist. ' + e);
            }
        };

        callMiddlewares(null, toState);
    }, {priority: 10});

}

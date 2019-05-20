export class AuthMiddleware {
    constructor($auth, $state) {
        'ngInject';

        this.$auth = $auth;
        this.$state = $state;
    }

    run(event, transition){
        if(!this.$auth.isAuthenticated()){
            if (event) {
                event.preventDefault();
            }

            if (transition) {
                transition.abort();
            }
            // console.log('You are not logged in, so you cant browse this');
            this.$state.go('app.login');
        }
    }

}
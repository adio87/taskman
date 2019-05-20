export class UserService {
    constructor($auth, API, $state, $q) {
        'ngInject';

        this.$auth       = $auth;
        this.API         = API;
        this.$state      = $state;
        this.$q          = $q;

        this.model       = {};
        this.isLogin     = false;

    }

    logout() {
        this.$auth.logout();
        this.model = {};
        this.isLogin = false;
        this.$state.go('app.landing');
    }

    set(user){
        this.model = user;
        this.isLogin = true;
    }

    get(){
        let deferred = this.$q.defer();

        if (!angular.equals({}, this.model)) {
            deferred.resolve(this.model);
        } else {
            this.API.one('user').get().then((res) => {
                if (res.data.status === 'ok') {
                    this.model = res.data.user;
                    this.isLogin = true;
                    // this.handleRedirect();
                    deferred.resolve(res.data.user);
                } else {
                    this.model = {};
                    this.isLogin = false;
                    deferred.reject(res);
                }
            }, (res) => {
                this.model = {};
                this.isLogin = false;
                deferred.reject(res);
            });
        }

        return deferred.promise;
    }

    handleRedirect(){
        if (this.model && this.model.hasOwnProperty('lists') && this.model.lists.length) {
            this.$state.go('profile.dashboard.list', {list: this.model.lists[0].slug});
        } else {
            this.$state.go('profile.dashboard');
        }
    }

}

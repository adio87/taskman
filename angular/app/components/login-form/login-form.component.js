class LoginFormController {
	constructor($auth, $state, toastr, User) {
		'ngInject';

		this.$auth = $auth;
		this.$state = $state;
		this.toastr = toastr;
		this.User = User;
	}

    $onInit(){
        this.email = '';
        this.password = '';
    }

	login() {
		let user = {
			email: this.email,
			password: this.password
		};

		this.$auth.login(user).then((res) => {
			this.$auth.setToken(res.data);
			this.User.set(res.data.data.user);
            this.User.handleRedirect();

			this.toastr.success('Logged in successfully.');
		}).catch(this.failedLogin.bind(this));
	}

	failedLogin(response) {
		if (response.status === 422) {
			for (let error in response.data.errors) {
				return this.toastr.error(response.data.errors[error][0]);
			}
		}
		this.toastr.error(response.statusText);
	}
}

export const LoginFormComponent = {
	templateUrl: './views/app/components/login-form/login-form.component.html',
	controller: LoginFormController,
	controllerAs: 'vm',
	bindings: {}
}

class RegisterFormController {
	constructor($auth, toastr, $state, User) {
		'ngInject';

		this.$auth = $auth;
		this.toastr = toastr;
		this.$state = $state;
		this.User = User;
	}

    $onInit(){
        this.name = '';
        this.email = '';
        this.password = '';
    }

	register() {
		let user = {
			name: this.name,
			email: this.email,
			password: this.password
		};

		this.$auth.signup(user)
			.then((res) => {
				//remove this if you require email verification
				this.$auth.setToken(res.data);
                this.User.set(res.data.data.user);

				this.toastr.success('Successfully registered.');
                this.$state.go('app.landing');
			})
			.catch(this.failedRegistration.bind(this));
	}



	failedRegistration(response) {
    	console.log(response);
		if (response.status === 422) {
			for (let error in response.data) {
				return this.toastr.error(response.data[error][0]);
			}
		}
		this.toastr.error(response.statusText);
	}
}

export const RegisterFormComponent = {
	templateUrl: './views/app/components/register-form/register-form.component.html',
	controller: RegisterFormController,
	controllerAs: 'vm',
	bindings: {}
}

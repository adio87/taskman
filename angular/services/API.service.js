export class APIService {
    constructor(Restangular, $window, toastr) {
        'ngInject';
        //content negotiation
        let headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/x.laravel.v1+json'
        };

        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer
                .setBaseUrl('/api/')
                .setDefaultHeaders(headers)
                .setErrorInterceptor(function(response) {
                    if (response.status === 422 || response.status === 401 || response.status === -1) {
                        if (!response.data.hasOwnProperty('errors')) {
                            for (let error in response.data) {
                                return toastr.error(response.data[error][0]);
                            }
                        } else {
                            for (let error in response.data.errors) {
                                return toastr.error(response.data.errors[error][0]);
                            }
                        }
                    }
                    if (response.status === 500) {
                        return toastr.error(response.statusText)
                    }
                })
                .addFullRequestInterceptor(function(element, operation, what, url, headers) {
                    let token = $window.localStorage.satellizer_token;
                    if (token) {
                        headers.Authorization = 'Bearer ' + token;
                    }
                });
        });
    }
}

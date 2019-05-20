angular.module('app', [
    'app.run',
	'app.filters',
	'app.services',
	'app.components',
	'app.controllers',
    'app.directives',
	'app.routes',
	'app.config',
]);

angular.module('app.run', []);
angular.module('app.routes', []);
angular.module('app.filters', []);
angular.module('app.services', [
	'toastr'
]);
angular.module('app.config', []);
angular.module('app.directives', []);
angular.module('app.components', [
    'ui.router', 'angular-loading-bar', 'restangular', 'pascalprecht.translate', '720kb.datepicker',
    'satellizer', 'pusher-angular', 'dndLists'
]);
angular.module('app.controllers', []);


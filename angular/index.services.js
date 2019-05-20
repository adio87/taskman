import {APIService} from './services/API.service';
import {TimeService} from './services/time.service';
import {UserService} from './services/user.service';
import {SemanticService} from './services/semantic.service';
import {TaskManWatcherService} from './services/taskManWatcher.service';
import {VendorService} from './services/vendor.service';

import {AuthMiddleware} from './services/middleware.service';

angular.module('app.services')
	//Services
	.service('API', APIService)
	.service('Time', TimeService)
	.service('User', UserService)
	.service('SemanticService', SemanticService)
	.service('TMWService', TaskManWatcherService)
	.service('Vendor', VendorService)

	//Middleware
	.service('AuthMiddleware', AuthMiddleware)

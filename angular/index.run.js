import {AppRun} from './run/app.run';
import {RoutesRun} from './run/routes.run';

angular.module('app.run')
    .run(AppRun)
    .run(RoutesRun)

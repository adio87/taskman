import {TranslateConfig} from './config/translate.config';
import {SatellizerConfig} from './config/satellizer.config';
import {RoutesConfig} from './config/routes.config';
import {LoadingBarConfig} from './config/loading_bar.config';

angular.module('app.config')
    .config(TranslateConfig)
    .config(SatellizerConfig)
    .config(RoutesConfig)
    .config(LoadingBarConfig);

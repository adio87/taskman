import {AppShellComponent} from './app/components/app-shell/app-shell.component'
import {AppRootComponent} from './app/components/app-root/app-root.component'
import {ForgotPasswordComponent} from './app/components/forgot-password/forgot-password.component'
import {AppHeaderComponent} from './app/components/app-header/app-header.component'
import {LoginFormComponent} from './app/components/login-form/login-form.component'
import {RegisterFormComponent} from './app/components/register-form/register-form.component'
import {ResetPasswordComponent} from './app/components/reset-password/reset-password.component'
import {SideBarsComponent} from './app/components/side-bars/side-bars.component'
import {ListDetailsComponent} from './app/components/list-details/list-details.component'
import {SearchResultsComponent} from './app/components/search-results/search-results.component'
import {SettingsComponent} from './app/components/settings/settings.component'
import {PomodoreTimerComponent} from './app/components/pomodore-timer/pomodore-timer.component'
import { TagsManagerComponent } from './app/components/common/tags-manager.component';

angular.module('app.components')
    .component('appShell', AppShellComponent)
    .component('appRoot', AppRootComponent)
    .component('forgotPassword', ForgotPasswordComponent)
    .component('appHeader', AppHeaderComponent)
    .component('loginForm', LoginFormComponent)
    .component('registerForm', RegisterFormComponent)
    .component('resetPassword', ResetPasswordComponent)
    .component('sideBars', SideBarsComponent)
    .component('listDetails', ListDetailsComponent)
    .component('searchResults', SearchResultsComponent)
    .component('settings', SettingsComponent)
    .component('pomodoreTimer', PomodoreTimerComponent)
    .component('tagsManager', TagsManagerComponent)

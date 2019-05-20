import {MyEnterDirective} from './directives/myEnter.directive';
import {EmHeightTarget} from './directives/emHeightTarget';
import {ContextMenu} from './directives/contextMenu';
import {NgLongPressDirective} from './directives/ngLongPress';
import {MyDragEventDirective} from './directives/myDragEvent';
import {SlideToggleDirective} from './directives/slideToggle';
import {MyFilesDirective} from './directives/myFiles';
import {CheckPasswordDirective} from './directives/checkPasswordDirective';

angular.module('app.directives')
    .directive('myEnter', MyEnterDirective)
    .directive('emHeightTarget', EmHeightTarget)
    .directive('contextMenu', ContextMenu)
    .directive('ngLongPress', NgLongPressDirective)
    .directive('myDragEvent', MyDragEventDirective)
    .directive('slideToggle', SlideToggleDirective)
    .directive('myFiles', MyFilesDirective)
    .directive('pwCheck', CheckPasswordDirective)

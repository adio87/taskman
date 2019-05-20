export function SlideToggleDirective($rootScope) {
    'ngInject';
    return {
        restrict: 'A',
        link: (scope, element, attrs) => {
            attrs.expanded = false;
            let content = document.getElementsByTagName('pomodore-timer')[0];

            element.bind('click', function() {
                content.style.height = attrs.expanded ? '0' : '208px';
                attrs.expanded = !attrs.expanded;
            });
        }
    }
}
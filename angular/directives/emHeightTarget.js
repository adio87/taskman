export function EmHeightTarget($window) {
    'ngInject';
    return {
        link: ( scope, elem, attrs ) => {
            let win = angular.element($window);
            win.bind(attrs.emHeightEvent, () => {
                let callback = attrs.emHeightCallback.split('.');
                if (typeof scope[callback[0]][callback[1]] ===  'function')
                    scope[callback[0]][callback[1]](elem);
            })
        }
    }
}

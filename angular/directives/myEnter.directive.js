export function MyEnterDirective() {
    return function (scope, element, attrs) {
        element.bind("keyup", function (event) {
            if (event.keyCode === 10||(event.ctrlKey && event.keyCode === 13)) {
                scope.$eval(attrs.myCtrlEnter);
            } else if (event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
}

export function CheckPasswordDirective(Vendor) {
    'ngInject';
    return {
        require: 'ngModel',
        link: (scope, elem, attrs, ctrl) => {
            let $ = Vendor.$;
            let firstPassword = '#' + attrs.pwCheck;
            elem.on('keyup', () => {
                scope.$apply(() => {
                    let v = elem.val() === $(firstPassword).val();
                    ctrl.$setValidity('pwmatch', v);
                });
            });
        }
    }
}

export function MyFilesDirective() {
    return (scope, elem, attrs) => {
        elem.on("change", function (e) {
            scope.$eval(attrs.myFiles + "=$files", {$files: e.target.files});
            scope.$apply();
        });
    }
}
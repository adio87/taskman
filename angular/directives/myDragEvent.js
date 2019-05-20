export function MyDragEventDirective(SemanticService) {
    'ngInject';

    let checkDraggedElement = () => {
        return SemanticService.draggedElement;
    };

    let checkCurrentElement = (item) => {
        return SemanticService.currentList.slug === item.slug;
    };

    return function (scope, element, attrs) {
        element.bind("dragenter", function (evt) {
            // let item = scope.$parent.item;
            if (!checkDraggedElement()) return;

            evt.preventDefault();
            element.addClass('Dragover-task');
        });
        element.bind("dragleave", function (event) {
            element.removeClass('Dragover-task');
        });
        element.bind("drop dragdrop", function (event) {
            let item = scope.list;
            if (!checkDraggedElement() || checkCurrentElement(item)) return;

            element.removeClass('Dragover-task');
            SemanticService.dragOverElement = item;
            scope.$apply(function (){
                scope.$eval(attrs.myDragEvent);
            });

        });
        element.bind("dragover", (evt) => {
            evt.preventDefault();
        });
    };
}

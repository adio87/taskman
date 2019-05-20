export function ContextMenu($q, Vendor) {
    'ngInject';

    let $ = Vendor.$;

    let contextMenus = [];
    let $currentContextMenu = null;
    let defaultItemText = "New Item";

    let removeContextMenus = function (level) {
        /// Remove context menu.
        while (contextMenus.length && (!level || contextMenus.length > level)) {
            contextMenus.pop().remove();
        }
        if (contextMenus.length === 0 && $currentContextMenu) {
            $currentContextMenu.remove();
        }
    };


    let processTextItem = function ($scope, item, text, event, model, $promises, nestedMenu) {
        "use strict";

        let $a = $('<span>');
        $a.css("padding-right", "8px");
        $a.attr({ tabindex: '-1', href: '#' });

        text = item.label;

        let $promise = $q.when(text);
        $promises.push($promise);
        $promise.then(function (text) {
            if (nestedMenu) {
                $a.css("cursor", "default");
                $a.append($('<strong style="font-family:monospace;font-weight:bold;float:right;">&gt;</strong>'));
            }
            if (item.hasOwnProperty('icon') && typeof item.icon === 'string') {
                $a.append($('<i class="' + item.icon + '"></i>'));
            }
            $a.append(text);
        });

        return $a;

    };

    let processItem = function ($scope, event, model, item, $ul, $li, $promises, $q, level) {
        /// <summary>Process individual item</summary>
        "use strict";
        // nestedMenu is either an Array or a Promise that will return that array.
        let nestedMenu = item.hasOwnProperty('submenu') && angular.isArray(item.submenu) ? item.submenu : null;

        // if html property is not defined, fallback to text, otherwise use default text
        // if first item in the item array is a function then invoke .call()
        // if first item is a string, then text should be the string.

        let text = defaultItemText;
        if (item.hasOwnProperty('label') && typeof item.label === 'string') {
            text = processTextItem($scope, item, text, event, model, $promises, nestedMenu, $);
        }
        else if (typeof item.html === 'function') {
            // leave styling open to dev
            text = item.html($scope);
        }
        else if (typeof item.html !== "undefined") {
            // leave styling open to dev
            text = item.html;
        }

        $li.append(text);




        // if item is object, and has enabled prop invoke the prop
        // els if fallback to item[2]

        let isEnabled = function () {
            if (typeof item.enabled !== "undefined") {
                return item.enabled.call($scope, $scope, event, model, text);
            } else if (typeof item[2] === "function") {
                return item[2].call($scope, $scope, event, model, text);
            } else {
                return true;
            }
        };

        registerEnabledEvents($scope, isEnabled(), item, $ul, $li, nestedMenu, model, text, event, level);
    };

    let handlePromises = function ($ul, level, event, $promises) {
        /// Calculate if drop down menu would go out of screen at left or bottom
        /// calculation need to be done after element has been added (and all texts are set; thus the promises)
        /// to the DOM the get the actual height
        "use strict";
        $q.all($promises).then(function () {
            let topCoordinate = event.pageY;
            let menuHeight = angular.element($ul[0]).prop('offsetHeight');
            let winHeight = event && event.view ? event.view.innerHeight : menuHeight + 5;
            if (topCoordinate > menuHeight && winHeight - topCoordinate < menuHeight) {
                topCoordinate = event.pageY - menuHeight;
            } else if(winHeight <= menuHeight) {
                // If it really can't fit, reset the height of the menu to one that will fit
                angular.element($ul[0]).css({"height": winHeight - 5, "overflow-y": "scroll"});
                // ...then set the topCoordinate height to 0 so the menu starts from the top
                topCoordinate = 0;
            } else if(winHeight - topCoordinate < menuHeight) {
                let reduceThreshold = 5;
                if(topCoordinate < reduceThreshold) {
                    reduceThreshold = topCoordinate;
                }
                topCoordinate = winHeight - menuHeight - reduceThreshold;
            }

            let leftCoordinate = event.pageX;
            let menuWidth = angular.element($ul[0]).prop('offsetWidth');
            let winWidth = event && event.view ? event.view.innerWidth : menuWidth + 5;
            let rightPadding = 5;
            if (leftCoordinate > menuWidth && winWidth - leftCoordinate - rightPadding < menuWidth) {
                leftCoordinate = winWidth - menuWidth - rightPadding;
            } else if(winWidth - leftCoordinate < menuWidth) {
                let reduceThreshold = 5;
                if(leftCoordinate < reduceThreshold + rightPadding) {
                    reduceThreshold = leftCoordinate + rightPadding;
                }
                leftCoordinate = winWidth - menuWidth - reduceThreshold - rightPadding;
            }

            $ul.css({
                display: 'block',
                position: 'absolute',
                left: leftCoordinate + 'px',
                top: topCoordinate + 'px'
            });
        });

    };

    let registerEnabledEvents = function ($scope, enabled, item, $ul, $li, nestedMenu, model, text, event, level) {
        /// <summary>If item is enabled, register letious mouse events.</summary>
        if (enabled) {
            let openNestedMenu = function () {
                removeContextMenus(level + 1);
                /*
                 * The object here needs to be constructed and filled with data
                 * on an "as needed" basis. Copying the data from event directly
                 * or cloning the event results in unpredictable behavior.
                 */
                let ev = {
                    pageX: event.pageX + $ul[0].offsetWidth - 1,
                    pageY: $ul[0].offsetTop + $li[0].offsetTop - 3,
                    view: event.view || window
                };

                /*
                 * At this point, nestedMenu can only either be an Array or a promise.
                 * Regardless, passing them to when makes the implementation singular.
                 */
                $q.when(nestedMenu).then(function(promisedNestedMenu) {
                    renderContextMenu($scope, ev, promisedNestedMenu, model, level + 1);
                });
            };

            $li.on('click', function ($event) {
                $event.preventDefault();
                $scope.$apply(function () {
                    if (nestedMenu) {
                        openNestedMenu($event);
                    } else {
                        $(event.currentTarget).removeClass('context');
                        removeContextMenus();

                        if (item.hasOwnProperty('onClick') && angular.isFunction(item.onClick)) {
                            item.onClick.call($scope, $scope, event, model, text)
                        } else {
                            item.click.call($scope, $scope, event, model, text);
                        }
                    }
                });
            });

            $li.on('mouseover', function ($event) {
                $scope.$apply(function () {
                    if (nestedMenu) {
                        openNestedMenu($event);
                    }
                });
            });
        } else {
            $li.on('click', function ($event) {
                $event.preventDefault();
            });
            $li.addClass('disabled');
        }

    };


    let renderContextMenu = function ($scope, event, options, model, level, customClass) {
        /// <summary>Render context menu recursively.</summary>
        if (!level) { level = 0; }
        if (!$) { let $ = angular.element; }
        $(event.currentTarget).addClass('context');
        let $contextMenu = $('<div>');
        if ($currentContextMenu) {
            $contextMenu = $currentContextMenu;
        } else {
            $currentContextMenu = $contextMenu;
            $contextMenu.addClass('dropdown clearfix');
        }
        if (customClass) {
            $contextMenu.addClass(customClass);
        }
        let $div = $('<div>');
        $div.addClass('ui vertical menu');
        $div.css({
            display: 'block',
            position: 'absolute',
            left: event.pageX + 'px',
            top: event.pageY + 'px',
            "z-index": 10000
        });

        let $promises = [];

        angular.forEach(options, function (item) {
            if (item.hasOwnProperty('hidden') && item.hidden)
                return;
            let $a = $('<a>');
            $a.addClass('item');
            if (item === null) {
                $a.addClass('divider');
            } else if (typeof item[0] === "object") {
                custom.initialize($a, item);
            } else {
                processItem($scope, event, model, item, $div, $a, $promises, $q, $, level);
            }
            $div.append($a);
        });
        $contextMenu.append($div);
        let height = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
        $contextMenu.css({
            width: '100%',
            height: height + 'px',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 9999,
            "max-height" : window.innerHeight - 3,
        });
        $(document).find('body').append($contextMenu);

        handlePromises($div, level, event, $promises);

        $contextMenu.on("mousedown", function (e) {
            if ($(e.target).hasClass('dropdown')) {
                $(event.currentTarget).removeClass('context');
                removeContextMenus();
            }
        }).on('contextmenu', function (event) {
            $(event.currentTarget).removeClass('context');
            event.preventDefault();
            removeContextMenus(level);
        });

        $scope.$on("$destroy", function () {
            removeContextMenus();
        });

        contextMenus.push($div);
    };

    function isTouchDevice() {
        return 'ontouchstart' in window        // works on most browsers
            || navigator.maxTouchPoints;       // works on IE10/11 and Surface
    }

    return function ($scope, element, attrs) {
        let openMenuEvent = "contextmenu";
        if(attrs.contextMenuOn && typeof(attrs.contextMenuOn) === "string"){
            openMenuEvent = attrs.contextMenuOn;
        }
        element.on(openMenuEvent, function (event) {
            event.stopPropagation();
            event.preventDefault();

            // Don't show context menu if on touch device and element is draggable
            // if(isTouchDevice() && element.attr('draggable') === 'true') {
            //     return false;
            // }

            let apply = () => {
                let options = $scope.$eval(attrs.contextMenu);
                let customClass = attrs.contextMenuClass;
                let model = $scope.$eval(attrs.model);
                if (options instanceof Array) {
                    if (options.length === 0) { return; }
                    renderContextMenu($scope, event, options, model, undefined, customClass);
                } else {
                    throw '"' + attrs.contextMenu + '" not an array';
                }
            };

            if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                $scope.$apply(() => {
                    apply();
                });
            } else {
                apply();
            }

        });
    };

}

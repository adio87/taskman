export function InArrayFilter($filter) {
    'ngInject';
    return function(list, arrayFilter, element){
        if(arrayFilter){
            return $filter("filter")(list, function(listItem){
                return arrayFilter.indexOf(listItem[element]) !== -1;
            });
        }
    };
}

export function NotInArray($filter) {
    'ngInject';
    return function(list, arrayFilter, element){
        if(arrayFilter){
            return $filter("filter")(list, function(listItem){
                return arrayFilter.indexOf(listItem[element]) === -1;
            });
        }
    };
}

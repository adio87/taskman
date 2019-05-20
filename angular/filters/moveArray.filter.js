export function MoveArrayFilter() {
    return (array, from, to) => {
        while (from < 0) {
            from += array.length;
        }
        while (to < 0) {
            from += array.length;
        }
        if (to >= array.length) {
            let k = to - array.length;
            while ((k--) + 1) {
                array.push(undefined);
            }
        }
        array.splice(to, 0, array.splice(from, 1)[0]);
        return array;
    };
}

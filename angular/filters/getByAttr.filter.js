export function GetByAttrFilter() {
    return (input, attr, name, mode) => {
        let i=0, len=input.length;
        mode = mode !== undefined;
        for (; i<len; i++) {
            if (input[i][attr] == name) {
                return (mode) ? i : input[i];
            }
        }
        return null;
    };
}

class TagsManagerController {

    // private onTagAdd;

    constructor(API, Vendor, SemanticService){
        'ngInject';

        this.api = API;
        this.$ = Vendor.$;
        this.Semantic = SemanticService;
        this.selector = SemanticService.generateSelector('addTagDropdown');
        this.fullSelector = SemanticService.getFullSelector('dropdown', this.selector);

        this.tags = [];
        this.currentTags = [];
    }

    $onInit(){
        this.api.one('tags').get().then((res) => {
            this.tags = res.item;
            this.$(this.fullSelector).dropdown({
                maxSelections: 3
            });
        });
    }

    getTags(id = null){
        let _id = id ? id : '';
        this.api.one('tags/' + _id).get().then((res) => {
            if (_id) {
                this.currentTags = res.item;
            } else {
                this.tags = res.item;
            }
        });
    }

    addTag(){
        const index = this.$(this.fullSelector).dropdown('get value');
        const _tagInd = this.tags.findIndex(i => i.id === parseInt(index, 10));

        if (_tagInd !== -1 && typeof this.onTagAdd === 'function') {
            const tag = this.tags[_tagInd];
            this.currentTags.push(tag);
            this.$(this.fullSelector).dropdown('clear');
            this.onTagAdd({
                tag: tag
            });

        }
    }

    deleteTag(id){
        const _tagIndex = this.currentTags.findIndex(i => i.id === id);
        if (_tagIndex !== -1) {
            this.currentTags.splice(_tagIndex, 1);
        }
    }

    currentTagsArray(){
        let _array = [];
        for (let i in this.currentTags) {
            _array.push(this.currentTags[i].color);
        }
        return _array;
    }
}

export const TagsManagerComponent = {
    templateUrl: './views/app/components/common/tags-manager.component.html',
    controller: TagsManagerController,
    controllerAs: 'vm',
    bindings: {
        onTagAdd: '&',
        currentTags: '='
    }
};


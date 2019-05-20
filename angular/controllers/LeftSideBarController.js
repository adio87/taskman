export class LeftSideBarController{
    constructor(API, toastr, SemanticService, $rootScope, $timeout, $filter, $state, Vendor, $scope){
        'ngInject';

        this.API        = API;
        this.toastr     = toastr;
        this.$rootScope = $rootScope;
        this.$timeout   = $timeout;
        this.$filter    = $filter;
        this.Semantic   = SemanticService;
        this.$state     = $state;
        this.$scope     = $scope;

        this.$ = Vendor.$;

        this.selectors = SemanticService.selectors;

        this.title       = '';
        this.taskTitle   = '';
        this.folderTitle = '';
        this.searchText  = $state.params.query || '';

        this.allowedTypes      = ['list'];

        this.tasks             = [];
        this.includePredefined = false;
        this.leftBarOverflow   = false;

        this.rightClickMenu    = [];
        this.rightClickSubMenu = [];

        this.actions = [];
        this.tags = [];

    }

    $onInit(){

        this.load(() => {
            this.$(this.selectors.foldersAccordion).accordion({
                exclusive: false,
                onChange: () => {
                    this.isOverflow();
                    this.$scope.$apply();
                },
            });
        });

        if(!this.$rootScope.$$listenerCount['list.created']){
            this.$rootScope.$on('list.created', () => {
                this.load();
            });
        }

        this.actions = [
            {
                name: 'Manage Tags',
                icon: 'tags icon',
                link: 'profile.dashboard.settings({tab:"s4"})'
            },
            {
                name: 'Predefined tasks',
                icon: 'checked calendar icon',
                handle: () => {
                    this.openPredefined()
                },
            },
            {
                name: 'Create sub folder',
                icon: 'folder icon',
                handle: () => {
                    this.openSubFolder()
                },
            },
            {
                name: 'Create new list',
                icon: 'plus square outline icon',
                handle: () => {
                    this.open()
                },
            },
            {
                name: 'Settings',
                icon: 'setting icon',
                link: 'profile.dashboard.settings({tab:"s1"})'
            },
        ];

        this.rightClickMenu = [
            {
                label: 'Add Predefined Tasks',
                onClick: ($itemScope) => {
                    if ($itemScope.hasOwnProperty('list'))
                        this.addPredefined($itemScope.list);
                },
                icon: 'plus square outline icon',
            },
            {
                label: 'Rename',
                onClick: ($itemScope) => {
                    let list = $itemScope.hasOwnProperty('list') ? $itemScope.list : $itemScope.$parent.list;
                    this.Semantic.rename = list.title;
                    this.openRename('lists', list);
                },
                icon: 'edit icon',
            },
            {
                label: 'Delete',
                onClick: ($itemScope) => {
                    let list = $itemScope.hasOwnProperty('list') ? $itemScope.list : $itemScope.$parent.list;
                    this.deleteList(list);
                },
                icon: 'trash icon'
            },
            {
                label: 'Move Up',
                onClick: ($itemScope) => {
                    this.mobileOrder($itemScope.list, 'up');
                },
                icon: 'angle double up icon',
                hidden: !this.Semantic.isMobile()
            },
            {
                label: 'Move Down',
                onClick: ($itemScope) => {
                    this.mobileOrder($itemScope.list, 'down');
                },
                icon: 'angle double down icon',
                hidden: !this.Semantic.isMobile()
            }
        ];

        this.rightClickSubMenu = [
            {
                label: 'Rename',
                onClick: ($itemScope) => {
                    let item = $itemScope.hasOwnProperty('item') ? $itemScope.item : {};
                    this.Semantic.rename = item.title;
                    this.openRename('subfolders', item);
                },
                icon: 'edit icon',
            },
            {
                label: 'Delete',
                onClick: ($itemScope) => {
                    let item = $itemScope.hasOwnProperty('item') ? $itemScope.item : {};
                    this.deleteSub(item);
                },
                icon: 'trash icon'
            }
        ];
    }

    load(callback){
        this.API.one('lists').get().then((res) => {
            this.$(this.selectors.searchDropdown).dropdown();
            this.Semantic.set('lists', res.item.lists);
            this.Semantic.set('subFolders', res.item.sublists);

            this.$rootScope.$emit('lists:load');

            if (res.item.shared.length){
                let ls = [];
                for(let i in res.item.shared){
                    ls.push(res.item.shared[i].lists);
                }
                this.Semantic.set('sharedLists', ls);
            }

            if (callback !== undefined) callback();
        }, () => {});
    }

    loadPredefined(){
        this.API.one('predefined').get().then((res) => {
            this.tasks = res.item;
        }, () => {});
    }

    create(){
        if (this.title === '') return;
        let folderId = this.$(this.selectors.folderDropdown).dropdown('get value');
        this.API.all('lists').post({
            title: this.title,
            include: this.includePredefined,
            folder_id: folderId,
            tags: this.tags
        }).then((res) => {
            this.toastr.success(res.message);
            this.title = '';
            this.load();
        });
    }

    createPredefined(){
        if (this.taskTitle === '') return;
        this.API.all('predefined').post({title: this.taskTitle}).then((res) => {
            this.toastr.success(res.message);
            this.taskTitle = '';
            this.includePredefined = false;
            this.loadPredefined();
        });
    }

    createSubFolder(){
        if (this.folderTitle === '') return;
        this.API.all('subfolders').post({title: this.folderTitle}).then((res) => {
            this.toastr.success(res.message);
            this.folderTitle = '';
            this.load();
        });
    }

    deleteList(item){
        this.API.one('lists/' + item.id).remove().then((res) => {
            this.toastr.success(res.message);
            this.load();
            this.$state.go('profile.dashboard');
        });
    }

    deleteSub(item){
        this.API.one('subfolders/' + item.id).remove().then((res) => {
            this.toastr.success(res.message);
            this.load();
            this.$state.go('profile.dashboard');
        });
    }

    deletePredefined(item){
        this.API.one('predefined/' + item.id).remove().then((res) => {
            this.toastr.success(res.message);
            this.loadPredefined();
        }, () => {});
    }

    addPredefined(item){
        if (item.predefined.length) {
            this.toastr.error('This list has already got predefined tasks.');
            return;
        }
        this.API.one('lists/' + item.id).put({include: true}).then((res) => {
            this.toastr.success(res.message);
            this.load();
            this.$rootScope.$emit('list:refresh');
        }, () => {});
    }

    open(){
        let self = this;
        this.$(this.selectors.createListModal)
            .modal({
                transition: 'vertical flip',
                onDeny    : () => {

                },
                onApprove : () => {
                    self.create();
                }
            })
            .modal('show');
    }

    openPredefined(){
        this.loadPredefined();
        let self = this;
        this.$(this.selectors.createPredefinedListModal)
            .modal({
                transition: 'vertical flip',
                onDeny    : () => {

                },
                onApprove : () => {
                    self.createPredefined();
                    return false;
                }
            })
            .modal('show');
    }

    openSubFolder(){
        let self = this;
        this.$(this.selectors.createSubfolderModal)
            .modal({
                transition: 'vertical flip',
                onDeny    : () => {

                },
                onApprove : () => {
                    self.createSubFolder();
                }
            })
            .modal('show');
    }

    openRename(url, item){
        let self = this;
        this.$(this.selectors.renameModal)
            .modal({
                transition: 'vertical flip',
                onDeny    : () => {

                },
                onApprove : () => {
                    item.title = self.Semantic.rename;
                    self.update(url, item);
                }
            })
            .modal('show');
    }

    update(url, item){
        this.API.one(url + '/' + item.id).put({title: this.Semantic.rename}).then(() => {

        }, () => {});
    }

    mobileOrder(item, direction){
        let l = this.Semantic.get('lists');
        let index = this.$filter('getByAttr')(l, 'id', item.id, true);
        let step = direction === 'up' ? 1 : direction === 'down' ? -1 : null;
        if ((step > 0 && index === 0) || (step < 0 && index === l.length - 1))
            return;
        this.$filter('moveArray')(l, index, index - step);
        this.order();
    }

    order(){
        let data = {list: this.Semantic.lists, folders: this.Semantic.subFolders};
        this.API.all('lists/order').post(data).then(() => {
        }, () => {});
    }

    isOverflow(elem){
        if (elem === undefined) {
            let result = document.getElementsByClassName(this.selectors.leftBar.replace(/\./g,' '));
            elem = angular.element(result);
        }
         if (elem[0] && elem[0].hasChildNodes()) {
            let h = 0;

            for (let i in elem[0].children) {
                if (elem[0].children[i] && elem[0].children[i].clientHeight && i < 6) {
                    h += elem[0].children[i].clientHeight;
                }
            }

            this.leftBarOverflow = elem[0].clientHeight < h;
         }
    }

    search(){
        let by = this.$('#bySearch').text();
        this.$state.go('profile.dashboard.search', {query: this.searchText, by: by})
    }

    toResults(){
        this.$state.go('profile.dashboard.search', {query: this.searchText, cache: true})
    }

    replaceTask(list){
        let task = this.Semantic.draggedElement;
        this.API.one('tasks/' + task.slug).put({list_id: list.id}).then(() => {
            let index = this.$filter('getByAttr')(this.Semantic.currentList.tasks, 'id', task.id, true);
            this.Semantic.currentList.tasks.splice(index, 1);
            this.Semantic.increaseListIncomplete(list);
            this.Semantic.decreaseListIncomplete(this.Semantic.get('currentList'));
        });
    }

    triggerClick(selector){
        this.$(selector).click();
    }

    tagAdded(tags) {

    }

}

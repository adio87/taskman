class SettingsController {
    constructor(API, $state, $stateParams, SemanticService, $rootScope, Vendor, toastr, $window, $scope, Restangular) {
        'ngInject';

        this.API          = API;
        this.$state       = $state;
        this.$stateParams = $stateParams;
        this.selectors    = SemanticService.selectors;
        this.$rootScope   = $rootScope;
        this.Semantic     = SemanticService;
        this.toastr       = toastr;
        this.$window      = $window;
        this.$scope       = $scope;
        this.Restangular  = Restangular;

        this.files        = [];
        this.tag          = {};
        this.tags         = [];

        this.$            = Vendor.$;

    }

    $onInit(){
        this.Semantic.set('currentList', null);

        this.$(this.selectors.settingsTabs + ' .menu .item').tab({
            onVisible: (tab) => {
                this.$state.go('profile.dashboard.settings', {tab: tab});

                if (tab === 's4') {
                    this.getTags();
                }
            },
            context: this.selectors.settingsTabs
        });

        this.$(this.selectors.exportDropdown).dropdown();
        this.$(this.selectors.colorDropdown).dropdown();

        this.$rootScope.$on('lists:load', () => {
            this.getSubfolderLists();
        });

        if (this.$stateParams.tab) {
            $(this.selectors.settingsTabs + ' .menu .item').tab('change tab', this.$stateParams.tab);
        }
    }

    exportAction(){
        let id = this.$(this.selectors.exportDropdown).dropdown('get value');
        if (id === '') return;
        this.API.one('export/' + id).get().then((res) => {
            if (res.item !== '') this.download(res.item, 'export.json');
        }, (res) => {
            this.toastr.error(res.message);
        });
    }

    getTags(){
        this.API.one('tags').get().then((res) => {
            this.tags = res.item;
        });
    }

    createTag(){
        let color = this.$(this.selectors.colorDropdown).dropdown('get value');
        this.tag.color = color;
        if (color && this.tag.title) {
            this.API.all('tags').post(this.tag).then((res) => {
                this.getTags();
                this.toastr.success(res.message);
            });
        }
    }

    deleteTag(id){
        this.API.one('tags/' + id).remove().then((res) => {
            this.getTags();
            this.toastr.success(res.message);
        });
    }

    download(data, filename){
        if (!data) {
            this.toastr.error('No data');
            return;
        }

        if (!filename) {
            filename = 'download.json';
        }

        if (typeof data === 'object') {
            data = JSON.stringify(data, undefined, 2);
        }

        let blob = new Blob([data], {type: 'text/json'});

        // FOR IE:

        if (this.$window.navigator && this.$window.navigator.msSaveOrOpenBlob) {
            this.$window.navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            let e = document.createEvent('MouseEvents'),
                a = document.createElement('a');

            a.download = filename;
            a.href = this.$window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
            e.initEvent('click', true, false, this.$window,
                0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        }
    }

    getSubfolderLists(){
        let lists = [];

        if (!this.Semantic.subFolders.length) return;

        for (let s in this.Semantic.subFolders) {
            let obj = this.Semantic.subFolders[s];
            for (let l in obj.lists) {
                lists.push(obj.lists[l]);
            }
        }

        return lists;
    }

    uploadFile(){
        if (this.$scope.files === undefined) {
            this.toastr.error('Bitte wählen Sie zuerst das gewünschte Bild aus');
            return;
        }

        let fd = new FormData();

        fd.append("file", this.$scope.files[0]);

        this.Restangular.one('api/import').withHttpConfig({
            transformRequest: angular.identity
        }).customPOST(fd, '', undefined, {
            'Content-Type': undefined,
        }).then((res) => {
            this.$rootScope.$emit('list.created');
        }, (res) => {
            this.toastr.error(res.data.message);
        });
    }

    onChangePw() {
        if (!this.$scope.passwordChangeForm.$valid) {
            return;
        }

        this.API.all('auth/password/reset-from-dashboard').post({
            old: this.$scope.old,
            password: this.$scope.password,
            password_confirmation: this.$scope.password_confirmation,
        }).then((res) => {
            this.toastr.success(res.message);
        }, () => {});

    }

}

export const SettingsComponent = {
    templateUrl: './views/app/components/settings/settings.component.html',
    controller: SettingsController,
    controllerAs: 'vm',
    bindings: {}
}

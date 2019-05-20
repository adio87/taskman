class SideBarsController {
	constructor($http, $compile, $scope, $rootScope, $controller, $state, User, SemanticService, Vendor, API, $filter, toastr) {
		'ngInject';

		this.$http = $http;
		this.$compile = $compile;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$controller = $controller;
		this.$state = $state;
		this.User = User;
		this.API = API;
		this.$filter = $filter;
		this.toastr = toastr;

        this.$ = Vendor.$;

		this.SemanticService = SemanticService;

		this.selectors = SemanticService.selectors;

		this.statuses = ['red', 'yellow', 'green'];
		this.orderByFilters = [
            {
                name: 'Order',
                value: null
            },
            {
                name: 'Estimated time',
                value: 'estimated_time'
            },
        ];

	}

    $onInit(){

		let self = this;

		this.$http.get(`./views/app/sidebars/left.sidebar.html`).then((res) => {

			this.bindController({
				controller: 'LeftSideBarController',
				template: res.data
			});

            let ls = this.$(this.selectors.leftBar);

            if (this.SemanticService.isMobile()) {
                ls.sidebar();
                self.$rootScope.leftBar = false;
			} else {
                ls.sidebar({
                    allowMultiple: true,
                    dimPage: false,
                    closable: false,
                    onVisible: () => {
                        self.$rootScope.leftBar = true;
                    },
                    onHide: () => {
                        self.$rootScope.leftBar = false;
                    }
                });
                ls.sidebar('toggle');
                self.$rootScope.leftBar = true;
			}

            this.$(this.selectors.folderDropdown).dropdown();
		});

        this.$http.get(`./views/app/sidebars/right.sidebar.html`).then((res) => {

            this.bindController({
                controller: 'RightSideBarController',
                template: res.data
            });

            this.$(this.selectors.rightBar)
                .sidebar({
                    allowMultiple: true,
					transition: 'overlay',
                    onVisible: () => {
                    	self.$rootScope.rightBar = true;
					},
                    onHide: () => {
                        self.$rootScope.rightBar = false;
                        self.$rootScope.$apply();
                    },
                    onHidden: () => {
                    	if (!self.$state.params.previousState) return;
                    	let prevParams = self.$state.params.previousState.Params;
                    	self.$state.go('profile.dashboard.list', {list: prevParams.list});
					}
				});
            this.$(this.selectors.taskDueDate).calendar({
				ampm: false,
			});

            this.isTask();

        });

        $('.ui.search')
            .search({
                minCharacters : 2,
                apiSettings: {
                    url: '/api/search/users?q={query}'
                },
                fields: {
                    results : 'item',
                    title   : 'email',
                },
                onSelect: (result) => {
                    let list = self.SemanticService.get('currentList');
                    self.API.one('user/invite').get({list_id: list.id, user_id: result.id}).then((res) => {
                        list.members.push(res.item);
                        self.SemanticService.share = '';
                    }, () => {

                    });
                },
            });

    }

	bindController(object = {}){
		//this creates a new scope
		let $scope = this.$rootScope.$new();
		//Controller initialize with $scope
		this.$controller(object.controller, {$scope});
		let templateEl = angular.element(object.template);
		//Now compile the template with scope $scope
		this.$compile(templateEl)($scope);
		angular.element(document.body).prepend(templateEl);
	}

	toggle(){
        this.$(this.selectors.leftBar)
            .sidebar('toggle');
	}

	isTask(){
        if (this.$state.current.name === 'profile.dashboard.list.task') {
            this.$rootScope.$emit('task:load', this.$state.params.task);
            this.$(this.selectors.rightBar).sidebar('toggle');
            this.$rootScope.rightBar = true;
        }
	}

	logout(){
		this.User.logout();
	}

	share(){
        this.$(this.selectors.shareModal)
            .modal({
                transition: 'vertical flip',
                onDeny    : () => {

                },
                onApprove : () => {

                }
            })
            .modal('show');
	}

	deleteMember(id){
        this.API.one('user/invite/' + id).remove().then(() => {
            let list = this.SemanticService.get('currentList');
            let index = this.$filter('getByAttr')(list.members, 'id', id, true);
            list.members.splice(index, 1);
        }, () => {

        });
    }

    removePredefined(){
        let list = this.SemanticService.get('currentList');
	    this.API.one('predefined/list/' + list.id).remove().then((res) => {
	        this.toastr.success(res.message);
	        this.$rootScope.$emit('list:refresh');
        }, () => {

        });
    }

    changeOrder(item){
        this.SemanticService.orderBy = item;
    }


}

export const SideBarsComponent = {
	templateUrl: './views/app/components/side-bars/side-bars.component.html',
	controller: SideBarsController,
	controllerAs: 'vm',
	bindings: {}
}

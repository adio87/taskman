class SearchResultsController {
	constructor(API, $state, SemanticService, $rootScope) {
		'ngInject';

		this.API = API;
		this.$state = $state;
		this.selectors = SemanticService.selectors;
		this.$rootScope = $rootScope;
		this.Semantic = SemanticService;

	}

    $onInit(){
		this.Semantic.set('currentList', null);
		this.load();
    }

    load(){
    	if (this.$state.params.cache) return;

    	this.$rootScope.loadingSearch = true;
		this.API.one('search/' + this.$state.params.query).get({by: this.$state.params.by}).then((res) => {
			this.Semantic.set('searchResults', res.item);
            this.$rootScope.loadingSearch = false;
		}, () => {
            this.$rootScope.loadingSearch = false;
		});
	}

	go(task){
        this.$state.go('profile.dashboard.list.task', {list: task.list_slug, task: task.slug});
        this.show(task);
	}

    show(task){
        this.$rootScope.$emit('task:load', task);
        $(this.selectors.rightBar)
            .sidebar('setting', 'transition', 'overlay')
            .sidebar('toggle');
    }

}

export const SearchResultsComponent = {
	templateUrl: './views/app/components/search-results/search-results.component.html',
	controller: SearchResultsController,
	controllerAs: 'vm',
	bindings: {}
};

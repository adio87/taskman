class ListDetailsController {
	constructor(API, toastr, $state, $rootScope, Time, SemanticService, $filter, Vendor) {
		'ngInject';

		this.API = API;
		this.toastr = toastr;
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.Time = Time;
        this.Semantic = SemanticService;
        this.$filter = $filter;

        this.$ = Vendor.$;

        this.selectors = SemanticService.selectors;


        this.allowedTypes = ['task'];
        this.listDetails  = {};
		this.title        = '';
		this.rename       = '';
		this.tasks        = [];

		this.rightClickTasksMenu = [];
	}

    $onInit(){
		this.getListDetails(() => {
            this.$(this.selectors.completedTasksAccordion).accordion();
        });

        if(!this.$rootScope.$$listenerCount['list:refresh']){
            this.$rootScope.$on('list:refresh', () => {
                this.getListDetails();
            });
        }

        if(!this.$rootScope.$$listenerCount['task.created']){
            this.$rootScope.$on('task.created', (ev, obj) => {
                this.handleTaskEvent(obj);
            });
        }

        if(!this.$rootScope.$$listenerCount['task.deleted']){
            this.$rootScope.$on('task.deleted', (ev, obj) => {
                this.handleTaskEvent(obj);
            });
        }

        if(!this.$rootScope.$$listenerCount['task.checked']){
            this.$rootScope.$on('task.checked', (ev, obj) => {
                this.handleTaskEvent(obj);
            });
        }

        this.rightClickTasksMenu = [
            {
                label: 'Rename',
                onClick: ($itemScope) => {
                    let item = $itemScope.hasOwnProperty('task') ? $itemScope.task : {};
                    this.Semantic.rename = item.title;
                    this.openRename('tasks', item);
                },
                icon: 'edit icon',
            },
            {
                label: 'Set High Priority',
                icon: 'exclamation icon',
                onClick: ($itemScope) => {
                    let data = {
                        high_priority: !$itemScope.task.high_priority
                    };
                    this.update('tasks', $itemScope.task, data);
                }
            },
            {
                label: 'Delete',
                onClick: ($itemScope) => {
                    let item = $itemScope.hasOwnProperty('task') ? $itemScope.task : {};
                    this.deleteTask(item);
                },
                icon: 'trash icon'
            },
            {
                label: 'Move Up',
                onClick: ($itemScope) => {
                    this.mobileOrder($itemScope.task, 'up');
                },
                icon: 'angle double up icon',
                hidden: !this.Semantic.isMobile()
            },
            {
                label: 'Move Down',
                onClick: ($itemScope) => {
                    this.mobileOrder($itemScope.task, 'down');
                },
                icon: 'angle double down icon',
                hidden: !this.Semantic.isMobile()
            }
        ];
    }

    handleTaskEvent(obj){
        if (this.Semantic.get('currentList').id === obj.list.id) {
            this.getListDetails((item) => {
                this.Semantic.updateList(item);
            });
        } else {
            this.Semantic.updateList(obj.list);
        }
    }

    getListDetails(callback){
    	let slug = this.$state.params.list;
        this.API.one('lists/' + slug).get().then((res) => {
            this.Semantic.set('currentList', res.item);
			this.listDetails = res.item;
			this.tasks = this.listDetails.tasks;

			if (callback !== undefined) callback(res.item);

        }, () => {

        });
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
                    self.update(url, item, {title: this.Semantic.rename});
                }
            })
            .modal('show');
	}

	create(key = ''){

	    let data = {
            list_id: this.listDetails.id,
            title: this.title
        };

	    if (key === 'first') {
	        data.first = true;
        }

    	this.API.all('tasks')
            .post(data)
            .then((res) => {
    		this.toastr.success(res.message);
            // this.getListDetails((item) => {
            //     this.Semantic.increaseListIncomplete(item, true);
            // });
    		this.title = '';
		}, (res) => {
    		this.toastr.error(res.data.message);
		});
	}

    mobileOrder(item, direction){
        let currentList = this.Semantic.get('currentList');
        let index = this.$filter('getByAttr')(currentList.tasks, 'id', item.id, true);
        let step = direction === 'up' ? 1 : direction === 'down' ? -1 : null;
        if ((step > 0 && index === 0) || (step < 0 && index === currentList.tasks.length - 1))
            return;
        this.$filter('moveArray')(currentList.tasks, index, index - step);
        this.order();
    }

    spliceDraggedTask(){
        let currentList = this.Semantic.get('currentList');
        let index = this.$filter('getByAttr')(currentList.tasks, '$$hashKey', this.Semantic.draggedElement.$$hashKey, true);
        currentList.tasks.splice(index, 1)
    }

	order(evt){
        this.Semantic.draggedElement = null;
        this.API.all('tasks/order').post({list: this.Semantic.currentList.tasks}).then(() => {
        }, () => {});
	}

	check(task){
		this.API.all('tasks/check/' + task.slug).post().then(() => {
			// this.getListDetails();
			// this.$rootScope.$emit('list.created');
		}, () => {});
	}

	toggle(task){
		this.$state.go('profile.dashboard.list.task', {list: this.listDetails.slug, task: task.slug});
		this.Semantic.set('currentTask', task);
		this.$rootScope.$emit('task:load', task);
		$('.ui.sidebar.right')
            .sidebar('setting', 'transition', 'overlay')
			.sidebar('toggle');
	}

	isDue(task){
		if (!task.due_date) return false;
		let d0 = this.Time.convertUTCDateToLocalDate(task.due_date);
		let d1 = new Date();
		return this.Time.compare(d0, d1) <= 0;
	}

    update(url, item, data){
        this.API.one(`${url}/${item.slug}`).put(data).then((res) => {
            this.$rootScope.$emit('list:refresh');
        }, () => {});
    }

	deleteTask(task){
        this.API.one('tasks/' + task.id).remove().then((res) => {
            this.toastr.success(res.message);
            // this.getListDetails((item) => {
            //     this.Semantic.decreaseListIncomplete(item, true);
            // });
        });
	}

    setDraggedTask(t){
	    this.Semantic.draggedElement = t;
    }

}

export const ListDetailsComponent = {
	templateUrl: './views/app/components/list-details/list-details.component.html',
	controller: ListDetailsController,
	controllerAs: 'vm',
	bindings: {}
}

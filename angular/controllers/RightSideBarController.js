export class RightSideBarController{
    constructor($state, $rootScope, API, SemanticService, Time, Vendor){
        'ngInject';

        this.$state = $state;
        this.$rootScope = $rootScope;
        this.API = API;
        this.Time = Time;
        this.Semantic = SemanticService;

        this.$ = Vendor.$;

        this.selectors = SemanticService.selectors;

        this.selectorDropdown = SemanticService.generateSelector('addTagDropdown');
        this.fullSelectorDropdown = SemanticService.getFullSelector('dropdown', this.selectorDropdown);

        this.tags = [];
        this.currentTags = [];

    }

    $onInit(){
        if(!this.$rootScope.$$listenerCount['task:load']){
            this.$rootScope.$on('task:load', (ev, task) => {
                this.load(task);
            });
        }

        this.API.one('tags').get().then((res) => {
            this.tags = res.item;
            this.$(this.fullSelectorDropdown).dropdown({
                maxSelections: 3
            });
        });
    }

    load(task = null){
        this.getTags();
        if (typeof task === 'object') {
            this.Semantic.set('currentTask', task);
            this.setCalendarDate(task.due_date);
            this.getTags(task.id);
            return;
        }
        this.getTags(task);
        this.API.one('tasks/' + task).get().then((res) => {
            this.Semantic.set('currentTask', res.item);
            this.setCalendarDate(res.item.due_date);
        }, () => {});
    }

    addTag(){
        let tag = this.$(this.fullSelectorDropdown).dropdown('get value');
        if (tag) {
            this.API.all('tags/task').post({
                tag_id: tag,
                task_id: this.Semantic.currentTask.id
            }).then((res) => {
                this.getTags(this.Semantic.currentTask.id);
                this.$(this.fullSelectorDropdown).dropdown('clear');
            });
        }
    }

    getTags(id = null){
        let _id = id ? id : '';
        this.API.one('tags/' + _id).get().then((res) => {
            if (_id) {
                this.currentTags = res.item;
            } else {
                this.tags = res.item;
            }
        });
    }

    deleteTag(id){
        this.API.one('tags/task/' + id).remove().then((res) => {
            this.getTags(this.Semantic.currentTask.id);
        });
    }

    currentTagsArray(){
        let _array = [];
        for (let i in this.currentTags) {
            _array.push(this.currentTags[i].tag.color);
        }
        return _array;
    }

    save(){
        let task = this.Semantic.get('currentTask');
        let date = this.$(this.selectors.taskDueDate).calendar('get date');
        task.due_date = (date) ? date.toISOString().slice(0, 19).replace('T', ' ') : null;
        this.API.one('tasks/' + task.slug).put(task).then(() => {

        }, () => {

        });
    }

    check(){
        this.$rootScope.$emit('task:check', this.Semantic.get('currentTask'), (res) => {
            if (this.$state.current.name === 'profile.dashboard.list.task') {
                this.$rootScope.$emit('list:refresh');
                this.$rootScope.$emit('list.created');
            }
            if (this.$state.current.name === 'profile.dashboard.search')
                this.Semantic.updateSearchResults(res.item);
        });
    }

    setCalendarDate(due_date){
        if (!due_date) {
            this.$(this.selectors.taskDueDate).calendar('clear');
            return;
        }
        let d = this.Time.convertUTCDateToLocalDate(due_date);
        this.$(this.selectors.taskDueDate).calendar('set date', d.toLocaleString());
    }


}

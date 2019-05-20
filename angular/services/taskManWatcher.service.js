export class TaskManWatcherService {
    constructor(API, toastr, $pusher, $interval, $rootScope, $window) {
        'ngInject';

        this.API = API;
        this.toastr = toastr;
        this.$interval = $interval;
        this.$rootScope = $rootScope;
        this.$window = $window;

        this.isRun = false;

        this.options = {
            chanel: 'private-taskman-chanel.'
        };

        let token = $window.localStorage.satellizer_token;

        let client = new Pusher(Taskman.config.pusherKey, {
            cluster: 'eu',
            encrypted: true,
            authEndpoint: 'api/pusher/auth',
            auth: {
                headers: { 'Authorization': 'Bearer ' + token }
            }
        });
        this.$pusher = $pusher(client);
        this.privateChanel = {};
        this.sharedChanel  = [];

    }

    start(user){
        if (this.isRun) return;

        this.privateChanel = this.$pusher.subscribe(this.options.chanel + user.id);

        for(let i in user.lists){
            if(user.lists[i].members.length){
                for(let j in user.lists[i].members){
                    let member = user.lists[i].members[j];
                    if (member.status.id === 3) this.sharedChanel.push(this.$pusher.subscribe(this.options.chanel + member.user.id + '.' + member.list_id));
                }
            }
        }

        for(let i in user.shared){
            if(user.shared[i].status_id === 3){
                this.sharedChanel.push(this.$pusher.subscribe(this.options.chanel + user.shared[i].lists.user_id + '.' + user.shared[i].list_id));
            }
        }

        for(let i in this.sharedChanel){
            // Handle Task Creation Event
            this.sharedChanel[i].bind('task.created', (obj) => {
                this.$rootScope.$emit('task.created', obj);
            });

            // Handle Task Delete Event
            this.sharedChanel[i].bind('task.deleted', (obj) => {
                this.$rootScope.$emit('task.deleted', obj);
            });

            // Handle Task Delete Event
            this.sharedChanel[i].bind('task.checked', (obj) => {
                this.$rootScope.$emit('task.checked', obj);
            });
        }

        // Handle List Creation Event
        this.privateChanel.bind('list.created', (obj) => {
            this.$rootScope.$emit('list.created');
        });

        // Handle Task Creation Event
        this.privateChanel.bind('task.created', (obj) => {
            this.$rootScope.$emit('task.created', obj);
        });

        // Handle Task Delete Event
        this.privateChanel.bind('task.deleted', (obj) => {
            this.$rootScope.$emit('task.deleted', obj);
        });

        // Handle Task Delete Event
        this.privateChanel.bind('task.checked', (obj) => {
            this.$rootScope.$emit('task.checked', obj);
        });

        this.isRun = true;
    }

    stop(){
        if (!this.isRun) return;

        if (this.privateChanel.unbind !== undefined && typeof this.privateChanel.unbind === "function") this.privateChanel.unbind();

        for(let i in this.sharedChanel){
            if (this.sharedChanel[i].unbind !== undefined && typeof this.sharedChanel[i].unbind === "function") this.sharedChanel[i].unbind();
        }

        this.isRun = false;
    }

}

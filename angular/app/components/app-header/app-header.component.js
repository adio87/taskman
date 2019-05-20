class AppHeaderController{
    constructor($sce, User, Vendor){
        'ngInject';

        this.$sce = $sce;
        this.User = User;

        this.$ = Vendor.$;

    }

    $onInit(){
        let self = this;
        this.$('.masthead')
            .visibility({
                once: false,
                onBottomPassed: function() {
                    self.$('.fixed.menu').transition('fade in');
                },
                onBottomPassedReverse: function() {
                    self.$('.fixed.menu').transition('fade out');
                }
            });
    }

    logout(){
        this.User.logout();
    }
}

export const AppHeaderComponent = {
    templateUrl: './views/app/components/app-header/app-header.component.html',
    controller: AppHeaderController,
    controllerAs: 'vm',
    bindings: {}
}

export function AppRun(User) {
    'ngInject';

    User.get().then(() => {}, () => {});

}
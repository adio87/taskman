export function TranslateConfig($translateProvider, $windowProvider) {
    'ngInject';

    let $window = $windowProvider.$get();
    let lang = $window.localStorage.lang || 'de';

    $translateProvider
        .useStaticFilesLoader({
            prefix: '/translations/',
            suffix: '.json'
        })
        .preferredLanguage(lang)
        .useSanitizeValueStrategy('escapeParameters');

}

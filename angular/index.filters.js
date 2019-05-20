import {CapitalizeFilter} from './filters/capitalize.filter';
import {HumanReadableFilter} from './filters/human_readable.filter';
import {TruncatCharactersFilter} from './filters/truncate_characters.filter';
import {TruncateWordsFilter} from './filters/truncate_words.filter';
import {TrustHtmlFilter} from './filters/trust_html.filter';
import {UcFirstFilter} from './filters/ucfirst.filter';
import {GetByAttrFilter} from './filters/getByAttr.filter';
import {MoveArrayFilter} from './filters/moveArray.filter';
import {InArrayFilter, NotInArray} from "./filters/inArray.filter";

angular.module('app.filters')
	.filter('capitalize', CapitalizeFilter)
	.filter('humanReadable', HumanReadableFilter)
	.filter('truncateCharacters', TruncatCharactersFilter)
	.filter('truncateWords', TruncateWordsFilter)
	.filter('trustHtml', TrustHtmlFilter)
	.filter('ucFirst', UcFirstFilter)
	.filter('getByAttr', GetByAttrFilter)
	.filter('moveArray', MoveArrayFilter)
	.filter('inArray', InArrayFilter)
	.filter('notInArray', NotInArray)

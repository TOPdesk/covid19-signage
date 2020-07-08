import PageHeader from "./pageheader.js";
import PageRule from "./pagerule.js";
import PageFooter from "./pagefooter.js";

const nextId = (function () {
	let counter = 0;
	return () => "svg-content-" + counter++;
})();

/*
* Source for the numbers in the color matrix:
* http://davengrace.com/dave/cspace/
*/
const redFilter = .21586; // #800000
const greenFilter = .21586; // #008000

export default {
	props: {
		rules: {type: Object, required: true},
		languages: {type: Array, required: true},
		ruleStyle: {type: Object, default: { ruleBackground: "light" }},
	},
	components: {
		PageHeader,
		PageRule,
		PageFooter,
	},
	data: () => ({
		id: null,
	}),
	created() {
		this.id = nextId();
	},
	methods: {
	},
	template: `
	<svg
			viewBox="0 0 200 287"
			xmlns="http://www.w3.org/2000/svg">
		<defs>
			<template v-if="ruleStyle['ruleBackground'] === 'fill'">
				<filter :id="id + '-color-filter-do'">
					<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
				</filter>
				<filter :id="id + '-color-filter-dont'">
					<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
				</filter>
			</template>
			<template v-else>
				<filter :id="id + '-color-filter-do'">
					<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 ${greenFilter} 0 0 0 0 0 0 0 0 1 0" />
				</filter>
				<filter :id="id + '-color-filter-dont'">
					<feColorMatrix type="matrix" values="0 0 0 0 ${redFilter} 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
				</filter>
			</template>
		</defs>
		<page-header :languages="languages" />
		<page-rule v-for="(rule, index) in rules"
			:rule="rule"
			:languages="languages"
			:ruleStyle="ruleStyle"
			:idPrefix="id"
			:transform="'translate(0 ' + (16 + index * 65) + ')'" 
		/>
		<page-footer 
			:transform="'translate(0 ' + (16 + 4 * 65) + ')'" 
		/>
	</svg>
	`,
};

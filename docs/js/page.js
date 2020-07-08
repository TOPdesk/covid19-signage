import PageContent from "./pagecontent.js";

export default {
	props: {
		languages: {type: Array, required: true},
		rules: {type: Array, require: true},
		selectedStyle: {type: Object, require: true },
		label: {type: String, default: () => null},
	},
	components: {
		PageContent
	},
	template: `
		<div class="page">
			<div v-if="label !== null" class="page-number noprint">{{ label }}</div>
			<page-content
				:languages="languages"
				:rules="rules"
				:ruleStyle="selectedStyle"
				 class="page-content"
			/>
			<div class="page-break">&nbsp;</div>
		</div>`,
};
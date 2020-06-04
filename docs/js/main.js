import languages from "./languages.js";
import rules from "../rules/index.js";

const content = {
	template: `
	<div class="outer-container">
		<div>
			<h1 class="title">COVID-19 Signage Generator</h1>
			<div>
				<h2 class="subtitle">Step 1: Select languages to include</h2>
				<div v-for="language in languages">
					<img :src="'img/flags/' + language.key + '.svg'" width="50px"/>
					<button v-if="selectedLanguageKeys.includes(language.key)" @click="removeLanguage(language.key)" class="button is-success">
						Remove
					</button>
					<button v-else @click="addLanguage(language.key)" class="button is-outlined">
						Add
					</button>
				</div>
			</div>
			<div>
				<h2 class="subtitle">Step 2: Select rules to include</h2>
				<div v-for="rule in rules">
					<button v-if="selectedRuleNames.includes(rule.name)" @click="removeRule(rule.name)" class="button is-success">
						Remove rule: {{rule.lang["en"]}}
					</button>
					<button v-else @click="addRule(rule.name)" class="button is-outlined">
						Add rule: {{rule.lang["en"]}}
					</button>
				</div>
			</div>
		</div>
		<div class="preview-container">
			<div v-if="!(selectedLanguageKeys.length && selectedRuleNames.length)">
				A preview of your sign will be shown here after you select at least one language and rule.
			</div>
			<div v-for="rule in selectedRules" class="rule-container">
				<div v-for="languageKey in selectedLanguageKeys" class="translation-container">
					{{rule.lang[languageKey]}}
				</div>
			</div>
		</div>
    </div>`,
	data() {
		return {
			selectedLanguageKeys: [],
			selectedRuleNames: [],
			languages,
			rules
		}
	},
	computed: {
		selectedRules() {
			return this.rules.filter(rule => this.selectedRuleNames.includes(rule.name));
		},
	},
	methods: {
		addRule(ruleName) {
			this.selectedRuleNames.push(ruleName);
		},
		removeRule(ruleName) {
			this.selectedRuleNames.splice(this.selectedRules.indexOf(ruleName), 1);
		},
		addLanguage(languageKey) {
			this.selectedLanguageKeys.push(languageKey);
		},
		removeLanguage(languageKey) {
			this.selectedLanguageKeys.splice(this.selectedLanguageKeys.indexOf(languageKey), 1);
		},
	}
};

new Vue({
	render: (h) => h(content),
}).$mount("#app");

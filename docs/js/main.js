import languages from './languages.js';
import rules from '../rules/index.js';

const content = {
	template: `
	<div class="outer-container">
		<div>
			<h1 class="title">COVID-19 Signage Generator</h1>
			<div>
				<h2 class="subtitle">Step 1: Select languages to include</h2>
				<div v-for="language in languages">
					<img :src="'img/flags/' + language.key + '.svg'" class="language-flag"/>
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
			<div>
				<div v-for="languageKey in selectedLanguageKeys">
					<img :src="'img/flags/' + languageKey + '.svg'" class="language-flag"/>
				</div>
			</div>
			<div v-if="!(selectedLanguageKeys.length && selectedRuleNames.length)">
				A preview of your sign will be shown here after you select at least one language and rule.
			</div>
			<div v-for="(rule, index) in selectedRules" class="rule-container">
				<button v-if="index > 0" @click="moveRuleUp(index)">+</button>
				<button v-if="index < selectedRules.length - 1" @click="moveRuleDown(index)">-</button>
				<div v-for="languageKey in selectedLanguageKeys" class="translation-container">
					{{rule.lang[languageKey]}}
				</div>
			</div>
			<footer v-if="selectedLanguageKeys.length && selectedRuleNames.length">
				<span>https://www.covid19-signage.org</span>
			</footer>
		</div>
		<footer>
			<a href="https://github.com/TOPdesk/covid19-signage/issues">Feedback</a>
		</footer>
    </div>`,
	data() {
		return {
			selectedLanguageKeys: [],
			selectedRuleNames: [],
			languages,
			rules,
		};
	},
	computed: {
		selectedRules() {
			return this.rules
				.filter((rule) => this.selectedRuleNames.includes(rule.name))
				.sort((a, b) => this.selectedRuleNames.indexOf(a.name) - this.selectedRuleNames.indexOf(b.name));
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
		moveRuleUp(index) {
			const top = this.selectedRuleNames.slice(0, index - 1);
			const bottom = this.selectedRuleNames.slice(index + 1, this.selectedRuleNames.length);

			this.selectedRuleNames = [...top, this.selectedRuleNames[index], this.selectedRuleNames[index - 1], ...bottom];
		},
		moveRuleDown(index) {
			const top = this.selectedRuleNames.slice(0, index);
			const bottom = this.selectedRuleNames.slice(index + 2, this.selectedRuleNames.length);

			this.selectedRuleNames = [...top, this.selectedRuleNames[index + 1], this.selectedRuleNames[index], ...bottom];
		},
	},
};

new Vue({
	render: (h) => h(content),
}).$mount('#app');

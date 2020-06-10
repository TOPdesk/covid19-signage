import languages from './languages.js';
import rules from '../rules/index.js';
import './multiselectlist.js';

const content = {
	template: `
	<div class="outer-container">
		<div class="noprint">
			<h1 class="title">COVID-19 Signage Generator</h1>
			<section aria-labelledby="step1">
				<h2 class="subtitle" id="step1">Step 1: Select languages to include</h2>
				<multiselect-list
						:elements="languages"
						:selected="selectedLanguageKeys"
						keyfield="key"
						autofocus>
					<template v-slot:element="{element: language, selected}">
						{{ language.displayName }}
						<span aria-hidden="true" :lang="language.key">&nbsp;({{ language.own }})</span>
					</template>
				</multiselect-list>
			</section>
			<section class="rule-selection" aria-labelledby="step2">
				<h2 class="subtitle" id="step2">Step 2: Select rules to include</h2>
				<multiselect-list
						:elements="rules"
						:selected="selectedRuleNames"
						keyfield="name"
						>
					<template v-slot:element="{element: rule, selected}">
						<img class="icon" :src="'img/icons/' + rule.icon + '.svg'" :class="rule.type" alt=""/>
						<span>{{rule.lang["en"]}}<span>
					</template>
				</multiselect-list>
			</section>
			<footer class="noprint feedback">
				<a class="button" href="https://github.com/TOPdesk/covid19-signage/issues" target="_blank" rel="noreferrer noopener">Feedback</a>
			</footer>
		</div>
		<section aria-describedby="step3" class="preview">
		<h2 class="subtitle noprint" id="step3">Step 3: Preview and sort</h2>
		<div class="preview-container">
			<table>
				<thead><tr><th role="columnheader" class="languages">
					<div v-for="(language, index) in selectedLanguages" class="language">
						<div :lang="language.key">{{ language.own }}</div>
					</div>
				</th></tr></thead>
				<tbody><tr><td>
				<div v-if="!(selectedLanguageKeys.length && selectedRuleNames.length)">
					A preview of your sign will be shown here after you select at least one language and rule.
				</div>
				<div v-for="(rule, index) in selectedRules" class="rule-container">
					<img v-if="index % 2 === 0" class="ledger-background" :src="'img/backgrounds/ledger.png'" alt=""/>
					<div class="columns is-vcentered rule-content">
						<div class="icon-holder">
							<img class="icon-background" :src="'img/backgrounds/' + rule.type + '.png'"  :class="rule.type" alt=""/>
							<img class="icon" :src="'img/icons/' + rule.icon + '.svg'" alt=""/>
						</div>
						<div class="translations">
							<div v-for="language in selectedLanguages" :key="language['key']"
								class="translation-container"
								:lang="language['key']"
							>{{rule.lang[language['key']]}}</div>
						</div>
					</div>
				</div>
				</td></tr></tbody>
				<tfoot><tr><td>&nbsp;</td></tr></tfoot>
				<footer><span>Free multilingual sign, generated by https://www.covid19-signage.org</span></footer>
			</table>
		</div>
		</section>
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
		selectedLanguages() {
			return this.languages
				.filter((language) => this.selectedLanguageKeys.includes(language.key))
				.sort((a, b) => this.selectedLanguageKeys.indexOf(a.key) - this.selectedLanguageKeys.indexOf(b.key));
		},
	},
};

new Vue({
	render: (h) => h(content),
}).$mount('#app');

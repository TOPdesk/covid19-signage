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
			<section class="rule-selection" aria-labelledby="step3">
				<h2 class="subtitle" id="step3">Step 3: Print this page</h2>
				<button
					@click="window.print()"
					class="button"
					:disabled="!(selectedLanguageKeys.length && selectedRuleNames.length)"
				>Print</button>
			</section>
			<footer class="noprint feedback">
				<a class="button" href="https://github.com/TOPdesk/covid19-signage/issues" target="_blank" rel="noreferrer noopener">Feedback</a>
			</footer>
		</div>
		<section aria-describedby="preview" class="preview">
		<h2 class="subtitle noprint" id="preview">Preview</h2>
		<div class="preview-container">
			<div v-for="(page, index) in pages" class="page">
				<div class="page-number noprint">{{ (index + 1) + '/' + pages.length }}</div>
				<div class="page-content" :class="{'first-page': index === 0}">
					<header class="languages">
						<div v-for="(language, index) in page['languages']" class="language">
							<div :lang="language.key">{{ language.own }}</div>
						</div>
					</header>
					<div v-for="(rule, index) in page['rules']" class="rule-container">
						<img v-if="index % 2 === 0" class="ledger-background" :src="'img/backgrounds/ledger.png'" alt=""/>
						<div class="rule-content">
							<div class="icon-column">
								<div class="icon-holder">
									<img class="icon-background" :src="'img/backgrounds/' + rule.type + '.png'"  :class="rule.type" alt=""/>
									<img class="icon" :src="'img/icons/' + rule.icon + '.svg'" alt=""/>
								</div>
							</div>
							<div class="translations">
								<div v-for="language in page['languages']" :key="language['key']"
									class="translation-container"
									:lang="language['key']"
									:class="{bigfont: language['bigfont']}"
								>{{rule.lang[language['key']]}}</div>
							</div>
						</div>
					</div>
				</div>
				<div class="page-break">&nbsp;</div>
				<footer><span>Free multilingual sign, generated by https://www.covid19-signage.org</span></footer>
			</div>
		</div>
		</section>
    </div>`,
	data() {
		return {
			selectedLanguageKeys: [],
			selectedRuleNames: [],
			languages,
			rules,
			maxLanguagesPerPage: 4,
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
		pages() {
			let distribute = (items, max) => {
				if (!items) {
					return [];
				}
				const copy = [...items];
				if (copy.length <= max) {
					return [copy];
				}
				const buckets = Math.floor((copy.length - 1) / max) + 1;
				const entries = new Array(buckets).fill(0);
				for (let i = 0; i < copy.length; i++) {
					entries[i % buckets]++;
				}
				const result = [];
				entries.forEach(i => result.push(copy.splice(0, i)));
				return result;
			};

			const pages = [];
			const languageDistribution = distribute(this.selectedLanguages, this.maxLanguagesPerPage);
			languageDistribution.forEach((pageLanguages) => {
				const languageCount = pageLanguages.length;
				const rulesPerPage = Math.min(4, 7 - languageCount);
				const ruleDistribution = distribute(this.selectedRules, rulesPerPage);
				ruleDistribution.forEach((pageRules) => {
					pages.push({
						languages: pageLanguages,
						rules: pageRules,
					});
				});
			});
			return pages;
		},
	},
};

new Vue({
	render: (h) => h(content),
}).$mount('#app');

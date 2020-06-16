import languages from "./languages.js";
import rules from "../rules/index.js";
import MultiselectListComponent from "./multiselectlist.js";
import Page from "./page.js";
import toPages from "./paging.js";

const content = {
	components: {
		"multiselect-list": MultiselectListComponent,
		Page
	},
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
						id="select-languages">
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
			<template v-for="(page, index) in pages">
				<page :class="{'first-page': index === 0}"
					:languages="page['languages']"
					:rules="page['rules']"
					:label="(index + 1) + '/' + pages.length"
				/>
			</template>
		</div>
		</section>
    </div>`,
	data: () => ({
		selectedLanguageKeys: [],
		selectedRuleNames: [],
		languages,
		rules,
	}),
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
			return toPages(this.selectedLanguages, this.selectedRules);
		},
	},
};

new Vue({
	render: (h) => h(content),
	mounted: () => {
		document.getElementById("select-languages").focus();
	},
}).$mount("#app");

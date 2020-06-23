import languages from "./languages.js";
import rules from "../rules/index.js";
import styleOptions from "./styles.js";
import MultiselectListComponent from "./multiselectlist.js";
import SingleOptionList from "./singleoptionlist.js";
import Page from "./page.js";
import toPages from "./paging.js";

const content = {
	components: {
		"multiselect-list": MultiselectListComponent,
		"single-option-list": SingleOptionList,
		Page,
	},
	template: `
	<div class="outer-container">
		<div class="noprint">
			<h1 class="title">COVID-19 Signage Generator</h1>
			<section aria-labelledby="step-select-languages">
				<h2 class="subtitle" id="step-select-languages">Step 1: Select languages to include</h2>
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
			<section aria-labelledby="step-select-rules">
				<h2 class="subtitle" id="step-select-rules">Step 2: Select rules to include</h2>
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
			<section aria-labelledby="step-select-style">
				<h2 class="subtitle" id="step-select-style">Step 3: Select a style</h2>
				<single-option-list
						class="style-selection"
						:elements="styleOptions"
						:selected="selectedStyleKey"
						v-on:update:selected="selectedStyleKey=$event"
						keyfield="key"
						>
					<template v-slot:element="{element: style}">
						<page
							:languages="languagesFor(['en', 'fr'])"
							:rules="rulesFor(['follow_arrows', 'shopping_basket_mandatory', 'dont_enter_with_symptoms', 'no_cash_money'])"
							:selectedStyle="styleFor(style.key)"
						>
					</template>
				</single-option-list>
			</section>
			<section aria-labelledby="step-print">
				<h2 class="subtitle" id="step-print">Step 4: Print this page</h2>
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
		<section aria-labelledby="preview" class="preview">
		<h2 class="subtitle noprint" id="preview">Preview</h2>
		<div class="preview-container">
			<template v-for="(page, index) in pages">
				<page :class="{'first-page': index === 0}"
					:languages="page['languages']"
					:rules="page['rules']"
					:selectedStyle="selectedStyle"
					:label="(index + 1) + '/' + pages.length"
				/>
			</template>
		</div>
		</section>
    </div>`,
	data: () => ({
		selectedLanguageKeys: [],
		selectedRuleNames: [],
		selectedStyleKey: "classic",
		languages,
		rules,
		styleOptions,
	}),
	computed: {
		selectedRules() {
			return this.rulesFor(this.selectedRuleNames);
		},
		selectedLanguages() {
			return this.languagesFor(this.selectedLanguageKeys);
		},
		selectedStyle() {
			return this.styleFor(this.selectedStyleKey);
		},
		pages() {
			return toPages(this.selectedLanguages, this.selectedRules);
		},
	},
	methods: {
		languagesFor(keys) {
			return this.languages
				.filter((language) => keys.includes(language.key))
				.sort((a, b) => keys.indexOf(a.key) - keys.indexOf(b.key));
		},
		rulesFor(names) {
			return this.rules
				.filter((rule) => names.includes(rule.name))
				.sort((a, b) => names.indexOf(a.name) - names.indexOf(b.name));
		},
		styleFor(key) {
			return this.styleOptions.filter((style) => style.key === key)[0];
		},
	},
};

new Vue({
	render: (h) => h(content),
	mounted: () => {
		document.getElementById("select-languages").focus();
	},
}).$mount("#app");

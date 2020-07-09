import languages from "./languages.js";
import rules from "../rules/index.js";
import styleOptions from "./styles.js";
import MultiselectListComponent from "./multiselectlist.js";
import SingleOptionList from "./singleoptionlist.js";
import Page from "./page.js";
import toPages from "./paging.js";

document.body.classList.toggle("firefox", /Gecko\//.test(navigator.userAgent));
document.body.classList.toggle("android", /Android/.test(navigator.userAgent));

function getInitialConfig(queryString) {
	const initialConfig = {
		languages: [],
		rules: [],
		style: "classic"
	};

	if (!queryString) {
		return initialConfig;
	}

	const queryFragments = queryString
		.substring(1)
		.split("&");

	for (let fragment of queryFragments) {
		const [key, value] = fragment.split("=");
		if (!value) {
			continue;
		}

		if (key === "languages" || key === "rules") {
			initialConfig[key] = value.split(",");
		}
		if (key === "style") {
			initialConfig.style = value;
		}
	}
	return initialConfig;
}

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
						:selected="selectedRuleKeys"
						keyfield="key"
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
						labelfield="description"
						>
					<template v-slot:element="{element: style}">
						<page
							:languages="languagesFor(['en', 'fr'])"
							:rules="rulesFor(['fa', 'bm', 'nc', 'nm'])"
							:selectedStyle="styleFor(style.key)"
							aria-hidden="true"
						>
					</template>
				</single-option-list>
			</section>
			<section aria-labelledby="step-print">
				<h2 class="subtitle" id="step-print">Step 4: Print this page</h2>
				<button
					@click="window.print()"
					class="button"
					:disabled="!(selectedLanguageKeys.length && selectedRuleKeys.length)"
				>Print</button>
			</section>
			<footer class="noprint feedback">
				<a class="button" href="https://github.com/TOPdesk/covid19-signage/issues" target="_blank" rel="noreferrer noopener">Feedback</a>
				<a class="button" href="https://www.topdesk.com/nl/privacyverklaring/" target="_blank" rel="noreferrer noopener">Privacy Policy</a>
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
	data: () => {
		const initialConfig = getInitialConfig(document.location.search);

		return {
			selectedLanguageKeys: initialConfig.languages,
			selectedRuleKeys: initialConfig.rules,
			selectedStyleKey: initialConfig.style,
			languages,
			rules,
			styleOptions,
			modifiedSinceLastPrint: true,
		};
	},
	created() {
		const reportPrintOptions = () => {
			if (this.modifiedSinceLastPrint) {
				this.modifiedSinceLastPrint = false;
				const state = {
					languages: [...this.selectedLanguageKeys],
					rules: [...this.selectedRuleKeys],
					style: this.selectedStyleKey,
				};
				/*global appInsights*/
				appInsights.trackEvent({
					name: "print",
					properties: state,
				});
			}
		};
		window.addEventListener("beforeprint", reportPrintOptions);
		const mediaQueryList = window.matchMedia("print");
		if (mediaQueryList.addListener) {
			mediaQueryList.addListener(function (mql) {
				if (mql.matches) {
					reportPrintOptions();
				}
			});
		}
	},
	computed: {
		selectedRules() {
			return this.rulesFor(this.selectedRuleKeys);
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
		rulesFor(keys) {
			return this.rules
				.filter((rule) => keys.includes(rule.key))
				.sort((a, b) => keys.indexOf(a.key) - keys.indexOf(b.key));
		},
		styleFor(key) {
			return this.styleOptions.filter((style) => style.key === key)[0];
		},
		modification() {
			this.updateQueryString();
			this.modifiedSinceLastPrint = true;
		},
		updateQueryString() {
			let queryString = "?style=" + this.selectedStyleKey;
			if (this.selectedLanguageKeys.length) {
				queryString += "&languages=" + this.selectedLanguageKeys.join(",");
			}
			if (this.selectedRuleKeys.length) {
				queryString += "&rules=" + this.selectedRuleKeys.join(",");
			}

			history.replaceState(null, "", document.location.pathname + queryString);
		}
	},
	watch: {
		selectedLanguageKeys() {
			this.modification();
		},
		selectedRuleKeys() {
			this.modification();
		},
		selectedStyleKey() {
			this.modification();
		}
	}
};

new Vue({
	render: (h) => h(content),
	mounted: () => {
		document.getElementById("select-languages").focus();
	},
}).$mount("#app");

const nextId = (function () {
	let counter = 0;
	return () => "svg-rule-" + counter++;
})();

/*
* Source for the numbers in the color matrix:
* http://davengrace.com/dave/cspace/
*/
const redFilter = .21586; // #800000
const greenFilter = .21586; // #008000
const yOffsets = [
	[30],
	[20,40],
	[16,30,44],
	[12,24,36,48],
];

const ff = "BlinkMacSystemFont,-apple-system,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',Helvetica,Arial, 'Microsoft YaHei',sans-serif";

export default {
	props: {
		rule: {type: Object, require: true},
		languages: {type: Array, required: true},
		ruleStyle: {type: Object, default: { ruleBackground: "light" }},
	},
	data: () => ({
		id: null,
	}),
	created() {
		this.id = nextId();
	},
	methods: {
		fontWeight: (language) => (language["bigfont"] ?? false) ? "normal" : "bold",
		fontSize: (language) => 5.7 * ((language["bigfont"] ?? false) ? 1.25 : 1),
		adjustLength(language) {
			return this.rule["adjustLength"]?.[language["key"]] ?? 1;
		},
		offsetY(language) {
			return yOffsets[this.languages.length - 1][this.languages.indexOf(language)];
		},
		colorMatrix() {
			if (this.ruleStyle["ruleBackground"] === "fill") {
				return "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0";
			}
			if (this.rule["type"] === "do") {
				return `0 0 0 0 0 0 0 0 0 ${greenFilter} 0 0 0 0 0 0 0 0 1 0`;
			}
			return `0 0 0 0 ${redFilter} 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0`;
		},
		textColor() {
			return (this.ruleStyle["ruleBackground"] === "fill") ? "white" : "black";
		},
		color(strokeOrFill, ruleOrIcon) {
			const backgroundFill = this.ruleStyle["ruleBackground"] === "fill";
			const isDo = this.rule['type'] === "do";
			const isStroke = strokeOrFill  === "stroke";
			const isRule = ruleOrIcon === "rule";

			if ((!backgroundFill && isStroke) || (backgroundFill && (isRule || !isStroke))) {
				return isDo ? "rgb(0, 128, 0)" : "rgb(128, 0, 0)";
			}
			return "white";
		},
	},
	template: `
		<div><svg 
				viewBox="0 0 200 60"
				xmlns="http://www.w3.org/2000/svg">
				<defs>
					<clipPath :id="id + '-rule-clip'">
						<rect width="200" height="60" rx="6" />
					</clipPath>
					<clipPath :id="id + '-icon-clip'">
						<rect x="6" y="10" width="40" height="40" rx="6" />
					</clipPath>
					<filter :id="id + '-color-filter'">
						<feColorMatrix type="matrix" :values="colorMatrix()" />
					</filter>
				</defs>
				<g>
					<rect width="200" height="60" rx="6" :clip-path="'url(#' + id + '-rule-clip)'" stroke-width="1" :stroke="color('stroke', 'rule')" :fill="color('fill', 'rule')" />
					<rect x="6" y="10" width="40" height="40" rx="6" :clip-path="'url(#'  + id + '-icon-clip)'" stroke-width="3" :stroke="color('stroke', 'icon')" :fill="color('fill', 'icon')" />
					<image x="11" y="15" width="30" height="30" :filter="'url(#' + id + '-color-filter)'" :xlink:href="'img/icons/' + rule['icon'] + '.svg'" />
					<template v-for="language in languages">
						<text
							:font-size="fontSize(language)"
							:font-weight="fontWeight(language)" 
							:fill="textColor()"
							font-family="${ff}"
							dominant-baseline="central"
							text-anchor="middle"
							:lang="language['key']"
							:direction="language['rtl'] ? 'rtl' : 'ltr'"
							:transform="'scale(' + adjustLength(language) + ' 1) translate(' + 123 / adjustLength(language) + ' ' + offsetY(language) + ')'"
							>{{ rule['lang'][language['key']] }}</text>
					</template>
				</g>
			</svg>
		</div>
`,
};
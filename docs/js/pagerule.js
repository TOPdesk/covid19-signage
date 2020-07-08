const yOffsets = [
	[30],
	[20,40],
	[16,30,44],
	[12,24,36,48],
];

const ff = "BlinkMacSystemFont,-apple-system,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',Helvetica,Arial, 'Microsoft YaHei',sans-serif";

export default {
	props: {
		rule: {type: Object, required: true},
		languages: {type: Array, required: true},
		ruleStyle: {type: Object, default: { ruleBackground: "light" }},
		idPrefix: {type: String, required: true},
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
		textColor() {
			return (this.ruleStyle["ruleBackground"] === "fill") ? "white" : "black";
		},
		color(strokeOrFill, ruleOrIcon) {
			const backgroundFill = this.ruleStyle["ruleBackground"] === "fill";
			const isDo = this.rule["type"] === "do";
			const isStroke = strokeOrFill  === "stroke";
			const isRule = ruleOrIcon === "rule";

			if ((!backgroundFill && isStroke) || (backgroundFill && (isRule || !isStroke))) {
				return isDo ? "rgb(0, 128, 0)" : "rgb(128, 0, 0)";
			}
			return "white";
		},
	},
	template: `
		<g>
			<rect x=".25" y=".25" width="199.5" height="59.5" rx="6" stroke-width=".5" :stroke="color('stroke', 'rule')" :fill="color('fill', 'rule')" />
			<rect x="6.75" y="10.75" width="38.5" height="38.5" rx="6" stroke-width="1.5" :stroke="color('stroke', 'icon')" :fill="color('fill', 'icon')" />
			<image x="11" y="15" width="30" height="30" :filter="'url(#' + idPrefix + '-color-filter-' + rule['type'] + ')'" :xlink:href="'img/icons/' + rule['icon'] + '.svg'" />
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
`,
};
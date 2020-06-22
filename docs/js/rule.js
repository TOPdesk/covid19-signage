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
	methods: {
		fontWeight: (language) => (language["bigfont"] ?? false) ? "normal" : "bold",
		fontSize: (language) => 5.7 * ((language["bigfont"] ?? false) ? 1.25 : 1),
		adjustLength(language) {
			return this.rule["adjustLength"]?.[language["key"]] ?? 1;
		},
		offsetY(language) {
			return yOffsets[this.languages.length - 1][this.languages.indexOf(language)];
		},
	},
	template: `
		<div><svg 
				viewBox="0 0 200 60"
				xmlns="http://www.w3.org/2000/svg">
				<defs>
					<svg:style type="text/css">
						text {
							font-family: ${ff};
							fill: black;
						}
						.svg-background-fill text {
							fill: white;
						}
						
						.svg-rule-do .svg-rule-background {
							stroke: rgb(0, 128, 0);
							fill: white;
						}
						.svg-rule-do .svg-icon-background {
							stroke: rgb(0, 128, 0);
							fill: white;
						}
						.svg-rule-dont .svg-rule-background {
							stroke: rgb(128, 0, 0);
							fill: white;
						}
						.svg-rule-dont .svg-icon-background {
							stroke: rgb(128, 0, 0);
							fill: white;
						}
						
						.svg-rule-do.svg-background-fill .svg-rule-background {
							stroke: rgb(0, 128, 0);
							fill: rgb(0, 128, 0);
						}
						.svg-rule-do.svg-background-fill .svg-icon-background {
							stroke: white;
							fill: rgb(0, 128, 0);
						}
						.svg-rule-dont.svg-background-fill .svg-rule-background {
							stroke: rgb(128, 0, 0);
							fill: rgb(128, 0, 0);
						}
						.svg-rule-dont.svg-background-fill .svg-icon-background {
							stroke: white;
							fill: rgb(128, 0, 0);
						}
						
						.svg-rule-do .svg-icon {
							filter: url(#go-do);
						}
					   .svg-rule-dont .svg-icon {
							filter: url(#go-dont);
						}
						.svg-background-fill  .svg-icon {
							filter: url(#go-white);
						}
					</svg:style>
					<clipPath id="ruleClip">
						<rect width="200" height="60" rx="6" />
					</clipPath>
					<clipPath id="iconClip">
						<rect x="6" y="10" width="40" height="40" rx="6" />
					</clipPath>
					<filter id="go-white">
						<feColorMatrix type="matrix" values="
							0 0 0 0 1
							0 0 0 0 1
							0 0 0 0 1
							0 0 0 1 0
						" />
					</filter>
					<filter id="go-do">
						<feColorMatrix type="matrix" values="
							0 0 0 0 0
							0 0 0 0 ${greenFilter}
							0 0 0 0 0
							0 0 0 1 0
						" />
					</filter>
					<filter id="go-dont">
						<feColorMatrix type="matrix" values="
							0 0 0 0 ${redFilter}
							0 0 0 0 0
							0 0 0 0 0
							0 0 0 1 0
						" />
					</filter>
				</defs>
				<g :class="'svg-rule-' + rule['type'] + ' svg-background-' + ruleStyle['ruleBackground']">
					<rect class="svg-rule-background" width="200" height="60" clip-path="url(#ruleClip)" rx="6" stroke-width="1" />
					<rect class="svg-icon-background" x="6" y="10" width="40" height="40" clip-path="url(#iconClip)" rx="6" stroke-width="3" />
					<image class="svg-icon" x="11" y="15" width="30" height="30" :xlink:href="'img/icons/' + rule['icon'] + '.svg'" />
					<template v-for="language in languages">
						<text x="123" :y="offsetY(language)" 
							:font-size="fontSize(language)"
							:font-weight="fontWeight(language)" 
							dominant-baseline="central"
							text-anchor="middle"
							:lang="language['key']"
							:direction="language['rtl'] ? 'rtl' : 'ltr'"
							:transform-origin="'123 ' + offsetY(language)"
							:transform="'scale(' + adjustLength(language) + ', 1)'"
							:id="'svg-rule-' + rule['name'] + '-' + language['key']">{{ rule['lang'][language['key']] }}</text>
					</template>
				</g>
			</svg>
		</div>
`,
};
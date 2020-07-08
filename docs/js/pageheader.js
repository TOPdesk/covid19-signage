const xOffsets = [
	[100],
	[60,140],
	[40,100,160],
	[25,75,125,175],
];

const ff = "BlinkMacSystemFont,-apple-system,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',Helvetica,Arial, 'Microsoft YaHei',sans-serif";

export default {
	props: {
		languages: {type: Array, required: true},
	},
	methods: {
		offsetX(language) {
			return xOffsets[this.languages.length - 1][this.languages.indexOf(language)];
		},
	},
	template: `
		<g>
			<rect width="200" height="11" fill="white" />
			<template v-for="language in languages">
				<text
					:x="offsetX(language)"
					y="5.5"
					font-size="8"
					font-weight="bold"
					fill="black"
					font-family="${ff}"
					dominant-baseline="central"
					text-anchor="middle"
					:lang="language['key']"
					:direction="language['rtl'] ? 'rtl' : 'ltr'"
				>{{ language['own'] }}</text>
			</template>
		</g>
`,
};
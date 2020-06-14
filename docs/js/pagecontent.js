Vue.component("page-content", {
	props: {
		languages: {type: Array, required: true},
		rules: {type: Array, require: true},
	},
	template: `
        <div class="page-content">
            <header class="languages">
                <div v-for="(language, index) in languages" class="language">
                    <div :lang="language.key">{{ language.own }}</div>
                </div>
            </header>
            <div v-for="(rule, index) in rules">
                <div class="horizontal-separator" :class="{ 'first-separator': index === 0 }">
                    <svg v-if="index !== 0" class="line" viewBox="0 0 100 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="vertical" y1="0" y2="1">
                                <stop offset="0%" stop-color="black" />
                                <stop offset="50%" stop-color="white" />
                                <stop offset="100%" stop-color="black"/>
                            </linearGradient>
                            <linearGradient id="horizontal">
                                <stop offset="0%" stop-color="black" />
                                <stop offset="50%" stop-color="white" />
                                <stop offset="100%" stop-color="black"/>
                            </linearGradient>
                            <mask id="_mask">
                                <rect width="100" height="100" fill="url(#vertical)"  />
                            </mask>
                            <mask id="mask">
                                <rect width="100" height="100" fill="url(#horizontal)" mask="url(#_mask)"  />
                            </mask>
                        </defs>
                        <rect width="100" height="100" mask="url(#mask)"/>
                    </svg>
                </div>
                <div class="rule-container">
                    <svg class="rule-background" alt=""
                        viewBox="0 0 1 1" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="1" height="1">
                    </svg>
                    <div class="rule-content">
                        <div class="icon-column">
                            <div class="icon-holder">
                                <svg class="icon-background" :class="rule.type" alt=""
                                    viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <clipPath id="clipPath">
                                            <rect width="50" height="50" rx="6" />
                                        </clipPath>
                                    </defs>
                                    <rect width="50" height="50" rx="6" clip-path="url(#clipPath)" />
                                </svg>
                                <img class="icon" :src="'img/icons/' + rule.icon + '.svg'" alt=""/>
                            </div>
                        </div>
                        <div class="translations">
                            <div v-for="language in languages" :key="language['key']"
                                class="translation-container"
                                :lang="language['key']"
                                :class="{bigfont: language['bigfont']}"
                            >{{rule.lang[language['key']]}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
});
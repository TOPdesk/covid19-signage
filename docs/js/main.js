import keep_1point5_meters_distance from "../rules/keep_1point5_meters_distance.js";
import use_basket from "../rules/use_basket.js";
import wash_hands from "../rules/wash_hands.js";

const content = {
	template: `<div class="outer-container">
      <div v-for="rule in rules" class="rule-container">
        <div v-for="translation in rule.lang" class="translation-container">
          {{translation}}
        </div>
      </div>
    </div>`,
	data() {
		return {
			rules: [
				keep_1point5_meters_distance,
				use_basket,
				wash_hands
			]
		}
	}
};

new Vue({
	render: (h) => h(content),
}).$mount("#app");

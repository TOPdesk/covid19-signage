const nextId = (function () {
	let counter = 0;
	return () => "singleoptionlist" + counter++;
})();

export default {
	props: {
		elements: { type: Array, required: true },
		selected: { type: String, required: true },
		keyfield: { type: String, required: true },
		labelfield: {type: String, default: undefined},
	},
	data: () => ({
		current: 0,
		id: null,
	}),
	created() {
		this.id = nextId();

		for (let i = 0; i < this.elements.length; i++) {
			if (this.elements[i][this.keyfield] === this.selected) {
				this.current = i;
				return;
			}
		}
		
		this.selected = this.elements[this.current];
	},
	methods: {
		moveSelectionTo(index) {
			this.current = (index + this.elements.length) % this.elements.length;
			this.selected = this.elements[this.current][this.keyfield];
			this.$emit("update:selected", this.elements[this.current][this.keyfield]);
			this.ensureCurrentVisible();
		},
		idFor(index) {
			return this.id + "_" + this.elements[index][this.keyfield];
		},
		isSelected(index) {
			return index === this.current;
		},
		ensureCurrentVisible() {
			const el = document.getElementById(this.idFor(this.current));
			el.focus();
			el.scrollIntoView({
				block: "nearest",
				behavior: "smooth",
			});
		},
	},
	template: `
		<ul role="radiogroup" class="single-option-list"
			:id="id"
			:aria-activedescendant="idFor(current)"
			@keydown.home.prevent="moveSelectionTo(0)"
			@keydown.up.prevent="moveSelectionTo(current-1)"
			@keydown.left.prevent="moveSelectionTo(current-1)"
			@keydown.down.prevent="moveSelectionTo(current+1)"
			@keydown.right.prevent="moveSelectionTo(current+1)"
			@keydown.end.prevent="moveSelectionTo(elements.length - 1)"
			
		>
			<li v-for="(element, index) in elements" :key="element[keyfield]"
				role="radio"
				:aria-label="labelfield ? element[labelfield] : undefined"
				@click="moveSelectionTo(index)"
				:aria-checked="isSelected(index) ? 'true' : 'false'"
				:tabindex="isSelected(index) ? 0 : -1"
				class="option"
				:class="{selected: isSelected(index)}"
				:id="idFor(index)"
			><slot name="element" :element="element" /></li>
		</ul>`,
};

let nextId = function() {
	let counter = 0;
	return () => 'multiselectlist' + counter++;
}();

Vue.component('multiselect-list', {
	props: {
		elements: { type: Array, required: true, },
		selected: { type: Array, default: () => [], },
		keyfield: { type: String, required: true, },
	},
	data: () =>  ({
		current: 0,
		id: null,
	}),
	template: `
		<ul role="listbox" class="multiselect-list" tabindex="0"
			:id="id"
			:aria-activedescendant="idFor(current)"
			@keydown.space.prevent="toggleSelected(current)"
			@keydown.enter.prevent="next(current)"
			@keydown.home.prevent="moveSelectionTo(0)"
			@keydown.up.prevent="moveSelectionTo(current-1)"
			@keydown.down.prevent="moveSelectionTo(current+1)"
			@keydown.end.prevent="moveSelectionTo(elements.length)"
		>
			<li v-for="(element, index) in elements" :key="element[keyfield]" 
					role="option" 
					@click="toggleSelected(index)"
					:aria-selected="index === current ? 'true' : undefined" 
					:aria-checked="isSelected(index) ? 'true' : 'false'"
					:class="{selected: isSelected(index), current: index === current}"
					class="option"
					:id="idFor(index)"
			><slot name="element" :element="element" :selected="isSelected(index)" /></li>
		</ul>
	`,
	methods: {
		toggleSelected(index) {
			const key = this.elements[index][this.keyfield];
			this.current = index;
			if (this.isSelected(index)) {
				this.selected.splice(this.selected.indexOf(key), 1);
			} else {
				this.selected.push(key);
			}
		},
		idFor(index) {
			return this.id + '_'+ this.elements[index][this.keyfield];
		},
		isSelected(index) {
			return this.selected.includes(this.elements[index][this.keyfield]);
		},
		moveSelectionTo(index) {
			this.current = Math.max(Math.min(index, this.elements.length - 1), 0);
			this.ensureCurrentVisible();
		},
		next(index) {
			this.toggleSelected(index);
			this.moveSelectionTo(index + 1);
		},
		ensureCurrentVisible() {
			document.getElementById(this.idFor(this.current)).scrollIntoView({
				block: 'nearest',
				behavior: 'smooth',
			});
		},
	},
	beforeMount () {
		this.id = nextId();
	},
});
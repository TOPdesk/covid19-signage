export default (languageKeys, ruleNames) => {
	const distribute = (items, max) => {
		if (!items) {
			return [];
		}
		const copy = [...items];
		if (copy.length <= max) {
			return [copy];
		}
		const buckets = Math.floor((copy.length - 1) / max) + 1;
		const entries = new Array(buckets).fill(0);
		for (let i = 0; i < copy.length; i++) {
			entries[i % buckets]++;
		}
		const result = [];
		entries.forEach((i) => result.push(copy.splice(0, i)));
		return result;
	};

	const pages = [];
	const languageDistribution = distribute(languageKeys, 4);
	languageDistribution.forEach((pageLanguages) => {
		const ruleDistribution = distribute(ruleNames, 4);
		ruleDistribution.forEach((pageRules) => {
			pages.push({
				languages: pageLanguages,
				rules: pageRules,
			});
		});
	});
	return pages;
};
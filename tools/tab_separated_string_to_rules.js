// Run this script with NodeJS to turn the multiline string in 'rawData' into 'rules' Javascript files.
// Expected format is tab-separated values, which you get when you copy/paste an Excel table.
const rawData = `name\ttype\ticon\tEnglish\tFrench\tDutch\tTurkish\tChinese`;

const fs = require("fs");

const lines = rawData.split("\n");
for (let line of lines) {
	const cells = line.split("\t");
	if (!cells[0]) {
		continue;
	}
	
	fs.writeFile(`../docs/rules/${cells[0]}.js`,`export default {
	  name: "${cells[0]}",
	  type: "${cells[1]}",
	  icon: "${cells[2]}",
	  lang: {
	    en: "${cells[3]}",
	    fr: "${cells[4]}",
	    nl: "${cells[5]}",
	    tr: "${cells[6]}",
	    zh: "${cells[7]}"
	  }
	};`, error => {
		if (error) {
			console.log(error);
		}
	});
}
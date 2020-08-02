const axios = require('axios');

const replaceAll = (str, matchStr, replaceStr) => {
	return str.split(matchStr).join(replaceStr);
}

const cleanStr = (line) => {
	let str = line.replace("contributions", "");
	str = replaceAll(str, " ", "")
	return replaceAll(str, "\t", "");
}

const getGithubCommits = async ({username}) => {
	const url = "https://github.com/"+username;
	const r = await axios.get(url);
	const text = r.data;
	const lines = text.split("\n");
	
	if (lines[966].toLowerCase().includes("contributions")) {
		console.log(lines[966]);
		return cleanStr(lines[966]);
	} else {
		let lineIndex = 0;
		for (; lineIndex < lines.length; lineIndex++) {
			if (lines[lineIndex].includes("in the last year")) {
				console.log(lineIndex);
				return cleanStr(lines[lineIndex-1]);
			}
		}
	}
}

const main = async () => {
	const username = "sahilsk11";
	const commits = await getGithubCommits({username});
	console.log(commits);
}

main();

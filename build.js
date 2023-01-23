const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const axios = require("axios");
const fs = require('fs').promises;
const path = require('path');
async function walk(dir) {
    let files = await fs.readdir(dir);
    files = await Promise.all(files.map(async file => {
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) return walk(filePath);
        else if(stats.isFile()) return filePath;
    }));

    return files.reduce((all, folderContents) => all.concat(folderContents), []);
}
async function build(){
	let bunker = process.argv[2];
	let bundled = process.argv[3];
	console.log(bunker,bundled);
	let ht = fs.readFileSync(__dirname+"/"+bunker+"/index.html");
	const dom = new JSDOM(ht);
	let document = dom.window.document;
	let window = dom.window;

	//script inlining
	let scrs = document.getElementsByTagName("script");
	for(let i=0;i<scrs.length;i++){
		let content;
		if(scrs[i].src.indexOf("http") != 0){
			let src = __dirname+"/"+bunker+"/"+scrs[i].src;
			content = fs.readFileSync(src, "utf-8");
		} else {
			content = (await axios.get(scrs[i].src)).data;
		}
		scrs[i].removeAttribute("src");
		scrs[i].innerHTML = content;
	}
	delete scrs;

	//navigation virtualization
	let as = document.getElementsByTagName("a");
	for(let i=0;i<as.length;i++){
		if(as[i].href.indexOf("http") != 0){
			as[i].setAttribute("onclick", `document.write(window.navigation['${as[i].href}']);`);
			as[i].removeAttribute("href");
		}
	}

	fs.writeFileSync(__dirname+"/"+bundled+"/index.html", dom.serialize());
	console.log(dom.serialize());
}
build();
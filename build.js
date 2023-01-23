const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const axios = require("axios");
const fsp = require('fs').promises;
const path = require('path');
async function walk(dir) {
    let files = await fsp.readdir(dir);
    files = await Promise.all(files.map(async file => {
        const filePath = path.join(dir, file);
        const stats = await fsp.stat(filePath);
        if (stats.isDirectory()) return walk(filePath);
        else if(stats.isFile()) return filePath;
    }));

    return files.reduce((all, folderContents) => all.concat(folderContents), []);
}
async function build(){
	let bunker = process.argv[2];
	let bundled = process.argv[3];
	let files = await walk(__dirname+"/"+bunker);
	for(let i in files){
		files[i] = files[i].split(__dirname+"/"+bunker)[1];
	}
	console.log(files);
	for(let i in files){
		if(files[i].split(".")[files[i].split(".").length-1] != "html"){
			continue;
		}
		let ht = fs.readFileSync(__dirname+"/"+bunker+files[i]);
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
		fs.writeFileSync(__dirname+"/"+bundled+files[i], dom.serialize());
	}
}
build();
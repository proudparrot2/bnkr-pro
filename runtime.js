// COPYRIGHT [object Object]#3827
// 2022 - 2024
let SESSION = {
	failedDataAttempts: 0,
}
const capture = [
	"platform_identity_name",
	"CHROME VERSION",
	"ENTERPRISE_ENROLLED",
	"CHROMEOS_ARC_STATUS"
];

async function paste() {
	let d = document.getElementById("text").value;
	if (d == "") return;
	d = d.split("\n");
	if (d[0] == "About System System diagnostic data") {
		console.log(d.length);
		console.log(d);
	} else {
		SESSION.failedDataAttempts++;
		if(SESSION.failedDataAttempts>1){
			alert("Not correct data, try steps again\nCan't fix it? Try manually with 'Manual Entry'");
		} else {
			alert("Not correct data, try steps again");
		}
	}
}

let nth = 0;
function tutorial() {
	let steps = [
		"Open 'chrome://system'. If it's blocked, <button onclick=\"selfMake();\">recreate it</button>",
		"Wait for page to load, then press ctrl+a to select everything",
		"Next press ctrl+c to copy",
		"Paste it in the box above (ctrl+v) and hit 'Analyze'",
		"Done!"
	];
	//protect steps
	if (nth < 4) {
		document.getElementById("tutorial_display").innerHTML = steps[nth];
		document.getElementById("tutorial_button").textContent = "Next";
		nth++;
	} else if (nth == 4) {
		document.getElementById("tutorial_display").innerHTML = steps[nth];
		document.getElementById("tutorial_button").textContent = "How to get info?";
		nth = 0;
	}
}
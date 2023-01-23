const app = require("express")();
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});
app.get("/runtime.js", (req, res) => {
	res.sendFile(__dirname + "/runtime.js");
})
app.listen(3000);
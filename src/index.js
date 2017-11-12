const http = require("http");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");
const index = fs.readFileSync(path.join(__dirname, "../public/index.html"), {encoding: "utf8"});
const port = process.env.PORT || 3000;


const server = http.createServer((req, res) => {
	homeRoute(req, res);
	formRoute(req, res);
	dateRoute(req, res);
}).listen(port);
console.log("server is running on port 3000");


const homeRoute = (req, res) => {
	if(req.url === "/" && req.method === "GET") {
		res.writeHead(200, {"Content-type": "text/html"});
		res.write(index);
		res.end();
	}
}


const formRoute = (req, res) => {
	if(req.url === "/" && req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		})
		req.on("end", () => {
			console.log(body);
			let query = querystring.parse(body.toString()).date;
			res.writeHead(303, {"Location": "/" + query});
			res.end();
		})
	}
}

const dateRoute = (req, res) => {
	let query = req.url.replace("/", "").replace(/\%20/g, " ");
	if(query.length > 0) {
		let date = new Date(parseInt(query) || query);
		if(date != "Invalid Date") {
			let dateOptions = {"day": "numeric", "month": "long", "year": "numeric"}
			let dateObject = {"plain" : date.toLocaleString('en-US', dateOptions), "unix" : date.getTime()}
			let fileContents = mergeValues(dateObject, index);
			res.writeHead(200, {"Content-type": "text/html"});
			res.write(fileContents);
			res.end();
		} else {
			res.writeHead(303, {"Location": "/"});
			res.end();
		}
		
	}
}

const mergeValues = (dateObject, template) => {
	for(let key in dateObject) {
		template = template.replace("<h3 class='" + key + "'></h3>", "<h3 class='" + key + "'>" + dateObject[key] + "</h3>");
	}
	return template;
}








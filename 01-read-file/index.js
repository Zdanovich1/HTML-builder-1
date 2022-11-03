const fs = require("fs");
const path = require("path");
const wayToFile = path.join(__dirname, "text.txt");
const readStream = fs.createReadStream(wayToFile, "utf-8");

readStream.on("data", function (data) {
   console.log(data);
})


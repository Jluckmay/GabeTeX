import fs from "fs";

let html = fs.readFileSync("docs/index.html", "utf-8");

// Check current tokens
console.log("Found index.html, length:", html.length);

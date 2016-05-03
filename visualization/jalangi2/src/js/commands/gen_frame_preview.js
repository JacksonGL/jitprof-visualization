

var fs = require('fs');
var content = fs.readFileSync("src/js/frame.html", "utf8");
fs.writeFileSync("src/js/frame_preview.html", JSON.stringify(content).replace(/</g,"\x5Cx3c")+";\n</script>\n");

// require modules
var fs = require("fs");
var path = require("path");
var archiver = require("archiver");
var pjson = require("./package.json");

const isWindows = process.platform === "win32";
const isMac = process.platform === "darwin";

const format = isWindows ? "zip" : "tar";
const dir = pjson.name + "-v" + process.argv[2] + "-" + process.argv[3];

// create a file to stream archive data to.
var output = fs.createWriteStream(path.join(__dirname, dir + "." + format));
var archive = archiver(format);

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on("close", function() {
  console.log(archive.pointer() + " total bytes");
  console.log(
    "archiver has been finalized and the output file descriptor has closed."
  );
});

// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end
output.on("end", function() {
  console.log("Data has been drained");
});

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on("warning", function(err) {
  if (err.code === "ENOENT") {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

// good practice to catch this error explicitly
archive.on("error", function(err) {
  throw err;
});

// pipe archive data to the file
archive.pipe(output);

var frontFile = path.join(__dirname, "dist", pjson.name + ".umd.min.js");
archive.append(fs.createReadStream(frontFile), {
  name: path.join(dir, "opengeode.js")
});

archive.directory("server/protocols", path.join(dir, "server"));
archive.directory("build/install", path.join(dir, "server"));

for( let i = 4; i < process.argv.length; i++) {
    archive.directory(process.argv[i], path.join(dir, "server"));
}

// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize();

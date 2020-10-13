/*
 * Copyright (c) 2019 - 2020 Geode-solutions
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

// require modules
const fs = require("fs");
const process = require("process");
const path = require("path");
const archiver = require("archiver");

const dir = "opengeode-" + process.argv[2] + "-" + process.argv[3];

// create a file to stream archive data to.
const outputName = path.join(__dirname, dir + ".zip");
console.log("Output: ", outputName);
const output = fs.createWriteStream(outputName);
const archive = archiver("zip");

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

const frontFile = path.join(__dirname, "dist", "opengeode.umd.min.js");
archive.append(fs.createReadStream(frontFile), {
  name: path.join(dir, "index.js")
});
const configFile =
  process.platform === "win32" ? "config.win.json" : "config.unix.json";
archive.append(fs.createReadStream(configFile), {
  name: path.join(dir, "config.json")
});

archive.directory("server/protocols", path.join(dir, "server"));
archive.append(fs.createReadStream("server/requirements.txt"), {
  name: path.join(dir, "server", "requirements.txt")
});
archive.directory("build/install", path.join(dir, "server"));

for (let i = 4; i < process.argv.length; i++) {
  archive.directory(process.argv[i], path.join(dir, "server"));
}

// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize();

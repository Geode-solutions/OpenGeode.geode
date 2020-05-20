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

import basic from "./basic";
import mesh from "./mesh";
import model from "./model";
// import Octokit from "@octokit/rest";

// function installGeodeDependencies(platform) {
//   console.log(platform);
//   if (platform.startsWith("win")) {
//     platform = "win64";
//   } else {
//     platform = platform.charAt(0).toUpperCase() + platform.slice(1);
//   }
//   console.log(platform);
//   const octokit = new Octokit({
//     auth: "0d4aac0ac99b7ad5437b9b2124fb1650e3671d86"
//   });
//   const owner = "Geode-solutions";
//   Object.keys(GEODE).forEach(key => {
//     const repo = key;
//     const tag = "v" + GEODE[key];
//     console.log(owner);
//     console.log(repo);
//     console.log(tag);
//     const toto = octokit.repos.get.endpoint({
//       owner,
//       repo
//     });
//     console.log(toto);
//     toto.headers.accept = "application/octet-stream";
//     //toto.headers["Access-Control-Allow-Origin"] = "*";
//     toto.owner = owner;
//     toto.repo = repo;
//     console.log(toto);
//     octokit.repos
//       .getReleaseByTag({
//         owner,
//         repo,
//         tag
//       })
//       .then(release => {
//         console.log(release.data);
//         const release_id = release.data.id;
//         octokit.repos
//           .listAssetsForRelease({
//             owner,
//             repo,
//             release_id
//           })
//           .then(assets => {
//             console.log(assets.data);
//             assets.data.forEach(asset => {
//               if (asset.name.includes(platform)) {
//                 console.log(asset.name);
//                 const asset_id = asset.id;
//                 octokit.repos
//                   .getReleaseAsset({
//                     owner,
//                     repo,
//                     asset_id
//                   })
//                   .then(asset => {
//                     console.log(asset);
//                     console.log("download");
//                     toto.asset_id = asset_id;
//                     fetch(asset.data.browser_download_url, {
//                       mode: "no-cors",
//                       headers: {
//                         Authorization:
//                           "Token 0d4aac0ac99b7ad5437b9b2124fb1650e3671d86"
//                       }
//                     }).then(tutu => console.log(tutu));
//                     /*
//                   octokit
//                       .request("GET /repos/:owner/:repo/releases/assets/:asset_id", {
//                         headers: {
//                           Accept: "application/octet-stream"
//                         },
//                         owner,
//                         repo,
//                         asset_id
//                       })
//                       //.then(tutu => console.log(tutu));
//                       */
//                   });
//               }
//             });
//           });
//       });
//   });
// }

export default function(store, platform) {
  // installGeodeDependencies(platform);
  basic(store);
  mesh(store);
  model(store);
}

const https = require("https");
const mimeUrl =
  "https://gist.githubusercontent.com/AshHeskes/6038140/raw/27c8b1e28ce4c3aff0c0d8d3d7dbcb099a22c889/file-extension-to-mime-types.json";

const getMimeType = (extname) => {
  return new Promise((resolve, reject) => {
    https
      .get(mimeUrl, (res) => {
        if (res.statusCode < 200 || res.statusCode > 299) {
          reject(`Error: can not load mime types json file: ${res.statusCode}`);
          return false;
        }

        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(JSON.parse(data)[extname]);
        });
      })
      .on("error", (error) => {
        console.error(error);
      });
  });
};

module.exports = getMimeType;

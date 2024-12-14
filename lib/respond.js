const url = require("url");
const fs = require("fs");
const path = require("path");

const buildBreadcrumb = require("./breadcrumb");
const buildMainContent = require("./mainContent");
const getMimetype = require("./getMimeType");

const staticBasePath = path.join(__dirname, "..");
const { URL } = url;

const respond = (request, response) => {
  const baseURL = `${request.protocol}://${request.headers.host}`;
  let pathname = new URL(request.url, baseURL).pathname;

  pathname = decodeURIComponent(pathname);

  if (pathname === "/favicon.ico") return;

  if (pathname === "/") pathname = `${pathname}/static`;

  const fullStaticPath = path.join(staticBasePath, pathname);

  if (!fs.existsSync(fullStaticPath)) {
    console.log(`${fullStaticPath} does not exist`);
    return response.end("404 error");
  } else {
    let stats;

    try {
      stats = fs.lstatSync(fullStaticPath);
    } catch (error) {
      console.log(`lstatSync error : ${error.message}`);
    }

    if (stats.isDirectory()) {
      // html template
      let data = fs.readFileSync(
        path.join(staticBasePath, "views/index.html"),
        "utf-8"
      );

      let pathSegments = pathname.split("/").reverse();

      // ["", "item"] -> ["item"]
      pathSegments = pathSegments.filter((segment) => segment !== "");

      // folderName for title display
      const folderName =
        pathSegments[0] === "static" ? "Home" : pathSegments[0];

      // build breadcrumb
      const breadcrumb = buildBreadcrumb(pathname);

      // build rows
      const mainContent = buildMainContent(fullStaticPath, pathname);

      data = data.replace("{title}", folderName);
      data = data.replace("{breadcrumb}", breadcrumb);
      data = data.replace("{folders}", mainContent);

      response.statusCode = 200;
      return response.end(data);
    }

    if (!stats.isFile()) {
      response.statusCode = 401;
      return response.end("401: Access denied!");
    }

    const fileDetails = {};
    fileDetails.extname = path.extname(fullStaticPath);

    try {
      fileDetails.size = fs.statSync(fullStaticPath).size;
    } catch (error) {
      console.log(`error: ${error}`);
    }

    getMimetype(fileDetails.extname)
      .then((mime) => {
        const headers = {};
        const options = {};

        let statusCode = 200;

        headers["Content-Type"] = mime;

        if (fileDetails.extname === ".pdf") {
          headers["Content-Disposition"] = "inline";
          // headers["Content-Disposition"] = "attachment; filename=file.pdf";
        }

        if (RegExp("audio").test(mime) || RegExp("video").test(mime)) {
          headers["Accept-Ranges"] = "bytes";

          const range = request.headers.range;

          if (range) {
            // Content-Range
            // e.g: bytes=10000-end
            const bytesRange = range.replace(/bytes=/, "").split("-");
            const start = parseInt(bytesRange[0]) - 1;
            const end = bytesRange[1]
              ? parseInt(bytesRange[1])
              : fileDetails.size - 1;

            headers["Content-Range"] = `bytes ${start}-${end}/${
              fileDetails.size - 1
            }`;

            headers["Content-Length"] = end - (start + 1);

            statusCode = 206;

            options.start = start;
            options.end = end;
          }
        }

        const fileStream = fs.createReadStream(fullStaticPath, options);

        response.writeHead(statusCode, headers);
        fileStream.pipe(response);

        fileStream.on("close", () => {
          return response.end();
        });

        fileStream.on("error", (error) => {
          response.statusCode = 404;
          return response.end("404: FileStream error!");
        });
      })
      .catch((error) => {
        response.statusCode = 500;
        response.write("500: Internal Server Error");
        console.log(error.name, error.message);
        return response.end();
      });
  }
};

module.exports = respond;

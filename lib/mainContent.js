const fs = require("fs");
const path = require("path");

const calculateDirectorySize = require("./calculateDirectorySize");
const calculateFileSize = require("./calculateFileSize");

// loop through the elements inside the folder
// get the following elements for each item:
// - name
// - link to the item
// - size
// - last modified
const buildMainContent = (fullStaticPath, pathname) => {
  // table rows and cols
  let mainContent = "";
  // files and folders returned from readdirSync
  let items;

  // readdirSync - return files and folders from the path

  try {
    items = fs.readdirSync(fullStaticPath);
  } catch (error) {
    console.error(`readdirSync error: ${error.message}`);
    return `
            <div class="alert alert-warning">Internal Server Error, try later</div>
        `;
  }

  items.forEach((item) => {
    // build item details that can be a file or folder
    let itemDetails = {};
    itemDetails.name = item;

    // link
    const link = path.join(pathname, item);

    const itemFullStaticPath = path.join(fullStaticPath, item);
    // stats from the item
    try {
      // get stats from the item
      itemDetails.stats = fs.statSync(itemFullStaticPath);
    } catch (error) {
      console.error(`statSync error ${error}`);
      return `<div class="alert alert-warning">Internal Server Error</div>`;
    }

    if (itemDetails.stats.isDirectory()) {
      // folder icon
      itemDetails.icon = `<ion-icon name="folder"></ion-icon>`;

      [itemDetails.size, itemDetails.bytes] =
        calculateDirectorySize(itemFullStaticPath);
    } else if (itemDetails.stats.isFile) {
      // file icon
      itemDetails.icon = `<ion-icon name="document"></ion-icon>`;
      [itemDetails.size, itemDetails.bytes] = calculateFileSize(
        itemDetails.stats
      );
    }

    // file last change in unix timestamp
    itemDetails.timestamp = parseInt(itemDetails.stats.mtimeMs);

    itemDetails.date = new Date(itemDetails.timestamp);

    itemDetails.date = itemDetails.date.toLocaleDateString();
    if (itemDetails.size === "NaNundefined") itemDetails.size = "0B";
    mainContent += `<tr data-name="${itemDetails.name}" data-size="${
      itemDetails.bytes
    }" data-time="${itemDetails.timestamp}">
        <td>${itemDetails.icon}<a href="${link}" ${
      itemDetails.stats.isFile() && "target='_blank'"
    }>${itemDetails.name}</a></td>
        <td>${itemDetails.size}</td>
        <td>${itemDetails.date}</td>
    </tr>
        `;
  });

  return mainContent;
};

module.exports = buildMainContent;

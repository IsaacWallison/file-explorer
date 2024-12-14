const { execSync } = require("child_process");

const calculateDirectorySize = (itemFullStaticPath) => {
  //escape spaces, tabs..
  const itemFullStaticPathCleaned = itemFullStaticPath.replace(/\s/g, `\ `);

  // return [sizeOfItem] [itemFullPath]
  const commandOutput = execSync(
    `du -sh "${itemFullStaticPathCleaned}"`
  ).toString();

  // replace tabs, spaces and split by '/'
  const size = commandOutput.replace(/\s/g, "").split("/")[0];

  // size=[number][symbol]
  const bytesUnit = size.split("").pop();

  // mapping values by keys
  const bytesUnitMap = {
    B: 1,
    K: Math.pow(1000, 1),
    M: Math.pow(1000, 2),
    G: Math.pow(1000, 3),
    T: Math.pow(1000, 4),
  };

  // replace any chars but not ','
  // that can be K(kilobytes), M(megabytes)..
  let sizeNumber = size.replace(/[^\d,]+/g, "");
  // replace ',' by '.'
  sizeNumber = sizeNumber.replace(/,/g, ".");
  // calculate size number to bytes
  const bytes = +sizeNumber * bytesUnitMap[bytesUnit];

  return [size, bytes];
};

module.exports = calculateDirectorySize;

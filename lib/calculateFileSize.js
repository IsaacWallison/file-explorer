const calculateFileSize = (stats) => {
  const bytes = stats.size; // bytes
  // unit size
  const units = "BKMGT";
  // log10 returns the base 10 logarithm
  const index = Math.floor(Math.log10(bytes) / 3);

  const readableFileSize = bytes / Math.pow(1000, index);

  const unit = units[index];

  const size = `${readableFileSize.toFixed(1)}${unit}`;

  return [size, bytes];
};

module.exports = calculateFileSize;

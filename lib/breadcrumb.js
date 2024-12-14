const path = require("path");

const buildBreadcrumb = (pathname) => {
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  let breadcrumb = `
        <li class="breadcrumb-item">
            <a href="/">Home</a>
        </li>
    `;

  let link = "/";
  pathSegments.forEach((item, index) => {
    if (index !== pathSegments.length - 1) {
      link = path.join(link, item);
      breadcrumb += `
                <li class="breadcrumb-item">
                    <a href="${link}">${item}</a>
                </li>
            `;
    } else {
      breadcrumb += `
            <li class="breadcrumb-item active" aria-current="page">
                ${item}
            </li>
            `;
    }
  });

  return breadcrumb;
};

module.exports = buildBreadcrumb;

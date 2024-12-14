const table = document.querySelector("tbody");

const children = table.children;

const rows = Array.from(children);

const items = [];

const sortState = {
  name: "none",
  size: "none",
  time: "none",
};

rows.forEach((element) => {
  const rowDetails = {
    name: element.getAttribute("data-name"),
    size: parseInt(element.getAttribute("data-size")),
    time: parseInt(element.getAttribute("data-time")),
    html: element.outerHTML,
  };
  items.push(rowDetails);
});

const sortNames = (items, order) => {
  items.sort((a, b) => {
    const aName = a.name.toUpperCase();
    const bName = b.name.toUpperCase();
    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  });
  if (order === "desc") {
    items.reverse();
  }
};

const sortSize = (items, order) => {
  items.sort((a, b) => {
    if (a.size < b.size) return -1;
    if (a.size > b.size) return 1;
    return 0;
  });
  if (order === "desc") {
    items.reverse();
  }
};

const sortTime = (items, order) => {
  items.sort((a, b) => {
    if (a.time < b.time) return -1;
    if (a.time > b.time) return 1;
    return 0;
  });
  if (order === "desc") {
    items.reverse();
  }
};

const updateTable = (items) => {
  const content = items.map((element) => element.html).join();
  table.innerHTML = content.replaceAll(",", "");
};

document.querySelector("#table-head-row").addEventListener("click", (event) => {
  const { target } = event;
  if (target) {
    sortBy(target.id);
    handleIcon(target);
    // if (target.id === "name") {
    //   const icon = target.querySelector("ion-icon");
    //   if (icon) {
    //     icon.remove();
    //   }
    //   sortItemsByName();
    //   handleIcon(target);
    // }
  }
});

const sortMap = {
  name: sortNames,
  size: sortSize,
  time: sortTime,
};

const sortBy = (field) => {
  if (["none", "desc"].includes(sortState[field])) {
    sortMap[field](items, "asc");
    sortState[field] = "asc";
  } else {
    sortMap[field](items, "desc");
    sortState[field] = "desc";
  }
  updateTable(items);
};

const sortItemsByName = () => {
  if (["none", "desc"].includes(sortState.name)) {
    sortNames(items, "asc");
    sortState.name = "asc";
  } else {
    sortNames(items, "desc");
    sortState.name = "desc";
  }
  updateTable(items);
};

const handleIcon = (target) => {
  target.parentElement.querySelectorAll("ion-icon").forEach((e) => e.remove());
  const state = sortState[target.id];

  const icon = target.querySelector("ion-icon");
  if (icon) icon.remove();

  if (state === "asc") {
    target.innerHTML += ' <ion-icon name="caret-up-circle"></ion-icon>';
    return;
  }
  if (state === "desc") {
    target.innerHTML += ' <ion-icon name="caret-down-circle"></ion-icon>';
    return;
  }
};

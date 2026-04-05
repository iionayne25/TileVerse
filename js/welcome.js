import { BOX_WIDTH, BOX_HEIGHT } from "../constants/constant.js";

function createBox({
  backgroundColor = "#C1CFA1",
  width = "300px",
  height = "200px",
  image = "",
  text = "",
  textColor = "#FFFFFF",
}) {
  const box = document.createElement("div");
  box.className = "box-component";
  box.style.backgroundColor = backgroundColor;
  box.style.width = width;
  box.style.height = height;

  if (image) {
    const img = document.createElement("img");
    img.src = image;
    img.alt = text || "box image";
    box.appendChild(img);

    const overlay = document.createElement("div");
    overlay.className = "overlay";
    box.appendChild(overlay);
  }

  const content = document.createElement("div");
  content.className = "content";

  const title = document.createElement("p");
  title.className = "title";
  title.textContent = text;
  title.style.color = textColor;
  title.style.fontSize = "12px";

  content.appendChild(title);
  box.appendChild(content);

  return box;
}

const tileList = [
  {
    id: 1,

    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    text: "Grass",
  },
  {
    id: 2,

    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    text: "Water",
  },
  {
    id: 3,

    width: BOX_WIDTH,
    height: BOX_HEIGHT,

    text: "Sand",
  },
  {
    id: 3,

    width: BOX_WIDTH,
    height: BOX_HEIGHT,

    text: "Stone",
  },
];

const objList = [
  {
    id: 1,
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    text: "Tree",
  },
  {
    id: 2,

    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    text: "Human",
  },
  {
    id: 3,

    width: BOX_WIDTH,
    height: BOX_HEIGHT,

    text: "Dino",
  },
];

const ground = document.getElementById("ground");
tileList.map(createBox).forEach((el) => ground.appendChild(el));

const object = document.getElementById("object");
objList.map(createBox).forEach((el) => object.appendChild(el));

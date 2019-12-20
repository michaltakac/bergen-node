const latex = require("node-latex");
const fs = require("fs");
const fse = require("fs-extra");
const { join } = require("path");
const generateDoc = require("./document-series");

const pr1TypesArr = require("./zdrojaky_prikladov/pr1/files");
const pr2TypesArr = require("./zdrojaky_prikladov/pr2/files");
const pr3TypesArr = require("./zdrojaky_prikladov/pr3/files");
const pr4TypesArr = require("./zdrojaky_prikladov/pr4/files");
const pr5TypesArr = require("./zdrojaky_prikladov/pr5/files");
const pr6TypesArr = require("./zdrojaky_prikladov/pr6/files");
const pr7TypesArr = require("./zdrojaky_prikladov/pr7/files");
const pr8TypesArr = require("./zdrojaky_prikladov/pr8/files");
const pr9TypesArr = require("./zdrojaky_prikladov/pr9/files");

const priklady = {
  pr1: {
    name: "pr1",
    types: pr1TypesArr,
    count: pr1TypesArr.length,
    usedCount: 0,
    usedTypes: [],
  },
  pr2: {
    name: "pr2",
    types: pr2TypesArr,
    count: pr2TypesArr.length,
    usedCount: 0,
    usedTypes: [],
  },
  pr3: {
    name: "pr3",
    types: pr3TypesArr,
    count: pr3TypesArr.length,
    usedCount: 0,
    usedTypes: [],
  },
  pr4: {
    name: "pr4",
    types: pr4TypesArr,
    count: pr4TypesArr.length,
    usedCount: 0,
    usedTypes: [],
  },
  pr5: {
    name: "pr5",
    types: pr5TypesArr,
    count: pr5TypesArr.length,
    usedCount: 0,
    usedTypes: [],
  },
  pr6: {
    name: "pr6",
    types: pr6TypesArr,
    count: pr6TypesArr.length,
    usedCount: 0,
    usedTypes: [],
  },
  pr7: {
    name: "pr7",
    types: pr7TypesArr,
    count: pr7TypesArr.length,
    usedCount: 0,
    usedTypes: [],
  },
  pr8: {
    name: "pr8",
    types: pr8TypesArr,
    count: pr8TypesArr.length,
    usedCount: 0,
    usedTypes: [],
  },
  pr9: {
    name: "pr9",
    types: pr9TypesArr,
    count: pr9TypesArr.length,
    usedCount: 0,
    usedTypes: [],
  },
};

const maxCount = Math.max(...Object.values(priklady).map(pr => pr.count));

// We use two possible ways of moving through arrays with less problems than maxCount
// and each list of the particular problem number can be traversed differently.
const passes = ["forward-pass", "backward-pass"];
const passType = passes[Math.floor(Math.random() * 2)];

async function prepareProblem(problemIndex, currentIndex) {
  const pr = priklady[`pr${problemIndex}`];

  let type = null;
  if (pr.count < maxCount) {
    if (pr.count < currentIndex) {
      type = pr.types[Math.floor(Math.random() * pr.count)];
    } else {
      if (passType === "forward-pass") {
        type = pr.types[currentIndex];
      } else {
        type = pr.types.reverse()[currentIndex];
      }
    }
  } else {
    const notUsedTypes = pr.types.filter(t => !pr.usedTypes.includes(t));
    type = notUsedTypes[Math.floor(Math.random() * notUsedTypes.length)];
    priklady[`pr${problemIndex}`].usedTypes.push(type);
  }

  priklady[`pr${problemIndex}`].usedCount++;

  console.log(priklady[`pr${problemIndex}`]);

  if (!type) {
    type = pr.types[Math.floor(Math.random() * pr.count)];
  }

  return fse.readFile(join(__dirname, `zdrojaky_prikladov/pr${problemIndex}/typ_${type}.tex`), "utf8");
}

function generator(currentIndex) {
  return new Promise(async (resolve, reject) => {
    const fileName = `seria_ing_${currentIndex + 1}`;

    const [pr1, pr2, pr3, pr4, pr5, pr6, pr7, pr8, pr9] = await Promise.all([
      await prepareProblem(1, currentIndex),
      await prepareProblem(2, currentIndex),
      await prepareProblem(3, currentIndex),
      await prepareProblem(4, currentIndex),
      await prepareProblem(5, currentIndex),
      await prepareProblem(6, currentIndex),
      await prepareProblem(7, currentIndex),
      await prepareProblem(8, currentIndex),
      await prepareProblem(9, currentIndex),
    ]);

    console.log(pr1, pr2, pr3, pr4, pr5, pr6, pr7, pr8, pr9);

    const texSource = await generateDoc({
      seriesNumber: currentIndex + 1,
      pr1,
      pr2,
      pr3,
      pr4,
      pr5,
      pr6,
      pr7,
      pr8,
      pr9,
    });

    try {
      await fse.writeFile(join(__dirname, `serie_zdrojaky/${fileName}.tex`), texSource);
    } catch (err) {
      reject(err);
      // return;
    }

    const input = await fse.createReadStream(join(__dirname, `serie_zdrojaky/${fileName}.tex`));

    const output = await fse.createWriteStream(join(__dirname, `serie/${fileName}.pdf`));

    const options = {
      inputs: join(__dirname, "."),
    };

    const pdf = latex(input, options);

    pdf.pipe(output);
    pdf.on("error", err => {
      reject(err);
    });
    pdf.on("finish", () => {
      resolve(`Séria úloh ${fileName}.pdf bola vygenerovaná.`);
    });
  });
}

function generateExams() {
  if (!fs.existsSync("serie")) {
    fs.mkdirSync("serie");
  }

  if (!fs.existsSync("serie_zdrojaky")) {
    fs.mkdirSync("serie_zdrojaky");
  }

  let doStuff = function* doStuff(fn) {
    let i = 0;
    do {
      yield fn(i).then(res => {
        console.log(res);
        return res;
      });
      ++i;
    } while (i < maxCount);
  };

  Promise.all(doStuff(generator))
    .then(data => console.log("complete:", data, passType))
    .catch(err => console.log(err));
}

generateExams();

const latex = require("node-latex");
const fs = require("fs");
const fse = require("fs-extra");
const { join } = require("path");
const generateDoc = require("./document");

const pr1TypesArr = require("./exam_sources_test/pr1/files");
const pr2TypesArr = require("./exam_sources_test/pr2/files");
const pr3TypesArr = require("./exam_sources_test/pr3/files");
const pr4TypesArr = require("./exam_sources_test/pr4/files");
const pr5TypesArr = require("./exam_sources_test/pr5/files");
const pr6TypesArr = require("./exam_sources_test/pr6/files");
const pr7TypesArr = require("./exam_sources_test/pr7/files");
const pr8TypesArr = require("./exam_sources_test/pr8/files");
const pr9TypesArr = require("./exam_sources_test/pr9/files");

const priklady = {
  pr1: {
    name: "pr1",
    types: pr1TypesArr,
    count: pr1TypesArr.length,
    usedCount: 0,
    usedTypes: []
  },
  pr2: {
    name: "pr2",
    types: pr2TypesArr,
    count: pr2TypesArr.length,
    usedCount: 0,
    usedTypes: []
  },
  pr3: {
    name: "pr3",
    types: pr3TypesArr,
    count: pr3TypesArr.length,
    usedCount: 0,
    usedTypes: []
  },
  pr4: {
    name: "pr4",
    types: pr4TypesArr,
    count: pr4TypesArr.length,
    usedCount: 0,
    usedTypes: []
  },
  pr5: {
    name: "pr5",
    types: pr5TypesArr,
    count: pr5TypesArr.length,
    usedCount: 0,
    usedTypes: []
  },
  pr6: {
    name: "pr6",
    types: pr6TypesArr,
    count: pr6TypesArr.length,
    usedCount: 0,
    usedTypes: []
  },
  pr7: {
    name: "pr7",
    types: pr7TypesArr,
    count: pr7TypesArr.length,
    usedCount: 0,
    usedTypes: []
  },
  pr8: {
    name: "pr8",
    types: pr8TypesArr,
    count: pr8TypesArr.length,
    usedCount: 0,
    usedTypes: []
  },
  pr9: {
    name: "pr9",
    types: pr9TypesArr,
    count: pr9TypesArr.length,
    usedCount: 0,
    usedTypes: []
  }
};

const maxCount = Math.max(...Object.values(priklady).map(pr => pr.count));

const date = `05. január 2020`;
const time = `9:00`;

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
    type =
      pr.types[
        Math.floor(Math.random() * priklady[`pr${problemIndex}`].types.length)
      ];
    priklady[`pr${problemIndex}`].usedTypes.push(type);
    // priklady[`pr${problemIndex}`].types = priklady[`pr${problemIndex}`].types.filter(pr => !pr.includes(type));
  }

  priklady[`pr${problemIndex}`].usedCount++;

  console.log(priklady[`pr${problemIndex}`]);

  if (!type) {
    type = pr.types[Math.floor(Math.random() * pr.count)];
  }

  return fse.readFile(
    join(__dirname, `exam_sources_test/pr${problemIndex}/typ_${type}.tex`),
    "utf8"
  );
}

function generator(currentIndex) {
  return new Promise(async (resolve, reject) => {
    const fileName = `test_ing_${currentIndex}`;

    const [pr1, pr2, pr3, pr4, pr5, pr6, pr7, pr8, pr9] = await Promise.all([
      await prepareProblem(1, currentIndex),
      await prepareProblem(2, currentIndex),
      await prepareProblem(3, currentIndex),
      await prepareProblem(4, currentIndex),
      await prepareProblem(5, currentIndex),
      await prepareProblem(6, currentIndex),
      await prepareProblem(7, currentIndex),
      await prepareProblem(8, currentIndex),
      await prepareProblem(9, currentIndex)
    ]);

    console.log(pr1, pr2, pr3, pr4, pr5, pr6, pr7, pr8, pr9);

    const texSource = await generateDoc({
      date,
      time,
      pr1,
      pr2,
      pr3,
      pr4,
      pr5,
      pr6,
      pr7,
      pr8,
      pr9
    });

    try {
      await fse.writeFile(
        join(__dirname, `skusky_zdrojaky_testovacie/${fileName}.tex`),
        texSource
      );
    } catch (err) {
      reject(err);
      // return;
    }

    const input = await fse.createReadStream(
      join(__dirname, `skusky_zdrojaky_testovacie/${fileName}.tex`)
    );

    const output = await fse.createWriteStream(
      join(__dirname, `skusky_testovacie/${fileName}.pdf`)
    );

    const options = {
      inputs: join(__dirname, ".")
    };

    const pdf = latex(input, options);

    pdf.pipe(output);
    pdf.on("error", err => {
      reject(err);
    });
    pdf.on("finish", () => {
      resolve(`Skúška ${fileName}.pdf bola vygenerovaná.`);
    });

    // Log to file
    fse
      .writeFile(
        join(__dirname, `priklady.log`),
        `${JSON.stringify(priklady.pr1)}
-----------------
${JSON.stringify(priklady.pr2)}
-----------------
${JSON.stringify(priklady.pr3)}
-----------------
${JSON.stringify(priklady.pr4)}
-----------------
${JSON.stringify(priklady.pr5)}
-----------------
${JSON.stringify(priklady.pr6)}
-----------------
${JSON.stringify(priklady.pr7)}
-----------------
${JSON.stringify(priklady.pr8)}
-----------------
${JSON.stringify(priklady.pr9)}`
      )
      .catch(err => console.error("log file was not generated: ", err));
  });
}

// async function generator(currentIndex) {

//   let pr1Type = undefined
//   priklady.pr1.types.forEach(pr => {

//   });

//   const pr1 = await fse.readFile(
//     join(__dirname, "exam_sources/pr1/1_termin_9_00.tex"),
//     "utf8"
//   );

//   const pr2 = await fse.readFile(
//     join(__dirname, "exam_sources/pr2/1_termin_9_00.tex"),
//     "utf8"
//   );

//   const texSource = await generateDoc({
//     date,
//     time,
//     pr1,
//     pr2,
//     pr3: "Test prikladu 3",
//     pr4: "Test prikladu 4",
//     pr5: "Test prikladu 5",
//     pr6: "Test prikladu 6",
//     pr7: "Test prikladu 7",
//     pr8: "Test prikladu 8",
//     pr9: "Test prikladu 9"
//   });

//   try {
//     await fse.writeFile(
//       join(__dirname, "exam_sources/test_ing_01.tex"),
//       texSource
//     );
//     console.log("TeX document saved!");
//   } catch (err) {
//     throw err;
//   }

//   const input = await fse.createReadStream(
//     join(__dirname, "exam_sources/test_ing_01.tex")
//   );

//   const output = await fse.createWriteStream(join(__dirname, "skusky/output.pdf"));

//   const options = {
//     inputs: join(__dirname, '.') // This will write the errors to `latexerrors.log`
//   }

//   const pdf = latex(input, options);

//   pdf.pipe(output);
//   pdf.on("error", err => {
//     console.error(err);
//     return;
//   });
//   pdf.on("finish", () => {
//     console.log("Skúšky boli vygenerované do zložky `/skusky`.");
//     return;
//   });
// }

function generateExams() {
  if (!fs.existsSync("skusky_testovacie")) {
    fs.mkdirSync("skusky_testovacie");
  }

  if (!fs.existsSync("skusky_zdrojaky_testovacie")) {
    fs.mkdirSync("skusky_zdrojaky_testovacie");
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

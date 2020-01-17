const latex = require("node-latex");
const fs = require("fs");
const fse = require("fs-extra");
const { join, dirname } = require("path");
const { format } = require('date-fns');
const { sk } = require('date-fns/locale');
const generateDoc = require("./document-exam");

const currentDateTime = format(new Date(), "yyyy-MM-dd_hh-mm-ss");

async function getTypesArray(dir) {
  let typesArr = null;

  try {
    const fileList = await fse.readdir(dir);
    typesArr = fileList.filter(f => f.includes(".tex"));
  } catch (err) {
    throw new Error(`Seems like directory ${dir} doesn't exist.`);
  }

  return typesArr;
}

async function main(time) {
  // Use proper project folder when run as an executable or as nodejs script
  const projectFolder = process.pkg ? dirname(process.execPath) : __dirname;

  const [
    pr1TypesArr,
    pr2TypesArr,
    pr3TypesArr,
    pr4TypesArr,
    pr5TypesArr,
    pr6TypesArr,
    pr7TypesArr,
    pr8TypesArr,
    pr9TypesArr,
  ] = await Promise.all([
    await getTypesArray(join(projectFolder, "sources/pr1")),
    await getTypesArray(join(projectFolder, "sources/pr2")),
    await getTypesArray(join(projectFolder, "sources/pr3")),
    await getTypesArray(join(projectFolder, "sources/pr4")),
    await getTypesArray(join(projectFolder, "sources/pr5")),
    await getTypesArray(join(projectFolder, "sources/pr6")),
    await getTypesArray(join(projectFolder, "sources/pr7")),
    await getTypesArray(join(projectFolder, "sources/pr8")),
    await getTypesArray(join(projectFolder, "sources/pr9")),
  ]);

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

    // console.log(priklady[`pr${problemIndex}`]);

    if (!type) {
      type = pr.types[Math.floor(Math.random() * pr.count)];
    }

    return fse.readFile(join(projectFolder, `sources/pr${problemIndex}/${type}`), "utf8");
  }

  function generator(currentIndex) {
    return new Promise(async (resolve, reject) => {
      const fileName = `test_ing_${currentIndex + 1}`;

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

      const texSource = await generateDoc({
        time: time && format(new Date(time), "hh:mm", { locale: sk }) || format(new Date("2020-01-15T09:00"), "hh:mm", { locale: sk }),
        date: time && format(new Date(time), "dd. MMMM", { locale: sk }) || format(new Date("2020-01-15T09:00"), "dd. MMMM", { locale: sk }),
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
        await fse.writeFile(join(projectFolder, `exams/${currentDateTime}/tex_sources/${fileName}.tex`), texSource);
      } catch (err) {
        reject(err);
        // return;
      }

      const input = await fse.createReadStream(join(projectFolder, `exams/${currentDateTime}/tex_sources/${fileName}.tex`));

      const output = await fse.createWriteStream(join(projectFolder, `exams/${currentDateTime}/${fileName}.pdf`));

      const options = {
        inputs: join(projectFolder, "."),
      };

      const pdf = latex(input, options);

      pdf.pipe(output);
      pdf.on("error", err => {
        reject(err);
      });
      pdf.on("finish", () => {
        resolve(`Exam ${fileName}.pdf was generated.`);
      });
    });
  }

  function generateExams() {
    if (!fs.existsSync("exams")) {
      fs.mkdirSync("exams");
    }

    fs.mkdirSync(`exams/${currentDateTime}`);
    fs.mkdirSync(`exams/${currentDateTime}/tex_sources`);

    let doStuff = function* doStuff(fn) {
      let i = 0;
      do {
        yield fn(i).then(res => {
          return res;
        });
        ++i;
      } while (i < maxCount);
    };

    Promise.all(doStuff(generator))
      .then(data => console.log("Log:", data, passType))
      .catch(err => console.log(err));
  }

  generateExams();
}

module.exports = main

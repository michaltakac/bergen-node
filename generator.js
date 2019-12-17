const latex = require("node-latex");
const fs = require("fs");
const fse = require("fs-extra");
const { join } = require("path");

const generateDoc = require("./document");
const date = `05. január 2020`;
const time = `9:00`;

async function generator() {
  if (!fs.existsSync("skusky")) {
    fs.mkdirSync("skusky");
  }

  const pr1 = await fse.readFile(
    join(__dirname, "exam_sources/pr1/1_termin_9_00.tex"),
    "utf8"
  );

  const pr2 = await fse.readFile(
    join(__dirname, "exam_sources/pr2/1_termin_9_00.tex"),
    "utf8"
  );

  const texSource = await generateDoc({
    date,
    time,
    pr1,
    pr2,
    pr3: "Test prikladu 3",
    pr4: "Test prikladu 4",
    pr5: "Test prikladu 5",
    pr6: "Test prikladu 6",
    pr7: "Test prikladu 7",
    pr8: "Test prikladu 8",
    pr9: "Test prikladu 9"
  });

  try {
    await fse.writeFile(
      join(__dirname, "exam_sources/test_ing_01.tex"),
      texSource
    );
    console.log("TeX document saved!");
  } catch (err) {
    throw err;
  }

  const input = await fse.createReadStream(
    join(__dirname, "exam_sources/test_ing_01.tex")
  );

  const output = await fse.createWriteStream(join(__dirname, "skusky/output.pdf"));

  const options = {
    inputs: join(__dirname, '.') // This will write the errors to `latexerrors.log`
  }

  const pdf = latex(input, options);

  pdf.pipe(output);
  pdf.on("error", err => {
    console.error(err);
    return;
  });
  pdf.on("finish", () => {
    console.log("Skúšky boli vygenerované do zložky `/skusky`.");
    return;
  });
}

generator()

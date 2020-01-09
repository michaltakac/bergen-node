#!/usr/bin/env node

const argv = require("minimist")(process.argv.slice(2));
const generateExams = require("./generator-exams");
const generateSeries = require("./generator-series");

if (argv.help || argv.h) {
  const help = `
Bergen - Generator for tests and series from TeX sources.
Made at FBERG TUKE by Michal Takac

Options:

  -h, --help      Show this help.
  -t, --time      Set time for exams in format: 2020-01-15T09:00
  -s, --series    Generate series instead of exams.
  `;
  console.log(help);
} else if (argv.series || argv.s) {
  generateSeries();
} else {
  if (argv.t || argv.time) {
    generateExams(argv.t || argv.time);
  } else {
    generateExams()
  }
}

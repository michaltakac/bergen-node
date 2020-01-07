#!/usr/bin/env node

const { exec } = require("child_process");
var argv = require("minimist")(process.argv.slice(2));

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
  exec(`node generator-series.js`);
} else {
  if (argv.t || argv.time) {
    exec(`npm run exams -- -t ${argv.t || argv.time}`);
  } else {
    exec(`npm run exams`);
  }
}

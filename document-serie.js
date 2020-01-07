module.exports = async vars => `
\\documentclass[12pt]{article}
\\usepackage{graphics,amssymb,amsmath}

\\usepackage[slovak]{babel}
\\usepackage[utf8]{inputenc}
\\usepackage[IL2]{fontenc}

\\usepackage{multicol}
\\usepackage{mathtools}

\\pagestyle{empty}
\\setlength\\textwidth{170mm}
\\setlength\\textheight{265mm}
\\addtolength\\oddsidemargin{-20mm}
\\addtolength\\topmargin{-20mm}
\\setlength{\\parindent}{1pt}
\\setlength{\\parskip}{10pt}
\\newcount\\pocet
\\pocet = 1
\\def\\pr{{\\bf \\the \\pocet .\\ \\global\\advance\\pocet by 1}}

\\newcommand{\\g}{ \\dots \\dots \\dots \\dots \\dots \\ }
\\newcommand{\\gu}{ \\dots \\dots \\ }
\\newcommand{\\gr}{\\dotfill \\ }

\\begin{document}

\\newenvironment{itemize*}
{\\begin{itemize}
\\setlength{\\itemsep}{0pt}
\\setlength{\\parskip}{0pt}}
{\\end{itemize}}

\\newenvironment{enumerate*}
{\\begin{enumerate}
\\setlength{\\itemsep}{0pt}
\\setlength{\\parskip}{0pt}}
{\\end{enumerate}}


\\phantom{a}

\\centerline{\\textbf{\\Large Matematika I}}
\\smallskip
\\centerline{Séria úloh ${vars.seriesNumber}}
\\vskip0.5cm

\\medskip

${vars.pr1}
${vars.pr2}
${vars.pr3}
${vars.pr4}
${vars.pr5}
${vars.pr6}
${vars.pr7}
${vars.pr8}
${vars.pr9}

\\end{document}`;

# Bergen

Generator for exams and series from TeX sources. It's used for generating math tests and series.

### Usage

Use `./bergen -h` to show help with additional information on how to use this tool.

There are two ways you can use this CLI tool:

1. Generate exams:

- This will generate exam PDFs in `exams` folder:

```
$ ./bergen
```

- If you want to set custom date and time, you can pass additional parameter `-t` or `--time`:

```
$ ./bergen -t 2020-01-20T11:00
```

It will generate exams with date and time in localized format (currently only Slovak): `20. január 11:00`.

2. Generate series of problem sets:

```
$ ./bergen -s
```

or

```
$ ./bergen --series
```

This will generate PDFs problem sets as series for students to practice. They will be stored in `series` folder.

### Extend or edit problem sources

List of all problem type and their variations are stored in `sources` folder. You can edit any of them and then regenerate PDFs. Currently there are 9 problem sets with various number of types of particular problem in each folder under `sources`. Each problem has its own folder (`pr1`, `pr2` and so on...). Inside those folders you can add, remove or edit TeX sources of problem types.

File naming convention to follow when adding new items:

```
typ_[number].tex
```

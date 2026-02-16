The New Hackfoldr
============

Organize gdoc and hackpad documents for project.

### Why?

We need a way to organize many dynamic documents for every projects.

The shared folder feature in Google Docs comes very close to what we want, but as every document is opened in edit mode, it soon becomes unusable.  It is also impossible to sort the items and we had to use numeric prefix to achieve that.

Hackpad collections are great too, but we also want to include spreadsheets as one of the item types.

So we build this small single-page static web application, that reads a list of url from an EtherCalc spreadsheet, rendering it in a way similar to a google docs folder.  If the document supports read-only mode, we use that by default when it is opened by the user, and provide an additional edit link.


### Supported document types

* Google Docs
* Google Spreadsheets
* Google Prensetation
* Google Drawing
* Hackpad
* EtherCalc
* Links


## Sample folder

http://folder.moztw.org/hackfolder_template


# Hosting your own Hackfoldr
[Please follow the toturial](https://github.com/hackfoldr/hackfoldr-2.0-forkme/blob/master/docs/Hosting%20your%20own%20Hackfoldr%202.0.md) to set up your own hackfoldr 2.0 instance


# Development

[![devDependency Status](https://david-dm.org/hackfoldr/hackfoldr-2.0-forkme/dev-status.svg?style=flat-square)](https://david-dm.org/hackfoldr/hackfoldr-2.0-forkme#info=devDependencies)

* development on master branch
* <del>deploy on gh-pages branch (It would auto deploy via travis-ci. You only commit on master branch and push.)</del>
^^^ temporary broken ^^^


### Developing with Gulp.js

* pre-dev:
    * install: [node](http://nodejs.org/)
    * `npm i`
* devlopment:
    * `npm start`
    * open `http://localhost:3000/` to see the result. You can use `http://localhost:3000/hackfolder_template` to development.


# License

## CC0 1.0 Universal

http://creativecommons.org/publicdomain/zero/1.0

To the extent possible under law, the original author [Chia-liang Kao](https://github.com/clkao) has waived all copyright and related or neighboring rights to hackfoldr.

Thanks to all contributors for [Hackfoldr](https://github.com/hackfoldr/hackfoldr/graphs/contributors) and [Hackfoldr 2.0](https://github.com/hackfoldr/hackfoldr-2.0-forkme/graphs/contributors)

This work is published from Taiwan.

## Transcript to Diary CLI

This repository now includes a small CLI utility to turn speech transcripts into a daily journal in Chinese.

### Features

* First-person narrative diary text
* 24-hour timeline extraction (e.g. `08:30`, `19:45`)
* Body-condition summary (sleep, food, discomfort, energy, stress)
* Daily keyword frequency analysis

### Usage

```bash
node tools/transcript_to_diary.js <input.txt> [output.md] [YYYY-MM-DD]
```

Example:

```bash
node tools/transcript_to_diary.js transcript.txt diary.md 2026-02-16
```

Or via npm script:

```bash
npm run transcript:diary -- transcript.txt diary.md 2026-02-16
```

### One-click run

If your transcript file is named `transcript.txt` in project root:

```bash
./run-diary.sh
```

This will output `diary-YYYY-MM-DD.md` automatically.

You can also pass custom paths:

```bash
./run-diary.sh transcript.txt diary.md 2026-02-16
```

Or use npm shortcut:

```bash
npm run transcript:quick -- transcript.txt diary.md 2026-02-16
```


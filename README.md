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


## 在本地端測試 simple-site.html

你截圖裡的 `404 File not found`，通常代表「伺服器啟動的資料夾」不是 `simple-site.html` 所在位置。

### Windows PowerShell（建議照這個順序執行）

1. 先切到專案根目錄（有 `simple-site.html` 的那層）：

```powershell
cd "D:\使用者\下載\hackfoldr-2.0-forkme-master\hackfoldr-2.0-forkme-master"
```

2. 確認目前路徑與檔案存在：

```powershell
Get-Location
dir simple-site.html
```

如果這一步出現你貼的錯誤（`PathNotFound` / 找不到 `simple-site.html`），通常是以下其中一種：

- 你目前所在資料夾不是專案根目錄（常見是多一層 `hackfoldr-2.0-forkme-master (1)`）。
- 你下載的是舊版 zip，當時還沒有 `simple-site.html`。

可以依序執行：

```powershell
# 先看目前資料夾有哪些檔案
dir

# 找出哪一層才有 simple-site.html
cd .\hackfoldr-2.0-forkme-master
dir simple-site.html
```

如果仍找不到，請更新到最新版本後再試：

```powershell
git pull
dir simple-site.html
```

> 若你是直接下載 zip（沒有 git），請重新下載最新專案，或自行建立 `simple-site.html` 後再啟動伺服器。

3. 啟動本地伺服器（你原本用的 4175 可以）：

```powershell
python3 -m http.server 4175
```

4. 在瀏覽器開啟：

```
http://localhost:4175/simple-site.html
```

---

### 如果還是 404，請照下面排查

1. 先開 `http://localhost:4175/` 看目錄清單。  
   - 如果看不到 `simple-site.html`，表示你不在正確資料夾。

2. 直接指定服務目錄（最穩）：

```powershell
python3 -m http.server 4175 --directory "D:\使用者\下載\hackfoldr-2.0-forkme-master\hackfoldr-2.0-forkme-master"
```

3. 再次開啟：

```
http://localhost:4175/simple-site.html
```

4. `GET /favicon.ico 404` 可忽略。  
   這只是瀏覽器自動找網站圖示，不影響頁面本體。

---

### macOS / Linux 參考

```bash
cd /path/to/hackfoldr-2.0-forkme
python3 -m http.server 4175
# open http://localhost:4175/simple-site.html
```

> 小提醒：如果埠號被占用，改用 8080：`python3 -m http.server 8080`，網址改成 `http://localhost:8080/simple-site.html`。

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

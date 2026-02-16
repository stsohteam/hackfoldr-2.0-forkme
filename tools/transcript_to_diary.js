#!/usr/bin/env node
/*
 * 語音逐字稿 -> 日記整理工具
 * 功能：第一人稱日記、24 小時時間軸、身體狀況、關鍵字分析
 */

var fs = require('fs');
var path = require('path');

function usage() {
  console.log('用法: node tools/transcript_to_diary.js <input.txt> [output.md] [YYYY-MM-DD]');
  console.log('範例: node tools/transcript_to_diary.js transcript.txt diary.md 2026-02-16');
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}

function formatDate(inputDate) {
  if (inputDate && /^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
    return inputDate;
  }
  var now = new Date();
  var y = now.getFullYear();
  var m = ('0' + (now.getMonth() + 1)).slice(-2);
  var d = ('0' + now.getDate()).slice(-2);
  return y + '-' + m + '-' + d;
}

function normalizeSentence(text) {
  var t = text;
  t = t.replace(/\s+/g, ' ').trim();
  t = t.replace(/\b(嗯+|呃+|啊+|就是|然後|那個)\b/g, '');
  t = t.replace(/\s+/g, ' ').trim();

  // 輕量第一人稱修整（避免過度改寫）
  t = t.replace(/(?:你|妳)今天/g, '我今天');
  t = t.replace(/(?:你|妳)現在/g, '我現在');
  t = t.replace(/(?:你|妳)剛剛/g, '我剛剛');
  t = t.replace(/(?:你|妳)要/g, '我要');

  return t;
}

function detectTime(text) {
  var m = text.match(/(?:^|\s|\[|\()([01]?\d|2[0-3])[:：](\d{2})(?::(\d{2}))?(?:\]|\)|\s|$)/);
  if (!m) {
    return null;
  }
  var hh = ('0' + parseInt(m[1], 10)).slice(-2);
  var mm = m[2];
  return hh + ':' + mm;
}

function splitSentences(text) {
  var raw = text
    .replace(/\n+/g, '\n')
    .split(/\n|(?<=[。！？!?；;])/)
    .map(function(s) { return s.trim(); })
    .filter(Boolean);

  return raw;
}

function buildTimeline(sentences) {
  var timeline = [];
  var currentTime = null;

  sentences.forEach(function(sentence) {
    var normalized = normalizeSentence(sentence);
    if (!normalized) {
      return;
    }

    var time = detectTime(normalized);
    if (time) {
      currentTime = time;
      normalized = normalized.replace(/(?:^|\s|\[|\()([01]?\d|2[0-3])[:：](\d{2})(?::(\d{2}))?(?:\]|\)|\s|$)/g, ' ').replace(/\s+/g, ' ').trim();
    }

    if (!normalized) {
      return;
    }

    timeline.push({
      time: currentTime || '未標註時間',
      text: normalized.replace(/[。！？!?；;，,]+$/g, '')
    });
  });

  return timeline;
}

function collectHealthSummary(text) {
  var categories = {
    '睡眠': ['睡', '失眠', '醒來', '作夢', '午睡', '疲倦'],
    '飲食': ['吃', '早餐', '午餐', '晚餐', '喝水', '咖啡', '餓', '食慾'],
    '疼痛/不適': ['痛', '頭暈', '咳', '發燒', '不舒服', '痠', '過敏', '腸胃'],
    '體力': ['累', '精神', '體力', '沒力', '恢復', '虛弱'],
    '情緒壓力': ['焦慮', '緊張', '煩', '壓力', '沮喪', '開心', '放鬆']
  };

  var lines = [];
  Object.keys(categories).forEach(function(cat) {
    var hit = [];
    categories[cat].forEach(function(kw) {
      if (text.indexOf(kw) >= 0) {
        hit.push(kw);
      }
    });
    if (hit.length) {
      lines.push(cat + '：提及 ' + hit.join('、'));
    }
  });

  if (!lines.length) {
    lines.push('未偵測到明確的身體狀況描述，建議補充睡眠、飲食與精力狀態。');
  }

  return lines;
}

function extractKeywords(text, limit) {
  var keywordPool = [
    '工作', '會議', '學習', '專案', '進度', '溝通', '家人', '朋友', '運動', '散步',
    '睡眠', '早餐', '午餐', '晚餐', '咖啡', '情緒', '焦慮', '壓力', '放鬆', '開心',
    '疲倦', '精神', '健康', '身體', '疼痛', '腸胃', '頭痛', '感冒', '休息', '效率'
  ];

  var freq = {};
  keywordPool.forEach(function(k) {
    var m = text.match(new RegExp(k, 'g'));
    if (m && m.length) {
      freq[k] = m.length;
    }
  });

  var result = Object.keys(freq)
    .sort(function(a, b) { return freq[b] - freq[a]; })
    .slice(0, limit || 10)
    .map(function(k) { return { keyword: k, count: freq[k] }; });

  if (result.length) {
    return result;
  }

  // fallback：若無命中詞庫，改採短詞頻率
  var words = text.match(/[一-龥]{2,6}/g) || [];
  var stopwords = { '今天':1, '然後':1, '就是':1, '所以':1, '因為':1, '我們':1, '你們':1, '自己':1, '這個':1, '那個':1 };
  words.forEach(function(w) {
    if (stopwords[w]) return;
    freq[w] = (freq[w] || 0) + 1;
  });

  return Object.keys(freq)
    .sort(function(a, b) { return freq[b] - freq[a]; })
    .slice(0, limit || 10)
    .map(function(k) { return { keyword: k, count: freq[k] }; });
}

function generateDiary(date, timeline, healthLines, keywords) {
  var intro = '今天是 ' + date + '。我回顧這一天，依照時間順序記錄自己的行動與感受。';

  var grouped = {};
  timeline.forEach(function(item) {
    if (!grouped[item.time]) {
      grouped[item.time] = [];
    }
    grouped[item.time].push(item.text);
  });

  var timeKeys = Object.keys(grouped).sort(function(a, b) {
    if (a === '未標註時間') return 1;
    if (b === '未標註時間') return -1;
    return a > b ? 1 : -1;
  });

  var body = [];
  timeKeys.forEach(function(t) {
    var paragraph = grouped[t].join('，').replace(/[。！？!?]+$/g, '');
    body.push('在 ' + t + '，' + paragraph + '。');
  });

  var keywordText = keywords.length
    ? keywords.map(function(k) { return k.keyword + '（' + k.count + '）'; }).join('、')
    : '（樣本太少，尚無可分析關鍵字）';

  var healthText = healthLines.map(function(line) { return '- ' + line; }).join('\n');

  return [
    '# ' + date + ' 日記',
    '',
    '## 今日日記（第一人稱）',
    intro,
    '',
    body.join('\n\n'),
    '',
    '## 身體狀況',
    healthText,
    '',
    '## 當日關鍵字分析',
    '- 關鍵字：' + keywordText,
    '- 解讀：關鍵字反映我今天最常關注的議題與情緒焦點，可作為後續回顧與行動調整依據。',
    ''
  ].join('\n');
}

function main() {
  var input = process.argv[2];
  var output = process.argv[3];
  var dateArg = process.argv[4];

  if (!input) {
    usage();
    process.exit(1);
  }

  var inputPath = path.resolve(process.cwd(), input);
  if (!fs.existsSync(inputPath)) {
    console.error('找不到輸入檔案: ' + inputPath);
    process.exit(1);
  }

  var text = readFile(inputPath);
  var sentences = splitSentences(text);
  var timeline = buildTimeline(sentences);
  var date = formatDate(dateArg);
  var health = collectHealthSummary(text);
  var keywords = extractKeywords(text, 12);

  var result = generateDiary(date, timeline, health, keywords);

  if (output) {
    var outputPath = path.resolve(process.cwd(), output);
    fs.writeFileSync(outputPath, result, 'utf8');
    console.log('已輸出日記：' + outputPath);
  } else {
    console.log(result);
  }
}

main();

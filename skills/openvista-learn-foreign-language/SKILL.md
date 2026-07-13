---
name: openvista-learn-foreign-language
description: 帮助用户学习外语（俄语、西班牙语、法语、德语等）的 Skill。基于 lesson-based 交互式学习模式，Agent 自动部署本地 TTS/STT 服务，实现语音跟读和即时纠错。当用户说"我想学俄语"、"教我学法语"、"学外语"、"学德语"、"language learning"或任何表达学习外语意图的时候，触发此 Skill。注意：外语类型由用户指定，俄语是最常见的示例但不是唯一支持的语言。
---

# openvista-learn-foreign-language

帮助用户通过 AI Agent 高效学习外语的 Skill。基于 lesson-based HTML 交互式学习模式，支持语音跟读和即时纠错，遵循二八原则聚焦核心技能。

## 核心能力

1. **TTS/STT 自部署**：Agent 自动在本地部署 Whisper.cpp（STT）和 Coqui TTS/Bark（TTS）服务
2. **Lesson-based 学习**：生成自包含的 HTML lesson 文件，交互式学习
3. **学习工作区管理**：维护 MISSION.md、GLOSSARY.md、learning-records/ 等
4. **进度追踪**：SM-2 间隔重复算法、里程碑提醒、成就系统

## 用户工作区

工作区位于 `~/.openvista/learning/`（用户家目录下）：

```
~/.openvista/learning/
├── MISSION.md              # 学习使命（Why、Success、Constraints）
├── GLOSSARY.md             # 术语表
├── RESOURCES.md            # 学习资源列表
├── NOTES.md                # 用户偏好笔记
├── progress.yaml           # 学习进度快照
├── schedule.yaml           # 本周/今日计划
├── review-queue.yaml       # SM-2 复习队列
├── streaks.yaml            # 连续学习天数、成就徽章
├── lessons/                # lesson 文件（Agent 生成）
│   ├── 0001-*.html
│   └── 0002-*.html
├── reference/              # 参考资料
│   └── *.md
└── learning-records/       # 学习记录
    └── 0001-*.md
```

## 初始化流程

当用户首次说"我想学俄语"（或任意外语）时，按以下步骤初始化：

### Step 1: 确认学习语言

用固定开场白打招呼：

> "你好！我是你的外语学习助手。我支持学习俄语、西班牙语、法语、德语、日语、韩语等多种语言。你想学习哪一种？"

等待用户回复，确认目标语言。

### Step 2: 询问学习目标和时间

> "很好！你计划什么时候开始学习？想学多久？每天什么时间段有空？比如：'每天晚上8点到9点，学习3个月'。"

记录用户的回答到 NOTES.md。

### Step 3: 评估当前水平

> "你现在 [语言] 水平如何？零基础、入门、还是有一定基础？"

等待用户回复（zero/入门/进阶）。

### Step 4: 生成 MISSION.md

基于用户的回答，在 `~/.openvista/learning/MISSION.md` 生成：

```markdown
# Mission: [语言] 学习

## Why
{1-3句话：用户为什么想学这门语言？学成后生活会有什么改变？}

## Success looks like
- {具体可观察的学习成果}
- {另一个具体成果}

## Constraints
- 时间：{每周投入时间}
- 目标：{学习多久达到什么水平}

## Out of scope
- {用户明确不想追求的相邻主题}
```

### Step 5: 生成第一周学习计划

基于用户的时间和目标水平，生成 schedule.yaml 和第一课 lesson。

## TTS/STT 部署流程

如果本地 TTS/STT 服务未运行，Agent 自动执行以下步骤：

### STT 部署（Whisper.cpp）

```bash
# 1. 检测是否已安装
which whisper-cli || echo "需要安装"

# 2. 克隆 whisper.cpp（如未安装）
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp
mkdir build && cd build
cmake ..
make -j4 main stream

# 3. 下载语言模型（以俄语为例）
wget https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium-ru.bin -O models/ggml-medium-ru.bin

# 4. 启动 HTTP 服务
./stream -m models/ggml-medium-ru.bin --languages ru --http-port 8080
```

### TTS 部署（Coqui TTS 或 Bark）

```bash
# 方案A：Coqui TTS
pip install TTS
tts --model_name <russian_model> --download_speaker_embedding
python -m TTS.server.server --port 8081

# 方案B：Bark（更简单）
pip install bark
```

### 服务调用

```bash
# STT：录音文件识别
curl -X POST http://localhost:8080/inference -H "Content-Type: audio/wav" --data-binary @recording.wav -o text.txt

# TTS：文本转语音
curl -X POST http://localhost:8081/tts -H "Content-Type: application/json" -d '{"text":"Привет"}' -o output.wav
```

## Lesson 生成规范

每个 lesson 是一个自包含的 HTML 文件，遵循以下规范：

### 文件命名

`lessons/0001-{topic}.html`，编号递增。

### HTML 结构

```html
<!DOCTYPE html>
<html lang="[语言代码，如 ru]">
<head>
    <meta charset="UTF-8">
    <title>Lesson 0001: [标题]</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
    <h1>0001: [标题]</h1>
    <section class="content">
        <p>[学习内容]</p>
    </section>

    <section class="exercise">
        <h2>跟读练习</h2>
        <button onclick="tts_speak('要朗读的文本')">🔊 朗读</button>
        <button onclick="start_recording()">🎤 录音</button>
        <div id="feedback"></div>
    </section>

    <section class="quiz">
        <h2>小测验</h2>
        <!-- 测验内容 -->
    </section>

    <footer>
        <a href="../reference/grammar.md">📖 语法参考</a>
        <a href="0002-*.html">下一课 →</a>
    </footer>

    <script src="../assets/speech.js"></script>
</body>
</html>
```

### 设计原则

- 每个 lesson 聚焦一个紧密相关的主题
- 短小、可快速完成（5-10分钟）
- 包含 TTS 朗读、STT 录音、AI 即时反馈
- 给用户一个可积累的 tangible win
- 末尾链接到下一课和相关参考资料

## 语法纠错流程

用户提交语音或文本后，Agent 实时检测并纠错：

1. **识别错误类型**：性、数、格、时、体、动词形式等
2. **提供中文解释**：用中文解释错误原因
3. **给出正确例句**：展示正确形式
4. **记录到 learning-records/**：错误类型、正确形式、用户回答

示例：
```
用户："Я хотеть учить русский язык"
检测：动词 "хотеть" 应该用 "хотеть" 的正确变位 "хочу"
解释："хотеть" 是第二变位动词，现在时需要变位。第一人称单数是 "хочу"。
例句："Я хочу учить русский язык."
```

## 学习进度管理

### SM-2 间隔重复

每次 lesson 或复习后，更新 `review-queue.yaml`：

```yaml
queue:
  - word: "Привет"
    next_review: 2026-07-15
    interval: 1
    ease_factor: 2.5
  - word: "Спасибо"
    next_review: 2026-07-20
    interval: 3
    ease_factor: 2.5
```

Agent 每次会话开始时检查 `review-queue.yaml`，优先安排过期复习任务。

### 进度面板

定期更新 `progress.yaml`：

```yaml
vocabulary_count: 150
grammar_mastery:
  cases: 0.3
  verb_aspect: 0.1
  conjugation: 0.2
cefr_level: A1
streak_days: 7
achievements:
  - first_lesson
  - week_streak
```

## 核心词汇和语法

Agent 内置以下优先级排序的学习内容（可扩展）：

### 高频场景（优先）

- 自我介绍
- 日常问候
- 兴趣爱好
- 数字和时间
- 方向和位置

### 核心语法点（按优先级）

1. 名词 6 格变化（主格外 5 格）
2. 动词体（完成体/未完成体）
3. 形容词性数格配合
4. 人称代词 6 格
5. 动词变位（现在时）

## 模板文件

### MISSION-FORMAT.md

见 `MISSION-FORMAT.md` 文件。

### GLOSSARY-FORMAT.md

见 `GLOSSARY-FORMAT.md` 文件。

### LEARNING-RECORD-FORMAT.md

见 `LEARNING-RECORD-FORMAT.md` 文件。

### RESOURCES-FORMAT.md

见 `RESOURCES-FORMAT.md` 文件。

## 注意事项

1. **用户零手动操作**：TTS/STT 部署、lesson 生成、学习计划制定全部由 Agent 自动完成
2. **遵循二八原则**：优先教高频核心内容，不追求面面俱到
3. **保护用户隐私**：所有数据存储在本地 `~/.openvista/`，不上传云端
4. **语音服务优先**：TTS/STT 是核心功能，文本对话是辅助
5. **SM-2 驱动复习**：根据间隔重复算法自动安排复习，不让用户遗忘

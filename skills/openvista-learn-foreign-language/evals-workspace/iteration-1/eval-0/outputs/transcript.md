# 模拟执行：openvista-learn-foreign-language Skill

## Eval 1: 我想学俄语，每天晚上8点到9点有空，三个月后能进行基础对话就行，我现在是零基础

### Agent 执行过程

**Step 1: 固定开场白**
> "你好！我是你的外语学习助手。我支持学习俄语、西班牙语、法语、德语、日语、韩语等多种语言。你想学习哪一种？"

用户回复："俄语"

**Step 2: 询问学习目标和时间**
> "很好！你计划什么时候开始学习？想学多久？每天什么时间段有空？比如：'每天晚上8点到9点，学习3个月'。"

用户回复："每天晚上8点到9点，三个月后能进行基础对话就行"

**Step 3: 评估当前水平**
> "你现在俄语水平如何？零基础、入门、还是有一定基础？"

用户回复："零基础"

**Step 4: 生成 MISSION.md**
Agent 在 `~/.openvista/learning/MISSION.md` 创建：

```markdown
# Mission: 俄语学习

## Why
想学习俄语以便与俄罗斯女性交流，最终建立跨国关系。俄语是打开俄罗斯社交圈的钥匙。

## Success looks like
- 3个月内能进行基础俄语对话（自我介绍、兴趣爱好、日常交流）
- 能在 VK 上与俄罗斯女性进行简单交流
- 掌握核心词汇1500词

## Constraints
- 时间：每天晚上8点到9点（1小时/天）
- 目标：3个月内达到 A2 水平
- 已有基础：无

## Out of scope
- 深入文学或学术俄语
- 写作技能（专注于口语和听力）
```

**Step 5: 生成 schedule.yaml**

```yaml
week_1:
  theme: "西里尔字母 + 基本问候"
  daily:
    - 复习西里尔字母（20分钟）
    - 学习基本问候语（20分钟）
    - 跟读练习（20分钟）
  lessons:
    - 0001-cyrillic-basics
    - 0002-greetings
```

**Step 6: 生成第一个 lesson HTML**

创建 `~/.openvista/learning/lessons/0001-cyrillic-basics.html`：

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Lesson 0001: 西里尔字母基础</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
    <h1>0001: 西里尔字母基础</h1>
    <p>学习俄语的第一步是掌握西里尔字母表...</p>
    
    <section class="exercise">
        <h2>跟读练习</h2>
        <button onclick="tts_speak('А а')">🔊 朗读 А</button>
        <button onclick="start_recording()">🎤 录音</button>
        <div id="feedback"></div>
    </section>
    
    <footer>
        <a href="0002-greetings.html">下一课 →</a>
    </footer>
    
    <script src="../assets/speech.js"></script>
</body>
</html>
```

### 输出文件

- MISSION.md ✓
- schedule.yaml ✓
- lessons/0001-cyrillic-basics.html ✓

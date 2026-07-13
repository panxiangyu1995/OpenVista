# 用户 Profile 格式

用户 Profile 存储在 `~/.openvista/user-profile.yaml`，用于 AI Personality Mirror 和社交策略制定。

## 模板

```yaml
name: "用户名字或昵称"
age: 28
occupation: "职业"
background: |
  背景简介。可以是多行文本。
  包括学历、工作经历、文化背景等。

interests:
  - "兴趣1"
  - "兴趣2"
  - "兴趣3"

personality: |
  性格特点描述。
  包括沟通风格（直接/含蓄/幽默）、
  内向/外向、冒险/保守等。

looking_for: |
  想找的伴侣类型描述。
  包括年龄范围、性格偏好、价值观等。

relationship_goals: |
  感情目标。
  例如：一年内结婚、认真交往、不着急等。

communication_style: |
  沟通风格描述。
  例如：直接但有礼貌、喜欢幽默、可能会害羞等。

cultural_awareness: |
  对俄罗斯文化的了解程度。
  例如：完全不了解、看过一些俄罗斯电影、读过一些书等。

languages:
  native: "中文"
  learning: "俄语"
  level: "A1"  # 当前俄语水平

dealbreakers:
  - "不能接受酗酒的人"
  - "必须有共同兴趣"
  # ...
```

## 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| name | 是 | 用户名字或昵称 |
| age | 是 | 年龄 |
| occupation | 是 | 职业 |
| background | 是 | 背景简介 |
| interests | 是 | 兴趣爱好列表 |
| personality | 是 | 性格特点 |
| looking_for | 是 | 想找的伴侣类型 |
| relationship_goals | 是 | 感情目标 |
| communication_style | 是 | 沟通风格 |
| cultural_awareness | 否 | 文化了解程度，默认"有限" |
| languages | 是 | 语言能力 |
| dealbreakers | 否 | 绝对不能接受的条件 |

## 收集流程

Agent 通过对话引导用户输入：

1. **基本信息**："你叫什么名字？做什么工作？"
2. **兴趣爱好**："你平时有什么爱好？喜欢什么类型的活动？"
3. **性格特点**："你会怎么形容自己的性格？在社交场合你通常是什么样的人？"
4. **择偶标准**："你想找什么样的伴侣？有什么是绝对不能接受的？"
5. **感情目标**："你对感情的态度是什么？是想认真找结婚对象，还是先从朋友开始？"
6. **沟通风格**："你在和陌生人交流时，通常是什么样的风格？"

## 使用场景

- **AI Personality Mirror**：读取 personality 和 communication_style 来模拟用户的说话风格
- **消息生成**：参考 looking_for 和 interests 来生成个性化开场白
- **筛选目标**：对比用户偏好和女性档案，排除不匹配者

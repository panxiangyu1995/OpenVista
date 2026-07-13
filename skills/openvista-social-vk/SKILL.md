---
name: openvista-social-vk
description: 辅助用户在 VK（俄罗斯社交平台）上进行社交的 Skill。全流程支持：注册引导、用户Profile建立、AI Personality Mirror模拟练习、playwright-cli浏览器自动化、社交对象筛选、消息模板生成、女性用户档案管理。当用户说"帮我注册VK"、"VK社交"、"在VK上认识俄罗斯女生"、"社交模拟练习"、"帮我发VK消息"或任何与VK社交相关的需求时，触发此Skill。
---

# openvista-social-vk

辅助用户在 VK 上进行社交的 Skill。整合了注册引导、用户Profile、AI Mirror、浏览器自动化、档案管理的全流程能力。

## 核心能力

1. **VK 全流程注册引导**：分步引导完成注册、头像优化、资料设置
2. **用户 Profile 建立**：通过对话收集用户背景、性格、社交目标
3. **AI Personality Mirror**：社交前模拟练习，确保真实表达
4. **playwright-cli 自动化**：浏览器操作自动化（浏览、发消息）
5. **社交对象筛选**：基于偏好自动筛选高价值目标
6. **女性用户档案管理**：每人一档，聊天记录存档

## 用户工作区

工作区位于 `~/.openvista/`：

```
~/.openvista/
├── user-profile.yaml          # 用户 Profile（学习 Skill 生成，社交 Skill 读取）
├── learning/                   # 学习数据（openvista-learn-foreign-language 使用）
└── social/
    └── profiles/              # 女性用户档案
        └── {vk_id}/
            ├── profile.md     # 人物描述文档
            ├── chat-history.md # 聊天记录
            └── metadata.yaml  # 元数据
```

## 初始化流程

当用户首次使用 VK 社交功能时：

### Step 1: 检测是否已有 user-profile.yaml

```bash
ls ~/.openvista/user-profile.yaml
```

如果不存在，引导用户建立 Profile。

### Step 2: 建立用户 Profile（如需要）

> "在我帮你开始在 VK 上社交之前，我需要了解一些关于你的信息，这样我能更好地帮助你练习和交流。你从事什么工作？有什么兴趣爱好？你想找什么样的伴侣？"

收集以下信息并写入 `~/.openvista/user-profile.yaml`：

```yaml
name: {用户的名字或昵称}
age: {年龄}
occupation: {职业}
background: {背景简介}
interests: [{兴趣1}, {兴趣2}]
personality: {性格特点描述}
looking_for: {想找的伴侣类型}
relationship_goals: {感情目标}
communication_style: {沟通风格（直接/含蓄/幽默等）}
```

### Step 3: VK 注册引导

如果用户还没有 VK 账号：

> "好的，现在让我们来设置 VK 账号。VK 是俄罗斯最流行的社交平台，你需要先注册一个账号。"

引导步骤：
1. 访问 vk.com
2. 点击"注册"（Sign Up）
3. 输入手机号（需要能接收短信，建议使用虚拟号服务）
4. 验证完成后，设置头像（建议真实照片+微笑）和简介

### Step 4: 介绍 AI Personality Mirror

> "在你正式开始和俄罗斯女性交流之前，我建议我们先做一个模拟练习。我会扮演俄罗斯女性的性格和说话风格，你来练习开场白和对话。这样可以确保你表达的是真实的自己，而不是机械的模板。"

## AI Personality Mirror

### 目的

在用户正式社交前，用 AI 模拟用户的真实性格和说话方式进行练习，确保：
1. 用户表达的是真实自我
2. 用户熟悉俄语表达和文化差异
3. 用户对即将到来的社交有信心

### 工作流程

1. **读取用户 Profile**：`~/.openvista/user-profile.yaml`
2. **了解目标女性**（如果有）：读取 `~/.openvista/social/profiles/{vk_id}/profile.md`
3. **生成模拟对话**：AI 扮演目标女性（或典型俄罗斯女性），与用户进行 5-10 分钟对话
4. **对话后反馈**：指出用户的表达是否自然、是否有文化差异问题、俄语表达是否正确

### 模拟对话示例

```
Agent（扮演 Katya，28岁，莫斯科，喜欢音乐）:
"Привет! Ты кто? Откуда ты?"

用户（练习自我介绍）:
"Привет! Меня зовут Alex. Я из Китая. Я программист."

Agent（反馈）:
"很好！你的自我介绍很清晰。几个建议：
1. 'Ты кто?' 比较直接，更礼貌的说法是 'Ты как тебя зовут?'
2. 可以加上 'Приятно познакомиться!'（很高兴认识你）
3. 你的俄语发音不错，继续练习！"
```

## playwright-cli 浏览器自动化

### 基本命令

```bash
# 打开 VK 并保持登录状态
playwright-cli open https://vk.com --persistent --profile=~/.openvista/vk-profile

# 导航到目标用户主页
playwright-cli goto https://vk.com/id{vk_id}

# 截图确认
playwright-cli screenshot

# 点击"发消息"按钮
playwright-cli click e15  # element ref 需要从快照获取

# 输入消息
playwright-cli type "Привет! Как дела?"

# 发送
playwright-cli click e22
```

### 完整社交流程

1. **发现目标用户**
   ```bash
   playwright-cli goto https://vk.com/search
   playwright-cli snapshot
   # 根据条件筛选（年龄、地区、在线状态）
   ```

2. **发送第一条消息**
   ```bash
   playwright-cli goto https://vk.com/id{vk_id}
   playwright-cli snapshot
   playwright-cli click e15  # 发消息按钮
   playwright-cli type "Привет! Я изучаю русский язык. Приятно познакомиться!"
   playwright-cli click e22  # 发送按钮
   ```

3. **保存聊天记录**
   - 自动保存到 `~/.openvista/social/profiles/{vk_id}/chat-history.md`

### 操作规范

- 单次操作间隔 3-10 秒，模拟人类操作节奏
- 每日发送消息不超过 10 条，避免触发反垃圾
- 所有操作记录日志，用户可随时暂停/终止

## 女性用户档案管理

### 档案结构

每个社交对象单独建档：

```
~/.openvista/social/profiles/{vk_id}/
├── profile.md        # 人物描述文档
├── chat-history.md   # 聊天记录
└── metadata.yaml     # 元数据
```

### metadata.yaml 格式

```yaml
vk_id: "123456789"
name: "Катя"
age: 28
city: "Москва"
source: "search"  # 如何发现：search/group/recommendation
first_contact: "2026-07-13"
last_contact: "2026-07-13"
status: "active"  # active/waiting/closed
interest_tags: ["музыка", "путешествия"]
notes: "在莫斯科工作，喜欢古典音乐"
```

### profile.md 格式

```markdown
# Катя

## 基本信息
- 年龄：28岁
- 城市：莫斯科
- 职业：[待补充]

## 性格特点
[AI 在对话后自动总结]

## 聊天风格
[AI 在对话后自动总结]

## 兴趣爱好
- 音乐（古典音乐、钢琴）
- 旅行

## 文化注意事项
[AI 在对话后自动总结]

## 对话历史摘要
[关键对话要点]
```

### chat-history.md 格式

```markdown
# 与 Катя 的对话记录

## 2026-07-13 第一次接触
**我**: Привет! Я изучаю русский язык. Приятно познакомиться!
**Катя**: Привет! Ты откуда? Из Китая?
**我**: Да, я из Шанхая. Я программист.
**Катя**: О, интересно! Ты давно учишь русский?

[完整对话记录]
```

## 社交消息模板

### 开场白模板

```yaml
templates:
  - name: "礼貌问候"
    text: "Привет! Я изучаю русский язык. Приятно познакомиться!"
    usage: "首次接触，通用"

  - name: "共同兴趣"
    text: "Привет! Видел(а), что ты любишь музыку. Я тоже! Какую музыку ты предпочитаешь?"
    usage: "有共同兴趣时"

  - name: "赞美开场"
    text: "Привет! У тебя красивые фотографии! Ты из Москвы?"
    usage: "女性照片质量高时"
```

### 后续跟进模板

```yaml
follow_up:
  - name: "3天后跟进"
    text: "Привет! Как дела? Не хочешь поболтать?"
    delay_days: 3

  - name: "一周后跟进"
    text: "Привет! Как прошла неделя? Что нового?"
    delay_days: 7
```

## 社交对象筛选

### 筛选条件

- 年龄范围：用户偏好设置
- 地区：城市/地区偏好
- 在线活跃度：最近 24 小时在线优先
- Profile 完整度：有照片、自我介绍者优先
- 共同兴趣标签：有交集者优先

### 优先级评分

```yaml
scoring:
  profile_complete: +20
  online_recently: +15
  shared_interests: +25
  mutual_language: +15
  no_red_flags: +25
```

## 伦理边界

1. **真实表达**：AI Personality Mirror 确保用户练习的是真实自我，不是机械模板
2. **尊重对方**：不发送垃圾消息，不骚扰，不欺骗
3. **隐私保护**：所有数据本地存储，不上传云端
4. **透明可控**：用户可随时暂停/终止任何自动化操作

## 模板文件

### USER-PROFILE-FORMAT.md

见 `USER-PROFILE-FORMAT.md` 文件。

### PROFILE-FORMAT.md

见 `PROFILE-FORMAT.md` 文件。

### MESSAGE-TEMPLATES.md

见 `MESSAGE-TEMPLATES.md` 文件。

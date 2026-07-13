---
name: openvista-social-telegram
description: 辅助用户在 Telegram 上进行社交的 Skill。全流程支持：注册引导、用户Profile建立（复用VK的profile）、AI Personality Mirror模拟练习（复用VK的模拟逻辑）、playwright-cli浏览器自动化（用于Telegram web版本）、群组发现与加入、消息发送、女性用户档案管理。当用户说"帮我设置Telegram"、"Telegram社交"、"加入俄语群组"、"Telegram消息"、"社交模拟练习"或任何与Telegram社交相关的需求时，触发此Skill。
---

# openvista-social-telegram

辅助用户在 Telegram 上进行社交的 Skill。Telegram 是俄罗斯和独联体国家最流行的即时通讯应用之一，相比 VK 更侧重于群组和频道社交。

## 与 VK Skill 的关系

此 Skill 与 `openvista-social-vk` 高度相似，共享：
- 同一套用户 Profile（`~/.openvista/user-profile.yaml`）
- 同一套女性档案系统（`~/.openvista/social/profiles/`）
- 同一套 AI Personality Mirror 模拟逻辑
- 同一套消息模板

主要区别：
- Telegram 更侧重群组社交（发现潜在联系人更容易）
- Telegram 有官方 Bot API，支持更稳定的自动化
- Telegram web 版本需要浏览器自动化

## 核心能力

1. **Telegram 全流程注册引导**：下载、安装、注册、设置
2. **用户 Profile 复用**：读取已有的 `~/.openvista/user-profile.yaml`
3. **AI Personality Mirror**：复用 VK Skill 的模拟逻辑
4. **playwright-cli 自动化**：用于 Telegram web 版本操作
5. **群组发现与加入**：推荐高质量俄语群组
6. **女性用户档案管理**：复用 VK Skill 的档案系统

## 用户工作区

```
~/.openvista/
├── user-profile.yaml              # 用户 Profile（复用）
├── learning/                       # 学习数据
└── social/
    └── profiles/                  # 女性用户档案（复用）
        └── {telegram_handle}/
            ├── profile.md
            ├── chat-history.md
            └── metadata.yaml
```

## 初始化流程

### Step 1: 检测用户是否已有 Telegram

> "你有 Telegram 账号吗？如果没有，我来帮你下载和注册。"

### Step 2: 没有账号则引导注册

Telegram 注册流程：
1. 下载 Telegram（iOS/Android/Desktop）
2. 使用手机号注册（需要接收短信，建议使用虚拟号）
3. 设置头像和简介

### Step 3: 读取用户 Profile

```bash
cat ~/.openvista/user-profile.yaml
```

如果不存在，引导用户先完成 Profile 建立（参见 `openvista-social-vk`）。

### Step 4: 推荐加入的群组

> "根据你的兴趣（音乐、健身、旅行），我推荐以下俄语群组..."

推荐的群组类型：
- **语言交换群**：中文-俄语学习群
- **兴趣群**：特定兴趣的俄语群组
- ** expatriate 群**：在华俄罗斯人或在俄中国人的群组
- **同城群**：莫斯科、圣彼得堡等城市的社交群

## playwright-cli 浏览器自动化

用于 Telegram Web 版本操作。

### 打开 Telegram Web

```bash
# 打开 Telegram Web
playwright-cli open https://web.telegram.org --persistent --profile=~/.openvista/profiles/telegram-web

# 或使用已有的登录状态
playwright-cli open https://web.telegram.org/k/ --persistent --profile=~/.openvista/profiles/telegram-web
```

### 导航到用户对话

```bash
# 搜索用户
playwright-cli goto https://web.telegram.org/k/#/im?p=u{user_id}

# 获取快照
playwright-cli snapshot

# 点击消息输入框
playwright-cli click e15

# 输入消息
playwright-cli type "Привет! Как дела?"

# 发送
playwright-cli press Enter
```

### 加入群组

```bash
# 打开群组链接
playwright-cli goto https://t.me/{group_link}

# 获取快照
playwright-cli snapshot

# 点击"加入"按钮
playwright-cli click e20

# 确认加入
playwright-cli snapshot
```

## 群组发现

### 推荐群组类型

| 类型 | 示例 | 用途 |
|------|------|------|
| 语言交换 | "Chinese-Russian Language Exchange" | 学习俄语、认识正在学中文的俄罗斯人 |
| 兴趣群 | "Moscow Music Lovers" | 基于共同兴趣建立联系 |
| expatriate | "Russians in Shanghai" | 在华俄罗斯人，可能对中国文化感兴趣 |
| 城市群 | "Moscow Social Club" | 同城社交，更容易见面 |

### 寻找群组的方法

1. **搜索关键词**：
   - "中文学习俄语" / "изучаю китайский"
   - "莫斯科" / "Москва"
   - "俄罗斯" / "Россия"

2. **通过已有联系人推荐**：
   - 询问群组成员是否知道其他好群

3. **访问群组目录**：
   - https://t.me/ directory

## AI Personality Mirror（复用）

与 VK Skill 相同的模拟逻辑：
1. 读取用户 Profile
2. 读取目标女性档案（如有）
3. AI 扮演目标进行模拟对话
4. 对话后反馈

参见 `openvista-social-vk` 的 AI Mirror 文档。

## 女性用户档案（复用）

档案格式与 VK Skill 完全相同：
- `~/.openvista/social/profiles/{telegram_handle}/profile.md`
- `~/.openvista/social/profiles/{telegram_handle}/chat-history.md`
- `~/.openvista/social/profiles/{telegram_handle}/metadata.yaml`

## 消息模板（复用）

与 VK Skill 共用同一套消息模板：
- 开场白模板
- 后续跟进模板
- 邀约见面模板

参见 `openvista-social-vk` 的 `MESSAGE-TEMPLATES.md`。

## Telegram 特有注意事项

### 隐私设置

Telegram 隐私设置比 VK 更灵活：
- 谁可以添加我为联系人：所有人/我的联系人
- 谁可以看到我的手机号：无人/我的联系人/所有人
- 谁可以看到我的在线状态：同上

建议用户：
- 限制手机号可见性（避免被陌生人获取）
- 使用用户名而非手机号添加

### Bot 使用

Telegram Bot 是强大的工具：

**有用 Bot 推荐**：
- `@LanguageExchangeBot` — 语言交换配对
- `@QuizBot` — 知识问答游戏（破冰好工具）
- `@VoteBot` — 投票工具（了解群组成员兴趣）

**创建自己的 Bot**：
用户可以创建自己的 Bot 用于：
- 自动欢迎新成员
- 发起话题讨论
- 管理群组

### Telegram vs VK 对比

| 维度 | Telegram | VK |
|------|----------|-----|
| 平台定位 | 即时通讯 | 社交网络 |
| 群组社交 | 强（20万人大群） | 中（小组功能） |
| 隐私 | 强（秘密聊天） | 弱 |
| 自动化支持 | 强（Bot API） | 中（Web UI） |
| 发现新联系人 | 通过群组 | 通过推荐 |
| 在中国可用性 | 需要VPN | 可用 |

## 安装 playwright-cli

如未安装，自动执行：

```bash
npm install -g @playwright/cli@latest
```

## 参考文档

- `reference/telegram-commands.md` — Telegram 专用命令
- `reference/telegram-vs-vk.md` — Telegram 与 VK 对比
- `openvista-playwright-cli/SKILL.md` — playwright-cli 封装

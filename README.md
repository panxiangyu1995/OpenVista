# OpenVista - 睁眼看世界

**Skill 技能包仓库**，帮助 AI Agent 辅助终端用户学习外语、在俄语区社交平台（VK、Telegram）上认识俄罗斯女性。

---

## 项目简介

OpenVista 遵循**二八原则**：聚焦 20% 核心行为，带来 80% 的学习效果和社交成果。

**核心定位**：不是代码应用，而是 **Skill 包**。终端用户通过安装这些 Skills 到自己的 AI Agent（Claude Code、Cline、OpenCode、Cursor 等）中，获得外语学习和社交辅助能力。

---

## 核心功能

### 1. openvista-learn-foreign-language（外语学习）

- **个性化学习方案**：基于用户时间安排生成量身定制的学习计划
- **Lesson-based 交互式学习**：每个 lesson 短小精悍，内嵌 TTS 语音朗读和 STT 语音输入
- **实时纠错**：语法错误（性、数、格、时、体）和发音纠错
- **进度管理**：SM-2 间隔重复算法、词汇量估算、里程碑提醒（A1/A2/B1/B2）
- **TTS/STT 自部署**：Agent 自动完成 Whisper.cpp 和 Coqui TTS 的安装配置

### 2. openvista-social-vk（VK 社交）

- **全流程注册引导**：手机号验证、基础资料填写、头像和隐私设置优化
- **用户 Profile 管理**：建立个人资料档案，用于后续社交模拟
- **AI Personality Mirror**：在真实社交前，AI 模拟目标女性的性格和说话风格进行练习
- **浏览器自动化**：使用 playwright-cli 进行访问主页、发送消息等操作
- **社交对象筛选**：基于偏好自动筛选目标，高价值目标优先标记
- **女性档案管理**：每 个社交对象单独建档，记录聊天历史和性格特点

### 3. openvista-social-telegram（Telegram 社交）

- **使用引导**：下载、安装、注册全程指导
- **群组推荐**：推荐有价值的俄语区学习小组、社交群、兴趣群
- **自动化操作**：自动加入群组、发送消息、抓取群成员

### 4. openvista-playwright-cli（内置浏览器自动化）

- **内置 Playwright CLI**：封装 playwright-cli 浏览器自动化工具，由 openvista-social-vk 和 openvista-social-telegram 引用调用
- **自动安装**：自动检测并安装 playwright-cli
- **完整命令封装**：提供完整的浏览器自动化命令，支持访问页面、点击、输入、截图等操作

---

## 安装指南

### 快速安装（推荐）

```bash
# 安装全部 skills 到全部 agent
npx skills add panxiangyu1995/OpenVista --all

# 安装到指定 agent
npx skills add panxiangyu1995/OpenVista --agent claude-code

# 只安装指定 skill
npx skills add panxiangyu1995/OpenVista --skill openvista-learn-foreign-language

# 查看可用的 skills
npx skills add panxiangyu1995/OpenVista --list
```

### 手动安装

```bash
git clone https://github.com/panxiangyu1995/OpenVista.git
# 将 skills/ 目录下的 skill 复制到你的 agent skills 目录
```

### 工作区位置

用户数据存储在 `~/.openvista/` 目录下：

```
~/.openvista/
├── user-profile.yaml          # 用户 Profile
├── learning/                 # 学习相关数据
│   ├── MISSION.md
│   ├── GLOSSARY.md
│   ├── progress.yaml
│   ├── lessons/
│   └── learning-records/
└── social/
    └── profiles/              # 社交对象档案
        └── {vk_id}/
            ├── profile.md
            ├── chat-history.md
            └── metadata.yaml
```

---

## 使用流程

### 第一步：安装 Skills

在你的 AI Agent 中安装 openvista skills。

### 第二步：开始学习

对 Agent 说"我想学习俄语"，Agent 会：

1. 用固定开场白打招呼
2. 询问学习时间安排
3. 评估你的俄语基础
4. 生成个性化的学习方案

### 第三步：每日学习

- **早晨**：收到今日任务推送
- **午间**：复习昨日错误词汇
- **晚间**：俄语对话练习 + 社交模拟

### 第四步：真实社交

1. 在 AI Mirror 中练习开场白
2. 通过 Agent 执行 playwright-cli 在 VK 上联系目标
3. 对话结束后 AI 自动总结并更新档案

---

## 项目结构

```
OpenVista/
├── skills/
│   ├── openvista-learn-foreign-language/   # 外语学习 Skill
│   │   ├── SKILL.md
│   │   ├── MISSION-FORMAT.md
│   │   ├── LEARNING-RECORD-FORMAT.md
│   │   ├── GLOSSARY-FORMAT.md
│   │   ├── RESOURCES-FORMAT.md
│   │   └── assets/
│   ├── openvista-social-vk/               # VK 社交 Skill
│   │   └── SKILL.md
│   ├── openvista-social-telegram/          # Telegram 社交 Skill
│   │   └── SKILL.md
│   └── openvista-playwright-cli/           # Playwright CLI 集成
│       └── SKILL.md
└── README.md
```

---

## 成功指标

| 指标 | 目标 |
|------|------|
| Skill 安装量 | 100+ 次 |
| 用户留存率 | 30天内 30% |
| 俄语词汇量 | 6个月内达到 1500 词 |
| 社交连接数 | 6个月内 5+ 个活跃联系 |
| 关系进展 | 12个月内稳定交往 |

---

## 技术特性

- **多 Agent 兼容**：Claude Code、Cline、OpenCode、Cursor
- **跨平台**：支持 macOS、Linux、Windows
- **离线可用**：核心功能在离线环境下可用
- **数据本地化**：所有数据存储在本地，不上传云端

---

## License

本项目采用 **MIT** 开源协议，你可以自由使用、修改、分发本项目的代码，包括用于商业目的。

---

## 联系方式与反馈

- **邮箱**：panxiangyu1995@gmail.com
- **问题反馈**：欢迎提交 [Issues](https://github.com/panxiangyu1995/OpenVista/issues)

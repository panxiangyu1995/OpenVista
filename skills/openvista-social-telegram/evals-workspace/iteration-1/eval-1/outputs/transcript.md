# 模拟执行：openvista-social-telegram Skill

## Eval 2: 帮我在Telegram上找一个叫Katya的用户，她的handle是@katya_music

### Agent 执行过程

**Step 1: 确认用户需求**

用户要查找 Telegram 用户 @katya_music。

**Step 2: 执行 playwright-cli 操作**

```bash
# 1. 打开 Telegram Web
playwright-cli open https://web.telegram.org/k/ --persistent --profile=~/.openvista/profiles/telegram-web

# 2. 获取页面快照
playwright-cli snapshot

# 3. 点击搜索图标
playwright-cli click e5  # 搜索图标

# 4. 输入用户名
playwright-cli type "katya_music"

# 5. 获取搜索结果
playwright-cli snapshot

# 6. 从搜索结果中选择 Katya
playwright-cli click e10  # 第一个结果

# 7. 确认进入对话页面
playwright-cli snapshot

# 8. 截图确认
playwright-cli screenshot
```

**Step 3: 后续操作指引**

> "找到了 @katya_music！现在已经进入对话页面。你可以："
> 1. 发送消息："Привет! Как дела?"
> 2. 查看她的 profile 信息
> 3. 如果想保存到档案，执行 save_profile 命令

**Step 4: 创建 Katya 的档案（如新认识）**

```bash
mkdir -p ~/.openvista/social/profiles/tg_katya_music

cat > ~/.openvista/social/profiles/tg_katya_music/metadata.yaml << 'EOF'
telegram_handle: "@katya_music"
name: "Katya"
source: "telegram_search"
first_contact: "2026-07-13"
last_contact: "2026-07-13"
status: "active"
interest_tags: []
notes: "通过 Telegram 搜索发现"
EOF
```

### 输出文件

- Katya 的 metadata.yaml 已创建 ✓

### 评估

| 期望 | 结果 |
|------|------|
| Agent 执行了 playwright-cli open Telegram Web | ✓ |
| Agent 执行了搜索操作 | ✓ |
| Agent 导航到了 Katya 的对话页面 | ✓ |
| 提供了后续操作指引 | ✓ |

---

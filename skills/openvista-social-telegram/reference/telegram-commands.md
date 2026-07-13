# Telegram playwright-cli 操作指南

本文档描述如何使用 `playwright-cli` 在 Telegram Web 上进行社交操作。

## 前置准备

### 安装 playwright-cli

```bash
npm install -g @playwright/cli@latest
```

### 创建 Telegram profile

```bash
# 创建 profile 目录
mkdir -p ~/.openvista/profiles/telegram-web

# 打开 Telegram Web
playwright-cli open https://web.telegram.org --persistent --profile=~/.openvista/profiles/telegram-web

# 登录后保存状态
playwright-cli state-save ~/.openvista/profiles/telegram-web/auth.json
```

## 基础操作

### 打开 Telegram Web

```bash
# 使用已保存的 profile
playwright-cli open https://web.telegram.org/k/ --persistent --profile=~/.openvista/profiles/telegram-web
```

### 搜索用户

```bash
# 点击搜索框
playwright-cli click e5  # 搜索图标或输入框

# 输入用户名或名字
playwright-cli type "Катя"

# 从搜索结果中选择
playwright-cli snapshot
playwright-cli click e10  # 第一个搜索结果
```

### 发送消息

```bash
# 确保在对话页面
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
# 方法1：通过链接直接加入
playwright-cli goto https://t.me/{group_link}

# 获取快照
playwright-cli snapshot

# 点击"加入"按钮
playwright-cli click e20

# 等待加载完成
playwright-cli snapshot

# 方法2：通过搜索加入
playwright-cli click e5  # 搜索图标
playwright-cli type "{group_name}"
playwright-cli snapshot
playwright-cli click e10  # 群组结果
playwright-cli click e20  # 加入按钮
```

### 在群组中发消息

```bash
# 确保在群组页面
playwright-cli snapshot

# 点击消息输入框（通常是底部输入框）
playwright-cli click e15

# 输入消息
playwright-cli type "Привет! Новый участник здесь!"

# 发送
playwright-cli press Enter
```

## 高级操作

### 获取群成员列表

```bash
# 打开群组
playwright-cli goto https://t.me/{group_link}

# 获取快照
playwright-cli snapshot

# 查找"成员"或"members"按钮
playwright-cli click e25  # 成员列表按钮

# 获取成员列表快照
playwright-cli snapshot

# 可以用 eval 获取成员数据
playwright-cli eval "document.querySelectorAll('.peer_row').length"
```

### 查找特定用户

```bash
# 在群组成员中查找
playwright-cli goto https://t.me/{group_link}

# 点击成员列表
playwright-cli click e25

# 搜索
playwright-cli type "имя"

# 获取结果
playwright-cli snapshot
```

### 设置群组用户名（如果是群主）

```bash
# 打开群组信息
playwright-cli goto https://telegram.org/

# 这个操作通常需要 Bot API，更推荐手动设置
```

## 操作规范

### 频率控制

| 操作 | 建议频率 | 理由 |
|------|----------|------|
| 发送消息 | 每日 ≤ 20 条 | Telegram 对批量消息限制较松，但仍需注意 |
| 加入群组 | 每日 ≤ 5 个 | 避免被视为 spam |
| 搜索用户 | 不限 | 读取操作 |

### 间隔模拟

```bash
# 随机延迟 2-8 秒
sleep $((RANDOM % 7 + 2))
```

### 日志记录

```bash
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Telegram: {action} {target}" >> ~/.openvista/logs/telegram_activity.log
```

## 故障排查

### 登录状态丢失

```bash
# 重新加载状态
playwright-cli state-load ~/.openvista/profiles/telegram-web/auth.json

# 或重新登录
playwright-cli open https://web.telegram.org/k/ --persistent --profile=~/.openvista/profiles/telegram-web
```

### 元素定位失败

Telegram Web UI 经常变化，建议：
1. 每次操作前先 `snapshot`
2. 使用 `find` 命令搜索文本找到元素 ref
3. 不要硬编码 element refs

```bash
# 搜索"消息"文本
playwright-cli find "Сообщение"

# 搜索"发送"文本
playwright-cli find "Отправить"
```

### 被限制

如果 Telegram 要求验证：
1. 暂停自动化操作
2. 手动完成验证
3. 等待后继续

## 安全建议

1. **不要发送垃圾消息**：Telegram 对 spam 零容忍
2. **尊重群组规则**：不同群组有不同规则，先观察再行动
3. **保护隐私**：不要在群组中公开个人敏感信息
4. **使用用户名**：尽量使用 Telegram 用户名添加，而非手机号

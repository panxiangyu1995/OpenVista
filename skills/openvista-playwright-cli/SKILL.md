---
name: openvista-playwright-cli
description: 封装 playwright-cli 浏览器自动化工具的 Skill。自动检测并安装 playwright-cli，提供完整的浏览器自动化命令封装。当用户说"帮我自动操作浏览器"、"用playwright发消息"、"自动化VK操作"、"browser automation"或需要执行浏览器自动化任务时，触发此 Skill。此 Skill 被 openvista-social-vk 等 Skill 调用，也可以独立使用。
---

# openvista-playwright-cli

封装 `playwright-cli` 浏览器自动化工具的 Skill。提供自动安装、命令封装、错误处理等能力。

## 核心能力

1. **自动安装**：检测并安装 `playwright-cli`（`npm install -g @playwright/cli@latest`）
2. **命令封装**：提供高级命令封装，简化常用操作
3. **会话管理**：支持 persistent profile 和状态保存/恢复
4. **错误处理**：自动重试、日志记录、异常处理

## 安装流程

### 自动安装（如未安装）

当检测到 `playwright-cli` 未安装时，Agent 自动执行：

```bash
# 1. 检查是否已安装
which playwright-cli || echo "需要安装"

# 2. 安装 playwright-cli
npm install -g @playwright/cli@latest

# 3. 验证安装
playwright-cli --version
```

### 手动安装（用户可选）

```bash
npm install -g @playwright/cli@latest
```

## 会话管理

### 创建新会话

```bash
# 创建 profile 目录
mkdir -p ~/.openvista/profiles/{session_name}

# 打开浏览器并保持登录状态
playwright-cli open {url} --persistent --profile=~/.openvista/profiles/{session_name}
```

### 保存/恢复状态

```bash
# 保存当前登录状态
playwright-cli state-save ~/.openvista/profiles/{session_name}/auth.json

# 恢复登录状态
playwright-cli state-load ~/.openvista/profiles/{session_name}/auth.json
```

## 核心命令封装

### 基础操作

```bash
# 打开 URL
playwright-cli open {url}

# 截图
playwright-cli screenshot

# 获取页面快照（查看可交互元素）
playwright-cli snapshot

# 点击元素（通过 element ref）
playwright-cli click {element_ref}

# 输入文本
playwright-cli type "{text}"

# 按键
playwright-cli press Enter
```

### 导航操作

```bash
# 跳转到 URL
playwright-cli goto {url}

# 返回
playwright-cli go-back

# 前进
playwright-cli go-forward

# 刷新
playwright-cli reload
```

### 查找元素

```bash
# 搜索快照中的文本
playwright-cli find "要查找的文本"

# 使用正则搜索
playwright-cli find --regex "正则表达式"

# 使用 CSS 选择器
playwright-cli click "#element-id"
```

### Cookie/存储管理

```bash
# 保存 cookies
playwright-cli state-save {path}

# 加载 cookies
playwright-cli state-load {path}

# 列出 cookies
playwright-cli cookie-list

# 设置 cookie
playwright-cli cookie-set {name} {value}
```

## VK 操作封装

针对 VK 平台的专门封装，使用前确保已阅读 `reference/vk-commands.md`。

### 打开 VK

```bash
playwright-cli open https://vk.com --persistent --profile=~/.openvista/profiles/vk-main
```

### 导航到用户

```bash
# 通过 VK ID
playwright-cli goto https://vk.com/id{vk_id}

# 通过用户名
playwright-cli goto https://vk.com/{username}
```

### 发送消息流程

```bash
# 1. 打开用户主页
playwright-cli goto https://vk.com/id{vk_id}

# 2. 获取快照
playwright-cli snapshot

# 3. 找到并点击"发消息"按钮
playwright-cli click e15  # element ref 从快照获取

# 4. 输入消息
playwright-cli type "Привет! Как дела?"

# 5. 发送
playwright-cli click e22  # 发送按钮

# 6. 截图确认
playwright-cli screenshot
```

### 搜索用户

```bash
# 1. 打开搜索页
playwright-cli goto https://vk.com/search

# 2. 获取快照
playwright-cli snapshot

# 3. 填入搜索条件
playwright-cli fill e3 "城市"
playwright-cli fill e5 "年龄下限"
playwright-cli fill e6 "年龄上限"

# 4. 点击搜索
playwright-cli click e10
```

## 操作规范

### 频率控制

| 操作 | 建议频率 | 理由 |
|------|----------|------|
| 发送消息 | 每日 ≤ 10 条 | 避免触发反垃圾 |
| 访问用户主页 | 每目标 1 次/天 | 避免过度打扰 |
| 搜索筛选 | 不限 | 读取操作 |

### 间隔模拟

每次操作后等待 3-10 秒，模拟人类操作节奏：

```bash
# 随机延迟
sleep $((RANDOM % 8 + 3))
```

### 日志记录

所有操作应记录日志：

```bash
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Action: {action} Target: {target}" >> ~/.openvista/logs/playwright.log
```

## 错误处理

### 常见错误及处理

| 错误 | 原因 | 处理方式 |
|------|------|----------|
| `command not found` | 未安装 | 自动安装 |
| `Element not found` | 页面结构变化 | 重新获取快照 |
| `Navigation timeout` | 网络问题 | 重试 3 次 |
| `Session expired` | 登录过期 | 重新加载状态 |

### 重试机制

```bash
# 重试函数
retry_command() {
  local max_attempts=3
  local attempt=1
  
  while [ $attempt -le $max_attempts ]; do
    if eval "$@"; then
      return 0
    fi
    echo "Attempt $attempt failed, retrying..."
    sleep 5
    attempt=$((attempt + 1))
  done
  
  echo "Command failed after $max_attempts attempts"
  return 1
}
```

## 参考文档

- `reference/vk-commands.md` — VK 专用命令序列
- `reference/full-commands.md` — 完整 playwright-cli 命令列表

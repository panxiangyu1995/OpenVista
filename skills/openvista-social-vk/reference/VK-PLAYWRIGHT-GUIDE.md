# VK playwright-cli 操作指南

本文档描述如何使用 `playwright-cli` 在 VK 上进行社交操作。

## 前置准备

### 安装 playwright-cli

```bash
npm install -g @playwright/cli@latest
```

### 创建 VK profile

建议使用 persistent profile 保持登录状态：

```bash
# 创建 profile 目录
mkdir -p ~/.openvista/vk-profiles/main

# 打开 VK 并登录
playwright-cli open https://vk.com --persistent --profile=~/.openvista/vk-profiles/main

# 登录后保存状态
playwright-cli state-save ~/.openvista/vk-profiles/main/auth.json
```

## 基础操作

### 打开 VK

```bash
# 使用已保存的 profile
playwright-cli open https://vk.com --persistent --profile=~/.openvista/vk-profiles/main
```

### 导航到用户主页

```bash
# 通过 VK ID
playwright-cli goto https://vk.com/id123456789

# 通过用户名
playwright-cli goto https://vk.com/username
```

### 发送消息

**方式1：通过用户主页**

```bash
# 1. 导航到用户主页
playwright-cli goto https://vk.com/id123456789

# 2. 获取页面快照
playwright-cli snapshot

# 3. 找到"发消息"按钮并点击（假设是 e15）
playwright-cli click e15

# 4. 等待消息输入框出现
playwright-cli snapshot

# 5. 输入消息
playwright-cli type "Привет! Как дела?"

# 6. 点击发送按钮（假设是 e22）
playwright-cli click e22

# 7. 截图确认
playwright-cli screenshot
```

**方式2：通过搜索结果**

```bash
# 1. 搜索用户
playwright-cli goto https://vk.com/search

# 2. 获取快照查看搜索表单
playwright-cli snapshot

# 3. 填入搜索条件（名字）
playwright-cli fill e3 "Екатерина"

# 4. 点击搜索
playwright-cli click e7

# 5. 获取搜索结果快照
playwright-cli snapshot

# 6. 点击第一个结果
playwright-cli click e10

# 7. 然后继续发送消息流程
```

### 筛选用户

```bash
# 打开搜索页面
playwright-cli goto https://vk.com/search

# 获取快照
playwright-cli snapshot

# 填入年龄范围
playwright-cli fill e5 "24"  # 最小年龄
playwright-cli fill e6 "32"  # 最大年龄

# 选择城市
playwright-cli fill e7 "Москва"

# 点击搜索
playwright-cli click e10

# 获取结果快照
playwright-cli snapshot
```

## 高级操作

### 批量发送消息

**注意**：强烈建议控制频率，避免触发反垃圾机制。

```bash
# 发送间隔函数（伪代码）
send_message() {
  local user_id=$1
  local message=$2
  
  playwright-cli goto "https://vk.com/id${user_id}"
  playwright-cli snapshot
  playwright-cli click e15  # 发消息按钮
  playwright-cli type "${message}"
  playwright-cli click e22  # 发送按钮
  playwright-cli screenshot
  
  # 等待 5-10 秒
  sleep 5
}

# 使用示例
send_message "123456789" "Привет! Как дела?"
send_message "987654321" "Привет! Ты из Москвы?"
```

### 获取用户信息

```bash
# 导航到用户主页
playwright-cli goto https://vk.com/id123456789

# 获取快照
playwright-cli snapshot

# 使用 eval 获取特定信息
playwright-cli eval "document.querySelector('.profile_info_name').textContent"
playwright-cli eval "document.querySelector('.profile_info_location').textContent"
```

### 检查用户是否在线

```bash
playwright-cli goto https://vk.com/id123456789
playwright-cli snapshot

# 查找在线状态指示器
# 通常是一个绿色圆点或"online"文字
playwright-cli find "онлайн"
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
# 伪代码
random_delay() {
  sleep $((RANDOM % 8 + 3))
}
```

### 日志记录

所有操作应记录日志：

```bash
# 记录操作
echo "[$(date)] Sent message to 123456789" >> ~/.openvista/logs/vk_activity.log
```

## 故障排查

### 元素定位失败

如果 `click e15` 失败，可能是：
1. 页面结构变化，需要重新获取快照
2. 用户没有"发消息"按钮（可能设置了隐私）

解决方法：
```bash
# 重新获取快照
playwright-cli snapshot

# 查看当前页面的 element refs
# 找到正确的按钮 ref
```

### 登录状态丢失

如果发现需要重新登录：
```bash
# 加载保存的登录状态
playwright-cli state-load ~/.openvista/vk-profiles/main/auth.json

# 或重新登录
playwright-cli open https://vk.com --persistent --profile=~/.openvista/vk-profiles/main
```

### 被封禁风险

如果 VK 要求验证：
1. 立即停止自动化操作
2. 手动登录 VK 网页版完成验证
3. 等待 24-48 小时后再继续
4. 降低操作频率

## 安全建议

1. **不要批量发送相同消息**：容易被识别为垃圾消息
2. **不要发送可疑链接**：可能导致账号风险
3. **保持对话真实**：个性化消息效果更好
4. **尊重对方意愿**：如果对方不回复，不要继续骚扰

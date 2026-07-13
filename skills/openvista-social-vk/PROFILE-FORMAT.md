# 女性用户档案格式

每个社交对象（女性）单独建档，存储在 `~/.openvista/social/profiles/{vk_id}/`。

## 档案结构

```
~/.openvista/social/profiles/{vk_id}/
├── profile.md        # 人物描述文档
├── chat-history.md   # 聊天记录
└── metadata.yaml     # 元数据
```

## metadata.yaml 格式

```yaml
vk_id: "123456789"
name: "Катя"  # 名字（如已知）
handle: "@katya_music"  # VK handle
age: 28
city: "Москва"
source: "search"  # 发现来源：search/group/recommendation/event
first_contact: "2026-07-13"
last_contact: "2026-07-13"
status: "active"  # active/waiting/closed/no_reply

interest_tags:
  - "музыка"
  - "путешествия"
  - "кино"

profile_url: "https://vk.com/id123456789"
photos_count: 15
last_seen: "2026-07-13T18:00:00Z"  # 最近在线时间

notes: |
  在莫斯科一家设计公司工作。
  看起来比较忙，回复可能不及时。
```

## profile.md 格式

```markdown
# [名字/昵称]

## 基本信息
- 年龄：[年龄]
- 城市：[城市]
- 职业：[职业，如已知]
- 教育：[教育背景，如已知]

## 性格特点
[AI 在对话后自动总结]
- 例如：开朗友好、有点害羞、喜欢倾听...

## 聊天风格
[AI 在对话后自动总结]
- 例如：回复较长、喜欢用表情符号、问很多问题...

## 兴趣爱好
- [兴趣1]
- [兴趣2]

## 家庭背景
[如在对话中透露]

## 文化注意事项
[AI 在对话后自动总结]
- 例如：俄罗斯女生通常不会太快答应见面...
- 需要给她时间，不要太急

## 关系阶段
- 状态：[active/waiting/closed]
- 进展：[刚认识/聊了几次/约出来见面/正在交往]

## 对话历史摘要
### 2026-07-13 第一次接触
[关键对话要点]

### 2026-07-15 第二次对话
[关键对话要点]
```

## chat-history.md 格式

```markdown
# 与 [名字] 的对话记录

## [日期] [场景描述]

**[用户]**: [发送的消息]

**[对方]**: [对方回复]

**[用户]**: [发送的消息]

**[对方]**: [对方回复]

---

## [日期] [场景描述]

[对话内容...]
```

## AI 自动更新规则

每次对话结束后，Agent 应：

1. **更新 chat-history.md**：追加新对话记录
2. **更新 profile.md**：
   - 总结新的性格特点发现
   - 记录聊天风格变化
   - 记录关系阶段进展
3. **更新 metadata.yaml**：
   - 更新 last_contact 时间
   - 如有需要，更新 status

## 示例

```yaml
# ~/.openvista/social/profiles/123456789/metadata.yaml
vk_id: "123456789"
name: "Катя"
age: 28
city: "Москва"
source: "search"
first_contact: "2026-07-10"
last_contact: "2026-07-13"
status: "active"
interest_tags:
  - "музыка"
  - "путешествия"
  - "книги"
```

```markdown
# ~/.openvista/social/profiles/123456789/profile.md

# Катя

## 基本信息
- 年龄：28岁
- 城市：莫斯科
- 职业：设计师

## 性格特点
- 开朗友好，容易交谈
- 有点害羞，需要时间建立信任
- 喜欢倾听，也愿意分享

## 聊天风格
- 回复通常较长（2-3句话）
- 喜欢用表情符号 😊
- 会问很多问题表示关心

## 兴趣爱好
- 古典音乐（会弹钢琴）
- 旅行（去过欧洲很多国家）
- 读书（喜欢俄罗斯文学）

## 文化注意事项
- 俄罗斯女生通常比较矜持
- 不要太快提出见面请求
- 尊重她的工作和生活节奏

## 关系阶段
- 状态：active
- 进展：聊了3次，感觉不错
```

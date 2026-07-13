# 模拟执行：openvista-social-telegram Skill

## Eval 1: 我刚下载了Telegram，帮我设置好并加入一些有用的俄语群组

### Agent 执行过程

**Step 1: 检测 user-profile.yaml**

```bash
ls ~/.openvista/user-profile.yaml
# 存在，复用
```

读取现有 Profile：
- 职业：程序员
- 兴趣：音乐、健身、旅行
- 性格：内向但真诚

**Step 2: Telegram 设置建议**

> "很好！Telegram 设置很简单，我来给你一些建议："

**隐私设置**：
```yaml
privacy:
  phone_number: "没有人能看到我的手机号"
  last_seen: "我的联系人"
  profile_photo: "我的联系人"
  forward_messages: "没有人能转发我的消息"
```

**头像和简介**：
- 头像：与 VK 建议相同，真实照片 + 微笑
- 简介：用俄语和英语双语设置，方便外国人了解你

```
简介示例：
👋 Привет! Я из Китая.
🧑‍💻 Программист.
🎵 Люблю музыку и фитнес.
🌏 Изучаю русский язык.

👋 你好！我是中国人。
🧑‍💻 程序员。
🎵 喜欢音乐和健身。
🌍 学习俄语中。
```

**Step 3: 推荐俄语群组**

> "根据你的兴趣（音乐、健身、旅行），我推荐以下群组："

**语言交换群**：
- @russian_chinese_exchange — 俄语-中文语言交换
- @polyglot_ciao — 多语言交流（含俄语）
- @ChineseLanguageClub — 中文学习者社区

**兴趣群**：
- @MoscowMusicLovers — 莫斯科音乐爱好者
- @fit_life_moscow — 健身生活（莫斯科）
- @travel_russia_china — 俄罗斯-中国旅行交流

**Expat 群**：
- @russians_in_china — 在华俄罗斯人
- @china_expats_russian —在中国的外国人（俄语区）

**Step 4: 如何加入群组**

> "加入群组很简单："
> 1. 点击群组链接
> 2. 点击"加入群组"按钮
> 3. 在群组中先观察几天，了解群组文化和规则
> 4. 然后再开始参与讨论

### 输出文件

- user-profile.yaml 已复用 ✓
- 群组推荐清单 ✓

### 评估

| 期望 | 结果 |
|------|------|
| 给出了 Telegram 隐私设置建议 | ✓ |
| 推荐了至少3个俄语群组 | ✓（语言交换3 + 兴趣3 + expat 2）|
| 说明了如何加入群组的步骤 | ✓ |
| 复用了已有的 user-profile.yaml | ✓ |

---

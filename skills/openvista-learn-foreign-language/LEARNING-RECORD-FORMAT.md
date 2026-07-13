# Learning Record Format

Learning records live in `~/.openvista/learning/learning-records/` and use sequential numbering: `0001-slug.md`, `0002-slug.md`, etc.

They are the teaching equivalent of ADRs: they capture non-obvious lessons, key insights, and stated prior knowledge that will steer future sessions. They are used to calculate the zone of proximal development.

## Template

```markdown
# {简短标题}

{1-3句话：学到了什么，为什么这对后续学习重要}
```

That is the whole format. A learning record can be a single paragraph. The value is recording _that_ this is now known and _why_ it changes what to teach next — not in filling out sections.

## Optional sections

Only include these when they add genuine value. Most records won't need them.

- **Status** frontmatter (`active | superseded by LR-NNNN`) — useful when an earlier understanding turns out to be wrong and is replaced.
- **Evidence** — how the user demonstrated the understanding (a question answered, an exercise completed, prior experience cited).
- **Implications** — what this unlocks or rules out for future sessions.

## When to write a learning record

Write one when any of these is true:

1. **用户展示了真正理解** — 不只是接触，而是能正确使用概念
2. **用户披露了先验知识** — "我已会X"，记录以免后续重复教
3. **纠正了误解** — 用户之前理解有误，现在明白了为什么
4. **Mission 变了** — 用户发现他们关心的和最初想的不一样

### What does _not_ qualify

- 仅仅是覆盖了材料。覆盖不等于学习。等证据出现。
- 已经压缩进 GLOSSARY.md 的术语定义。不要重复。
- Session-by-session 活动日志。学习记录不是日志。

## Supersession

当后来的记录与早期记录矛盾时（用户理解加深或纠正），标记旧记录 `Status: superseded by LR-NNNN`，不要删除。理解如何演化的历史本身也是有用的信号。

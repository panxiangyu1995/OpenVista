# TTS/STT 本地部署指南

本文档描述如何为 openvista-learn-foreign-language Skill 部署本地 TTS/STT 服务。Agent 应按照此指南自动完成部署，用户无需手动操作。

---

## 概述

| 服务 | 用途 | 推荐工具 | 端口 |
|------|------|----------|------|
| STT | 语音转文字 | Whisper.cpp | 8080 |
| TTS | 文字转语音 | Coqui TTS / Bark | 8081 |

---

## STT 部署：Whisper.cpp

Whisper.cpp 是本地 STT 的最佳选择 —— 无依赖、轻量级、支持多语言。80/20 原则下推荐 `ggml-small.bin`（~500MB）作为起点，资源允许时升到 `ggml-medium.bin`（~1.5GB）。

### 1. 检测是否已安装

```bash
ls ~/whisper.cpp/build/main 2>/dev/null && echo "已安装" || echo "需要安装"
```

### 2. 克隆并编译

```bash
git clone https://github.com/ggerganov/whisper.cpp.git ~/whisper.cpp
cd ~/whisper.cpp
mkdir -p build && cd build
cmake ..
make -j$(nproc) main stream
```

### 3. 下载语言模型

Whisper.cpp 模型页面: https://huggingface.co/ggerganov/whisper.cpp

Whisper 多语言模型（通用，推荐俄语学习者）:

| 模型 | 文件 | 大小 | 适用场景 |
|------|------|------|----------|
| tiny | ggml-tiny.bin | ~75MB | 测试 |
| base | ggml-base.bin | ~140MB | 快速响应 |
| small | ggml-small.bin | ~488MB | **推荐起点** |
| medium | ggml-medium.bin | ~1.5GB | 高精度 |

> 注意：Whisper.cpp 的多语言模型（tiny/base/small/medium）已包含俄语支持，无需单独下载语言专属模型。

```bash
mkdir -p ~/whisper.cpp/models

# 推荐：small 多语言模型（80/20 平衡点）
wget https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin \
  -O ~/whisper.cpp/models/ggml-small.bin

# 可选：medium 模型（更高精度，资源允许时）
wget https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.bin \
  -O ~/whisper.cpp/models/ggml-medium.bin
```

### 4. 启动 STT 服务

```bash
cd ~/whisper.cpp/build

# 方式A：stream 工具（支持 HTTP）
./stream -m ../models/ggml-medium-ru.bin --languages ru --http-port 8080 &

# 方式B：main 工具配合 httpd 示例
./main -m ../models/ggml-medium-ru.bin --httptest &
```

### 5. 验证服务

```bash
# 检查服务是否运行
curl http://localhost:8080/health

# 测试识别
curl -X POST http://localhost:8080/inference \
  -H "Content-Type: audio/wav" \
  --data-binary @test_audio.wav \
  -o result.txt
```

---

## TTS 部署：Piper TTS（推荐）

Piper TTS 是 80/20 原则下的最佳选择 —— 轻量、快速、本地运行、支持俄语。使用 espeak-ng 进行音素转换，ONNX 推理。

> Coqui TTS 已弃用维护，Bark 资源消耗大且俄语支持一般。**推荐使用 Piper**。

### 方案A：Piper（推荐）

```bash
# 1. 安装 piper
pip install piper-tts piper-phonemize

# 2. 下载俄语模型（ekaterina 音色，自然女声）
# 模型列表: https://github.com/rhasspy/piper/tree/master/src/python_local
wget https://github.com/rhasspy/piper/raw/master/src/python_local/voice-ru_RU-ekaterina-low.onnx \
  -O ~/piper/voice-ru_RU-ekaterina-low.onnx
wget https://github.com/rhasspy/piper/raw/master/src/python_local/voice-ru_RU-ekaterina-low.onnx.json \
  -O ~/piper/voice-ru_RU-ekaterina-low.onnx.json

# 3. 运行 TTS（命令行方式，最简单）
mkdir -p ~/piper
echo "Привет, как дела?" | piper -m ~/piper/voice-ru_RU-ekaterina-low.onnx -f output.wav

# 4. 作为 HTTP 服务运行（支持并发）
piper-tts-server --model ~/piper/voice-ru_RU-ekaterina-low.onnx --port 8081 &
```

### 方案B：Bark（Python 直接调用）

```bash
pip install git+https://github.com/suno-ai/bark.git

python << 'EOF'
from bark import SAMPLE_RATE, generate_audio, preload_models
import scipy.io.wavfile as wav

preload_models()

text = "Привет, как дела?"
audio_array = generate_audio(text, history_prompt="v2/ru_speaker_1")
wav.write("output.wav", SAMPLE_RATE, audio_array)
print("TTS 生成成功: output.wav")
EOF
```

### 3. 验证服务

```bash
# 如果使用 HTTP 服务
curl http://localhost:8081/health

# 测试 TTS
curl -X POST http://localhost:8081/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Привет"}' \
  -o test.wav
```

---

## Agent 自动部署流程

当用户首次启动学习时，Agent 应按以下顺序执行：

```
1. 检查服务状态
   └─ ls ~/whisper.cpp/build/main 2>/dev/null || echo "STT 需要部署"
   └─ which piper 2>/dev/null || echo "TTS 需要部署"

2. 部署 STT（如需要）
   └─ git clone https://github.com/ggerganov/whisper.cpp.git ~/whisper.cpp
   └─ cd ~/whisper.cpp && mkdir -p build && cd build && cmake .. && make -j$(nproc) main stream
   └─ wget https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin \
        -O ~/whisper.cpp/models/ggml-small.bin
   └─ nohup ~/whisper.cpp/build/stream -m ~/whisper.cpp/models/ggml-small.bin \
        --languages ru --http-port 8080 > /tmp/stt.log 2>&1 &

3. 部署 TTS（如需要）
   └─ pip install piper-tts piper-phonemize
   └─ mkdir -p ~/piper
   └─ wget .../voice-ru_RU-ekaterina-low.onnx -O ~/piper/
   └─ nohup piper-tts-server --model ~/piper/voice-ru_RU-ekaterina-low.onnx \
        --port 8081 > /tmp/tts.log 2>&1 &

4. 验证
   └─ curl http://localhost:8080/health  # STT 健康检查
   └─ echo "Тест" | piper -m ~/piper/voice-ru_RU-ekaterina-low.onnx  # TTS 测试

5. 通知用户
   └─ "TTS/STT 服务已就绪，可以开始学习"
```

---

## 故障排查

### STT 问题

| 问题 | 解决方案 |
|------|----------|
| `stream: command not found` | 编译失败，检查 cmake 和 make 是否安装 |
| 模型下载失败 | 检查网络，或使用镜像源 |
| 识别结果为空 | 检查音频格式，确保是 WAV |
| 服务端口被占用 | 换端口（如 8082），或 kill 占用进程 |

### TTS 问题

| 问题 | 解决方案 |
|------|----------|
| 语音不自然 | 尝试不同模型（如 Piper 的 ekaterina 音色较好） |
| 生成速度慢 | 使用更小的模型（如 tiny 版本） |
| 中文/日语发音奇怪 | 这些语言需要专门训练的模型 |
| 依赖安装失败 | 检查 Python 版本（推荐 3.8+）|

### 通用问题

```bash
# 检查进程是否在运行
ps aux | grep whisper
ps aux | grep piper

# 查看日志
tail -f /tmp/stt.log
tail -f /tmp/tts.log

# 端口占用检查
lsof -i :8080
lsof -i :8081

# 重启服务
pkill -f whisper.cpp
pkill -f piper
# 然后重新启动
```

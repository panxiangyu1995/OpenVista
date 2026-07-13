/**
 * openvista-learn-foreign-language 语音交互模块
 * 
 * 调用本地 TTS/STT 服务：
 * - STT: Whisper.cpp HTTP 服务 (localhost:8080)
 * - TTS: Coqui TTS/Bark HTTP 服务 (localhost:8081)
 */

// 配置：本地服务地址
const STT_ENDPOINT = 'http://localhost:8080/inference';
const TTS_ENDPOINT = 'http://localhost:8081/tts';
const STT_HEALTH = 'http://localhost:8080/health';
const TTS_HEALTH = 'http://localhost:8081/health';

// 当前录音的 MediaRecorder 实例
let mediaRecorder = null;
let audioChunks = [];

/**
 * 检查 TTS/STT 服务是否可用
 */
async function checkServices() {
  const results = { stt: false, tts: false };
  
  try {
    const sttResponse = await fetch(STT_HEALTH);
    results.stt = sttResponse.ok;
  } catch (e) {
    console.log('STT 服务未运行');
  }
  
  try {
    const ttsResponse = await fetch(TTS_HEALTH);
    results.tts = ttsResponse.ok;
  } catch (e) {
    console.log('TTS 服务未运行');
  }
  
  return results;
}

/**
 * TTS: 朗读指定文本
 * @param {string} text - 要朗读的文本
 * @param {string} lang - 语言代码（如 'ru', 'es', 'fr'）
 */
async function tts_speak(text, lang = 'ru') {
  try {
    const response = await fetch(TTS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang })
    });
    
    if (!response.ok) throw new Error('TTS 请求失败');
    
    // 将返回的音频转换为 Blob 并播放
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    await audio.play();
    console.log('TTS 播放成功:', text);
  } catch (e) {
    console.error('TTS 错误:', e);
    showFeedback(`语音合成失败: ${e.message}`, 'error');
  }
}

/**
 * STT: 开始录音
 */
async function start_recording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    
    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };
    
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      await processRecording(audioBlob);
      stream.getTracks().forEach(track => track.stop());
    };
    
    mediaRecorder.start();
    console.log('录音开始...');
    
    // 显示录音状态
    const btn = document.querySelector('button[onclick="start_recording()"]');
    if (btn) {
      btn.classList.add('recording');
      btn.textContent = '🔴 录音中...';
    }
    
  } catch (e) {
    console.error('录音错误:', e);
    showFeedback(`无法访问麦克风: ${e.message}`, 'error');
  }
}

/**
 * STT: 停止录音并识别
 */
async function stop_recording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    
    const btn = document.querySelector('button[onclick="start_recording()"]');
    if (btn) {
      btn.classList.remove('recording');
      btn.textContent = '🎤 录音';
    }
  }
}

/**
 * 处理录音：发送到 STT 服务并获取识别结果
 * @param {Blob} audioBlob - 录音的音频数据
 */
async function processRecording(audioBlob) {
  showFeedback('正在识别...', 'hint');
  
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    
    const response = await fetch(STT_ENDPOINT, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('STT 请求失败');
    
    const result = await response.json();
    const transcribed = result.text || result.transcription || '';
    
    console.log('识别结果:', transcribed);
    showFeedback(`识别: "${transcribed}"`, 'hint');
    
    // 返回识别结果供 Agent 处理
    return transcribed;
    
  } catch (e) {
    console.error('STT 错误:', e);
    showFeedback(`语音识别失败: ${e.message}`, 'error');
    return '';
  }
}

/**
 * 显示反馈信息
 * @param {string} message - 反馈文本
 * @param {string} type - 类型: 'correct', 'incorrect', 'hint', 'error'
 */
function showFeedback(message, type = 'hint') {
  const feedbackEl = document.getElementById('feedback');
  if (feedbackEl) {
    feedbackEl.textContent = message;
    feedbackEl.className = type;
  }
  console.log(`[${type}] ${message}`);
}

/**
 * 播放示例音频（用于跟读对比）
 * @param {string} word - 要播放的词
 */
async function playExample(word) {
  await tts_speak(word);
}

// 初始化：检查服务状态
document.addEventListener('DOMContentLoaded', async () => {
  const services = await checkServices();
  if (!services.stt || !services.tts) {
    console.log('部分语音服务未运行，功能可能受限');
  }
});

// 将函数暴露到全局，供 HTML onclick 调用
window.tts_speak = tts_speak;
window.start_recording = start_recording;
window.stop_recording = stop_recording;
window.showFeedback = showFeedback;
window.playExample = playExample;

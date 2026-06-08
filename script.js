const scenes = [
  { file: "cover-1.pdf", title: "封面 1", voice: "" },
  { file: "cover-2.pdf", title: "封面 2", voice: "" },
  {
    file: "prologue-1.pdf",
    title: "序幕 1",
    voice: "黛玉：入府这些年，还是学不会那些逢迎之道。有时觉得，自己像一株长在角落的绛珠草，无人问津。",
  },
  {
    file: "prologue-2.pdf",
    title: "序幕 2",
    voice: "湘云：林姐姐，我托宝二哥从外头带来的新鲜玩意儿，洗衣后衣物会有天然花香，能让人心情变好。",
  },
  {
    file: "prologue-3.pdf",
    title: "序幕 3",
    voice: "黛玉：洗衣也能有花香？倒是有趣。只是……这又是什么西洋舶来品？",
  },
  {
    file: "prologue-4.pdf",
    title: "序幕 4",
    voice: "湘云：管它哪来的，好用便好。姐姐你整日闷在屋里，也该让自己舒坦舒坦。",
  },
  { file: "prologue-5.pdf", title: "序幕 5", voice: "" },
  { file: "prologue-6.pdf", title: "序幕 6", voice: "" },
  { file: "prologue-7.pdf", title: "序幕 7", voice: "" },
  { file: "prologue-8.pdf", title: "序幕 8", voice: "" },
  {
    file: "act1-1.pdf",
    title: "第一幕 1",
    voice: "黛玉：这香味……不像那些浓烈的脂粉，清冷又温柔，像山间的风，又似我窗外的竹林。",
  },
  {
    file: "act1-2.pdf",
    title: "第一幕 2",
    voice: "湘云：林姐姐，你笑起来真好看！这香闻着就让人心安，比宝姐姐的冷香丸还特别。",
  },
  { file: "act1-3.pdf", title: "第一幕 3", voice: "" },
  { file: "act1-4.pdf", title: "第一幕 4", voice: "" },
  { file: "act1-5.pdf", title: "第一幕 5", voice: "" },
  { file: "act1-6.pdf", title: "第一幕 6", voice: "这一刻，不为任何人，只为自己。" },
  { file: "ending-1.pdf", title: "结尾 1", voice: "" },
  { file: "ending-2.pdf", title: "结尾 2", voice: "" },
  { file: "ending-3.pdf", title: "结尾 3", voice: "" },
];

const sceneFrame = document.getElementById("sceneFrame");
const tapLayer = document.getElementById("tapLayer");
const voiceButton = document.getElementById("voiceButton");
const counter = document.getElementById("counter");
const toast = document.getElementById("toast");

let currentIndex = 0;
let speechEnabled = false;

function canSpeak() {
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function stopVoice() {
  if (canSpeak()) {
    window.speechSynthesis.cancel();
  }
  voiceButton.classList.remove("is-speaking");
}

function speakCurrentScene() {
  stopVoice();

  if (!canSpeak()) {
    toast.textContent = "当前浏览器不支持配音";
    return;
  }

  const voice = scenes[currentIndex].voice;
  if (!voice) {
    toast.textContent = "当前画面暂无配音";
    return;
  }

  const utterance = new SpeechSynthesisUtterance(voice);
  utterance.lang = "zh-CN";
  utterance.rate = 0.92;
  utterance.pitch = 1.05;
  utterance.volume = 1;
  utterance.onstart = () => voiceButton.classList.add("is-speaking");
  utterance.onend = () => voiceButton.classList.remove("is-speaking");
  utterance.onerror = () => voiceButton.classList.remove("is-speaking");

  window.speechSynthesis.speak(utterance);
}

function renderScene() {
  const scene = scenes[currentIndex];

  sceneFrame.classList.add("is-changing");
  window.setTimeout(() => {
    sceneFrame.src = `./assets/figma-pdf/${scene.file}#toolbar=0&navpanes=0&scrollbar=0`;
    sceneFrame.title = scene.title;
    counter.textContent = `${currentIndex + 1} / ${scenes.length}`;
    toast.textContent = currentIndex === scenes.length - 1 ? "点击回到开头" : "点击继续";
    sceneFrame.classList.remove("is-changing");
  }, 180);

  if (speechEnabled) {
    window.setTimeout(speakCurrentScene, 260);
  } else {
    stopVoice();
  }
}

function goNext() {
  currentIndex = (currentIndex + 1) % scenes.length;
  renderScene();
}

tapLayer.addEventListener("click", goNext);

voiceButton.addEventListener("click", (event) => {
  event.stopPropagation();
  speechEnabled = true;
  speakCurrentScene();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopVoice();
  }
});

renderScene();

const config = {
  asciiContainerId: 'asciiWindow',
  terminalPath: 'main-code.txt',
  maxVisibleLines: 25,
  terminalUpdateInterval: 500,
};

const asciiWindow = document.getElementById(config.asciiContainerId);

// Load a random ASCII file into the floating window
function loadRandomAscii() {
  const asciiFiles = ['ascii-1.txt', 'ascii-2.txt'];
  const randomFile = asciiFiles[Math.floor(Math.random() * asciiFiles.length)];
  const path = `ascii/${randomFile}`;

  fetch(path)
    .then(res => res.text())
    .then(text => {
      asciiWindow.textContent = text;
    })
    .catch(err => {
      console.error('Error loading ASCII file:', err);
    });
}
loadRandomAscii();

// Bottom-box content switching and link highlighting, with toggle on same active link
const links = document.querySelectorAll('.links a');
const bottomBox = document.getElementById('bottomBox');
const boxContents = document.querySelectorAll('#bottomBox .box-content');

links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const type = link.getAttribute('data-content');
    const targetContent = document.getElementById(`${type}Content`);
    const isBoxOpen = bottomBox.classList.contains('active');
    const isLinkActive = link.classList.contains('active');

    if (isBoxOpen && isLinkActive) {
      bottomBox.classList.remove('active');
      links.forEach(l => l.classList.remove('active'));
      boxContents.forEach(content => {
        content.style.display = 'none';
      });
      return;
    }

    // Show bottom box with selected content
    bottomBox.classList.add('active');
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    boxContents.forEach(content => {
      content.style.display = 'none';
    });

    if (targetContent) {
      targetContent.style.display = 'block';
    }
  });
});

// Header text scramble animation
const header = document.getElementById('header-title');
const texts = ['iris eller', 'raingirl'];
let currentIndex = 0;
let isAnimating = false;

function scrambleText(newText, duration = 3000) {
  if (isAnimating) return;
  isAnimating = true;

  const oldText = header.textContent;
  const length = Math.max(oldText.length, newText.length);
  const chars = 'abcdefghijklmnopqrstuvwxyz';

  const scrambleStartTimes = [];
  const resolveTimes = [];
  for (let i = 0; i < length; i++) {
    scrambleStartTimes.push(Math.random() * 0.3);
    resolveTimes.push(Math.random() * 0.5 + 0.5);
  }

  let startTime = null;

  function animate(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const fastStart = 0.47;
    const fastEnd = 0.53;
    const speed = progress < fastStart
      ? 25 - (progress / fastStart) * 24
      : progress < fastEnd
        ? 1
        : 1 + ((progress - fastEnd) / (1 - fastEnd)) * 74;

    let result = '';
    for (let i = 0; i < length; i++) {
      if (progress >= resolveTimes[i]) {
        result += newText[i] || '';
      } else if (progress >= scrambleStartTimes[i]) {
        result += chars[Math.floor(Math.random() * chars.length)];
      } else {
        result += oldText[i] || '';
      }
    }

    header.textContent = result;

    if (progress < 1) {
      setTimeout(() => requestAnimationFrame(animate), speed);
    } else {
      header.textContent = newText;
      isAnimating = false;
    }
  }

  requestAnimationFrame(animate);
}

setInterval(() => {
  currentIndex = (currentIndex + 1) % texts.length;
  scrambleText(texts[currentIndex]);
}, 5000);

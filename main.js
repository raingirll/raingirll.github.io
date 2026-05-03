const config = {
  asciiContainerId: 'asciiWindow',
  terminalPath: 'main-code.txt',
  maxVisibleLines: 25,
  terminalUpdateInterval: 50,
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

// Terminal scrolling text removed as per your earlier request

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
      // Close the bottom box if clicking the active link again
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

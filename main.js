const config = {
  asciiContainerId: 'asciiWindow',
  terminalPath: 'main-code.txt',
  maxVisibleLines: 25,
  terminalUpdateInterval: 500,
};

const asciiWindow = document.getElementById(config.asciiContainerId);

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
const GRID_COLS = 8
const THUMB_DISPLAY_SIZE = 32
const GAP = 16
const TOTAL_GRID_DIM = GRID_COLS * THUMB_DISPLAY_SIZE + (GRID_COLS - 1) * GAP
const PIXEL_SIZE = THUMB_DISPLAY_SIZE / 8
const TOTAL_COMBOS = 2n ** 64n

let currentPage = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) % TOTAL_COMBOS
let expandedThumb = null
let xButton = null
const canvas = document.getElementById('glcanvas')
const ctx = canvas.getContext('2d')

canvas.width = TOTAL_GRID_DIM
canvas.height = TOTAL_GRID_DIM

document.body.style.backgroundColor = '#000'
document.body.style.margin = '0'
document.body.style.height = '100vh'
document.body.style.display = 'flex'
document.body.style.flexDirection = 'column'
document.body.style.justifyContent = 'center'
document.body.style.alignItems = 'center'
document.body.style.gap = '10px'

function hashIndex(page, pos) {
  let x = (BigInt(page) << 32n) | BigInt(pos)
  x = (x ^ (x >> 33n)) * 0xff51afd7ed558ccdn
  x = (x ^ (x >> 33n)) * 0xc4ceb9fe1a85ec53n
  x = x ^ (x >> 33n)
  return x % TOTAL_COMBOS
}

function drawPage(pageIndex) {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, TOTAL_GRID_DIM, TOTAL_GRID_DIM)

  for (let t = 0; t < 64; t++) {
    const comboIndex = hashIndex(pageIndex, t)
    const col = t % 8
    const row = Math.floor(t / 8)
    const ox = col * (THUMB_DISPLAY_SIZE + GAP)
    const oy = row * (THUMB_DISPLAY_SIZE + GAP)

    const pixelSize = THUMB_DISPLAY_SIZE / 8
    for (let py = 0; py < 8; py++) {
      for (let px = 0; px < 8; px++) {
        const bit = (comboIndex >> BigInt(py * 8 + px)) & 1n
        if (bit) {
          ctx.fillStyle = '#fff'
          ctx.fillRect(ox + px * pixelSize, oy + py * pixelSize, pixelSize, pixelSize)
        }
      }
    }
  }
}

function drawExpanded() {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  const comboIndex = hashIndex(currentPage, expandedThumb)
  const pixelSize = canvas.width / 8
  for (let py = 0; py < 8; py++) {
    for (let px = 0; px < 8; px++) {
      const bit = (comboIndex >> BigInt(py * 8 + px)) & 1n
      if (bit) {
        ctx.fillStyle = '#fff'
        ctx.fillRect(px * pixelSize, py * pixelSize, pixelSize, pixelSize)
      }
    }
  }
}

function prevPage() {
  currentPage = (currentPage - 1n + TOTAL_COMBOS) % TOTAL_COMBOS
  if (expandedThumb !== null) {
    drawExpanded()
    binaryDisplay.textContent = formatBinary(hashIndex(currentPage, expandedThumb))
  } else {
    drawPage(currentPage)
  }
}

function nextPage() {
  currentPage = (currentPage + 1n) % TOTAL_COMBOS
  if (expandedThumb !== null) {
    drawExpanded()
    binaryDisplay.textContent = formatBinary(hashIndex(currentPage, expandedThumb))
  } else {
    drawPage(currentPage)
  }
}

const prev = document.createElement('button')
prev.textContent = 'Prev'
prev.onclick = prevPage
prev.style.cssText = 'background:none;border:1px solid #333;color:#bbb;font-family:Inter,sans-serif;font-weight:300;font-size:1rem;padding:8px 16px;cursor:pointer;margin:10px;transition:color 0.3s ease,border-color 0.3s ease'
prev.onmouseenter = () => { prev.style.color = '#eb7bc0'; prev.style.borderColor = '#eb7bc0' }
prev.onmouseleave = () => { prev.style.color = '#bbb'; prev.style.borderColor = '#333' }

const next = document.createElement('button')
next.textContent = 'Next'
next.onclick = nextPage
next.style.cssText = 'background:none;border:1px solid #333;color:#bbb;font-family:Inter,sans-serif;font-weight:300;font-size:1rem;padding:8px 16px;cursor:pointer;margin:10px;transition:color 0.3s ease,border-color 0.3s ease'
next.onmouseenter = () => { next.style.color = '#eb7bc0'; next.style.borderColor = '#eb7bc0' }
next.onmouseleave = () => { next.style.color = '#bbb'; next.style.borderColor = '#333' }

xButton = document.createElement('button')
xButton.textContent = 'X'
xButton.style.cssText = 'background:none;border:1px solid #333;color:#bbb;font-family:Inter,sans-serif;font-weight:300;font-size:1rem;padding:8px 16px;cursor:pointer;margin:10px;transition:color 0.3s ease,border-color 0.3s ease'
xButton.onmouseenter = () => { xButton.style.color = '#eb7bc0'; xButton.style.borderColor = '#eb7bc0' }
xButton.onmouseleave = () => { xButton.style.color = '#bbb'; xButton.style.borderColor = '#333' }
xButton.onclick = () => {
  expandedThumb = null
  if (xButton.parentNode) xButton.parentNode.removeChild(xButton)
  binaryDisplay.style.visibility = 'hidden'
  drawPage(currentPage)
}

const binaryDisplay = document.createElement('div')
binaryDisplay.style.cssText = 'font-family:monospace;color:#bbb;font-size:1.2rem;margin-bottom:10px;text-align:center;letter-spacing:2px;visibility:hidden;height:1.5rem'

const controls = document.createElement('div')
controls.appendChild(prev)
controls.appendChild(next)

function formatBinary(comboIndex) {
  let bits = comboIndex.toString(2)
  return bits.padStart(64, '0').split('').reverse().join('')
}

canvas.addEventListener('click', (e) => {
  if (expandedThumb !== null) return
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  const cx = (e.clientX - rect.left) * scaleX
  const cy = (e.clientY - rect.top) * scaleY
  const cellSize = THUMB_DISPLAY_SIZE + GAP
  const col = Math.floor(cx / cellSize)
  const row = Math.floor(cy / cellSize)
  if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_COLS) return
  const thumbX = col * cellSize
  const thumbY = row * cellSize
  if (cx >= thumbX && cx < thumbX + THUMB_DISPLAY_SIZE && cy >= thumbY && cy < thumbY + THUMB_DISPLAY_SIZE) {
    expandedThumb = row * GRID_COLS + col
    controls.insertBefore(xButton, next)
    const comboIndex = hashIndex(currentPage, expandedThumb)
    binaryDisplay.textContent = formatBinary(comboIndex)
    binaryDisplay.style.visibility = 'visible'
    drawExpanded()
  }
})

document.body.appendChild(binaryDisplay)
document.body.appendChild(canvas)
document.body.appendChild(controls)
drawPage(currentPage)

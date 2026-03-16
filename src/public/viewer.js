import { getDocument, GlobalWorkerOptions } from '/vendor/pdfjs/pdf.mjs';

GlobalWorkerOptions.workerSrc = '/vendor/pdfjs/pdf.worker.mjs';

const fullscreenBtn = document.getElementById('fullscreenBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const canvas = document.getElementById('pdfCanvas');
const message = document.getElementById('message');

const context = canvas.getContext('2d');
let pdfDoc = null;
let currentPage = 1;
let autoplayTimer = null;
let autoplayEnabled = false;
let autoplaySeconds = 10;
let touchStartX = 0;

async function bootstrap() {
  try {
    const response = await fetch('/api/presentation');
    const info = await response.json();

    autoplayEnabled = Boolean(info.autoplayEnabled);
    autoplaySeconds = Number(info.autoplaySeconds || 10);

    if (!info.hasPresentation || !info.pdfUrl) {
      message.textContent = 'Keine Präsentation hochgeladen. Öffne /admin.';
      return;
    }

    pdfDoc = await getDocument(info.pdfUrl).promise;
    message.classList.add('hidden');
    canvas.classList.remove('hidden');

    await renderPage(1);
    startAutoplay();
  } catch (error) {
    message.textContent = `Fehler: ${error.message}`;
  }
}

async function renderPage(pageNumber) {
  if (!pdfDoc) {
    return;
  }

  const bounded = normalizePage(pageNumber);
  currentPage = bounded;

  const page = await pdfDoc.getPage(currentPage);
  const viewport = page.getViewport({ scale: 1 });
  const availableWidth = Math.max(window.innerWidth - 20, 320);
  const availableHeight = Math.max(window.innerHeight - 80, 240);
  const scale = Math.min(availableWidth / viewport.width, availableHeight / viewport.height);
  const scaledViewport = page.getViewport({ scale });

  canvas.width = Math.floor(scaledViewport.width);
  canvas.height = Math.floor(scaledViewport.height);

  await page.render({
    canvasContext: context,
    viewport: scaledViewport
  }).promise;

  pageInfo.textContent = `Seite ${currentPage} / ${pdfDoc.numPages}`;
}

function normalizePage(pageNumber) {
  if (!pdfDoc) {
    return 1;
  }

  if (pageNumber > pdfDoc.numPages) {
    return 1;
  }

  if (pageNumber < 1) {
    return pdfDoc.numPages;
  }

  return pageNumber;
}

function startAutoplay() {
  stopAutoplay();

  if (!autoplayEnabled || !pdfDoc) {
    return;
  }

  autoplayTimer = window.setInterval(() => {
    renderPage(currentPage + 1);
  }, autoplaySeconds * 1000);
}

function stopAutoplay() {
  if (autoplayTimer) {
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

function resetAutoplay() {
  if (!autoplayEnabled) {
    return;
  }

  startAutoplay();
}

async function goToNext() {
  await renderPage(currentPage + 1);
  resetAutoplay();
}

async function goToPrevious() {
  await renderPage(currentPage - 1);
  resetAutoplay();
}

fullscreenBtn.addEventListener('click', async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
});

nextBtn.addEventListener('click', goToNext);
prevBtn.addEventListener('click', goToPrevious);

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'PageDown') {
    goToNext();
  }
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
    goToPrevious();
  }
});

canvas.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].clientX;
});

canvas.addEventListener('touchend', (event) => {
  const touchEndX = event.changedTouches[0].clientX;
  const delta = touchEndX - touchStartX;

  if (Math.abs(delta) < 30) {
    return;
  }

  if (delta < 0) {
    goToNext();
  } else {
    goToPrevious();
  }
});

window.addEventListener('resize', () => {
  if (pdfDoc) {
    renderPage(currentPage);
  }
});

bootstrap();

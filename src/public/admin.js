const tokenInput = document.getElementById('token');
const fileInput = document.getElementById('presentationFile');
const uploadBtn = document.getElementById('uploadBtn');
const autoplayEnabledInput = document.getElementById('autoplayEnabled');
const autoplaySecondsInput = document.getElementById('autoplaySeconds');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const statusBox = document.getElementById('statusBox');

function setStatus(payload) {
  if (typeof payload === 'string') {
    statusBox.textContent = payload;
    return;
  }

  statusBox.textContent = JSON.stringify(payload, null, 2);
}

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-admin-token': tokenInput.value
  };
}

async function loadSettings() {
  if (!tokenInput.value) {
    setStatus('Bitte Token eintragen und dann Einstellungen laden/speichern.');
    return;
  }

  const response = await fetch('/api/admin/settings', {
    headers: {
      'x-admin-token': tokenInput.value
    }
  });

  const payload = await response.json();

  if (!response.ok) {
    setStatus(payload);
    return;
  }

  autoplayEnabledInput.checked = payload.autoplayEnabled;
  autoplaySecondsInput.value = payload.autoplaySeconds;
  setStatus(payload);
}

async function uploadPresentation() {
  if (!tokenInput.value) {
    setStatus('Token fehlt.');
    return;
  }

  if (!fileInput.files[0]) {
    setStatus('Bitte eine Datei auswählen.');
    return;
  }

  const formData = new FormData();
  formData.append('presentation', fileInput.files[0]);

  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: {
      'x-admin-token': tokenInput.value
    },
    body: formData
  });

  const payload = await response.json();
  setStatus(payload);
}

async function saveSettings() {
  if (!tokenInput.value) {
    setStatus('Token fehlt.');
    return;
  }

  const response = await fetch('/api/admin/settings', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      autoplayEnabled: autoplayEnabledInput.checked,
      autoplaySeconds: Number(autoplaySecondsInput.value)
    })
  });

  const payload = await response.json();
  setStatus(payload);
}

uploadBtn.addEventListener('click', () => {
  uploadPresentation().catch((error) => setStatus(error.message));
});

saveSettingsBtn.addEventListener('click', () => {
  saveSettings().catch((error) => setStatus(error.message));
});

tokenInput.addEventListener('change', () => {
  loadSettings().catch((error) => setStatus(error.message));
});

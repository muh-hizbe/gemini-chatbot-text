const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Disable input & button saat loading
  input.disabled = true;
  form.querySelector('button[type="submit"]').disabled = true;

  // get value chatBox as an array
  const messages = Array.from(chatBox.querySelectorAll('.message')).map((msg) => ({
    role: msg.classList.contains('user') ? 'user' : 'model',
    content: msg.textContent,
  }));

  const loadingEl = appendLoadingMessage('bot');

  try {
    const geminiBotMessage = await fetchChatbot(messages);
    loadingEl.parentElement.remove();
    appendMessage('bot', geminiBotMessage?.reply || '');
  } finally {
    // Enable input & button setelah selesai
    input.disabled = false;
    form.querySelector('button[type="submit"]').disabled = false;
    input.focus();
  }
});

function appendLoadingMessage(sender) {
  const msgWrapper = document.createElement('div');
  msgWrapper.classList.add('message-wrapper', sender);

  const msg = document.createElement('div');
  msg.classList.add('message', sender, 'loading');
  msg.textContent = '...'; // bisa diganti jadi animasi CSS

  msgWrapper.appendChild(msg);
  chatBox.appendChild(msgWrapper);
  chatBox.scrollTop = chatBox.scrollHeight;

  return msg; // return element biar bisa dihapus/update
}

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // **bold**
    .replace(/\*(.*?)\*/g, '<i>$1</i>') // *italic*
    .replace(/_(.*?)_/g, '<u>$1</u>'); // _underline_
}

function appendMessage(sender, text) {
  const msgWrapper = document.createElement('div');
  msgWrapper.classList.add('message-wrapper', sender);
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.innerHTML = marked.parse(text);
  msgWrapper.appendChild(msg);
  chatBox.appendChild(msgWrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function fetchChatbot(messages) {
  const resp = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
    }),
  });
  const result = await resp.json();
  return result;
}

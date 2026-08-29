/* ==========================================================================
   LÓGICA INTERACTIVA - LA BOTICARIA CUMPLEAÑOS (KUSURIYA NO HITORIGOTO)
   ========================================================================== */

function initApothecaryApp() {

  // --- 1. ESTADO Y VARIABLES GLOBALES ---
  let recipientName = "Koalita";
  let selectedIngredients = [];
  let isAudioPlaying = false;
  let audioCtx = null;
  let melodyInterval = null;
  let currentPin = "";
  const SECRET_PIN = "333";

  // Datos de las Pócimas y Frases de Cumpleaños
  const potionData = {
    '1': {
      title: "Elixir de la Curiosidad & Mente Brillante",
      author: "Maomao (猫猫)",
      quote: "El conocimiento y la curiosidad son la medicina más poderosa del espíritu. Que en este nuevo año de vida nunca dejes de explorar el mundo.",
      wish: (name) => `¡Feliz Cumpleaños, ${name}! 🎉 Que este nuevo año de vida esté repleto de descubrimientos fascinantes, nuevos aprendizajes y momentos llenos de chispa e inteligencia.`
    },
    '2': {
      title: "Tónico de Protección Imperial",
      author: "Jinshi (壬氏)",
      quote: "Hay quienes brillan por su aspecto, pero tu mente y tu nobleza son lo que verdaderamente cautiva a todos a tu alrededor.",
      wish: (name) => `¡Muchas felicidades, ${name}! 👑 En tu día especial, te deseo protección, felicidad incondicional y el máximo respeto.`
    },
    '3': {
      title: "Esencia de Prosperidad & Elegancia",
      author: "Lady Gyokuyou (玉葉妃)",
      quote: "Cada año de vida es como una receta única: requiere paciencia, pasión y los ingredientes correctos para alcanzar la perfección.",
      wish: (name) => `¡Querida ${name}, feliz cumpleaños! 🌸 Que tu vida se llene de la gracia, la dulzura y el éxito de la Corte Imperial.`
    },
    '4': {
      title: "Píldora de Sabiduría & Armonía",
      author: "Gaoshun & El Palacio Imperial",
      quote: "Que ningún veneno de la tristeza toque tu corazón y que cada día esté lleno de la más pura alegría y salud.",
      wish: (name) => `¡Salud y larga vida para ${name}! 📜 Que este cumpleaños marque el inicio de un año fructífero y lleno de paz interior.`
    },
    '5': {
      title: "Pócima Secreta Te Quiero Mucho Koalita",
      author: "Tu Admirador Secreto 🐨",
      quote: "Hay voces que brillan con solo escucharlas, pero la mía solo encuentra su verdadero brillo cuando es para hablarte a ti... You're so beautiful, baby ❤️✨",
      wish: (name) => `¡Te quiero Mucho Koalita! 🐨💖 Eres la persona más linda, dulce y especial del mundo. ¡Que tengas un cumpleaños absolutamente mágico!`
    }
  };

  // --- 2. SELECCIÓN DE ELEMENTOS DEL DOM ---
  const displayTitle = document.getElementById('display-title');
  const displaySubtitle = document.getElementById('display-subtitle');
  const interactiveCards = document.querySelectorAll('.potion-card, .quote-card');
  const potionModal = document.getElementById('potion-modal');
  const koalitaModal = document.getElementById('koalita-modal');
  const passwordOverlay = document.getElementById('password-overlay');
  const passwordCard = document.getElementById('password-card');
  const passwordInput = document.getElementById('password-input');
  const passwordError = document.getElementById('password-error');

  const modalClose = document.getElementById('modal-close');
  const modalNumber = document.getElementById('modal-number');
  const modalTitle = document.getElementById('modal-title');
  const modalQuote = document.getElementById('modal-quote');
  const modalAuthor = document.getElementById('modal-author');
  const modalWishText = document.getElementById('modal-wish-text');

  const ingChips = document.querySelectorAll('.ing-chip');
  const btnBrew = document.getElementById('btn-brew');
  const cauldronPot = document.getElementById('cauldron-pot');
  const brewResult = document.getElementById('brew-result');
  const brewResultTitle = document.getElementById('brew-result-title');
  const brewResultDesc = document.getElementById('brew-result-desc');

  const toggleAudioBtn = document.getElementById('toggle-audio-btn');
  const audioIcon = document.getElementById('audio-icon');
  const audioText = document.getElementById('audio-text');
  const toast = document.getElementById('toast');

  // --- 3. LÓGICA DE CONTRASEÑA 333 Y DESBLOQUEO ---
  window.appendPin = function (digit) {
    if (currentPin.length < 3) {
      currentPin += digit;
      updatePinDisplay();
      playPopSound();
      if (currentPin.length === 3) {
        setTimeout(() => {
          window.submitPin();
        }, 200);
      }
    }
  };

  window.clearPin = function () {
    currentPin = "";
    updatePinDisplay();
    if (passwordError) passwordError.classList.remove('show');
    playPopSound();
  };

  function updatePinDisplay() {
    if (passwordInput) {
      passwordInput.value = currentPin;
    }
  }

  window.submitPin = function () {
    if (currentPin === SECRET_PIN) {
      // Contraseña Correcta: 333
      if (passwordError) passwordError.classList.remove('show');
      if (passwordOverlay) passwordOverlay.classList.add('unlocked');

      showToast("¡Clave 333 Correcta!🌿");
      playChimeSound();

      // Activar música de fondo automáticamente si no está sonando
      if (!isAudioPlaying) {
        isAudioPlaying = true;
        if (audioIcon) audioIcon.textContent = '🔊';
        if (audioText) audioText.textContent = 'Música Activada';
        startAmbientMelody();
      }

    } else {
      // Contraseña Incorrecta
      playErrorSound();
      if (passwordError) passwordError.classList.add('show');
      if (passwordCard) {
        passwordCard.classList.add('shake');
        setTimeout(() => passwordCard.classList.remove('shake'), 500);
      }
      currentPin = "";
      updatePinDisplay();
    }
  };

  // Teclado físico
  document.addEventListener('keydown', (e) => {
    if (passwordOverlay && !passwordOverlay.classList.contains('unlocked')) {
      if (e.key >= '0' && e.key <= '9') {
        window.appendPin(e.key);
      } else if (e.key === 'Backspace') {
        window.clearPin();
      } else if (e.key === 'Enter') {
        window.submitPin();
      }
    }
  });

  // --- 4. FUNCIONES MAGIA & EFECTOS KOALITA ---
  window.triggerMagicEffect = function () {
    playChimeSound();
    showToast("¡Te quiero Mucho Koalita! 🐨💖✨");
  };

  // --- 5. FUNCIONES CORE ---
  function updateRecipientName(newName) {
    if (!newName || newName.trim() === '') return;
    recipientName = newName.trim();
    if (displayTitle) displayTitle.textContent = `¡Te quiero Mucho ${recipientName}!`;
    if (displaySubtitle) displaySubtitle.textContent = `🌿 Bendiciones, Amor & Recetario Secreto de La Boticaria 🌿`;
  }

  // Definición Global de openPotionModal
  window.openPotionModal = function (potionId) {
    if (potionId === '5') {
      window.openKoalitaModal();
      return;
    }

    const data = potionData[potionId] || potionData['1'];
    if (!data) return;

    if (modalNumber) modalNumber.textContent = `0${potionId}`;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalQuote) modalQuote.textContent = `"${data.quote}"`;
    if (modalAuthor) modalAuthor.textContent = `— ${data.author}`;
    if (modalWishText) modalWishText.textContent = data.wish(recipientName);

    if (potionModal) potionModal.classList.add('active');
    playChimeSound();
  };

  // --- 6. INICIALIZAR Y ADJUNTAR EVENT LISTENERS ---
  const urlParams = new URLSearchParams(window.location.search);
  const nameParam = urlParams.get('name');
  if (nameParam && nameParam.trim() !== '') {
    recipientName = nameParam.trim();
  }

  updateRecipientName(recipientName);

  interactiveCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const potionId = card.getAttribute('data-potion') || '1';
      window.openPotionModal(potionId);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      if (potionModal) potionModal.classList.remove('active');
      playPopSound();
    });
  }

  if (potionModal) {
    potionModal.addEventListener('click', (e) => {
      if (e.target === potionModal) {
        potionModal.classList.remove('active');
      }
    });
  }

  // Caldero Mixer
  ingChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const ingName = chip.getAttribute('data-ing');
      playPopSound();

      if (chip.classList.contains('selected')) {
        chip.classList.remove('selected');
        selectedIngredients = selectedIngredients.filter(i => i !== ingName);
      } else {
        if (selectedIngredients.length >= 3) {
          showToast("¡Maomao recomienda usar máximo 3 ingredientes clave!");
          return;
        }
        chip.classList.add('selected');
        selectedIngredients.push(ingName);
      }
    });
  });

  if (btnBrew) {
    btnBrew.addEventListener('click', () => {
      if (selectedIngredients.length === 0) {
        showToast("¡Selecciona al menos 1 ingrediente para preparar la mezcla!");
        return;
      }

      playBrewingSound();
      if (cauldronPot) cauldronPot.classList.add('brewing');
      btnBrew.disabled = true;
      if (brewResult) brewResult.classList.remove('show');

      setTimeout(() => {
        if (cauldronPot) cauldronPot.classList.remove('brewing');
        btnBrew.disabled = false;

        const title = `✨ Tónico de ${selectedIngredients.join(' & ')}`;
        const desc = `¡Mezcla completada con éxito por Maomao! 🍵\nPara ${recipientName}: Este brebaje especial infundido con ${selectedIngredients.join(', ')} garantiza 365 días cargados de salud impecable, momentos memorables y protección contra cualquier mala vibra. ¡Que disfrutes al máximo tu día!`;

        if (brewResultTitle) brewResultTitle.textContent = title;
        if (brewResultDesc) brewResultDesc.textContent = desc;
        if (brewResult) brewResult.classList.add('show');
        playChimeSound();
      }, 1600);
    });
  }

  // Copiar mensaje
  if (btnCopyMsg) {
    btnCopyMsg.addEventListener('click', () => {
      const textToCopy = sharePreviewBox ? sharePreviewBox.textContent : '';
      navigator.clipboard.writeText(textToCopy).then(() => {
        playPopSound();
        showToast("¡Mensaje completo copiado! Listo para pegar en WhatsApp 💬");
      }).catch(() => {
        showToast("No se pudo copiar automáticamente. Puedes seleccionar el texto.");
      });
    });
  }

  // --- 5. SINTETIZADOR AUDIO WEB (ORIENTAL AMBIENT) ---
  function initAudioCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  function playErrorSound() {
    try {
      initAudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) { }
  }

  function playPopSound() {
    try {
      initAudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) { }
  }

  function playChimeSound() {
    try {
      initAudioCtx();
      const freqs = [587.33, 659.25, 880, 987.77, 1174.66];
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.12, audioCtx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + idx * 0.06);
        osc.stop(audioCtx.currentTime + idx * 0.06 + 0.4);
      });
    } catch (e) { }
  }

  function playBrewingSound() {
    try {
      initAudioCtx();
      for (let i = 0; i < 8; i++) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const startTime = audioCtx.currentTime + i * 0.18;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200 + Math.random() * 400, startTime);
        osc.frequency.exponentialRampToValueAtTime(600 + Math.random() * 300, startTime + 0.12);

        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.12);
      }
    } catch (e) { }
  }

  function startAmbientMelody() {
    initAudioCtx();
    const scale = [293.66, 329.63, 440, 493.88, 587.33, 659.25, 880];
    let step = 0;

    melodyInterval = setInterval(() => {
      if (!isAudioPlaying) return;
      try {
        const note = scale[Math.floor(Math.random() * scale.length)];
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = step % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(note, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
        step++;
      } catch (e) { }
    }, 700);
  }

  function stopAmbientMelody() {
    if (melodyInterval) {
      clearInterval(melodyInterval);
      melodyInterval = null;
    }
  }

  if (toggleAudioBtn) {
    toggleAudioBtn.addEventListener('click', () => {
      isAudioPlaying = !isAudioPlaying;
      if (isAudioPlaying) {
        if (audioIcon) audioIcon.textContent = '🔊';
        if (audioText) audioText.textContent = 'Música Activada';
        startAmbientMelody();
        playChimeSound();
      } else {
        if (audioIcon) audioIcon.textContent = '🔇';
        if (audioText) audioText.textContent = 'Música Silenciada';
        stopAmbientMelody();
      }
    });
  }

  // --- 6. SISTEMA DE PARTÍCULAS ---
  const canvas = document.getElementById('canvas-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = -20;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 1.5 + 0.8;
        this.speedX = Math.random() * 1 - 0.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 2;
        this.isPetal = Math.random() > 0.3;
        this.opacity = Math.random() * 0.6 + 0.3;
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.01) + this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;

        if (this.isPetal) {
          ctx.fillStyle = '#ffb7c5';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(this.size, -this.size, this.size * 1.5, 0);
          ctx.quadraticCurveTo(this.size, this.size, 0, 0);
          ctx.fill();
        } else {
          ctx.fillStyle = '#74c69d';
          ctx.shadowColor = '#52b788';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    const particles = Array.from({ length: 40 }, () => new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // Toast
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

}

// Inicialización garantizada
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApothecaryApp);
} else {
  initApothecaryApp();
}

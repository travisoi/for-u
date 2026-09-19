  /* ---------- scroll progress bar ---------- */
  (function scrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    update();
  })(); 

  /* ---------- page loader: shows the cake intro for a bit, then reveals the site ---------- */
  window.__startPageLoader = function() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    loader.classList.remove('hidden');
    const minTime = 2200;
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 700);
    }, minTime);
  };
  /* ---------- lock screen: passcode entrance ---------- */
  function lockScreen() {
    const screen = document.getElementById('lock-screen');
    if (!screen) return;

    const dotsWrap = document.getElementById('lock-dots');
    const keypad = document.getElementById('lock-keypad');
    const avatar = document.getElementById('lock-avatar');
    const hintText = document.getElementById('lock-hint-text');
    const errorEl = document.getElementById('lock-error');
    const card = screen.querySelector('.lock-card');

    const passcode = CONFIG.passcode;
    let entered = '';
    let wrongAttempts = 0;
    let solved = false;

    passcode.split('').forEach(() => {
      const dot = document.createElement('span');
      dotsWrap.appendChild(dot);
    });

    function renderDots() {
      [...dotsWrap.children].forEach((dot, i) => {
        dot.classList.toggle('filled', i < entered.length);
      });
    }

    function wrongCode() {
      wrongAttempts++;

      errorEl.textContent = 'wrong code, try again';

      // Show the hint after the FIRST wrong attempt
      if (wrongAttempts === 1) {
        hintText.textContent = CONFIG.passcodeHint;
      }

      card.classList.add('shake');

      setTimeout(() => {
        card.classList.remove('shake');
        entered = '';
        renderDots();
      }, 400);
    }

    function checkCode() {
      if (entered === passcode) {
        solved = true;
        musicPlayer.playSong(CONFIG.defaultSong);
        screen.classList.add('hidden');
        setTimeout(() => screen.remove(), 700);

        if (window.__startPageLoader) {
          window.__startPageLoader();
        }
      } else {
        wrongCode();
      }
    }

    let primed = false;

    function pressKey(val) {
      errorEl.textContent = '';

      if (!primed) {
        primed = true;
        const a = document.getElementById('bg-audio');
        a.src = CONFIG.defaultSong.src;
        a.volume = 0;
        a.play().catch(() => {});
      }

      if (val === 'back') {
        entered = entered.slice(0, -1);
      } else if (entered.length < passcode.length) {
        entered += val;
      }

      renderDots();

      if (entered.length === passcode.length) {
        setTimeout(checkCode, 150);
      }
    }

    const keys = [
      '1','2','3',
      '4','5','6',
      '7','8','9',
      '',
      '0',
      'back'
    ];

    keys.forEach(k => {
      const btn = document.createElement('button');
      btn.className = 'lock-key';

      if (k === '') {
        btn.style.visibility = 'hidden';

      } else if (k === 'back') {
        btn.innerHTML = '&larr;';
        btn.addEventListener('click', () => pressKey('back'));

      } else {
        btn.textContent = k;
        btn.addEventListener('click', () => pressKey(k));
      }

      keypad.appendChild(btn);
    });

    avatar.addEventListener('click', () => {
      hintText.textContent = CONFIG.passcodeHint;
    });

    document.addEventListener('keydown', (e) => {
      if (solved) return;
      if (e.key >= '0' && e.key <= '9') {
        pressKey(e.key);
      } else if (e.key === 'Backspace') {
        pressKey('back');
      }
    });

    renderDots();
  }


  /* ---------- click flowers: a little lily blooms wherever you click ---------- */
  (function clickFlowers() {
    const colors = ['#F6F1EA', '#FF6F9C', '#FFC857', '#C9C0DC'];

    function lilySVG(color) {
      let petals = '';

      for (let i = 0; i < 6; i++) {
        petals += `<path
          d="M20 20 C 25 12, 25 4, 20 0 C 15 4, 15 12, 20 20 Z"
          fill="${color}"
          transform="rotate(${i * 60} 20 20)"
        />`;
      }

      return `<svg
        width="32"
        height="32"
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        ${petals}
        <circle cx="20" cy="20" r="3" fill="#FFC857"/>
      </svg>`;
    }

    document.addEventListener('click', (e) => {
      const color = colors[Math.floor(Math.random() * colors.length)];

      const flower = document.createElement('div');
      flower.className = 'click-flower';
      flower.style.left = `${e.clientX}px`;
      flower.style.top = `${e.clientY}px`;
      flower.innerHTML = lilySVG(color);

      document.body.appendChild(flower);

      setTimeout(() => flower.remove(), 900);
    });
  })();

  /* =====================================================================
    EDIT ME FIRST — everything personal lives in this one config object.
    Swap the placeholders, leave the code below alone unless you want to.
    ===================================================================== */
  const CONFIG = {
    herName: "Nour",
    yourName: "Ayoub",

    // Shown one at a time when she draws from the jar. Add as many as you want.
    reasons: [
      "you remember tiny things I mention once, weeks later",
      "you turn a boring text conversation into the best part of my day",
      "your terrible taste in shows that I now also love",
      "the specific way you type when you're actually laughing versus just being polite",
      "you're the first person I want to text good news",
      "you make me want to be more patient, more generous, more everything good",
      "how much I already can't wait to actually meet you",
      "you never let me take myself too seriously",
      "our texts somehow turning into three-hour conversations, every time"
    ],

      // The 4-digit code she needs to unlock the site, and a hint shown
      // when she taps the photo. Make the hint actually point to the code
      // (e.g. a date, if the photo means something specific).
      passcode: "1909",
      passcodeHint: "Your Birthday Date",

    // "How well do we know each other" — edit questions/options/answer per your relationship.
    // correctIndex is the index (starting at 0) of the right option.
    quiz: [
      {
        q: "How did we start talking?",
        options: ["Through mutual friends", "On social media", "A dating app", "In a Discord server"],
        correctIndex: 1
      },
      {
        q: "How do we mostly talk?",
        options: ["Nonstop texting", "A few texts a day", "Random check-ins", "Paragraphs at 2am"],
        correctIndex: 1
      },
      {
        q: "What was the first thing I said to you?",
        options: ["It's been a while","Cutie (replied to your story) ", "Stop viewing my profile !!!", "Wanna be friends??"],
        correctIndex: 2
      }
    ],

    // Photo slots. This points at real files in the "photos" folder next
    // to this script — just replace those 4 files with your own photos,
    // keeping the exact same filenames (photo1.jpg, photo2.jpg, etc).
    // No code editing needed for this part.
    photos: [
      { src: "photos/the most cutie one.jpeg", caption: "the pic I open when I miss her (which is often)" },
      { src: "photos/pfp.jpeg", caption: "she doesn't even know how good this one is" },
      { src: "photos/pic1.jpg", caption: "dangerously cute, should be illegal" },
      { src: "photos/pic3.jpeg", caption: "cute enough to make me forget what I was texting about" },
      { src: "photos/pijamas.jpeg", caption: "she's the reason I've been smiling at my phone like an idiot" },
      { src: "photos/glasses.jpeg", caption: "the one that made me stop scrolling" },
      { src: "photos/pinky.jpeg", caption: "this is what I picture when I miss you" },
      { src: "photos/white shirt.jpeg", caption: "my type, apparently, is exactly her" },
      { src: "photos/nawara.jpg", caption: "can't wait for there to be more of these, in person"},
      { src: "photos/vid.mp4", caption: "twirling her hair like she doesn't know what she's doing to me" }
    ],

    // Revealed under the scratch card. Keep it short — it's handwritten-style font.
    letter:
  `Hey you,

  I know I couldn't get you something big this year, so I built you this instead.

  Every part of this page is true — the reasons, the questions, all of it.
  I'm genuinely glad you're part of my life right now, distance and all.

  Happy birthday. I mean every bit of this.

  — ${"" /* leave blank, filled in below */}`,

    // IOU coupons. Cheap or free ideas work great here.
    coupons: [
      { tag: "good for one", title: "movie night, watched apart but texting the whole time", sub: "live-reacting counts, spoilers don't" },
      { tag: "good for one", title: "voice memo whenever you need one", sub: "redeemable any day, no reason needed" },
      { tag: "good for one", title: "fully planned first date, for whenever we finally meet", sub: "I've already got ideas" },
      { tag: "good for one", title: "switching to calls or video, anytime you want", sub: "just say the word — no pressure either way" },
      { tag: "good for one", title: "one free 'you were right'", sub: "use it during our next argument" }
    ],

    // Backup only: used for the "open email to send this" button that
    // shows up if the automatic server-side send isn't working (e.g. not
    // hosted with PHP yet). Opens Gmail's compose page pre-filled — works
    // best if this is a Gmail address. The real destination is
    // NOTIFY_EMAIL in backend/config.php — keep both the same.
    yourEmail: "hbibiiayoubb@gmail.com",

    
    // The open-ended question at the end. She'll type a free-text answer.
    futureQuestion: "how do you see us, down the line?",

    // Add as many songs as you want here — the "change song" button and
    // the picker screen both build themselves from this list automatically.
  songs: [
    { label: "Lovers Rock", src: "music/Lovers Rock.mp3" },
    { label: "My Kind of Woman", src: "music/My Kind of Woman.mp3" },
    { label: "Min Shaf Habibi", src: "music/Min Shaf Habibi.mp3" }
  ],
  moreSongs: [
    { label: "Wa Habibi", src: "music/Wa Habibi.mp3" },
    { label: "What You Heard", src: "music/what you heard.mp3" },
    { label: "Transform", src: "music/Transform.mp3" },
    { label: "Awel Kol Haga", src: "music/awel kol haga.mp3" }
  ],

    // Optional PHP+MySQL feature — see backend/README for setup.
    // If the fetch fails (no server, opened as a local file, etc.) this
    // local list is used instead so the site still works with zero setup.
    fallbackNotes: [
      "still thinking about that thing you said the other day",
      "you make Tuesdays feel less like Tuesdays",
      "just wanted this to say hi in the middle of your day",
      "grateful for you, plainly and simply, today"
    ],

    // Shown as draggable cards she can reorder into her ideal day.
    dateCards: [
      "dinner somewhere new",
      "a long walk, no destination",
      "movie night",
      "dessert after",
      "just talking for hours"
    ],

    defaultSong: {
    label: "American Wedding",
    src: "music/American Wedding.mp3"
  },

    // Shown one at a time as a fake "excuse" for texting her again. Add as many as you want.
  excuses: [
    "I was going to wait an hour before texting you again but I have no self control",
    "in my defense, I thought of you first and asked questions later",
    "I told myself I'd wait until tomorrow. that lasted 20 minutes",
    "I have a very serious and ongoing thinking-about-you problem",
    "this isn't a text, this is a scheduled check-in with myself",
    "I blame you for being memorable enough to think about this much",
    "I was busy, and then I wasn't, and then you happened"
  ],

    readReceipts: [
      { time: "Read 11:47 PM", joke: "typed for 4 minutes. sent nothing." },
      { time: "Read 2:13 AM", joke: "opened instantly. replied 6 hours later with 'lol'" },
      { time: "Read 9:02 PM", joke: "seen. left on read for the rest of the night." },
      { time: "Read 12:30 PM", joke: "read while actively posting on Instagram. bold." },
      { time: "Read 7:15 AM", joke: "read before I even finished typing the second text." },
      { time: "Read 3:41 PM", joke: "double-texted myself out of pure anxiety after this one." },
      { time: "Read 10:58 PM", joke: "read, then sent a meme instead of an actual reply." }
    ],

    // Shown as draggable cards she can reorder into her ideal day.
    quietDaysNotes: [
    "no matter how quiet it gets, this doesn't change.",
    "distance and silence don't mean distance in how I feel.",
    "however busy things get, you're still the one I'm thinking about.",
    "quiet days happen. I'm not going anywhere.",
    "however long it's been, I'm still glad you're the one I'm doing this with."
  ],
    honestNote: "I won't pretend I have this all figured out — the distance, the timing, none of it comes with guarantees. some days that's a little scary, if I'm honest. but I'm choosing this anyway, and I'd rather be honestly unsure with you than certain about anything else. no pressure on you to have it figured out either. we'll get there, or we won't, but I'm glad we're trying.",
  };
  CONFIG.letter = CONFIG.letter.replace(/— $/, `— ${CONFIG.yourName}`);
  lockScreen();



  /* =====================================================================
    Below this line: the actual site logic. Safe to leave as-is.
    ===================================================================== */

  document.querySelectorAll('[data-name-slot], [data-name-slot-2]').forEach(el => {
    el.textContent = CONFIG.herName;
  });
  document.querySelectorAll('[data-yourname-slot]').forEach(el => {
    el.textContent = CONFIG.yourName;
  });
  document.getElementById('future-question').textContent = CONFIG.futureQuestion;

  /* ---------- star field ---------- */
  (function stars() {
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');
    let stars = [];
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: Math.floor((canvas.width * canvas.height) / 22000) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        s: Math.random() * 0.02 + 0.005,
        p: Math.random() * Math.PI * 2
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const st of stars) {
        st.p += st.s;
        const alpha = 0.35 + Math.sin(st.p) * 0.35;
        ctx.fillStyle = `rgba(246,241,234,${Math.max(0, alpha)})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    window.addEventListener('resize', resize);
    resize();
    draw();
  })();

  /* ---------- scroll progress bar ---------- */
  (function scrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    update();
  })();

  /* ---------- build the date: drag to reorder ---------- */
  /* ---------- build the date: drag to reorder, follows the cursor ---------- */
  (function dateBuilder() {
    const container = document.getElementById('date-cards');
    const lockBtn = document.getElementById('date-lock-btn');
    const result = document.getElementById('date-result');

    function renumber() {
      container.querySelectorAll('.date-card').forEach((card, i) => {
        card.querySelector('.num').textContent = i + 1;
      });
    }

    function flipSiblings(mutate) {
      const cards = [...container.querySelectorAll('.date-card:not(.dragging)')];
      const first = new Map(cards.map(c => [c, c.getBoundingClientRect()]));
      mutate();
      cards.forEach(c => {
        const before = first.get(c);
        const after = c.getBoundingClientRect();
        const dy = before.top - after.top;
        if (dy) {
          c.style.transition = 'none';
          c.style.transform = `translateY(${dy}px)`;
          requestAnimationFrame(() => {
            c.style.transition = 'transform 0.2s ease';
            c.style.transform = '';
          });
        }
      });
    }

    function makeDraggable(card) {
      let dragging = false;
      let startY = 0, startTop = 0, startLeft = 0, width = 0;
      let placeholder = null;

      function onDown(e) {
        dragging = true;
        card.setPointerCapture(e.pointerId);
        const rect = card.getBoundingClientRect();
        startY = e.clientY;
        startTop = rect.top;
        startLeft = rect.left;
        width = rect.width;

        placeholder = document.createElement('div');
        placeholder.className = 'date-card-placeholder';
        placeholder.style.height = rect.height + 'px';
        container.insertBefore(placeholder, card.nextSibling);

        card.classList.add('dragging');
        card.style.position = 'fixed';
        card.style.top = startTop + 'px';
        card.style.left = startLeft + 'px';
        card.style.width = width + 'px';
        card.style.zIndex = 1000;
      }

      function onMove(e) {
        if (!dragging) return;
        const dy = e.clientY - startY;
        card.style.top = (startTop + dy) + 'px';

        const siblings = [...container.querySelectorAll('.date-card:not(.dragging)')];
        let closest = null;
        let closestDist = Infinity;
        siblings.forEach(sib => {
          const rect = sib.getBoundingClientRect();
          const dist = Math.abs(e.clientY - (rect.top + rect.height / 2));
          if (dist < closestDist) { closestDist = dist; closest = sib; }
        });
        if (closest) {
          const rect = closest.getBoundingClientRect();
          const before = e.clientY < rect.top + rect.height / 2;
          const target = before ? closest : closest.nextSibling;
          if (target !== placeholder) {
            flipSiblings(() => container.insertBefore(placeholder, target));
          }
        }
      }

      function onUp() {
        if (!dragging) return;
        dragging = false;
        card.classList.remove('dragging');
        card.style.position = '';
        card.style.top = '';
        card.style.left = '';
        card.style.width = '';
        card.style.zIndex = '';
        container.insertBefore(card, placeholder);
        placeholder.remove();
        placeholder = null;
        renumber();
      }

      card.addEventListener('pointerdown', onDown);
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerup', onUp);
      card.addEventListener('pointercancel', onUp);
    }

    function render() {
      container.innerHTML = '';
      CONFIG.dateCards.forEach((item, i) => {
        const card = document.createElement('div');
        card.className = 'date-card';
        card.innerHTML = `<span class="num">${i + 1}</span><span>${item}</span>`;
        container.appendChild(card);
        makeDraggable(card);
      });
    }

    lockBtn.addEventListener('click', () => {
      const order = [...container.querySelectorAll('.date-card span:last-child')].map(s => s.textContent);
      result.textContent = `locked in: ${order.join(' → ')} — I'm taking notes.`;
    });

    render();
  })();

  /* ---------- quiet days: gentle reassurance, cycled on tap ---------- */
  (function quietDays() {
    const noteEl = document.getElementById('receipt-joke');
    const nextBtn = document.getElementById('receipt-next');
    if (!nextBtn) return;
    let pool = [...CONFIG.quietDaysNotes];

    function show() {
      if (pool.length === 0) pool = [...CONFIG.quietDaysNotes];
      const idx = Math.floor(Math.random() * pool.length);
      noteEl.textContent = pool.splice(idx, 1)[0];
    }
    nextBtn.addEventListener('click', show);
  })();

  /* ---------- voice message recorder (no server needed — native share or download) ---------- */
  (function voiceRecorder() {
    const recordBtn = document.getElementById('record-btn');
    const status = document.getElementById('record-status');
    const preview = document.getElementById('voice-preview');
    const shareBtn = document.getElementById('voice-share-btn');
    const downloadLink = document.getElementById('voice-download-link');

    let mediaRecorder;
    let chunks = [];
    let recording = false;
    let audioBlob = null;

    recordBtn.addEventListener('click', async () => {
      if (!recording) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          chunks = [];
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
          mediaRecorder.onstop = () => {
            audioBlob = new Blob(chunks, { type: 'audio/webm' });
            const url = URL.createObjectURL(audioBlob);
            preview.src = url;
            preview.style.display = 'block';
            shareBtn.style.display = 'inline-block';
            downloadLink.href = url;
            downloadLink.style.display = 'inline-block';
            stream.getTracks().forEach(t => t.stop());
          };
          mediaRecorder.start();
          recording = true;
          recordBtn.textContent = 'stop recording';
          status.textContent = 'recording...';
        } catch (err) {
          status.textContent = "couldn't access the microphone — check your browser's permission settings";
        }
      } else {
        mediaRecorder.stop();
        recording = false;
        recordBtn.textContent = 'record again';
        status.textContent = 'got it — listen back below, then send';
      }
    });

    shareBtn.addEventListener('click', async () => {
      if (!audioBlob) return;
      const file = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'A voice message for you',
            text: 'here you go'
          });
          status.textContent = 'sent — thank you for that';
        } catch (err) {
          // she cancelled the share sheet — not an error, just do nothing
        }
      } else {
        status.textContent = "your browser can't send directly — use the download button and send it through whatever app you like";
      }
    });
  })();

  /* ---------- confetti burst (lightweight, no deps) ---------- */
  function confettiBurst(originX, originY, count = 60) {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const colors = ['#FFC857', '#FF6F9C', '#67E8B0', '#F6F1EA'];
    const pieces = Array.from({ length: count }, () => ({
      x: originX, y: originY,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * -10 - 4,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 0
    }));
    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of pieces) {
        p.vy += 0.35;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life++;
        if (p.life < 140) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - p.life / 140);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      if (alive) requestAnimationFrame(frame);
      else canvas.remove();
    }
    frame();
  }


  /* ---------- music player (single box: change-song icon + label + volume) ---------- */
  const musicPlayer = (function createMusicPlayer() {
    const audio = document.getElementById('bg-audio');
    const player = document.getElementById('music-player');
    const volume = document.getElementById('music-volume');
    const label = document.getElementById('current-song-label');
    const pauseBtn = document.getElementById('pause-toggle');
    const iconPlay = pauseBtn.querySelector('.pause-icon-play');
    const iconPause = pauseBtn.querySelector('.pause-icon-pause');

    audio.volume = volume.value / 100;

    function setPlaying(isPlaying) {
      if (isPlaying) {
        player.classList.add('playing');
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
        pauseBtn.setAttribute('aria-label', 'Pause');
      } else {
        player.classList.remove('playing');
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        pauseBtn.setAttribute('aria-label', 'Play');
      }
    }
    function playSong(song) {
      if (!audio.src.endsWith(song.src)) {
        audio.src = song.src;
        label.textContent = song.label;
      }
      audio.volume = volume.value / 100;
      audio.play().catch(() => setPlaying(false));
    }

    function stop() {
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute('src');
      audio.load();
      label.textContent = 'no music';
      setPlaying(false);
    }

    audio.addEventListener('play',  () => setPlaying(true));

    audio.addEventListener('pause', () => setPlaying(false));
    audio.addEventListener('error', () => {
      setPlaying(false);
      label.textContent = 'song failed to load';
    });

    function toggle() {
      if (!audio.src) return;
      if (audio.paused) {
        audio.play().catch(() => {});
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    }

    pauseBtn.addEventListener('click', toggle);
    label.addEventListener('click', toggle);

    volume.addEventListener('input', () => {
      audio.volume = volume.value / 100;
    });

    return { audio, playSong, stop, setPlaying };
  })();

  /* ---------- song picker overlay: built from CONFIG.songs, reopenable anytime ---------- */
  (function songPicker() {
    const overlay = document.getElementById('song-choice-overlay');
    const buttonsWrap = document.getElementById('song-choice-buttons');
    const moreButtonsWrap = document.getElementById('song-choice-buttons-more');
    const skipBtn = document.getElementById('choose-song-skip');
    const noneBtn = document.getElementById('choose-song-none');
    const changeBtn = document.getElementById('change-song-btn');
    const audio = document.getElementById('bg-audio');

    function openOverlay(onDone) {
      function close() {
        overlay.classList.remove('show');
        if (onDone) onDone();
      }
      function renderInto(wrap, list) {
        wrap.innerHTML = '';
        list.forEach(song => {
          const btn = document.createElement('button');
          btn.className = 'btn-primary';
          btn.textContent = song.label;
                  btn.addEventListener('click', () => {
            musicPlayer.playSong(song);
            close();
          });
          wrap.appendChild(btn);
        });
      }
      renderInto(buttonsWrap, CONFIG.songs);
      renderInto(moreButtonsWrap, CONFIG.moreSongs);
          skipBtn.onclick = () => {
        const alreadyPlaying = audio.src.endsWith(CONFIG.defaultSong.src) && !audio.paused;
        if (!alreadyPlaying) {
          musicPlayer.playSong(CONFIG.defaultSong);
        }
        close();
      };
      if (noneBtn) {
        noneBtn.onclick = () => {
          musicPlayer.stop();
          close();
        };
      }
      overlay.classList.add('show');
    }

    changeBtn.addEventListener('click', () => openOverlay());

    // exposed so the balloon gate can trigger the first prompt with a callback
    window.__openSongPicker = openOverlay;
  })();

  /* ---------- gate: balloon pop ---------- */
  (function balloons() {
    const field = document.getElementById('balloon-field');
    const enterBtn = document.getElementById('enter-btn');
    const colors = ['#FF6F9C', '#FFC857', '#67E8B0', '#C9C0DC'];
    let popped = 0;
    const need = 3;
    colors.forEach((c, i) => {
      const b = document.createElement('div');
      b.className = 'balloon';
      b.style.background = c;
      b.style.animationDelay = `${i * 0.3}s`;
      b.addEventListener('click', () => {
        if (b.classList.contains('popped')) return;
        b.classList.add('popped');
        const rect = b.getBoundingClientRect();
        confettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 26);
        popped++;
        if (popped >= need) {
          enterBtn.disabled = false;
          enterBtn.textContent = 'come on in';
        } else {
          enterBtn.textContent = `pop ${need - popped} more`;
        }
      });
      field.appendChild(b);
    });
    enterBtn.addEventListener('click', () => {
      window.__openSongPicker(() => {
        document.getElementById('cake-station').scrollIntoView({ behavior: 'smooth' });
      });
    });
  })();

  /* ---------- honest note: hidden behind a small dot in the footer ---------- */
  (function honestNote() {
    const dot = document.getElementById('honest-dot');
    const note = document.getElementById('honest-note');
    if (!dot) return;
    let revealed = false;
    dot.addEventListener('click', () => {
      if (!revealed) {
        note.textContent = CONFIG.honestNote;
        revealed = true;
      }
      note.classList.toggle('show');
    });
  })();

  /* ---------- cake: blow out candle ---------- */
  (function cake() {
    const wrap = document.getElementById('cake-wrap');
    const flame = document.getElementById('flame');
    const hint = document.getElementById('cake-hint');
    let blown = false;
    wrap.addEventListener('click', (e) => {
      if (blown) return;
      blown = true;
      flame.classList.add('out');
      hint.textContent = 'wish made. it\'s already coming true, probably.';
      confettiBurst(e.clientX, e.clientY, 80);
    });
  })();

  /* ---------- do you love me (dodging no button) ---------- */
  (function dylm() {
    const yes = document.getElementById('dylm-yes');
    const no = document.getElementById('dylm-no');
    const face = document.getElementById('dylm-face');
    const question = document.getElementById('dylm-question');
    const card = document.getElementById('dylm-card');
    let dodges = 0;

    function dodge() {
      dodges++;
      const cardRect = card.getBoundingClientRect();
      const maxX = Math.max(0, cardRect.width - no.offsetWidth - 40);
      const maxY = Math.max(0, 40);
      const x = Math.random() * maxX - maxX / 2;
      const y = (Math.random() - 0.5) * 30;
      no.style.transform = `translate(${x}px, ${y}px)`;
      face.textContent = ['🥺', '😳', '🙈', '😅'][dodges % 4];
    }

    no.addEventListener('mouseenter', dodge);
    no.addEventListener('touchstart', (e) => { e.preventDefault(); dodge(); }, { passive: false });
    no.addEventListener('click', (e) => { e.preventDefault(); dodge(); });

    yes.addEventListener('click', () => {
      face.textContent = '🥰';
      question.textContent = 'knew it, i love you too my pookie.';
      no.style.display = 'none';
      yes.textContent = 'obviously';
      confettiBurst(window.innerWidth / 2, card.getBoundingClientRect().top + 40, 50);
    });
  })();

  /* ---------- jar of reasons ---------- */
  (function jar() {
    const jarSvg = document.getElementById('jar-svg');
    const reasonBox = document.getElementById('jar-reason');
    const countLabel = document.getElementById('jar-count');
    let pool = [...CONFIG.reasons];
    let drawn = 0;
    const total = CONFIG.reasons.length;

    function draw() {
      if (pool.length === 0) {
        reasonBox.textContent = `that's all ${total} — want to hear them again? tap once more`;
        pool = [...CONFIG.reasons];
        drawn = 0;
        countLabel.textContent = '';
        return;
      }
      const idx = Math.floor(Math.random() * pool.length);
      const reason = pool.splice(idx, 1)[0];
      reasonBox.textContent = reason;
      drawn++;
      countLabel.textContent = `${drawn} of ${total} drawn`;
    }
    jarSvg.addEventListener('click', draw);
    reasonBox.addEventListener('click', draw);
  })();



  /* ---------- quiz ---------- */
  (function quiz() {
    const card = document.getElementById('quiz-card');
    let i = 0;
    let score = 0;

    function render() {
      if (i >= CONFIG.quiz.length) {
        card.innerHTML = `
          <p class="quiz-result">${score} of ${CONFIG.quiz.length} — and honestly, the number doesn't matter, I'm just happy we're still learning each other.</p>
        `;
        return;
      }
      const item = CONFIG.quiz[i];
      card.innerHTML = `
        <p class="quiz-progress">question ${i + 1} of ${CONFIG.quiz.length}</p>
        <p class="quiz-q">${item.q}</p>
        <div class="quiz-opts">
          ${item.options.map((opt, oi) => `<button class="quiz-opt" data-i="${oi}">${opt}</button>`).join('')}
        </div>
      `;
      card.querySelectorAll('.quiz-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          const chosen = parseInt(btn.dataset.i, 10);
          card.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);
          if (chosen === item.correctIndex) {
            btn.classList.add('correct');
            score++;
          } else {
            btn.classList.add('wrong');
            card.querySelector(`[data-i="${item.correctIndex}"]`).classList.add('correct');
          }
          const next = document.createElement('button');
          next.className = 'btn-ghost';
          next.style.marginTop = '1rem';
          next.textContent = i + 1 >= CONFIG.quiz.length ? 'see result' : 'next question';
          next.addEventListener('click', () => { i++; render(); });
          card.appendChild(next);
        });
      });
    }
    render();
  })();

  /* ---------- photo strip ---------- */
  (function photos() {
    const strip = document.getElementById('photo-strip');
    const videoExts = ['.mp4', '.webm', '.mov', '.ogg'];
    function isVideo(src) {
      const lower = src.toLowerCase();
      return videoExts.some(ext => lower.endsWith(ext));
    }
    CONFIG.photos.forEach((p, idx) => {
      const fig = document.createElement('figure');
      fig.className = 'polaroid';
      fig.style.setProperty('--r', `${(idx % 2 === 0 ? -1 : 1) * (2 + idx)}deg`);
      if (!p.src) {
        fig.innerHTML = `<div style="width:100%;height:140px;background:var(--night-3);display:flex;align-items:center;justify-content:center;color:var(--lav);font-size:0.8rem;">add photo</div>`;
      } else if (isVideo(p.src)) {
        fig.innerHTML = `<video src="${p.src}" autoplay loop muted playsinline style="width:100%;height:140px;object-fit:cover;display:block;background:var(--night-3);"></video>`;
      } else {
        fig.innerHTML = `<img src="${p.src}" alt="${p.caption}">`;
      }
      const cap = document.createElement('figcaption');
      cap.textContent = p.caption;
      fig.appendChild(cap);
      strip.appendChild(fig);
    });
  })();

  /* ---------- letter scratch card ---------- */
  (function scratch() {
    const textEl = document.getElementById('letter-text');
    textEl.textContent = CONFIG.letter;
    const canvas = document.getElementById('scratch-canvas');
    const frame = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    let scratching = false;
    let revealed = false;

    function size() {
      const rect = frame.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.fillStyle = '#2F2350';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#F6F1EA';
      ctx.font = '500 15px Karla, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('scratch here', canvas.width / 2, canvas.height / 2);
      ctx.globalCompositeOperation = 'destination-out';
    }
    window.addEventListener('resize', size);
    size();

    function pos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    }
    function scratchAt(x, y) {
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fill();
    }
    function checkDone() {
      if (revealed) return;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let cleared = 0;
      for (let i = 3; i < data.length; i += 4 * 40) {
        if (data[i] < 40) cleared++;
      }
      const ratio = cleared / (data.length / (4 * 40));
      if (ratio > 0.55) {
        revealed = true;
        canvas.style.transition = 'opacity 0.5s ease';
        canvas.style.opacity = '0';
        setTimeout(() => canvas.style.display = 'none', 500);
      }
    }
    function start(e) { scratching = true; const p = pos(e); scratchAt(p.x, p.y); }
    function move(e) {
      if (!scratching) return;
      e.preventDefault();
      const p = pos(e);
      scratchAt(p.x, p.y);
      checkDone();
    }
    function end() { scratching = false; }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, { passive: true });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end);
  })();

  /* ---------- coupon deck ---------- */
  (function coupons() {
    const deck = document.getElementById('coupon-deck');
    const nextBtn = document.getElementById('coupon-next');
    let i = 0;

    function render() {
      const c = CONFIG.coupons[i];
      deck.innerHTML = `
        <div class="coupon">
          <span class="tag">${c.tag}</span>
          <span class="title">${c.title}</span>
          <span class="sub">${c.sub}</span>
        </div>
      `;
    }
    function advance() {
      i = (i + 1) % CONFIG.coupons.length;
      render();
    }
    nextBtn.addEventListener('click', advance);
    deck.addEventListener('click', advance);
    render();
  })();

  /* ---------- future question: free-text, saved via PHP+MySQL if set up ---------- */
  (function futureQuestion() {
    const input = document.getElementById('future-input');
    const error = document.getElementById('future-error');
    const btn = document.getElementById('future-submit');
    const response = document.getElementById('future-response');

    btn.addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) {
        error.textContent = 'type something first — even one word';
        input.focus();
        return;
      }
      error.textContent = '';
      btn.disabled = true;
      btn.textContent = 'sending…';

      fetch('backend/save_answer.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: text })
      })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => (data && data.ok) ? true : Promise.reject())
        .then(() => {
          response.innerHTML = `<span class="label">sent &mdash; I'll read this.</span>${text.replace(/</g, '&lt;')}`;
          response.classList.add('show');
          btn.textContent = 'sent';
          input.disabled = true;
        })
        .catch(() => {
          // This site isn't hosted with working PHP yet, so nothing can be
          // sent automatically — a browser alone can't send email on its own.
          // Link straight to Gmail's web compose page (pre-filled, ready to
          // send) instead of mailto: — mailto: needs a mail app registered
          // on the device, which most phones/browsers don't have set up.
          const subject = encodeURIComponent('my answer');
          const mailBody = encodeURIComponent(text);
          const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONFIG.yourEmail)}&su=${subject}&body=${mailBody}`;
          response.innerHTML = `
            <span class="label">this couldn't reach me automatically yet &mdash; once the site's hosted, it will. for now:</span>
            ${text.replace(/</g, '&lt;')}
            <div style="margin-top:0.9rem;"><a href="${gmailLink}" target="_blank" rel="noopener" class="btn-ghost" style="display:inline-block;">open email to send this</a></div>
          `;
          response.classList.add('show');
          btn.textContent = 'try again once hosted';
          btn.disabled = false;
        });
    });
  })();

  /* ---------- excuse generator: cycled on tap ---------- */
  (function excuseGenerator() {
    const box = document.getElementById('note-box');
    const nextBtn = document.getElementById('note-next');
    if (!box || !nextBtn) return;
    let pool = [...CONFIG.excuses];

    function show() {
      if (pool.length === 0) pool = [...CONFIG.excuses];
      const idx = Math.floor(Math.random() * pool.length);
      box.textContent = pool.splice(idx, 1)[0];
    }

    nextBtn.addEventListener('click', show);
  })();
                                    
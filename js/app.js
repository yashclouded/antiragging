/**
 * KRISHNA SINGH // ASHOKA ANTI-RAGGING COMMITTEE 2026
 * APPLE/AWWWARDS-GRADE HORIZONTAL SCROLLYTELLING ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. ACOUSTIC HAPTIC AUDIO SYNTHESIZER
  // ==========================================================================
  class HapticAudio {
    constructor() {
      this.ctx = null;
      this.enabled = localStorage.getItem('arc_sound_enabled') === 'true';
      this.initUI();
    }

    initCtx() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playClick() {
      if (!this.enabled) return;
      try {
        this.initCtx();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.025);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.025);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.025);
      } catch (e) {}
    }

    playStamp() {
      if (!this.enabled) return;
      try {
        this.initCtx();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.09);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.09);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.09);
      } catch (e) {}
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('arc_sound_enabled', this.enabled);
      if (this.enabled) {
        this.initCtx();
        this.playClick();
      }
      this.updateUI();
    }

    initUI() {
      const toggleBtn = document.getElementById('audioToggleBtn');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => this.toggle());
        this.updateUI();
      }
    }

    updateUI() {
      const toggleBtn = document.getElementById('audioToggleBtn');
      const label = document.getElementById('audioToggleLabel');
      if (toggleBtn && label) {
        if (this.enabled) {
          toggleBtn.classList.add('active');
          label.textContent = 'Haptics: ON';
        } else {
          toggleBtn.classList.remove('active');
          label.textContent = 'Haptics: OFF';
        }
      }
    }
  }

  const sound = new HapticAudio();

  // ==========================================================================
  // 2. VIRTUAL HORIZONTAL SCROLLYTELLING ENGINE
  // ==========================================================================
  const trackContainer = document.getElementById('scrollTrackContainer');
  const horizontalRail = document.getElementById('horizontalRail');
  const progressBar = document.getElementById('scrollProgressBar');
  const kineticSeal = document.getElementById('kineticSealWrap');
  const bgParallaxText = document.querySelector('.broadsheet-bg-parallax');
  const navItems = document.querySelectorAll('#chapterNav .nav-item');
  const scenes = document.querySelectorAll('.h-scene');

  let maxTranslateX = 0;
  let scrollTrackHeight = 0;
  let currentX = 0;
  let targetX = 0;
  let prevScrollY = window.scrollY;
  let scrollVelocity = 0;
  let finaleTriggered = false;

  function recalculateMetrics() {
    if (!horizontalRail || !trackContainer) return;
    
    // Total horizontal distance to travel
    const railWidth = horizontalRail.scrollWidth;
    const windowWidth = window.innerWidth;
    maxTranslateX = Math.max(0, railWidth - windowWidth);

    // Height of vertical track container required to scroll through horizontal rail
    scrollTrackHeight = maxTranslateX + window.innerHeight;
    trackContainer.style.height = `${scrollTrackHeight}px`;
  }

  window.addEventListener('resize', () => {
    recalculateMetrics();
  });
  recalculateMetrics();

  // Smooth RAF Animation Loop
  function tick() {
    // Current vertical scroll progress
    const scrollY = window.scrollY;
    const trackTop = trackContainer ? trackContainer.offsetTop : 0;
    const effectiveScroll = Math.max(0, scrollY - trackTop);
    const progress = Math.min(1, Math.max(0, effectiveScroll / maxTranslateX));

    // Target X position on rail
    targetX = progress * maxTranslateX;

    // Physics-based lerp interpolation
    const ease = 0.12;
    currentX += (targetX - currentX) * ease;

    // Velocity tracking for 3D kinetic effects
    scrollVelocity = (scrollY - prevScrollY);
    prevScrollY = scrollY;

    // Apply horizontal translation
    if (horizontalRail) {
      horizontalRail.style.transform = `translate3d(-${currentX.toFixed(2)}px, 0, 0)`;
    }

    // Update Progress Bar
    if (progressBar) {
      progressBar.style.width = `${(progress * 100).toFixed(2)}%`;
    }

    // Kinetic 3D Seal Rotation
    if (kineticSeal) {
      const sealRot = (progress * 540) % 360;
      const sealTilt = Math.min(25, Math.max(-25, scrollVelocity * 0.4));
      kineticSeal.style.setProperty('--seal-rot', `${sealRot.toFixed(1)}deg`);
      kineticSeal.style.setProperty('--seal-tilt', `${sealTilt.toFixed(1)}deg`);
    }

    // Broadsheet Background Parallax
    if (bgParallaxText) {
      const parallaxOffset = currentX * 0.35;
      bgParallaxText.style.setProperty('--bg-parallax-x', `-${parallaxOffset.toFixed(1)}px`);
    }

    // Active Chapter Indicator in Nav
    let activeIndex = 0;
    scenes.forEach((scene, index) => {
      const sceneLeft = scene.offsetLeft;
      const sceneWidth = scene.offsetWidth;
      if (currentX >= sceneLeft - window.innerWidth * 0.4) {
        activeIndex = index;
      }
    });

    navItems.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Check if Finale is in view to trigger counter animation
    const finaleScene = document.getElementById('pledge');
    if (finaleScene && !finaleTriggered) {
      const finaleLeft = finaleScene.offsetLeft;
      if (currentX >= finaleLeft - window.innerWidth * 0.6) {
        finaleTriggered = true;
        animatePledgeCounter();
      }
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  // Smooth Chapter Navigation on Click
  document.querySelectorAll('[data-nav-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      sound.playClick();
      const targetIndex = parseInt(link.getAttribute('data-nav-target'), 10);
      const targetScene = scenes[targetIndex];
      if (targetScene && trackContainer) {
        const sceneLeft = targetScene.offsetLeft;
        const targetProgress = Math.min(1, sceneLeft / maxTranslateX);
        const targetScrollY = trackContainer.offsetTop + targetProgress * maxTranslateX;
        
        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });
      }
    });
  });

  // Keyboard Arrow Navigation (← / →)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
    }
  });

  // Touch Swipe for Mobile Navigation
  let touchStartX = 0;
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!e.touches.length) return;
    const deltaX = touchStartX - e.touches[0].clientX;
    const deltaY = touchStartY - e.touches[0].clientY;
    
    // If predominantly horizontal swipe on touch, map to vertical scroll
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      window.scrollBy({ top: deltaX * 0.8, behavior: 'auto' });
      touchStartX = e.touches[0].clientX;
    }
  }, { passive: true });

  // ==========================================================================
  // 3. LETTERS TO KRISHNA (INTERACTIVE Q&A TELEGRAM FEED)
  // ==========================================================================
  const defaultQuestions = [
    {
      id: 'q-1',
      author: 'Kabir V. (UG26)',
      category: 'Campus Safety',
      question: 'How quickly does committee intervention kick in after an incident report is filed?',
      response: "Within 24 hours mandatory under our proposed statute. No administrative gatekeeping. The student representative is directly notified and immediately opens proceedings.",
      authorRole: 'Krishna Singh',
      status: 'POLICY PLEDGE',
      upvotes: 42,
      time: '2 hours ago'
    },
    {
      id: 'q-2',
      author: 'Ashoka Sports Society Member',
      category: 'Initiation Rituals',
      question: 'How do you plan to handle sports team and dance society "trials" that border on mental hazing?',
      response: "We are introducing a mandatory Dean-approved onboarding charter. No closed-door hazing rituals disguised as 'bonding'. Committee student observers will conduct unannounced walkthroughs during induction week.",
      authorRole: 'Krishna Singh',
      status: 'ANSWERED',
      upvotes: 38,
      time: '5 hours ago'
    },
    {
      id: 'q-3',
      author: 'Anonymous Student',
      category: 'Whistleblower Shield',
      question: 'How do we know our identity won’t be leaked to the administration or the accused?',
      response: "Reports sent via the proposed Whistleblower Vault are stripped of metadata. Complainants receive an encrypted private token to communicate without revealing their name until they choose to do so.",
      authorRole: 'Krishna Singh',
      status: 'ANSWERED',
      upvotes: 56,
      time: 'Yesterday'
    },
    {
      id: 'q-4',
      author: 'Hostel Resident (RH4)',
      category: 'Freshmen Care',
      question: 'What happens in off-campus setups like late-night dhabas or Parker mall visits?',
      response: "Ragging jurisdiction follows Ashoka student conduct bylaws even outside campus gates. Any reported coercion at off-campus hangouts triggers immediate ARC investigation with zero tolerance.",
      authorRole: 'Krishna Singh',
      status: 'IN COMMITTEE QUEUE',
      upvotes: 29,
      time: 'Yesterday'
    }
  ];

  const STORAGE_Q_KEY = 'ashoka_arc_questions_feed';
  let storedQuestions = JSON.parse(localStorage.getItem(STORAGE_Q_KEY));
  if (!storedQuestions || !Array.isArray(storedQuestions) || storedQuestions.length === 0) {
    storedQuestions = defaultQuestions;
    localStorage.setItem(STORAGE_Q_KEY, JSON.stringify(storedQuestions));
  }

  const UPVOTED_KEY = 'ashoka_arc_upvoted_ids';
  let upvotedIds = JSON.parse(localStorage.getItem(UPVOTED_KEY)) || [];
  const questionsContainer = document.getElementById('questionsFeedContainer');

  function renderQuestions() {
    if (!questionsContainer) return;

    questionsContainer.innerHTML = storedQuestions.map(q => {
      const isUpvoted = upvotedIds.includes(q.id);

      return `
        <article class="q-item-clean" data-id="${q.id}">
          <div class="q-meta-clean">
            <span>${escapeHtml(q.author)} // ${escapeHtml(q.category)}</span>
            <span style="font-weight: 700; color: var(--c-black);">${escapeHtml(q.status)}</span>
          </div>
          <div class="q-text-clean">"${escapeHtml(q.question)}"</div>
          ${q.response ? `
            <div class="q-answer-clean">
              <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--c-red); display: block; margin-bottom: 0.2rem;">KRISHNA SINGH:</span>
              ${escapeHtml(q.response)}
            </div>
          ` : `
            <div class="q-answer-clean" style="border-left-color: var(--c-red);">
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--c-red);">Submitted to Candidate Queue</span>
            </div>
          `}
          <div class="q-foot-clean">
            <span style="font-family: var(--font-mono); font-size: 0.7rem; color: #888;">${escapeHtml(q.time || 'Recently')}</span>
            <button class="btn-upvote-clean ${isUpvoted ? 'upvoted' : ''}" data-id="${q.id}">
              ▲ SUPPORT (${q.upvotes})
            </button>
          </div>
        </article>
      `;
    }).join('');

    questionsContainer.querySelectorAll('.btn-upvote-clean').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const id = btn.getAttribute('data-id');
        handleUpvote(id);
      });
    });

    // Recalculate metrics when feed updates
    recalculateMetrics();
  }

  function handleUpvote(id) {
    const qIndex = storedQuestions.findIndex(item => item.id === id);
    if (qIndex === -1) return;

    if (upvotedIds.includes(id)) {
      upvotedIds = upvotedIds.filter(item => item !== id);
      storedQuestions[qIndex].upvotes = Math.max(0, storedQuestions[qIndex].upvotes - 1);
    } else {
      upvotedIds.push(id);
      storedQuestions[qIndex].upvotes += 1;
    }

    localStorage.setItem(UPVOTED_KEY, JSON.stringify(upvotedIds));
    localStorage.setItem(STORAGE_Q_KEY, JSON.stringify(storedQuestions));
    renderQuestions();
  }

  // Form submission
  const askForm = document.getElementById('askKrishnaForm');
  const anonToggle = document.getElementById('inquiryAnonymous');
  const authorInput = document.getElementById('inquiryAuthor');
  const categorySelect = document.getElementById('inquiryCategory');
  const questionInput = document.getElementById('inquiryQuestion');

  if (anonToggle && authorInput) {
    anonToggle.addEventListener('change', () => {
      sound.playClick();
      if (anonToggle.checked) {
        authorInput.value = 'Anonymous Ashokan';
        authorInput.disabled = true;
      } else {
        authorInput.value = '';
        authorInput.disabled = false;
      }
    });
  }

  if (askForm) {
    askForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sound.playStamp();

      const newQuestion = {
        id: `q-${Date.now()}`,
        author: authorInput.value.trim() || 'Ashoka Student',
        category: categorySelect.value,
        question: questionInput.value.trim(),
        response: "Thank you for raising this. This directly informs our mandate for the Anti-Ragging Committee. Every inquiry receives our full attention and a 24-hour hearing mandate.",
        authorRole: 'Krishna Singh',
        status: 'SUBMITTED',
        upvotes: 1,
        time: 'Just now'
      };

      storedQuestions.unshift(newQuestion);
      localStorage.setItem(STORAGE_Q_KEY, JSON.stringify(storedQuestions));
      renderQuestions();

      // Reset form
      questionInput.value = '';
      if (!anonToggle.checked) {
        authorInput.value = '';
      }
    });
  }

  renderQuestions();

  // ==========================================================================
  // 4. LIVE MONUMENTAL PLEDGE COUNTER
  // ==========================================================================
  const PLEDGE_KEY = 'ashoka_arc_ballot_pledged';
  const BASE_COUNT = 648;
  const isPledged = localStorage.getItem(PLEDGE_KEY) === 'true';

  const heroPledgeBtn = document.getElementById('heroPledgeBtn');
  const heroPledgeCount = document.getElementById('heroPledgeCount');
  const finalePledgeBtn = document.getElementById('pledgeActionBtn');
  const finaleCounterDisplay = document.getElementById('pledgeCounterDisplay');
  const pledgeStatusMsg = document.getElementById('pledgeStatusMsg');

  function updatePledgeUI() {
    const currentTally = isPledged ? BASE_COUNT + 1 : BASE_COUNT;

    if (heroPledgeCount) {
      heroPledgeCount.textContent = `${currentTally}+`;
    }
    if (finaleCounterDisplay) {
      finaleCounterDisplay.textContent = currentTally;
    }

    if (isPledged) {
      if (heroPledgeBtn) {
        heroPledgeBtn.classList.add('pledged');
        heroPledgeBtn.innerHTML = '✓ VOTE PLEDGED';
      }
      if (finalePledgeBtn) {
        finalePledgeBtn.classList.add('pledged');
        finalePledgeBtn.innerHTML = '✓ SOLIDARITY PLEDGED FOR KRISHNA SINGH';
      }
      if (pledgeStatusMsg) {
        pledgeStatusMsg.textContent = 'Solidarity Recorded • Thank you for standing for a fearless campus.';
      }
    }
  }

  function handlePledgeClick() {
    sound.playStamp();
    if (localStorage.getItem(PLEDGE_KEY) === 'true') {
      localStorage.removeItem(PLEDGE_KEY);
      location.reload();
    } else {
      localStorage.setItem(PLEDGE_KEY, 'true');
      location.reload();
    }
  }

  if (heroPledgeBtn) {
    heroPledgeBtn.addEventListener('click', handlePledgeClick);
  }
  if (finalePledgeBtn) {
    finalePledgeBtn.addEventListener('click', handlePledgeClick);
  }

  function animatePledgeCounter() {
    if (!finaleCounterDisplay) return;
    const target = isPledged ? BASE_COUNT + 1 : BASE_COUNT;
    let current = 0;
    const duration = 1200;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const val = Math.floor(ease * target);
      finaleCounterDisplay.textContent = val;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        finaleCounterDisplay.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  updatePledgeUI();

  // Escape HTML helper
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return m;
      }
    });
  }
});

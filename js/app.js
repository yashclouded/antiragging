/**
 * KRISHNA SINGH // ASHOKA ANTI-RAGGING COMMITTEE CAMPAIGN
 * APPLE-GRADE SMOOTH INTERACTION ENGINE & HAPTIC AUDIO
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Apple-Grade Haptic Audio Synthesizer (Subtle, Acoustic, Crisp)
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
        // Subtle haptic pop (like macOS trackpad or iOS keyboard haptic)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.025);
        
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.025);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.025);
      } catch (e) {
        // Silent fallback
      }
    }

    playStamp() {
      if (!this.enabled) return;
      try {
        this.initCtx();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.08);
        
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
      } catch (e) {
        // Silent fallback
      }
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

  // Attach haptic feedback to interactive items
  document.querySelectorAll('button, .nav-link, .filter-btn, .feed-cat-btn').forEach(elem => {
    elem.addEventListener('click', () => sound.playClick());
  });

  // 2. Pledge & Endorsement Counter
  const PLEDGE_KEY = 'ashoka_krishna_pledged_count';
  const USER_PLEDGED_KEY = 'ashoka_krishna_has_pledged';
  const baseCount = 648;

  let currentCount = parseInt(localStorage.getItem(PLEDGE_KEY), 10) || baseCount;
  let hasPledged = localStorage.getItem(USER_PLEDGED_KEY) === 'true';

  const countDisplay = document.getElementById('pledgeCounterDisplay');
  const heroCountDisplay = document.getElementById('heroPledgeCount');
  const pledgeBtn = document.getElementById('pledgeActionBtn');
  const heroPledgeBtn = document.getElementById('heroPledgeBtn');
  const pledgeStatus = document.getElementById('pledgeStatusMsg');

  function updatePledgeUI() {
    if (countDisplay) countDisplay.textContent = currentCount.toLocaleString();
    if (heroCountDisplay) heroCountDisplay.textContent = `${currentCount}+`;

    if (hasPledged) {
      if (pledgeBtn) {
        pledgeBtn.textContent = '✓ Endorsement Secured (Ballot #01)';
        pledgeBtn.style.background = 'var(--c-black)';
        pledgeBtn.style.color = 'var(--c-cream)';
        pledgeBtn.style.boxShadow = '5px 5px 0px var(--c-red)';
      }
      if (heroPledgeBtn) {
        heroPledgeBtn.textContent = '✓ Vote Pledged';
        heroPledgeBtn.style.background = 'var(--c-black)';
        heroPledgeBtn.style.color = 'var(--c-cream)';
        heroPledgeBtn.style.boxShadow = '5px 5px 0px var(--c-red)';
      }
      if (pledgeStatus) {
        pledgeStatus.textContent = 'STATUS: YOUR ENDORSEMENT IS LOGGED FOR KRISHNA SINGH • ARC 2026';
      }
    }
  }

  function handlePledge() {
    sound.playStamp();
    if (!hasPledged) {
      hasPledged = true;
      currentCount += 1;
      localStorage.setItem(USER_PLEDGED_KEY, 'true');
      localStorage.setItem(PLEDGE_KEY, currentCount);
    } else {
      hasPledged = false;
      currentCount -= 1;
      localStorage.setItem(USER_PLEDGED_KEY, 'false');
      localStorage.setItem(PLEDGE_KEY, currentCount);
      if (pledgeBtn) {
        pledgeBtn.textContent = 'PLEDGE YOUR VOTE FOR KRISHNA';
        pledgeBtn.style.background = '';
        pledgeBtn.style.color = '';
        pledgeBtn.style.boxShadow = '';
      }
      if (heroPledgeBtn) {
        heroPledgeBtn.textContent = 'PLEDGE VOTE';
        heroPledgeBtn.style.background = '';
        heroPledgeBtn.style.color = '';
        heroPledgeBtn.style.boxShadow = '';
      }
      if (pledgeStatus) {
        pledgeStatus.textContent = '';
      }
    }
    updatePledgeUI();
  }

  if (pledgeBtn) pledgeBtn.addEventListener('click', handlePledge);
  if (heroPledgeBtn) heroPledgeBtn.addEventListener('click', handlePledge);
  updatePledgeUI();

  // 3. Initial Community Questions Database
  const defaultQuestions = [
    {
      id: 'q-1',
      author: 'UG27 Freshmen (RH2)',
      category: 'Campus Safety',
      question: 'Will there be protection for first-years who report intimidation or informal "intro sessions" in the residence halls?',
      response: "100% yes. My #1 policy is the Whistleblower Vault with zero administrative retaliation. Any senior intimidating a complainant faces an instant suspension of residential campus privileges pending the 24-hour inquiry.",
      authorRole: 'Krishna Singh',
      status: 'POLICY PLEDGE',
      upvotes: 42,
      time: '2 hours ago'
    },
    {
      id: 'q-2',
      author: 'Ashoka Sports Society Member',
      category: 'Initiation Rituals',
      question: 'How do you plan to handle traditional sports team and dance society "trials" that border on mental hazing?',
      response: "We are introducing a mandatory Dean-approved onboarding charter for all club and sports inductions. No closed-door hazing rituals disguised as 'bonding'. Committee student observers will conduct unannounced walkthroughs during induction week.",
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
      response: "Reports sent via the proposed Whistleblower Vault are stripped of metadata and client IP addresses before reaching the committee. Complainants receive an encrypted private token to communicate without revealing their name until they choose to do so.",
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
  const feedCountBadge = document.getElementById('feedCountBadge');
  let currentCategoryFilter = 'All';

  function renderQuestions() {
    if (!questionsContainer) return;

    const filtered = currentCategoryFilter === 'All' 
      ? storedQuestions 
      : storedQuestions.filter(q => q.category.toLowerCase() === currentCategoryFilter.toLowerCase());

    if (feedCountBadge) {
      feedCountBadge.textContent = `${filtered.length} Inquiries Displayed`;
    }

    if (filtered.length === 0) {
      questionsContainer.innerHTML = `
        <div class="q-card" style="padding: 3rem; text-align: center;">
          <p style="color: #ffffff; font-weight: 600;">No inquiries in this category yet.</p>
          <p style="font-size: 0.9rem; color: var(--text-tertiary); margin-top: 0.5rem;">Be the first to submit a question on the left.</p>
        </div>
      `;
      return;
    }

    questionsContainer.innerHTML = filtered.map(q => {
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
              <span style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; color: var(--c-red); display: block; margin-bottom: 0.25rem;">KRISHNA SINGH:</span>
              ${escapeHtml(q.response)}
            </div>
          ` : `
            <div class="q-answer-clean" style="border-left-color: var(--c-red);">
              <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--c-red);">Submitted to Candidate Queue</span>
            </div>
          `}
          <div class="q-foot-clean">
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #888;">${escapeHtml(q.time || 'Recently')}</span>
            <button class="btn-upvote-clean ${isUpvoted ? 'upvoted' : ''}" data-id="${q.id}" aria-label="Support this inquiry">
              ▲ SUPPORT (${q.upvotes})
            </button>
          </div>
        </article>
      `;
    }).join('');

    questionsContainer.querySelectorAll('.btn-upvote').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const id = btn.getAttribute('data-id');
        handleUpvote(id);
      });
    });
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

  // Question Form Submission
  const askForm = document.getElementById('askKrishnaForm');
  const anonymousCheckbox = document.getElementById('inquiryAnonymous');
  const authorInput = document.getElementById('inquiryAuthor');
  const categorySelect = document.getElementById('inquiryCategory');
  const questionInput = document.getElementById('inquiryQuestion');
  const submitBtn = document.getElementById('btnSubmitInquiry');

  if (anonymousCheckbox && authorInput) {
    anonymousCheckbox.addEventListener('change', () => {
      sound.playClick();
      if (anonymousCheckbox.checked) {
        authorInput.value = 'Anonymous Ashokan';
        authorInput.disabled = true;
      } else {
        authorInput.value = '';
        authorInput.disabled = false;
        authorInput.placeholder = 'e.g. Kabir / UG26 / RH3';
      }
    });
  }

  if (askForm) {
    askForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const questionText = questionInput.value.trim();
      if (!questionText) return;

      let authorName = authorInput.value.trim();
      if (anonymousCheckbox.checked || !authorName) {
        authorName = 'Anonymous Ashokan';
      }

      const category = categorySelect.value || 'Campus Safety';

      const newQuestion = {
        id: 'q-' + Date.now(),
        author: authorName,
        category: category,
        question: questionText,
        response: generateImmediateResponse(questionText, category),
        authorRole: 'Krishna Singh',
        status: 'ANSWERED',
        upvotes: 1,
        time: 'Just now'
      };

      storedQuestions.unshift(newQuestion);
      localStorage.setItem(STORAGE_Q_KEY, JSON.stringify(storedQuestions));

      sound.playStamp();

      submitBtn.textContent = '✓ Inquiry Posted';
      submitBtn.style.background = 'var(--crimson-alert)';
      submitBtn.style.color = '#fff';
      submitBtn.style.boxShadow = '0 6px 20px var(--crimson-glow)';

      setTimeout(() => {
        submitBtn.textContent = 'SUBMIT INQUIRY TO KRISHNA';
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        submitBtn.style.boxShadow = '';
      }, 2500);

      questionInput.value = '';
      if (!anonymousCheckbox.checked) {
        authorInput.value = '';
      }

      renderQuestions();

      const firstCard = questionsContainer.firstElementChild;
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  function generateImmediateResponse(text, cat) {
    const lower = text.toLowerCase();
    if (lower.includes('anonymous') || lower.includes('privacy') || lower.includes('identity')) {
      return "Thank you for raising this. Guaranteeing student privacy is our non-negotiable benchmark. The Whistleblower Vault ensures no complainant identity is shared with accused parties or unauthorized faculty.";
    } else if (lower.includes('hostel') || lower.includes('dorm') || lower.includes('room') || lower.includes('night') || lower.includes('bus')) {
      return "Hostel and transit safety require dedicated peer wardens on duty. We are mandating designated student ARC liaisons and bus monitoring protocols so no student feels vulnerable.";
    } else if (lower.includes('club') || lower.includes('society') || lower.includes('inductions') || lower.includes('sports')) {
      return "Strict anti-hazing bylaws will be enforced across all student societies and athletic rosters. Any induction involving humiliation will result in immediate club de-recognition.";
    } else {
      return "Thank you for this query. This is factored directly into our campaign platform. Every complaint received will be resolved with a strict 24-hour hearing mandate. I stand with you.";
    }
  }

  // Category Filter Buttons
  document.querySelectorAll('.feed-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.feed-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategoryFilter = btn.getAttribute('data-cat') || 'All';
      renderQuestions();
    });
  });

  // Manifesto Filter Buttons
  document.querySelectorAll('.manifesto-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.manifesto-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      
      document.querySelectorAll('.pillar-card').forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Initial render
  renderQuestions();

  // 4. Pocket Manifesto Modal Controller
  const modal = document.getElementById('pocketManifestoModal');
  const openModalBtns = document.querySelectorAll('.open-pocket-manifesto');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const printManifestoBtn = document.getElementById('printManifestoBtn');
  const copyShareBtn = document.getElementById('copyShareBtn');

  function openModal() {
    sound.playClick();
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    sound.playClick();
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (printManifestoBtn) {
    printManifestoBtn.addEventListener('click', () => {
      sound.playStamp();
      window.print();
    });
  }

  if (copyShareBtn) {
    copyShareBtn.addEventListener('click', () => {
      sound.playClick();
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl).then(() => {
        copyShareBtn.textContent = '✓ Link Copied!';
        setTimeout(() => {
          copyShareBtn.textContent = 'Share on WhatsApp / Campus';
        }, 2000);
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // 5. SCROLL-BASED STORYTELLING & REVEAL ENGINE
  // =========================================================================
  const progressBar = document.getElementById('scrollProgressBar');

  // Reading progress tracker (fallback for non-CSS scroll-timeline browsers)
  function handleScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight > 0 && progressBar) {
      const scrolled = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
    }
  }

  window.addEventListener('scroll', handleScrollProgress, { passive: true });
  handleScrollProgress();

  // Storytelling Reveal Observer
  const revealElements = document.querySelectorAll('[data-scroll-reveal]');
  let hasAnimatedPledgeCounter = false;

  function animatePledgeCounter(targetNumber) {
    if (!countDisplay) return;
    const duration = 1400; // ms
    const startTime = performance.now();
    const startNumber = 0;

    function easeOutQuart(x) {
      return 1 - Math.pow(1 - x, 4);
    }

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(startNumber + (targetNumber - startNumber) * easeOutQuart(progress));
      countDisplay.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        countDisplay.textContent = targetNumber.toLocaleString();
      }
    }

    requestAnimationFrame(updateCounter);
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        
        // If this is the monumental pledge section and hasn't animated yet
        if (entry.target.dataset.scrollReveal === 'pledge' && !hasAnimatedPledgeCounter) {
          hasAnimatedPledgeCounter = true;
          animatePledgeCounter(currentCount);
        }

        // Keep observing or unobserve once revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Also immediately reveal any elements already in view on load
  setTimeout(() => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        el.classList.add('is-revealed');
      }
    });
  }, 100);
});


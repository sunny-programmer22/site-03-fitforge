/**
 * ==============================================================================
 * FitForge - HilltopAds Integration & Ad Zone Configuration Script
 * ==============================================================================
 * This script manages all 6 HilltopAds monetization ad zones:
 *   - Zone 1: Popunder / OnClick
 *   - Zone 2: In-Page Push (IPP) MultiTag
 *   - Zone 3: MultiTag Banners (728x90 Header Leaderboard & 300x250 Sidebar)
 *   - Zone 4: Video Slider MultiTag (Bottom-right Outstream unit)
 *   - Zone 5: Direct Link / SmartLink (Attached to high-intent CTA buttons)
 *   - Zone 6: Video VAST (Pre-roll ad stream for HTML5 HIIT Video Player)
 * ==============================================================================
 */

(function () {
  'use strict';

  // Master HilltopAds Configuration Object
  const HILLTOP_CONFIG = {
    debug: true, // Set to false in production
    publisherId: 'HTA_PUBLISHER_ID_HERE',

    // Zone 1: Popunder / OnClick
    zone1_popunder: {
      enabled: true,
      zoneId: 'ZONE_POPUNDER_001',
      scriptUrl: 'https://cdn.hilltopads.com/tag/popunder.js?zone=ZONE_POPUNDER_001', // Replace with real script tag
      fallbackUrl: 'https://fitforge-hub.trackdirect.link/popunder-click',
      frequencyHours: 0.1, // 6 minutes for demo/testing (set to 24 in prod)
      triggerOnAnyClick: true
    },

    // Zone 2: In-Page Push (IPP) MultiTag
    zone2_ipp: {
      enabled: true,
      zoneId: 'ZONE_IPP_002',
      scriptUrl: 'https://cdn.hilltopads.com/tag/ipp-multitag.js?zone=ZONE_IPP_002',
      fallbackDirectLink: 'https://fitforge-hub.trackdirect.link/fitness-ipp-offer',
      displayDelayMs: 2500,
      notification: {
        title: 'ðŸ”¥ New Shred Routine Unlocked!',
        message: 'Tap to view the 12-Week HIIT & Hypertrophy Blueprint (100% Free)',
        icon: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=100&h=100&fit=crop&crop=faces',
        badge: 'SPONSORED TIP'
      }
    },

    // Zone 3: MultiTag Banner Placements
    zone3_banners: {
      enabled: true,
      top728x90: {
        zoneId: 'ZONE_BANNER_TOP_728x90',
        scriptUrl: 'https://cdn.hilltopads.com/tag/banner.js?zone=ZONE_BANNER_TOP_728x90',
        targetContainerId: 'ad-slot-top-banner',
        defaultRedirect: 'https://fitforge-hub.trackdirect.link/banner-top-gear'
      },
      sidebar300x250: {
        zoneId: 'ZONE_BANNER_SIDEBAR_300x250',
        scriptUrl: 'https://cdn.hilltopads.com/tag/banner.js?zone=ZONE_BANNER_SIDEBAR_300x250',
        targetContainerId: 'ad-slot-sidebar-banner',
        defaultRedirect: 'https://fitforge-hub.trackdirect.link/banner-supplements'
      }
    },

    // Zone 4: Video Slider MultiTag
    zone4_videoSlider: {
      enabled: true,
      zoneId: 'ZONE_VIDEO_SLIDER_004',
      scriptUrl: 'https://cdn.hilltopads.com/tag/video-slider.js?zone=ZONE_VIDEO_SLIDER_004',
      targetContainerId: 'ad-slot-video-slider',
      slideInDelayMs: 4000,
      autoPlayMuted: true,
      directLinkUrl: 'https://fitforge-hub.trackdirect.link/video-slider-sponsor'
    },

    // Zone 5: Direct Link / SmartLink
    zone5_directLink: {
      enabled: true,
      zoneId: 'ZONE_SMARTLINK_005',
      smartLinkUrl: 'https://fitforge-hub.trackdirect.link/smartlink?zone=ZONE_SMARTLINK_005&sub=fitforge_cta',
      targets: [
        { selector: '#btn-download-plan', campaign: 'workout_plan_pdf' },
        { selector: '#btn-meal-guide', campaign: 'macro_meal_prep_guide' },
        { selector: '.smartlink-trigger', campaign: 'general_smartlink_button' }
      ]
    },

    // Zone 6: Video VAST (HTML5 Video Player Pre-Roll)
    zone6_videoVast: {
      enabled: true,
      zoneId: 'ZONE_VAST_006',
      vastUrl: 'https://cdn.hilltopads.com/vast/feed.xml?zone=ZONE_VAST_006',
      skipAfterSeconds: 5,
      adDurationSeconds: 15,
      companionDirectLink: 'https://fitforge-hub.trackdirect.link/vast-preroll-action',
      adCreativeSample: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-working-out-with-a-battle-rope-42860-large.mp4'
    }
  };

  // Helper log utility
  function log(message, ...args) {
    if (HILLTOP_CONFIG.debug) {
      console.log(`[HilltopAds Engine] ${message}`, ...args);
    }
  }

  /* ============================================================================
     Zone 1: Popunder / OnClick Implementation
     ============================================================================ */
  function initPopunder() {
    const config = HILLTOP_CONFIG.zone1_popunder;
    if (!config.enabled) return;

    log('Zone 1 (Popunder/OnClick) Initialized with Zone ID:', config.zoneId);

    // Dynamic Script Injection Placeholder for real HilltopAds tag
    if (config.scriptUrl && !config.scriptUrl.includes('ZONE_POPUNDER_001')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = config.scriptUrl;
      document.head.appendChild(script);
      log('Loaded live Popunder script:', config.scriptUrl);
      return;
    }

    // Client-side OnClick Popunder Trigger (HilltopAds emulation / fallback handler)
    const STORAGE_KEY = 'hta_popunder_last_trigger';
    let triggered = false;

    function handlePopunderClick(e) {
      if (triggered) return;

      const lastFired = localStorage.getItem(STORAGE_KEY);
      const now = Date.now();
      const cooldownMs = config.frequencyHours * 3600 * 1000;

      if (lastFired && now - parseInt(lastFired, 10) < cooldownMs) {
        log('Popunder capped by frequency setting');
        return;
      }

      // Do not trigger if clicking an explicit smartlink or video control directly
      if (e.target.closest('.no-popunder') || e.target.closest('video')) {
        return;
      }

      triggered = true;
      localStorage.setItem(STORAGE_KEY, now.toString());
      log('Popunder event triggered via user page click. Destination:', config.fallbackUrl);

      // Emulate HilltopAds window.open popunder / background tab
      try {
        const popWindow = window.open(config.fallbackUrl, '_blank');
        if (popWindow) {
          popWindow.blur();
          window.focus();
        }
      } catch (err) {
        log('Popunder popup blocked by browser policy:', err);
      }
    }

    document.addEventListener('click', handlePopunderClick, { once: false });
  }

  /* ============================================================================
     Zone 2: In-Page Push (IPP) MultiTag Implementation
     ============================================================================ */
  function initInPagePush() {
    const config = HILLTOP_CONFIG.zone2_ipp;
    if (!config.enabled) return;

    log('Zone 2 (In-Page Push MultiTag) Initialized with Zone ID:', config.zoneId);

    // If a live HilltopAds IPP script is provided, inject it
    if (config.scriptUrl && !config.scriptUrl.includes('ZONE_IPP_002')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = config.scriptUrl;
      document.body.appendChild(script);
      log('Injected external Hilltop IPP MultiTag script.');
      return;
    }

    // Interactive In-Page Push MultiTag UI Component
    setTimeout(() => {
      const existingIpp = document.getElementById('hta-ipp-container');
      if (existingIpp) return;

      const ippWrapper = document.createElement('aside');
      ippWrapper.id = 'hta-ipp-container';
      ippWrapper.className = 'hta-ipp-widget';
      ippWrapper.setAttribute('role', 'complementary');
      ippWrapper.setAttribute('aria-label', 'Recommended Fitness Notification');

      ippWrapper.innerHTML = `
        <div class="hta-ipp-card">
          <button class="hta-ipp-close" id="hta-ipp-close-btn" aria-label="Close notification">&times;</button>
          <div class="hta-ipp-badge">${config.notification.badge}</div>
          <div class="hta-ipp-body">
            <img src="${config.notification.icon}" alt="FitForge Alert" class="hta-ipp-thumb" />
            <div class="hta-ipp-text">
              <h4 class="hta-ipp-title">${config.notification.title}</h4>
              <p class="hta-ipp-desc">${config.notification.message}</p>
            </div>
          </div>
          <div class="hta-ipp-actions">
            <a href="${config.fallbackDirectLink}" target="_blank" rel="noopener noreferrer" class="hta-ipp-cta-btn">
              âš¡ Claim Access Now
            </a>
          </div>
          <span class="hta-ad-label-pill">Ad via HilltopAds Zone 2</span>
        </div>
      `;

      document.body.appendChild(ippWrapper);

      // Animate entry
      requestAnimationFrame(() => {
        ippWrapper.classList.add('visible');
      });

      // Close handler
      const closeBtn = document.getElementById('hta-ipp-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          ippWrapper.classList.remove('visible');
          setTimeout(() => ippWrapper.remove(), 400);
          log('User dismissed In-Page Push notification.');
        });
      }

      // Card click redirect
      ippWrapper.querySelector('.hta-ipp-card').addEventListener('click', (e) => {
        if (e.target.closest('#hta-ipp-close-btn')) return;
        log('User clicked In-Page Push notification. Redirecting to:', config.fallbackDirectLink);
        window.open(config.fallbackDirectLink, '_blank', 'noopener,noreferrer');
      });

    }, config.displayDelayMs);
  }

  /* ============================================================================
     Zone 3: MultiTag Banners (728x90 Top & 300x250 Sidebar)
     ============================================================================ */
  function initMultiTagBanners() {
    const config = HILLTOP_CONFIG.zone3_banners;
    if (!config.enabled) return;

    log('Zone 3 (MultiTag Banners) Initialized.');

    // 1. Top Banner 728x90
    const topSlot = document.getElementById(config.top728x90.targetContainerId);
    if (topSlot) {
      if (config.top728x90.scriptUrl && !config.top728x90.scriptUrl.includes('ZONE_BANNER_TOP_728x90')) {
        const script = document.createElement('script');
        script.async = true;
        script.src = config.top728x90.scriptUrl;
        topSlot.appendChild(script);
      } else {
        // High-engagement visual banner fallback slot
        topSlot.innerHTML = `
          <div class="hta-banner-wrapper banner-728x90">
            <span class="hta-ad-tagline">SPONSORED ADVERTISEMENT â€¢ HILLTOPADS ZONE 3 (728x90)</span>
            <a href="${config.top728x90.defaultRedirect}" target="_blank" rel="noopener noreferrer" class="hta-banner-link">
              <div class="banner-inner-content">
                <div class="banner-badge">SPECIAL OFFER</div>
                <div class="banner-headline">
                  <strong>TITAN ISO-WHEY PRO</strong>: Accelerate Recovery & Lean Mass Gains
                </div>
                <div class="banner-subtext">30g Pure Isolate Protein | Zero Sugar | 5.5g BCAAs</div>
                <button class="banner-btn">Shop 35% Off &rarr;</button>
              </div>
            </a>
          </div>
        `;
      }
    }

    // 2. Sidebar Banner 300x250
    const sidebarSlot = document.getElementById(config.sidebar300x250.targetContainerId);
    if (sidebarSlot) {
      if (config.sidebar300x250.scriptUrl && !config.sidebar300x250.scriptUrl.includes('ZONE_BANNER_SIDEBAR_300x250')) {
        const script = document.createElement('script');
        script.async = true;
        script.src = config.sidebar300x250.scriptUrl;
        sidebarSlot.appendChild(script);
      } else {
        sidebarSlot.innerHTML = `
          <div class="hta-banner-wrapper banner-300x250">
            <span class="hta-ad-tagline">SPONSORED â€¢ HILLTOPADS ZONE 3 (300x250)</span>
            <a href="${config.sidebar300x250.defaultRedirect}" target="_blank" rel="noopener noreferrer" class="hta-banner-link">
              <div class="banner-rect-content">
                <div class="rect-badge">PRE-WORKOUT EXPLOSION</div>
                <h4 class="rect-title">IGNITE YOUR PUMP & INTENSITY</h4>
                <p class="rect-desc">Clinical doses of L-Citrulline, Beta-Alanine & Natural Caffeine.</p>
                <div class="rect-cta">GET FREE TRIAL KIT &rarr;</div>
              </div>
            </a>
          </div>
        `;
      }
    }
  }

  /* ============================================================================
     Zone 4: Video Slider MultiTag (Bottom-Corner Outstream)
     ============================================================================ */
  function initVideoSlider() {
    const config = HILLTOP_CONFIG.zone4_videoSlider;
    if (!config.enabled) return;

    log('Zone 4 (Video Slider MultiTag) Initialized with Zone ID:', config.zoneId);

    const sliderContainer = document.getElementById(config.targetContainerId);
    if (!sliderContainer) return;

    // Real script injection path
    if (config.scriptUrl && !config.scriptUrl.includes('ZONE_VIDEO_SLIDER_004')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = config.scriptUrl;
      sliderContainer.appendChild(script);
      return;
    }

    // Built-in Slider Video Unit with interactive controls
    setTimeout(() => {
      sliderContainer.innerHTML = `
        <div class="hta-video-slider-card" id="hta-slider-card">
          <div class="hta-slider-header">
            <span class="hta-slider-badge">Featured Partner Video</span>
            <div class="hta-slider-controls">
              <button id="slider-mute-btn" title="Toggle Sound" aria-label="Mute / Unmute">ðŸ”Š</button>
              <button id="slider-close-btn" title="Close Video Ad" aria-label="Close ad">&times;</button>
            </div>
          </div>
          <div class="hta-slider-player-wrap">
            <video id="hta-slider-video" autoplay muted loop playsinline poster="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&auto=format&fit=crop&q=80">
              <source src="https://assets.mixkit.co/videos/preview/mixkit-young-man-training-with-battle-ropes-at-the-gym-42861-large.mp4" type="video/mp4">
              Your browser does not support HTML5 video.
            </video>
            <a href="${config.directLinkUrl}" target="_blank" rel="noopener noreferrer" class="hta-slider-overlay-click">
              <span class="hta-slider-cta-pill">Learn More &rarr;</span>
            </a>
          </div>
          <div class="hta-slider-footer">
            <span class="slider-brand">Sponsored: FitPulse Gear</span>
            <a href="${config.directLinkUrl}" target="_blank" rel="noopener noreferrer" class="slider-link">Visit Sponsor &raquo;</a>
          </div>
        </div>
      `;

      sliderContainer.classList.add('active');

      const closeBtn = document.getElementById('slider-close-btn');
      const muteBtn = document.getElementById('slider-mute-btn');
      const videoEl = document.getElementById('hta-slider-video');

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          sliderContainer.classList.remove('active');
          if (videoEl) videoEl.pause();
          log('Video slider ad closed by user.');
        });
      }

      if (muteBtn && videoEl) {
        muteBtn.addEventListener('click', () => {
          videoEl.muted = !videoEl.muted;
          muteBtn.textContent = videoEl.muted ? 'ðŸ”‡' : 'ðŸ”Š';
        });
      }
    }, config.slideInDelayMs);
  }

  /* ============================================================================
     Zone 5: Direct Link / SmartLink (CTAs & High-Conversion Buttons)
     ============================================================================ */
  function initDirectLink() {
    const config = HILLTOP_CONFIG.zone5_directLink;
    if (!config.enabled) return;

    log('Zone 5 (Direct Link / SmartLink) Initialized with Zone ID:', config.zoneId);

    // Attach to targeted high-intent action buttons
    config.targets.forEach((targetConfig) => {
      const elements = document.querySelectorAll(targetConfig.selector);
      elements.forEach((element) => {
        element.setAttribute('data-smartlink-active', 'true');
        element.addEventListener('click', function (e) {
          log(`SmartLink triggered by selector: ${targetConfig.selector} (Campaign: ${targetConfig.campaign})`);
          
          const targetUrl = new URL(config.smartLinkUrl);
          targetUrl.searchParams.set('campaign', targetConfig.campaign);
          targetUrl.searchParams.set('ts', Date.now().toString());

          // Open SmartLink in a new tab for monetization while keeping the user engaged
          window.open(targetUrl.toString(), '_blank', 'noopener,noreferrer');
        });
      });
    });

    // Delegated listener for any element with data-smartlink="true"
    document.addEventListener('click', function (e) {
      const smartLinkEl = e.target.closest('[data-smartlink="true"]');
      if (smartLinkEl && !smartLinkEl.getAttribute('data-smartlink-active')) {
        const campaign = smartLinkEl.getAttribute('data-campaign') || 'generic_smartlink';
        log(`Generic SmartLink click detected: ${campaign}`);
        const targetUrl = new URL(config.smartLinkUrl);
        targetUrl.searchParams.set('campaign', campaign);
        window.open(targetUrl.toString(), '_blank', 'noopener,noreferrer');
      }
    });
  }

  /* ============================================================================
     Zone 6: Video VAST (HTML5 Video Player Pre-Roll & Ad Pod)
     ============================================================================ */
  function initVideoVast() {
    const config = HILLTOP_CONFIG.zone6_videoVast;
    if (!config.enabled) return;

    log('Zone 6 (Video VAST Integration) Initialized with Zone ID:', config.zoneId);

    const videoPlayer = document.getElementById('hiit-video-player');
    const playerWrapper = document.getElementById('video-player-container');
    const adOverlay = document.getElementById('vast-ad-overlay');

    if (!videoPlayer || !playerWrapper || !adOverlay) {
      log('Video Player DOM elements for VAST not found. Waiting for user interaction.');
      return;
    }

    let adAlreadyPlayed = false;
    let countdownTimer = null;

    // Attach VAST pre-roll interception when user hits play
    const playTriggerBtn = document.getElementById('btn-play-hiit-workout');

    function startVastPreRoll() {
      if (adAlreadyPlayed) {
        resumeMainContent();
        return;
      }

      adAlreadyPlayed = true;
      log('Requesting HilltopAds VAST Tag:', config.vastUrl);

      // Render pre-roll ad overlay
      adOverlay.classList.remove('hidden');
      adOverlay.innerHTML = `
        <div class="vast-ad-frame">
          <div class="vast-ad-header">
            <span class="vast-badge">Ad â€¢ Sponsor Message (HilltopAds VAST Zone 6)</span>
            <div class="vast-skip-wrapper" id="vast-skip-wrapper">
              <span id="vast-skip-counter">Skip in ${config.skipAfterSeconds}s</span>
              <button id="vast-skip-btn" class="vast-skip-btn hidden">Skip Ad &raquo;</button>
            </div>
          </div>
          <video id="vast-ad-video" autoplay playsinline>
            <source src="${config.adCreativeSample}" type="video/mp4">
          </video>
          <div class="vast-ad-footer">
            <div class="vast-sponsor-info">
              <strong>SPONSORED: IronStrength Elite Series</strong>
              <p>Special 40% Off Community Pass for FitForge Members</p>
            </div>
            <a href="${config.companionDirectLink}" target="_blank" rel="noopener noreferrer" class="vast-cta-btn no-popunder">
              Visit Sponsor &rarr;
            </a>
          </div>
        </div>
      `;

      const adVideo = document.getElementById('vast-ad-video');
      const skipCounter = document.getElementById('vast-skip-counter');
      const skipBtn = document.getElementById('vast-skip-btn');

      let remainingSec = config.skipAfterSeconds;

      if (adVideo) {
        adVideo.play().catch(e => {
          log('VAST video autoplay issue (user gesture needed):', e);
        });

        adVideo.addEventListener('ended', () => {
          log('VAST pre-roll video playback completed.');
          finishAdAndResume();
        });
      }

      // Countdown to allow skip
      countdownTimer = setInterval(() => {
        remainingSec--;
        if (remainingSec > 0) {
          if (skipCounter) skipCounter.textContent = `Skip in ${remainingSec}s`;
        } else {
          clearInterval(countdownTimer);
          if (skipCounter) skipCounter.classList.add('hidden');
          if (skipBtn) {
            skipBtn.classList.remove('hidden');
            skipBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              log('User skipped VAST pre-roll.');
              finishAdAndResume();
            });
          }
        }
      }, 1000);

      function finishAdAndResume() {
        if (countdownTimer) clearInterval(countdownTimer);
        if (adVideo) adVideo.pause();
        adOverlay.classList.add('hidden');
        adOverlay.innerHTML = '';
        resumeMainContent();
      }
    }

    function resumeMainContent() {
      log('Resuming main HIIT Workout Video playback.');
      videoPlayer.play().catch(err => {
        log('Main video play error:', err);
      });
      const playOverlay = document.getElementById('video-custom-overlay');
      if (playOverlay) playOverlay.classList.add('playing');
    }

    if (playTriggerBtn) {
      playTriggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        startVastPreRoll();
      });
    }

    // Direct click on player poster trigger
    const videoPosterOverlay = document.getElementById('video-poster-click');
    if (videoPosterOverlay) {
      videoPosterOverlay.addEventListener('click', () => {
        startVastPreRoll();
      });
    }
  }

  // Global API exposure for testing & ad network tag swapping
  window.FitForgeAds = {
    config: HILLTOP_CONFIG,
    initPopunder,
    initInPagePush,
    initMultiTagBanners,
    initVideoSlider,
    initDirectLink,
    initVideoVast,
    reloadAll: function () {
      initPopunder();
      initInPagePush();
      initMultiTagBanners();
      initVideoSlider();
      initDirectLink();
      initVideoVast();
    }
  };

  // Bootstrap when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.FitForgeAds.reloadAll();
    });
  } else {
    window.FitForgeAds.reloadAll();
  }
})();


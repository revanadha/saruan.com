/**
 * ============================================================================
 * WEDDING INVITATION MAIN APPLICATION LOGIC
 * Sesuai Spesifikasi DESIGN.md & Standar Craftsmanship Antislop
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initGuestNameFromUrl();
  initHeroOpenInvitation();
  initCountdownTimer();
  initCalendarGenerator();
  initGalleryLightbox();
  initRsvpAndGuestbook();
  initClipboardCopy();
});

/* ----------------------------------------------------------------------------
   1. Dynamic Guest Name (?to=Nama+Tamu) (DESIGN.md 3.1)
   ---------------------------------------------------------------------------- */
function initGuestNameFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('to') || urlParams.get('u');
  const guestDisplayEl = document.getElementById('guest-name');

  if (guestDisplayEl) {
    if (guestParam && guestParam.trim() !== '') {
      const cleanGuestName = guestParam.trim();
      guestDisplayEl.textContent = cleanGuestName;
      document.title = `Undangan Pernikahan Dimas & Adinda untuk ${cleanGuestName}`;
    } else {
      guestDisplayEl.textContent = 'Tamu Undangan';
    }
  }
}

/* ----------------------------------------------------------------------------
   2. Audio Autoplay Workaround & Smooth Scroll (DESIGN.md 3.2)
   ---------------------------------------------------------------------------- */
function initHeroOpenInvitation() {
  const btnOpen = document.getElementById('btnOpenInvitation');
  if (!btnOpen) return;

  btnOpen.addEventListener('click', () => {
    // Jalankan alunan audio latar
    if (window.weddingAudio) {
      window.weddingAudio.play();
    }

    // Smooth scroll ke section kutipan / mempelai
    const targetSection = document.getElementById('kutipan') || document.getElementById('mempelai');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

/* ----------------------------------------------------------------------------
   3. Real-Time Countdown Interval (DESIGN.md 3.3)
   ---------------------------------------------------------------------------- */
function initCountdownTimer() {
  // Target: 24 Oktober 2026 pukul 08:00:00 WIB
  const targetDate = new Date('2026-10-24T08:00:00+07:00').getTime();

  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minutesEl = document.getElementById('countMinutes');
  const secondsEl = document.getElementById('countSeconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';

      const countdownHeader = document.querySelector('.countdown-section .section-title');
      if (countdownHeader) {
        countdownHeader.textContent = 'Acara Sedang / Telah Berlangsung';
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Pad leading zero (misal: 07 bukan 7)
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ----------------------------------------------------------------------------
   4. Tambah ke Kalender (Google Calendar & Unduh File .ics)
   ---------------------------------------------------------------------------- */
function initCalendarGenerator() {
  const btnGoogleCalendar = document.getElementById('btnGoogleCalendar');
  const btnIcsCalendar = document.getElementById('btnIcsCalendar');

  const eventTitle = encodeURIComponent('Pernikahan Dimas & Adinda');
  const eventDesc = encodeURIComponent('Akad & Resepsi Pernikahan Dimas Pratama dan Adinda Larasati. Kami sangat menantikan kehadiran Anda.');
  const eventLoc = encodeURIComponent('Plataran Botanical Heritage, Jl. Danau Sentani No. 8, Cilandak, Jakarta Selatan');

  // Format Waktu UTC untuk 24 Oktober 2026 08:00 - 14:00 WIB (01:00 - 07:00 UTC)
  const startTime = '20261024T010000Z';
  const endTime = '20261024T070000Z';

  if (btnGoogleCalendar) {
    btnGoogleCalendar.addEventListener('click', (e) => {
      e.preventDefault();
      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startTime}/${endTime}&details=${eventDesc}&location=${eventLoc}`;
      window.open(googleCalUrl, '_blank', 'noopener,noreferrer');
    });
  }

  if (btnIcsCalendar) {
    btnIcsCalendar.addEventListener('click', (e) => {
      e.preventDefault();
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Dimas & Adinda Wedding//ID',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'SUMMARY:Pernikahan Dimas & Adinda',
        'DESCRIPTION:Akad & Resepsi Pernikahan Dimas Pratama dan Adinda Larasati.',
        'LOCATION:Plataran Botanical Heritage, Jl. Danau Sentani No. 8, Cilandak, Jakarta Selatan',
        `DTSTART:${startTime}`,
        `DTEND:${endTime}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.setAttribute('download', 'undangan-dimas-adinda.ics');
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast('Jadwal acara telah diunduh ke kalender Anda.');
    });
  }
}

/* ----------------------------------------------------------------------------
   5. Lightbox Galeri Foto Interaktif (R-26 & R-32 Keyboard Navigable)
   ---------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev = document.getElementById('lightboxPrev');
  const btnNext = document.getElementById('lightboxNext');

  if (!modal || !lightboxImg || galleryItems.length === 0) return;

  let currentIndex = 0;
  const galleryData = Array.from(galleryItems).map((item) => {
    const img = item.querySelector('img');
    return {
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || 'Momen Bahagia Dimas & Adinda',
      caption: item.dataset.caption || img.getAttribute('alt') || ''
    };
  });

  function showImage(index) {
    if (index < 0) index = galleryData.length - 1;
    if (index >= galleryData.length) index = 0;
    currentIndex = index;

    lightboxImg.src = galleryData[currentIndex].src;
    lightboxImg.alt = galleryData[currentIndex].alt;
    lightboxCaption.textContent = galleryData[currentIndex].caption;
  }

  function openLightbox(index) {
    showImage(index);
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    if (btnClose) btnClose.focus();
  }

  function closeLightbox() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  if (btnClose) btnClose.addEventListener('click', closeLightbox);
  if (btnPrev) btnPrev.addEventListener('click', () => showImage(currentIndex - 1));
  if (btnNext) btnNext.addEventListener('click', () => showImage(currentIndex + 1));

  // Menutup saat klik di luar area foto
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  // Navigasi Keyboard (Escape, Panah Kiri, Panah Kanan)
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}

/* ----------------------------------------------------------------------------
   6. Buku Tamu & RSVP Interaktif (R-26, R-27, LocalStorage Persistence)
   ---------------------------------------------------------------------------- */
function initRsvpAndGuestbook() {
  const rsvpForm = document.getElementById('rsvpForm');
  const wishesListEl = document.getElementById('wishesList');
  const wishesCountEl = document.getElementById('wishesCount');
  const emptyStateEl = document.getElementById('wishesEmptyState');

  const STORAGE_KEY = 'dimas_adinda_wedding_wishes_v2';

  // Data Ucapan Awal
  const initialWishes = [
    {
      id: 1,
      name: 'Rian & Sarah',
      attendance: 'hadir',
      pax: '2 Orang',
      message: 'Selamat berbahagia Dimas dan Adinda. Semoga pernikahan kalian selalu dilimpahi keberkahan, sakinah, mawaddah, warahmah sampai akhir hayat.',
      time: '19 Okt 2026, 14:20'
    },
    {
      id: 2,
      name: 'Keluarga Bpk. Hartono',
      attendance: 'hadir',
      pax: '2 Orang',
      message: 'Barakallahu laka wa baraka alaika wa jamaa bainakuma fii khair. Turut berbahagia untuk kedua mempelai dan keluarga besar.',
      time: '19 Okt 2026, 11:05'
    },
    {
      id: 3,
      name: 'Anisa Citra',
      attendance: 'ragu',
      pax: '1 Orang',
      message: 'Happy wedding Adinda dan Mas Dimas. Insya Allah diusahakan hadir di waktu resepsi. Wishing you both a lifetime of happiness.',
      time: '18 Okt 2026, 19:40'
    }
  ];

  function getStoredWishes() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : initialWishes;
    } catch (e) {
      return initialWishes;
    }
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch (e) {
      console.warn('Unable to persist to localStorage', e);
    }
  }

  function renderWishes() {
    const wishes = getStoredWishes();

    if (wishesCountEl) {
      wishesCountEl.textContent = `${wishes.length} Doa Terkirim`;
    }

    if (!wishesListEl) return;

    if (wishes.length === 0) {
      if (emptyStateEl) emptyStateEl.style.display = 'block';
      wishesListEl.innerHTML = '';
      return;
    }

    if (emptyStateEl) emptyStateEl.style.display = 'none';

    wishesListEl.innerHTML = wishes.map((wish) => {
      let badgeClass = 'wish-status-hadir';
      let badgeLabel = 'Hadir';
      if (wish.attendance === 'ragu') {
        badgeClass = 'wish-status-ragu';
        badgeLabel = 'Masih Ragu';
      } else if (wish.attendance === 'absen') {
        badgeClass = 'wish-status-absen';
        badgeLabel = 'Berhalangan';
      }

      return `
        <div class="wish-item">
          <div class="wish-meta">
            <span class="wish-name">${escapeHtml(wish.name)}</span>
            <span class="wish-status-badge ${badgeClass}">${badgeLabel}</span>
          </div>
          <p class="wish-message">${escapeHtml(wish.message)}</p>
          <div class="wish-time">${wish.time} • ${wish.pax || '1 Orang'}</div>
        </div>
      `;
    }).join('');
  }

  // Render awal saat halaman dimuat
  renderWishes();

  if (!rsvpForm) return;

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('guestName');
    const attendanceInput = document.getElementById('attendanceStatus');
    const paxInput = document.getElementById('guestPax');
    const messageInput = document.getElementById('guestMessage');
    const submitBtn = rsvpForm.querySelector('.btn-submit-rsvp');

    let isValid = true;

    // Validasi Nama
    if (!nameInput.value.trim()) {
      nameInput.closest('.rsvp-form-group').classList.add('has-error');
      isValid = false;
    } else {
      nameInput.closest('.rsvp-form-group').classList.remove('has-error');
    }

    // Validasi Ucapan
    if (!messageInput.value.trim()) {
      messageInput.closest('.rsvp-form-group').classList.add('has-error');
      isValid = false;
    } else {
      messageInput.closest('.rsvp-form-group').classList.remove('has-error');
    }

    if (!isValid) return;

    // Loading State
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      <span>Mengirim doa restu...</span>
    `;

    setTimeout(() => {
      const now = new Date();
      const timeFormatted = now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + ', ' + now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const newWish = {
        id: Date.now(),
        name: nameInput.value.trim(),
        attendance: attendanceInput.value,
        pax: paxInput.value,
        message: messageInput.value.trim(),
        time: timeFormatted
      };

      const wishes = getStoredWishes();
      wishes.unshift(newWish);
      saveWishes(wishes);
      renderWishes();

      // Reset form
      rsvpForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      showToast('Doa restu dan konfirmasi Anda telah berhasil tersimpan!');
    }, 600);
  });
}

/* ----------------------------------------------------------------------------
   7. Clipboard Action dengan Feedback Visual "Tersalin! ✓" (DESIGN.md 2.F & 3.4)
   ---------------------------------------------------------------------------- */
function initClipboardCopy() {
  const copyButtons = document.querySelectorAll('.btn-copy-account, .btn-copy-address');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copyText;
      const targetLabel = btn.dataset.copyLabel || 'Nomor rekening';

      if (!textToCopy) return;

      const executeSuccessFeedback = () => {
        const originalHTML = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Tersalin! ✓</span>
        `;

        showToast(`${targetLabel} berhasil disalin ke clipboard!`);

        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = originalHTML;
        }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          executeSuccessFeedback();
        }).catch(() => {
          fallbackCopyText(textToCopy, executeSuccessFeedback);
        });
      } else {
        fallbackCopyText(textToCopy, executeSuccessFeedback);
      }
    });
  });
}

function fallbackCopyText(text, onSuccess) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  tempInput.style.position = 'fixed';
  tempInput.style.opacity = '0';
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    if (onSuccess) onSuccess();
  } catch (err) {
    showToast(`Silakan salin manual: ${text}`);
  }
  document.body.removeChild(tempInput);
}

/* ----------------------------------------------------------------------------
   Helper: Toast Notification Feedback
   ---------------------------------------------------------------------------- */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3200);
}

/* Helper: Escape HTML string */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================================
// Dinner at Quince Lakehouse — Frontend Logic
// ==========================================================

// *** CONFIGURATION ***
// Replace this URL with your deployed Google Apps Script web app URL
const API_URL = 'https://script.google.com/macros/s/AKfycbx8L3kF2hKAZ3-7UOVs46gRbCS1ToY6X1AEidt6P39f0FXmylv-GDi0EKTJU2BagfT2/exec';

// DOM Elements
const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');
const formMessage = document.getElementById('form-message');
const attendeeList = document.getElementById('attendee-list');
const guestCount = document.getElementById('guest-count');

// Field references
const nameInput = document.getElementById('name');
const partySizeInput = document.getElementById('party-size');
const dietaryInput = document.getElementById('dietary');

// ==========================================================
// Form Validation
// ==========================================================

function validateField(input, errorId, message) {
  const errorEl = document.getElementById(errorId);
  if (!input.value.trim()) {
    input.classList.add('invalid');
    errorEl.textContent = message;
    return false;
  }
  input.classList.remove('invalid');
  errorEl.textContent = '';
  return true;
}

function validatePartySize(input) {
  const errorEl = document.getElementById('party-size-error');
  const val = parseInt(input.value, 10);
  if (isNaN(val) || val < 1) {
    input.classList.add('invalid');
    errorEl.textContent = 'Party size must be at least 1.';
    return false;
  }
  input.classList.remove('invalid');
  errorEl.textContent = '';
  return true;
}

function validateForm() {
  const nameOk = validateField(nameInput, 'name-error', 'Name is required.');
  const partyOk = validatePartySize(partySizeInput);
  return nameOk && partyOk;
}

// Clear validation on input
[nameInput, partySizeInput].forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('invalid');
    const errorEl = document.getElementById(input.id + '-error');
    if (errorEl) errorEl.textContent = '';
  });
});

// ==========================================================
// Show/Hide Loading State
// ==========================================================

function setLoading(loading) {
  submitBtn.disabled = loading;
  btnText.hidden = loading;
  btnLoading.hidden = !loading;
}

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = 'form-message ' + type;
  formMessage.hidden = false;
  setTimeout(() => {
    formMessage.hidden = true;
  }, 5000);
}

// ==========================================================
// Submit Signup (POST)
// ==========================================================

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setLoading(true);
  formMessage.hidden = true;

  const payload = {
    name: nameInput.value.trim(),
    partySize: parseInt(partySizeInput.value, 10),
    dietary: dietaryInput.value.trim()
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === 'success') {
      showMessage("RSVP received! See y'all there!", 'success');
      form.reset();
      partySizeInput.value = '1';
      loadAttendees();
    } else {
      showMessage(result.message || 'Something went wrong. Please try again.', 'error');
    }
  } catch (err) {
    console.error('Submit error:', err);
    showMessage('Could not reach the server. Please try again later.', 'error');
  } finally {
    setLoading(false);
  }
});

// ==========================================================
// Load Attendee List (GET)
// ==========================================================

async function loadAttendees() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      attendeeList.innerHTML = '<p class="no-attendees">No guests yet — be the first!</p>';
      guestCount.textContent = '0 guests so far';
      return;
    }

    const totalGuests = data.reduce((sum, a) => sum + (parseInt(a.partySize, 10) || 1), 0);
    guestCount.textContent = `${totalGuests} guest${totalGuests !== 1 ? 's' : ''} so far`;

    attendeeList.innerHTML = data
      .map((attendee, i) => {
        const size = parseInt(attendee.partySize, 10) || 1;
        const partyLabel = size === 1 ? 'Solo' : `Party of ${size}`;
        return `
          <div class="attendee-card" style="animation-delay: ${i * 0.07}s">
            <span class="attendee-name">${escapeHtml(attendee.name)}</span>
            <span class="attendee-party">${partyLabel}</span>
          </div>
        `;
      })
      .join('');
  } catch (err) {
    console.error('Load attendees error:', err);
    attendeeList.innerHTML = '<p class="no-attendees">Could not load the guest list.</p>';
    guestCount.textContent = '—';
  }
}

// ==========================================================
// Utility
// ==========================================================

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ==========================================================
// Init
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  loadAttendees();
});

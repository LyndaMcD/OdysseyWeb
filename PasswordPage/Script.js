/*
  ============================================================
  script.js — the PUBLIC half of the lock.
  Safe for GitHub / Netlify. Contains no password, no numbers.
  ============================================================
*/

const CIPHERTEXT_B64 = "9fW7dUyHhGzSjdzrBaM4xUP1Gt+f+1Pchx9IxAcnTW/N";

// Matches the fixed reference value used in encrypt-LOCAL-ONLY.js
const FIXED_IV = new Uint8Array(12); // 12 zeros — must match the encrypt script

async function tryUnlock(passwordAttempt) {
    const enc = new TextEncoder();

    const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(passwordAttempt));
    const key = await crypto.subtle.importKey('raw', hashBuffer, 'AES-GCM', false, ['decrypt']);

    const ciphertext = Uint8Array.from(atob(CIPHERTEXT_B64), c => c.charCodeAt(0));

    try {
        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: FIXED_IV }, key, ciphertext);
        return new TextDecoder().decode(decrypted);
    } catch {
        return null;
    }
}

document.getElementById('submit-btn').addEventListener('click', handleAttempt);
document.getElementById('password-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAttempt();
});

async function handleAttempt() {
    const input = document.getElementById('password-input').value;
    const errorMsg = document.getElementById('error-msg');
    const revealArea = document.getElementById('reveal-area');

    const result = await tryUnlock(input);

    if (result) {
        errorMsg.textContent = '';
        window.location.href = result; // send the visitor to the unlocked page
    } else {
        revealArea.classList.add('hidden');
        errorMsg.textContent = 'Incorrect.';
    }
}

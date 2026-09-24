

const CIPHERTEXT_B64 = "U68+nHv27WqZJUixn9Ty1zFqLD9to/x0bcWVN6PaFdVW";

// Matches the fixed reference value used in encrypt-LOCAL-ONLY.js
const FIXED_IV = new Uint8Array(12); // 12 zeros — must match the encrypt script

async function tryUnlock(passwordAttempt) {
    const enc = new TextEncoder();

    // Step 1: run the same "blender" process on whatever the visitor typed
    const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(passwordAttempt));
    const key = await crypto.subtle.importKey('raw', hashBuffer, 'AES-GCM', false, ['decrypt']);

    // Step 2: turn the stored gibberish back into raw bytes
    const ciphertext = Uint8Array.from(atob(CIPHERTEXT_B64), c => c.charCodeAt(0));

    // Step 3: attempt to unscramble it using that key
    try {
        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: FIXED_IV }, key, ciphertext);
        return new TextDecoder().decode(decrypted); // success
    } catch {
        return null; // wrong password — fails cleanly, reveals nothing
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
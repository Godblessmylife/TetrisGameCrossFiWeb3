// Simple wallet connection helpers for Phantom and Solflare
async function connectWalletPhantom() {
    if (window.solana && window.solana.isPhantom) {
        try {
            const resp = await window.solana.connect();
            document.getElementById('walletAddress').innerText = resp.publicKey.toString();
        } catch (err) {
            console.error('Phantom connection error', err);
        }
    } else {
        alert('Phantom wallet not found');
    }
}

async function connectWalletSolflare() {
    if (window.solflare) {
        try {
            const resp = await window.solflare.connect();
            document.getElementById('walletAddress').innerText = resp.publicKey.toString();
        } catch (err) {
            console.error('Solflare connection error', err);
        }
    } else {
        alert('Solflare wallet not found');
    }
}

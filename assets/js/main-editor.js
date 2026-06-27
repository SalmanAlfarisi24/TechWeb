/* ==========================================================================
   js/main-editor.js (Logika Interaksi Utama Web - Full Fix & Auto Close Menu)
   ========================================================================== */

/* Mengontrol durasi visualisasi transisi memudar (fade-out) pada layar splash screen */
window.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash-screen');
    
    setTimeout(() => {
        if (splash) {
            splash.style.opacity = '0';
            splash.style.transform = 'scale(1.02)';
            
            setTimeout(() => {
                splash.classList.add('hidden');
            }, 500);
        }
    }, 1200);
});

/* Mengatur aksi buka-tutup list menu navigasi serta menutup otomatis saat link diklik */
(function setupMobileMenu() {
    const burgerMenu = document.getElementById('burger-menu');
    const navLinksContainer = document.getElementById('nav-links');

    if (burgerMenu && navLinksContainer) {
        // PERBAIKAN: Targetkan semua elemen link 'a' yang berada di dalam kontainer navigasi mobile
        const allNavLinks = navLinksContainer.querySelectorAll('a');

        burgerMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinksContainer.classList.toggle('active');
        });

        // PERBAIKAN UTAMA: Saat salah satu pilihan menu diklik, hapus kelas 'active' agar menu langsung menutup otomatis
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navLinksContainer.contains(e.target) && e.target !== burgerMenu) {
                navLinksContainer.classList.remove('active');
            }
        });
    }
})();

/* Mengelola perpindahan data atribut tema dokumen antara mode gelap (dark) dan mode terang (light) */
(function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) {
        const iconTheme = themeToggle.querySelector('i');

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                if (iconTheme) iconTheme.className = 'fa-solid fa-moon';
                showToast('Beralih ke Tema Terang ☀️');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                if (iconTheme) iconTheme.className = 'fa-solid fa-sun';
                showToast('Beralih ke Tema Gelap 🌙');
            }
        });
    }
})();

/* Mengekstraksi teks baris kode dari konsol editor dan merendernya secara real-time ke dalam dokumen iframe monitor */
(function setupLiveCompiler() {
    const btnRun = document.getElementById('btn-run');
    const codeInput = document.getElementById('code-input');
    const outputView = document.getElementById('output-view');

    if (btnRun && codeInput && outputView) {
        btnRun.addEventListener('click', () => {
            const userCode = codeInput.value;
            const iframeDoc = outputView.contentWindow.document;
            
            iframeDoc.open();
            iframeDoc.write(userCode);
            iframeDoc.close();
            
            showToast('Kode berhasil dieksekusi ke Live Monitor! 🚀');
        });
    }
})();

/* Memunculkan kotak notifikasi melayang (toast) di sudut kanan atas layar kemudian menutupnya secara otomatis */
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    
    if (toast && toastMsg) {
        toastMsg.textContent = message;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 2500);
    }
}

window.showToast = showToast;
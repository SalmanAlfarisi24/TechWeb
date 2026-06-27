/* ==========================================================================
   assets/js/main-editor.js (Logika Interaksi Web Utama - Full Fix & Safe)
   ========================================================================== */

// ==========================================================================
// 1. SPLASH SCREEN CONTROLLER
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash-screen');
    
    // Beri jeda 1.5 detik agar efek splash screen terlihat sebelum masuk ke halaman utama
    setTimeout(() => {
        if (splash) {
            splash.style.opacity = '0';
            splash.style.transform = 'scale(1.05)';
            
            // Hapus elemen dari display setelah animasi selesai agar tidak menghalangi klik
            setTimeout(() => {
                splash.classList.add('hidden');
            }, 500);
        }
    }, 1500);
    
    // Inisialisasi kuis awal jika elemen penampung kuis tersedia di halaman
    if (document.getElementById('options-container')) {
        loadQuiz();
    }
});

// ==========================================================================
// 2. RESPONSIVE BURGER MENU CONTROLLER
// ==========================================================================
const burgerMenu = document.getElementById('burger-menu');
const navLinksContainer = document.getElementById('nav-links');

if (burgerMenu && navLinksContainer) {
    const allNavLinks = navLinksContainer.querySelectorAll('a');

    // Toggle buka-tutup menu saat tombol burger di-klik
    burgerMenu.addEventListener('click', (e) => {
        e.stopPropagation(); // Mencegah klik ter-bubble ke dokumen
        navLinksContainer.classList.toggle('active');
    });

    // Tutup burger menu secara otomatis saat salah satu link menu diklik
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
        });
    });

    // Tutup burger menu jika user mengklik area di luar menu
    document.addEventListener('click', (e) => {
        if (!navLinksContainer.contains(e.target) && e.target !== burgerMenu) {
            navLinksContainer.classList.remove('active');
        }
    });
}

// ==========================================================================
// 3. FITUR DARK / LIGHT MODE CONTROLLER
// ==========================================================================
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

// ==========================================================================
// 4. LIVE CODE EDITOR CONTROLLER
// ==========================================================================
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
        
        showToast('Kode berhasil dijalankan! 🚀');
    });
}

// ==========================================================================
// 5. FITUR KUIS INTERAKTIF LOGIC
// ==========================================================================
const quizData = [
    {
        id: 1,
        question: "Tag HTML manakah yang digunakan untuk membuat judul utama paling besar?",
        options: ["<heading>", "<h6>", "<h1>", "<head>"],
        answer: 2
    },
    {
        id: 2,
        question: "Properti CSS apa yang digunakan untuk mengubah warna latar belakang sebuah elemen?",
        options: ["color", "background-color", "bg-color", "text-background"],
        answer: 1
    }
];

let currentQuestionIndex = 0;
let selectedOptionIndex = null;

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const btnSubmitQuiz = document.getElementById('btn-submit-quiz');
const quizFeedback = document.getElementById('quiz-feedback');
const quizBadge = document.getElementById('quiz-badge');

function loadQuiz() {
    if (!questionText || !optionsContainer || !quizFeedback || !quizBadge) return;

    selectedOptionIndex = null;
    quizFeedback.textContent = "";
    quizFeedback.className = "feedback-msg";
    
    const currentQuiz = quizData[currentQuestionIndex];
    
    quizBadge.textContent = `Soal #${currentQuestionIndex + 1} dari ${quizData.length}`;
    questionText.textContent = currentQuiz.question;
    optionsContainer.innerHTML = "";
    
    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('quiz-opt-btn');
        button.textContent = option;
        
        button.addEventListener('click', () => {
            const allButtons = optionsContainer.querySelectorAll('.quiz-opt-btn');
            allButtons.forEach(btn => btn.classList.remove('selected'));
            
            button.classList.add('selected');
            selectedOptionIndex = index;
        });
        
        optionsContainer.appendChild(button);
    });
}

if (btnSubmitQuiz) {
    btnSubmitQuiz.addEventListener('click', () => {
        if (selectedOptionIndex === null) {
            alert("Silakan pilih salah satu jawaban terlebih dahulu!");
            return;
        }
        
        const currentQuiz = quizData[currentQuestionIndex];
        const allButtons = optionsContainer.querySelectorAll('.quiz-opt-btn');
        
        // Kunci semua tombol kuis setelah dikirim agar tidak bisa mengganti jawaban
        allButtons.forEach(btn => btn.disabled = true);
        
        if (selectedOptionIndex === currentQuiz.answer) {
            quizFeedback.textContent = "🎉 Luar biasa! Jawaban Anda Benar.";
            quizFeedback.style.color = "var(--success)";
            showToast("Jawaban Kuis Benar! ✨");
        } else {
            quizFeedback.textContent = `❌ Yah, salah. Jawaban yang benar adalah: ${currentQuiz.options[currentQuiz.answer]}`;
            quizFeedback.style.color = "var(--danger)";
            showToast("Jawaban Kuis Salah. 📑");
        }
        
        setTimeout(() => {
            if (currentQuestionIndex < quizData.length - 1) {
                currentQuestionIndex++;
                loadQuiz();
            } else {
                quizBadge.textContent = "Selesai";
                questionText.textContent = "Selamat! Anda telah menyelesaikan seluruh kuis evaluasi.";
                optionsContainer.innerHTML = "";
                btnSubmitQuiz.style.display = "none";
                quizFeedback.textContent = "Refresh halaman untuk mengulang kuis.";
                quizFeedback.style.color = "var(--accent-color)";
            }
        }, 3000);
    });
}

// ==========================================================================
// 6. GLOBAL UTILITY FUNCTIONS
// ==========================================================================
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    
    if (toast && toastMsg) {
        toastMsg.textContent = message;
        toast.classList.remove('hidden');
        
        // Atur penutupan toast secara aman
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 2500);
    }
}

// Pasang fungsi ke objek window global agar bisa dibaca dari file skrip bertipe module (Firebase)
window.showToast = showToast;
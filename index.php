<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NgodingKuy - Platform Belajar Coding Interaktif</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

    <div id="splash-screen" class="splash-container">
        <div class="splash-content">
            <div class="splash-logo"><i class="fa-solid fa-code-branch"></i> NgodingKuy</div>
            <div class="spinner"></div>
        </div>
    </div>

    <div id="auth-modal" class="modal-overlay hidden">
        <div class="modal-card">
            <h3><i class="fa-solid fa-user-lock"></i> Masuk ke NgodingKuy</h3>
            <p>Masukkan Nama dan Password Anda untuk mulai belajar, menyimpan progres game, dan memberikan ulasan testimoni.</p>
            <form id="auth-form">
                <div class="form-group">
                    <label for="auth-username">Username</label>
                    <input type="text" id="auth-username" required placeholder="Contoh: salman_farisi">
                </div>
                <div class="form-group">
                    <label for="auth-password">Password</label>
                    <input type="password" id="auth-password" required placeholder="Masukkan password Anda">
                </div>
                <button type="submit" class="btn-submit-auth">Masuk / Daftar <i class="fa-solid fa-right-to-bracket"></i></button>
            </form>
        </div>
    </div>

    <div id="toast-notification" class="toast hidden">
        <i class="fa-solid fa-circle-check"></i> <span id="toast-message">Aksi berhasil!</span>
    </div>

    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo"><i class="fa-solid fa-code-branch"></i> NgodingKuy</div>
            
            <button id="burger-menu" class="burger-btn">
                <i class="fa-solid fa-bars"></i>
            </button>

            <ul id="nav-links" class="nav-links">
                <li><a href="#hero"><i class="fa-solid fa-house"></i> Home</a></li>
                <li><a href="#materi-section"><i class="fa-solid fa-book"></i> Materi</a></li>
                <li><a href="#editor-section"><i class="fa-solid fa-laptop-code"></i> Live Editor</a></li>
                <li><a href="#quiz-section"><i class="fa-solid fa-graduation-cap"></i> Kuis</a></li>
                <li><a href="#testimoni-section"><i class="fa-solid fa-comments"></i> Testimoni</a></li>
                <li id="user-display" class="user-badge-nav" style="display:none;">
                    <i class="fa-solid fa-user"></i> <span id="current-user-name">Guest</span>
                </li>
            </ul>
            <button id="theme-toggle" class="btn-theme"><i class="fa-solid fa-moon"></i></button>
        </div>
    </nav>

    <header id="hero" class="hero">
        <div class="hero-content">
            <span class="badge">🚀 Platform Belajar Masa Kini</span>
            <h1>Kuasai Coding Tanpa Ribet Setup</h1>
            <p>Tulis kode HTML dan CSS langsung di browser. Lihat hasilnya secara instan, uji pemahamanmu dengan kuis interaktif, dan jalankan misi petualangan game coding edukasi!</p>
            <div class="hero-buttons">
                <a href="#editor-section" class="btn-primary-lg">Mulai Ngoding Sekarang</a>
                <a href="#materi-section" class="btn-secondary-lg">Lihat Materi</a>
            </div>
        </div>
    </header>

    <main class="container">

        <section id="materi-section" class="section-layout">
            <div class="section-header">
                <h2><i class="fa-solid fa-book"></i> Alur Belajar Coding</h2>
                <p>Pilih kategori modul pemrograman atau masuk ke arena bermain interaktif untuk menguji kemampuan Anda hari ini.</p>
            </div>
            
            <div class="materi-main-showcase">
                <div class="materi-card game-arena-card" style="border-color: #a855f7;">
                    <div class="card-badge-new">NEW FEATURE</div>
                    <i class="fa-solid fa-gamepad arena-icon-huge" style="color: #a855f7;"></i>
                    <h3>Coding Game Arena: Code Journey</h3>
                    <p>Uji ketangkasan logika, kalahkan monster coding dengan menjawab kuis pilihan ganda, kumpulkan koin, dan bersainglah di papan peringkat leaderboard!</p>
                    <a href="game/index.html" class="btn-materi-link btn-arena-purple">Masuk Arena Pertarungan <i class="fa-solid fa-gun"></i></a>
                </div>
            </div>

            <div class="materi-grid">
                <div class="materi-card">
                    <i class="fa-brands fa-html5 card-icon-web"></i>
                    <h3>Web Development</h3>
                    <p>Pelajari fondasi dasar arsitektur web terstruktur menggunakan HTML5, CSS3, dan JavaScript Core secara mendalam.</p>
                    <a href="materi-web.php" class="btn-materi-link">Mulai Belajar <i class="fa-solid fa-arrow-right"></i></a>
                </div>
                <div class="materi-card">
                    <i class="fa-solid fa-mobile-screen-button card-icon-app"></i>
                    <h3>Mobile App Dev</h3>
                    <p>Langkah awal berkarir membangun aplikasi Android dan iOS native menggunakan framework modern masa kini.</p>
                    <a href="materi-app.php" class="btn-materi-link disabled-lock-btn">Segera Hadir <i class="fa-solid fa-lock"></i></a>
                </div>
            </div>
        </section>

        <section id="editor-section" class="section-layout">
            <div class="section-header">
                <h2><i class="fa-solid fa-laptop-code"></i> Ruang Kerja Interaktif</h2>
                <p>Gunakan panel kiri untuk menulis sintaks HTML/CSS dan lihat langsung visual perubahannya secara real-time di panel preview kanan.</p>
            </div>
            <div class="editor-grid">
                <div class="cheatsheet-panel">
                    <h3><i class="fa-solid fa-book-open"></i> Contekan Kode</h3>
                    <div class="cheat-item"><small>Judul Utama</small><code>&lt;h1&gt;Teks&lt;/h1&gt;</code></div>
                    <div class="cheat-item"><small>Paragraf</small><code>&lt;p&gt;Teks&lt;/p&gt;</code></div>
                    <div class="cheat-item"><small>Warna Teks (CSS)</small><code>&lt;style&gt; h1 { color: red; } &lt;/style&gt;</code></div>
                </div>

                <div class="editor-main">
                    <div class="editor-panel-box">
                        <div class="panel-topbar">
                            <span><i class="fa-solid fa-code"></i> index.html</span>
                            <button id="btn-run" class="btn-run"><i class="fa-solid fa-play"></i> Run Code</button>
                        </div>
                        <textarea id="code-input" placeholder="&#10;<h1>Halo Dunia</h1>&#10;<style>&#10;  h1 { color: #4F46E5; text-align: center; }&#10;</style>"></textarea>
                    </div>
                    <div class="editor-panel-box">
                        <div class="panel-topbar"><span><i class="fa-solid fa-eye"></i> Live Preview</span></div>
                        <iframe id="output-view" sandbox="allow-scripts"></iframe>
                    </div>
                </div>
            </div>
        </section>

        <section id="quiz-section" class="section-layout">
            <div class="section-header">
                <h2><i class="fa-solid fa-graduation-cap"></i> Uji Kemampuanmu</h2>
                <p>Uji sejauh mana pemahaman materi Anda dengan kuis evaluasi singkat di bawah ini.</p>
            </div>
            <div class="quiz-grid">
                <div class="quiz-card-box">
                    <div class="quiz-header"><span id="quiz-badge" class="quiz-badge">Soal #1</span></div>
                    <p class="quiz-question" id="question-text">Memuat pertanyaan...</p>
                    <div class="quiz-options" id="options-container"></div>
                    <button id="btn-submit-quiz" class="btn-submit"><i class="fa-solid fa-paper-plane"></i> Kirim Jawaban</button>
                    <div id="quiz-feedback" class="feedback-msg"></div>
                </div>
            </div>
        </section>

        <section id="testimoni-section" class="section-layout">
            <div class="section-header">
                <h2><i class="fa-solid fa-comments"></i> Dinding Testimoni (Sistem CRUD)</h2>
                <p>Ulasan Anda otomatis tervalidasi dengan session login Firebase Realtime Database dan tampil pada slider kontinu.</p>
            </div>
            
            <div class="testimoni-grid">
                <div class="form-card">
                    <h3 id="form-title"><i class="fa-solid fa-pen-to-square"></i> Tulis Ulasan Anda</h3>
                    <form id="testimoni-form">
                        <input type="hidden" id="testimoni-id">
                        <div class="form-group">
                            <label for="input-nama">Nama Anda</label>
                            <input type="text" id="input-nama" readonly required style="background-color: var(--panel-top);">
                        </div>
                        <div class="form-group">
                            <label for="input-pesan">Pesan & Kesan</label>
                            <textarea id="input-pesan" required placeholder="Bagikan pengalaman serumu belajar di NgodingKuy..."></textarea>
                        </div>
                        <div class="form-buttons">
                            <button type="submit" id="btn-save-testimoni" class="btn-success"><i class="fa-solid fa-paper-plane"></i> Kirim</button>
                            <button type="button" id="btn-cancel-edit" class="btn-danger" style="display: none;"><i class="fa-solid fa-xmark"></i> Batal</button>
                        </div>
                    </form>
                </div>

                <div class="testimoni-display">
                    <h3><i class="fa-solid fa-quote-left"></i> Apa Kata Pengguna Lain?</h3>
                    
                    <div class="slider-viewport">
                        <div id="testimoni-slider" class="slider-track">
                            <p class="loading-text"><i class="fa-solid fa-spinner fa-spin"></i> Memuat testimoni database...</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </main>

    <footer class="footer">
        <p>&copy; 2026 <strong>NgodingKuy</strong>. Dibuat dengan <i class="fa-solid fa-heart" style="color: #ef4444;"></i> untuk Tugas Akhir.</p>
    </footer>

    <script type="module" src="assets/js/firebase-config.js"></script>
    <script type="module" src="assets/js/crud-testimoni.js"></script>
    <script src="assets/js/main-editor.js"></script>
</body>
</html>
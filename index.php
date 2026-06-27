<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NgodingKuy - Platform Belajar Coding Interaktif</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        /* Perbaikan taktis langsung untuk menyeimbangkan posisi tombol hero ke tengah */
        .hero-buttons {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-top: 1.5rem;
            width: 100%;
        }
    </style>
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
            <p>Masukkan Nama dan Password Anda untuk mulai belajar dan memberikan testimoni.</p>
            <form id="auth-form">
                <div class="form-group">
                    <label for="auth-username">Username</label>
                    <input type="text" id="auth-username" required placeholder="Contoh: salman_farisi">
                </div>
                <div class="form-group">
                    <label for="auth-password">Password</label>
                    <input type="password" id="auth-password" required placeholder="Masukkan password Anda">
                </div>
                <button type="submit" class="btn-submit-auth"><i class="fa-solid fa-right-to-bracket"></i> Masuk / Daftar</button>
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
            <p>Tulis kode HTML dan CSS langsung di browser. Lihat hasilnya secara instan, uji pemahamanmu dengan kuis interaktif, dan bagikan pengalaman belajarmu!</p>
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
                <p>Pilih kategori pemrograman yang ingin Anda kuasai hari ini.</p>
            </div>
            
            <div class="materi-grid">
                <div class="materi-card" style="border-color: var(--accent-color);">
                    <i class="fa-solid fa-gamepad" style="color: #a855f7;"></i>
                    <h3>Coding Game Arena</h3>
                    <p>Uji ketangkasan dan logikamu di arena bermain interaktif berbasis grafis 2D Canvas dengan mengalahkan zombie coding.</p>
                    <a href="game/index.html" class="btn-materi-link">
                        <button class="btn-run" style="background-color: var(--accent-color); cursor: pointer;"><i class="fa-solid fa-gamepad"></i> Masuk Arena Game</button>
                    </a>
                </div>

                <div class="materi-card">
                    <i class="fa-brands fa-html5 card-icon-web"></i>
                    <h3>Web Development</h3>
                    <p>Pelajari fondasi dasar pembuatan website menggunakan HTML5, CSS3, dan JavaScript Dasar secara terstruktur.</p>
                    <a href="materi-web.php" class="btn-materi-link">
                        <button class="btn-run" style="cursor: pointer;"><i class="fa-solid fa-book-open"></i> Buka Materi Web</button>
                    </a>
                </div>

                <div class="materi-card">
                    <i class="fa-solid fa-mobile-screen-button card-icon-app"></i>
                    <h3>Mobile App Dev</h3>
                    <p>Langkah awal membangun aplikasi Android dan iOS menggunakan framework modern masa kini.</p>
                    <a href="materi-app.php" class="btn-materi-link" onclick="return false;">
                        <button class="btn-run" style="background-color: #bdc3c7; cursor: not-allowed;"><i class="fa-solid fa-lock"></i> Segera Hadir App</button>
                    </a>
                </div>
            </div>
        </section>

        <section id="editor-section" class="section-layout">
            <div class="section-header">
                <h2><i class="fa-solid fa-laptop-code"></i> Ruang Kerja Interaktif</h2>
                <p>Gunakan panel kiri untuk menulis sintaks HTML/CSS dan lihat langsung perubahannya.</p>
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

        <section id="testimoni-section" class="section-layout">
            <div class="section-header">
                <h2><i class="fa-solid fa-comments"></i> Dinding Testimoni (Sistem CRUD)</h2>
                <p>Ulasan Anda akan tampil pada slider otomatis di bawah ini secara real-time.</p>
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
                            <textarea id="input-pesan" required placeholder="Bagikan pengalaman serumu..."></textarea>
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
                            <p class="loading-text"><i class="fa-solid fa-spinner fa-spin"></i> Memuat testimoni...</p>
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
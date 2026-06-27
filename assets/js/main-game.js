// ==========================================================================
// 1. KONFIGURASI CORE ENGINE PHASER.JS
// ==========================================================================
const config = {
    type: Phaser.AUTO,
    width: 640,          // Lebar area bermain game
    height: 400,         // Tinggi area bermain game
    parent: 'phaser-game-canvas', // ID elemen HTML penampung canvas game
    backgroundColor: '#1e293b',   // Warna latar belakang arena (slate-800)
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },   // Nilai 0 karena ini game top-down (tampak atas), bukan platformer samping
            debug: false         // Ubah ke true jika ingin melihat kotak hit-box fisika objek
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Inisialisasi Game Engine Utama
const game = new Phaser.Game(config);

// Deklarasi Variabel Global Game
let player;
let cursors;
let codeGems;
let score = 0;
let scoreText;

// ==========================================================================
// 2. LIFECYCLE: PRELOAD (MEMUAT ASET)
// ==========================================================================
function preload() {
    // Memuat aset gambar dasar langsung dari CDN resmi Phaser untuk mempermudah pengerjaan tugas akhir
    this.load.image('gem', 'https://labs.phaser.io/assets/demoscene/star.png');
}

// ==========================================================================
// 3. LIFECYCLE: CREATE (INISIALISASI OBJEK)
// ==========================================================================
function create() {
    // A. Membuat Karakter Pemain (Berupa Kotak Ungu Neon yang Selaras dengan Tema Web)
    player = this.add.rectangle(100, 200, 28, 28, 0x4f46e5);
    
    // Daftarkan komponen fisik arcade ke objek player
    this.physics.add.existing(player);
    
    // Pastikan karakter tidak bisa menembus atau keluar dari batasan layar game
    player.body.setCollideWorldBounds(true);

    // B. Membuat Kelompok Objek Data yang Harus Dikumpulkan (Gems/Stars)
    codeGems = this.physics.add.group();

    // Lakukan Spawning 4 Buah Objek secara Acak di Dalam Arena
    for (let i = 0; i < 4; i++) {
        let randomX = Phaser.Math.Between(150, 600);
        let randomY = Phaser.Math.Between(50, 350);
        let gem = codeGems.create(randomX, randomY, 'gem');
        gem.setOrigin(0.5);
    }

    // C. Membuat Tampilan Papan Skor (Scoreboard) di Pojok Kiri Atas
    scoreText = this.add.text(16, 16, 'Skor: 0 Pts', {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        fontWeight: 'bold'
    });

    // D. Mengaktifkan Fungsi Pembaca Tombol Panah Keyboard (Cursors)
    cursors = this.input.keyboard.createCursorKeys();

    // E. Logika Tabrakan / Overlap Fisika
    // Ketika player menyentuh objek di kelompok 'codeGems', jalankan fungsi 'ambilGem'
    this.physics.add.overlap(player, codeGems, ambilGem, null, this);
}

// ==========================================================================
// 4. LIFECYCLE: UPDATE (LOOPING PERGERAKAN DETEKSI INPUT)
// ==========================================================================
function update() {
    // Reset kecepatan gerak karakter di setiap frame awal agar tidak meluncur terus-menerus
    player.body.setVelocity(0);

    // Deteksi Arah Gerak Horizontal (Sumbu X)
    if (cursors.left.isDown) {
        player.body.setVelocityX(-220); // Gerak ke kiri
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(220);  // Gerak ke kanan
    }

    // Deteksi Arah Gerak Vertikal (Sumbu Y)
    if (cursors.up.isDown) {
        player.body.setVelocityY(-220); // Gerak ke atas
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(220);  // Gerak ke bawah
    }
}

// ==========================================================================
// 5. GAMEPLAY LOGIC FUNCTIONS
// ==========================================================================
// Fungsi penanganan ketika kotak karakter menabrak/menyentuh item bintang materi
function ambilGem(player, gem) {
    // Hilangkan item bintang dari layar arena bermain
    gem.disableBody(true, true);

    // Tambahkan skor penilai pemain
    score += 25;
    scoreText.setText('Skor: ' + score + ' Pts');

    // Panggil fungsi toast notifikasi bawaan platform utama Anda (jika terhubung global)
    if (typeof window.showToast === "function") {
        window.showToast("Berhasil mengambil aset kode! +25 Poin");
    } else {
        // Fallback cadangan jika diuji secara mandiri
        console.log("Objek didapatkan! Skor saat ini: " + score);
    }

    // Integrasi Lanjutan: Jika seluruh bintang habis terkumpul di arena
    if (codeGems.countActive(true) === 0) {
        this.add.text(180, 180, 'Level Selesai!', {
            fontSize: '32px',
            fill: '#10b981',
            fontWeight: 'bold'
        });
    }
}
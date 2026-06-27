/* ==========================================================================
   game/js/app.js (Logika Utama & Integrasi Firebase - Full Fix & Matang)
   ========================================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Konfigurasi database yang diselaraskan dengan proyek utama Anda
const firebaseConfig = {
    apiKey: "AIzaSyBzFP24wY3JpWO9cwdsNxQLJtp6MTSUUqE",
    authDomain: "testproject-525b4.firebaseapp.com",
    databaseURL: "https://testproject-525b4-default-rtdb.firebaseio.com",
    projectId: "testproject-525b4",
    storageBucket: "testproject-525b4.firebasestorage.app",
    messagingSenderId: "708982701670",
    appId: "1:708982701670:web:324098d7962cef422037a7",
    measurementId: "G-RNGPW5823K"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const GameData = {
    worlds: [
        { id: 'html', name: 'HTML Dasar', icon: '🌐', color: '#E44D26' },
        { id: 'css', name: 'CSS Styling', icon: '🎨', color: '#264DE4' },
        { id: 'js', name: 'JavaScript Core', icon: '⚡', color: '#F7DF1E' }
    ],
    levels: {
        'html': [
            { id: 1, hp: 50 },
            { id: 2, hp: 80 },
            { id: 3, hp: 120 }
        ]
    },
    questions: {
        'html': [
            { q: "Tag apa yang digunakan untuk membuat paragraf?", options: ["<p>", "<h1>", "<a>", "<div>"], a: 0 },
            { q: "Atribut untuk menentukan URL gambar pada tag <img> adalah?", options: ["href", "link", "src", "alt"], a: 2 },
            { q: "Tag HTML yang benar untuk membuat teks menjadi tebal adalah?", options: ["<bold>", "<b>", "<important>", "<thick>"], a: 1 },
            { q: "Karakter apa yang digunakan untuk tag penutup?", options: ["/", "\\", "*", "^"], a: 0 }
        ]
    }
};

window.Game = (function() {
    
    let usernameSession = localStorage.getItem("ngodingkuy_user") || "guest_" + Math.floor(Math.random() * 1000);
    
    let player = {
        level: 1, xp: 0, coins: 100, gems: 10,
        hp: 100, maxHp: 100,
        progress: { 'html': 1 }
    };

    let combatState = {
        active: false, worldId: '', levelId: 0,
        monsterHp: 0, monsterMaxHp: 0,
        questions: [], currentQ: 0, combo: 0,
        timeLeft: 15, timerInterval: null
    };

    /* Menghubungkan sistem game dengan asset sprite dan memuat data awal dari Firebase */
    function init() {
        CombatLogic.initSprites();
        loadUserData();
        listenLeaderboard();
    }

    /* Mengambil data progres, level, koin, dan gem pengguna dari path database secara real-time */
    function loadUserData() {
        const userGameRef = ref(db, `users/${usernameSession}/game_data`);
        get(userGameRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                player.level = data.level || 1;
                player.xp = data.xp || 0;
                player.coins = data.coins || 100;
                player.gems = data.gems || 10;
                player.progress = data.progress || { 'html': 1 };
                player.maxHp = 100 + (player.level * 20);
            } else {
                saveUserData();
            }
            updateHUD();
            renderWorlds();
        }).catch(err => console.error("Gagal memuat data user:", err));
    }

    /* Menyimpan kondisi state data game terbaru milik pengguna kembali ke Firebase Realtime Database */
    function saveUserData() {
        const userGameRef = ref(db, `users/${usernameSession}/game_data`);
        set(userGameRef, {
            level: player.level,
            xp: player.xp,
            coins: player.coins,
            gems: player.gems,
            progress: player.progress
        }).catch(err => console.error("Gagal menyimpan data user:", err));
    }

    /* Membaca dan mengurutkan data seluruh pengguna dari database untuk disajikan ke dalam tabel peringkat */
    function listenLeaderboard() {
        const allUsersRef = ref(db, "users");
        onValue(allUsersRef, (snapshot) => {
            const tbody = document.getElementById("leaderboard-body");
            if (!tbody) return;
            tbody.innerHTML = "";

            if (snapshot.exists()) {
                const usersData = snapshot.val();
                let rankList = [];

                Object.keys(usersData).forEach(username => {
                    if (usersData[username].game_data) {
                        rankList.push({
                            username: username,
                            level: usersData[username].game_data.level || 1,
                            xp: usersData[username].game_data.xp || 0
                        });
                    }
                });

                rankList.sort((a, b) => b.xp - a.xp);

                rankList.forEach((u, idx) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${idx + 1}</td>
                        <td style="font-weight:bold; color:${u.username === usernameSession ? 'var(--accent-color)' : 'inherit'}">
                            ${u.username} ${u.username === usernameSession ? '(Kamu)' : ''}
                        </td>
                        <td>Lvl ${u.level}</td>
                        <td>${u.xp} XP</td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Belum ada data peringkat.</td></tr>`;
            }
        });
    }

    /* Menyinkronkan variabel nilai pada elemen penanda status di bar bagian atas dashboard */
    function updateHUD() {
        const newLevel = Math.floor(player.xp / 100) + 1;
        if(newLevel > player.level) {
            player.level = newLevel;
            player.maxHp = 100 + (player.level * 20);
            saveUserData();
        }

        document.getElementById('hud-level').innerText = player.level;
        document.getElementById('hud-xp').innerText = player.xp;
        document.getElementById('hud-coins').innerText = player.coins;
        document.getElementById('hud-gems').innerText = player.gems;
    }

    /* Mengatur sistem perpindahan kelas aktif pada elemen kontainer layar utama game */
    function showScreen(screenId, navBtn = null) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(`screen-${screenId}`).classList.add('active');
        
        if (navBtn) {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            navBtn.classList.add('active');
        }
    }

    /* Merender daftar pilihan kategori materi pemrograman pada halaman utama game */
    function renderWorlds() {
        const container = document.getElementById('worlds-container');
        if (!container) return;
        container.innerHTML = '';
        
        GameData.worlds.forEach(w => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span style="font-size:1.5rem">${w.icon}</span> ${w.name}`;
            btn.style.borderLeft = `5px solid ${w.color}`;
            btn.onclick = () => openWorld(w.id);
            container.appendChild(btn);
        });
    }

    /* Membuka sub-peta tingkat kesulitan level berdasarkan materi pemrograman yang dipilih */
    function openWorld(worldId) {
        const world = GameData.worlds.find(w => w.id === worldId);
        document.getElementById('current-world-title').innerText = world.name;
        
        const container = document.getElementById('nodes-container');
        if (!container) return;
        container.innerHTML = '';
        
        const levels = GameData.levels[worldId] || [];
        const playerMaxLevel = player.progress[worldId] || 1;

        levels.forEach(lvl => {
            const btn = document.createElement('button');
            btn.className = 'node-btn';
            
            if (lvl.id > playerMaxLevel) {
                btn.disabled = true;
                btn.innerText = '🔒';
            } else {
                btn.innerText = lvl.id;
                btn.onclick = () => prepareCombat(worldId, lvl);
            }
            container.appendChild(btn);
        });

        showScreen('map');
    }

    /* Mempersiapkan parameter awal state pertempuran, mereset audio, serta mengacak urutan soal kuis */
    function prepareCombat(worldId, levelData) {
        player.hp = player.maxHp;
        
        let shuffledQs = [...GameData.questions[worldId]].sort(() => Math.random() - 0.5);

        combatState = {
            active: true, worldId: worldId, levelId: levelData.id,
            monsterHp: levelData.hp, monsterMaxHp: levelData.hp,
            questions: shuffledQs, currentQ: 0, combo: 0, timeLeft: 15
        };

        CombatLogic.resetToIdle();
        CombatLogic.stopMenuBGM();

        document.getElementById('player-hp-txt').innerText = player.hp;
        document.getElementById('monster-hp-txt').innerText = levelData.hp;
        
        updateHealthBars();
        updateCombatHUD();
        showScreen('combat');
        nextQuestion();
    }

    /* Mengambil dan menampilkan komponen pertanyaan serta pilihan jawaban ke dalam panel kuis */
    function nextQuestion() {
        if (!combatState.active) return;
        
        if (combatState.monsterHp <= 0) { endCombat(true); return; }
        if (player.hp <= 0) { endCombat(false); return; }
        
        if (combatState.currentQ >= combatState.questions.length) {
            combatState.currentQ = 0;
        }

        const q = combatState.questions[combatState.currentQ];
        document.getElementById('question-text').innerText = q.q;
        
        const optContainer = document.getElementById('options-container');
        optContainer.innerHTML = '';
        
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.onclick = () => handleAnswer(btn, idx, q.a);
            optContainer.appendChild(btn);
        });

        document.getElementById('btn-hint').disabled = false;
        resetTimer();
    }

    /* Mengevaluasi ketepatan indeks jawaban yang dipilih pengguna dan memicu fungsi animasi aksi */
    function handleAnswer(btnElement, selectedIdx, correctIdx) {
        clearInterval(combatState.timerInterval);
        
        const options = document.querySelectorAll('#options-container .option-btn');
        options.forEach(b => b.disabled = true); 

        if (selectedIdx === correctIdx) {
            if (btnElement) btnElement.classList.add('correct');
            combatState.combo++;
            
            let damage = 15 + (combatState.combo * 2);
            combatState.monsterHp = Math.max(0, combatState.monsterHp - damage);
            let isDead = combatState.monsterHp <= 0;
            
            updateHealthBars();
            updateCombatHUD();

            CombatLogic.triggerCorrectAnswer(combatState.combo, combatState.monsterHp, isDead, () => {
                if (isDead) {
                    endCombat(true);
                } else {
                    combatState.currentQ++;
                    nextQuestion();
                }
            });

        } else {
            if (btnElement) btnElement.classList.add('wrong');
            if (correctIdx !== -1 && options[correctIdx]) options[correctIdx].classList.add('correct');
            
            combatState.combo = 0;
            let damage = 20;
            player.hp = Math.max(0, player.hp - damage);
            let isDead = player.hp <= 0;

            updateHealthBars();
            updateCombatHUD();

            CombatLogic.triggerWrongAnswer(player.hp, isDead, () => {
                if (isDead) {
                    endCombat(false);
                } else {
                    combatState.currentQ++;
                    nextQuestion();
                }
            });
        }
    }

    /* Menyinkronkan persentase lebar bar nyawa visual karakter berdasarkan sisa poin kesehatan */
    function updateHealthBars() {
        const pPct = (player.hp / player.maxHp) * 100;
        const mPct = (combatState.monsterHp / combatState.monsterMaxHp) * 100;
        
        document.getElementById('player-hp-bar').style.width = `${pPct}%`;
        document.getElementById('player-hp-txt').innerText = player.hp;
        
        document.getElementById('monster-hp-bar').style.width = `${mPct}%`;
        document.getElementById('monster-hp-txt').innerText = Math.floor(combatState.monsterHp);
    }

    /* Memperbarui tampilan angka combo hit beserta hitungan mundur sisa waktu berpikir */
    function updateCombatHUD() {
        document.getElementById('combo-count').innerText = combatState.combo;
        document.getElementById('time-left').innerText = combatState.timeLeft;
    }

    /* Menghentikan interval lama dan memicu ulang hitungan mundur 15 detik batas menjawab kuis */
    function resetTimer() {
        clearInterval(combatState.timerInterval);
        combatState.timeLeft = 15;
        updateCombatHUD();
        
        combatState.timerInterval = setInterval(() => {
            combatState.timeLeft--;
            updateCombatHUD();
            
            if (combatState.timeLeft <= 0) {
                handleAnswer(null, -1, combatState.questions[combatState.currentQ].a);
            }
        }, 1000);
    }

    /* Menghentikan jalannya pertempuran dan mengalkulasi penambahan perolehan reward koin serta tingkat XP */
    function endCombat(isVictory) {
        combatState.active = false;
        clearInterval(combatState.timerInterval);

        const overlay = document.getElementById('reward-popup');
        const title = document.getElementById('popup-title');
        const stats = document.getElementById('reward-stats');

        if (!overlay) return;
        overlay.classList.add('show');
        title.innerText = isVictory ? "Level Selesai! 🎉" : "Game Over! 💀";
        title.style.color = isVictory ? "var(--hp-green)" : "var(--hp-red)";
        
        if (isVictory) {
            if (stats) stats.style.display = "grid";
            let rewardXp = 30 + (combatState.levelId * 10);
            let rewardCoins = 10 + (combatState.levelId * 5);
            
            player.xp += rewardXp;
            player.coins += rewardCoins;
            
            document.getElementById('reward-xp').innerText = rewardXp;
            document.getElementById('reward-coins').innerText = rewardCoins;

            if (player.progress[combatState.worldId] === combatState.levelId) {
                player.progress[combatState.worldId]++;
            }
        } else {
            if (stats) stats.style.display = "none";
        }
        updateHUD();
        saveUserData();
    }

    /* Menutup kotak pop-up pengumuman kelulusan level dan mengarahkan user kembali ke peta materi */
    function closePopup() {
        document.getElementById('reward-popup').classList.remove('show');
        CombatLogic.resetToIdle();
        CombatLogic.playMenuBGM();
        openWorld(combatState.worldId);
    }

    /* Mengurangi saldo koin pemain untuk menyembunyikan dua opsi jawaban kuis yang salah */
    function useHint() {
        if (player.coins >= 10) {
            player.coins -= 10;
            updateHUD();
            saveUserData();
            
            const q = combatState.questions[combatState.currentQ];
            const options = document.querySelectorAll('#options-container .option-btn');
            let removed = 0;
            
            options.forEach((btn, idx) => {
                if (idx !== q.a && removed < 2) {
                    btn.style.opacity = '0.3';
                    btn.disabled = true;
                    removed++;
                }
            });
            document.getElementById('btn-hint').disabled = true;
        }
    }

    /* Membatalkan jalannya pertempuran secara paksa ditengah jalan atas keinginan pengguna */
    function fleeBattle() {
        if(confirm("Yakin ingin kabur?")) {
            combatState.active = false;
            clearInterval(combatState.timerInterval);
            CombatLogic.resetToIdle();
            CombatLogic.playMenuBGM();
            openWorld(combatState.worldId);
        }
    }

    return {
        init, showScreen, useHint, fleeBattle, closePopup
    };
})();

document.addEventListener('DOMContentLoaded', Game.init);
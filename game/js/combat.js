/* =========================================
   js/combat.js (Logika Pertarungan & Audio - Full Fix)
   ========================================= */
const CombatLogic = (function() {
    
    // Mengatur file audio sesuai dengan struktur folder assets/sounds/ Anda
    const sfx = {
        shoot: new Audio('assets/sounds/sfx_shoot.mp3'),
        melee: new Audio('assets/sounds/sfx_melee.mp3'),
        correct: new Audio('assets/sounds/sfx_correct.mp3'),
        wrong: new Audio('assets/sounds/sfx_wrong.mp3'),
        menuBgm: new Audio('assets/sounds/sound_games.mp3'),       // Aktif hanya di pilihan menu/map
        zombieAttack: new Audio('assets/sounds/zombie_attack.mp3') // Suara serangan zombie
    };

    // Konfigurasi awal audio
    sfx.menuBgm.loop = true; 
    sfx.menuBgm.volume = 0.4; 

    function initSprites() {
        // Preload seluruh aset gambar
        SpriteSystem.preload('assets/images/player/Idle', 10);
        SpriteSystem.preload('assets/images/player/Shoot', 3);
        SpriteSystem.preload('assets/images/player/Melee', 7);
        SpriteSystem.preload('assets/images/player/Slide', 5);
        SpriteSystem.preload('assets/images/player/Dead', 10);
        
        SpriteSystem.preload('assets/images/zombie/Idle', 15);
        SpriteSystem.preload('assets/images/zombie/Attack', 10);
        SpriteSystem.preload('assets/images/zombie/Walk', 10);
        SpriteSystem.preload('assets/images/zombie/Dead', 10);

        resetToIdle();
    }

    // Fungsi untuk memutar musik di menu/peta
    function playMenuBGM() {
        sfx.menuBgm.play().catch(e => {
            console.log("Menunggu interaksi user untuk memutar BGM menu...");
        });
    }

    // Fungsi untuk menghentikan musik menu saat masuk pertarungan (Solusi Perbaikan 1)
    function stopMenuBGM() {
        sfx.menuBgm.pause();
        sfx.menuBgm.currentTime = 0;
    }

    function resetToIdle() {
        const pImg = document.getElementById('player-img');
        const zImg = document.getElementById('zombie-img');

        if (pImg) {
            pImg.style.transition = "transform 0.5s ease-out";
            pImg.style.transform = "translateX(0) scaleX(1)";
            SpriteSystem.loop('player-img', 'assets/images/player/Idle', 10, 100);
        }
        if (zImg) {
            zImg.style.transition = "transform 0.5s ease-out";
            zImg.style.transform = "translateX(0) scaleX(-1)";
            SpriteSystem.loop('zombie-img', 'assets/images/zombie/Idle', 15, 100);
        }
    }

    function triggerCorrectAnswer(comboCount, monsterHp, isDead, callbackNextQuestion) {
        // Jalankan audio feedback benar
        sfx.correct.currentTime = 0;
        sfx.correct.play().catch(e => {});

        const pImg = document.getElementById('player-img');
        const isMelee = Math.random() > 0.5;

        if (isMelee) {
            if (pImg) pImg.style.transform = "translateX(140px) scaleX(1)";
            
            sfx.melee.currentTime = 0;
            sfx.melee.play().catch(e => {});
            
            SpriteSystem.play('player-img', 'assets/images/player/Slide', 5, 80, () => {
                SpriteSystem.play('player-img', 'assets/images/player/Melee', 7, 80, () => {
                    resetToIdle();
                });
            });
        } else {
            if (pImg) pImg.style.transform = "translateX(20px) scaleX(1)"; 
            
            sfx.shoot.currentTime = 0;
            sfx.shoot.play().catch(e => {});
            
            SpriteSystem.play('player-img', 'assets/images/player/Shoot', 3, 100, () => {
                resetToIdle();
            });
        }

        const zImg = document.getElementById('zombie-img');
        if (zImg) {
            zImg.classList.add('anim-damage');
            setTimeout(() => zImg.classList.remove('anim-damage'), 400);
        }

        // Solusi Perbaikan 3 (Mencegah Stuck): Pisahkan eksekusi callback jika musuh mati
        if (isDead) {
            setTimeout(() => {
                SpriteSystem.play('zombie-img', 'assets/images/zombie/Dead', 10, 100, () => {
                    callbackNextQuestion(); // Eksekusi callback setelah animasi Dead zombie selesai sempurna
                });
            }, 400);
        } else {
            setTimeout(callbackNextQuestion, 1200);
        }
    }

    function triggerWrongAnswer(playerHp, isDead, callbackNextQuestion) {
        // Solusi Perbaikan 2: Jalankan sfx.wrong dengan reset waktu
        sfx.wrong.currentTime = 0;
        sfx.wrong.play().catch(e => {});

        const zImg = document.getElementById('zombie-img');
        if (zImg) zImg.style.transform = "translateX(-140px) scaleX(-1)";

        SpriteSystem.play('zombie-img', 'assets/images/zombie/Walk', 10, 80, () => {
            
            // Suara cakar zombie diaktifkan
            sfx.zombieAttack.currentTime = 0;
            sfx.zombieAttack.play().catch(e => {});

            SpriteSystem.play('zombie-img', 'assets/images/zombie/Attack', 10, 80, () => {
                
                const pImg = document.getElementById('player-img');
                if (pImg) pImg.classList.add('anim-damage');
                
                // Solusi Perbaikan 3 (Mencegah Stuck): Tangani animasi Dead player dengan aman
                if (isDead) {
                    SpriteSystem.play('player-img', 'assets/images/player/Dead', 10, 100, () => {
                        callbackNextQuestion(); // Eksekusi penyelesaian kuis kalah
                    });
                } else {
                    resetToIdle();
                    setTimeout(callbackNextQuestion, 500);
                }
            });
        });
    }

    return { initSprites, triggerCorrectAnswer, triggerWrongAnswer, resetToIdle, playMenuBGM, stopMenuBGM };
})();
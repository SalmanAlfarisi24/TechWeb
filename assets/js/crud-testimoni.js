/* ==========================================================================
   assets/js/crud-testimoni.js (Logika CRUD & Auth Firebase - Full Premium Fix)
   ========================================================================== */
import { ref, push, onValue, update, remove, get, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { db } from "./firebase-config.js";

// Referensi Jalur Database Firebase
const testimoniRef = ref(db, "testimonis");
const usersRef = ref(db, "users");

// Selektor Elemen HTML
const authModal = document.getElementById("auth-modal");
const authForm = document.getElementById("auth-form");
const authUsernameInput = document.getElementById("auth-username");
const authPasswordInput = document.getElementById("auth-password");

const userDisplay = document.getElementById("user-display");
const currentUserName = document.getElementById("current-user-name");

const testimoniForm = document.getElementById("testimoni-form");
const testimoniIdInput = document.getElementById("testimoni-id");
const inputNama = document.getElementById("input-nama");
const inputPesan = document.getElementById("input-pesan");
const testimoniSlider = document.getElementById("testimoni-slider");
const formTitle = document.getElementById("form-title");
const btnSaveTestimoni = document.getElementById("btn-save-testimoni");
const btnCancelEdit = document.getElementById("btn-cancel-edit");

let currentUser = null;
let sliderInterval = null;

// ==========================================================================
// 1. LOGIKA AUTH POP-UP (LOGIN / DAFTAR OTOMATIS)
// ==========================================================================
// Periksa status login saat halaman dibuka (menggunakan localStorage agar persisten)
window.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("ngodingkuy_user");
    if (savedUser) {
        setLoggedInUser(savedUser);
    } else {
        // Tampilkan pop-up login blur jika belum login dan elemen modal tersedia
        if (authModal) {
            authModal.classList.remove("hidden");
        }
    }
});

if (authForm) {
    authForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!authUsernameInput || !authPasswordInput) return;

        const username = authUsernameInput.value.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
        const password = authPasswordInput.value;

        if (!username || !password) return;

        const singleUserRef = ref(db, `users/${username}`);

        // Cek apakah user sudah terdaftar di database
        get(singleUserRef).then((snapshot) => {
            if (snapshot.exists()) {
                // --- USER SUDAH ADA (PROSES LOGIN) ---
                const userData = snapshot.val();
                if (userData.password === password) {
                    triggerToast(`Selamat datang kembali, ${username}! 🎉`);
                    setLoggedInUser(username);
                } else {
                    alert("Password salah! Silakan coba lagi.");
                }
            } else {
                // --- USER BELUM ADA (PROSES DAFTAR OTOMATIS) ---
                set(singleUserRef, {
                    password: password,
                    registeredAt: Date.now()
                }).then(() => {
                    triggerToast(`Akun baru berhasil dibuat! Selamat datang ${username}. 🚀`);
                    setLoggedInUser(username);
                });
            }
        }).catch(err => console.error("Auth Error:", err));
    });
}

function setLoggedInUser(username) {
    currentUser = username;
    localStorage.setItem("ngodingkuy_user", username);
    
    // Sembunyikan modal pop-up secara aman
    if (authModal) authModal.classList.add("hidden");
    
    // Tampilkan nama di navbar dan kunci ke form input nama testimoni jika elemen tersedia
    if (currentUserName) currentUserName.textContent = username;
    if (userDisplay) userDisplay.style.display = "inline-flex";
    if (inputNama) inputNama.value = username;
}

// ==========================================================================
// 2. LOGIKA CRUD TESTIMONI
// ==========================================================================
if (testimoniForm) {
    testimoniForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert("Anda harus masuk terlebih dahulu!");
            return;
        }

        if (!inputPesan || !testimoniIdInput) return;

        const id = testimoniIdInput.value;
        const dataTestimoni = {
            nama: currentUser, // Dipastikan aman mengambil dari data session login
            pesan: inputPesan.value.trim(),
            timestamp: Date.now()
        };

        if (id === "") {
            push(testimoniRef, dataTestimoni).then(() => {
                triggerToast("Testimoni berhasil dikirim! ✨");
                inputPesan.value = "";
            });
        } else {
            const singleTestiRef = ref(db, `testimonis/${id}`);
            update(singleTestiRef, dataTestimoni).then(() => {
                triggerToast("Testimoni berhasil diperbarui! 📝");
                resetFormMode();
            });
        }
    });
}

// ==========================================================================
// 3. READ DATA & SLIDER GESER KANAN 2 DETIK KONTINU
// ==========================================================================
if (testimoniSlider) {
    onValue(testimoniRef, (snapshot) => {
        clearInterval(sliderInterval); // Hentikan slider lama saat ada pembaruan data
        testimoniSlider.innerHTML = "";

        if (snapshot.exists()) {
            const data = snapshot.val();
            const keys = Object.keys(data);
            
            // Buat element kartu testimoni
            keys.forEach((key) => {
                const item = data[key];
                const slideCard = document.createElement("div");
                slideCard.className = "testi-slider-card";
                
                // Tombol edit/hapus hanya muncul jika kartu itu milik user yang sedang login
                const actionButtons = (item.nama === currentUser) ? `
                    <div class="card-actions">
                        <button class="btn-edit-sm" data-id="${key}"><i class="fa-solid fa-pen"></i> Edit</button>
                        <button class="btn-delete-sm" data-id="${key}"><i class="fa-solid fa-trash"></i> Hapus</button>
                    </div>
                ` : '';

                slideCard.innerHTML = `
                    <div class="testi-bubble">
                        <h4><i class="fa-solid fa-user-tie"></i> ${escapeHTML(item.nama)}</h4>
                        <p>"${escapeHTML(item.pesan)}"</p>
                        ${actionButtons}
                    </div>
                `;
                testimoniSlider.appendChild(slideCard);
            });

            // Trik Klona Kartu Pertama ke Paling Akhir untuk Transisi Seamless Geser Kanan Kontinu
            if (keys.length > 1) {
                const firstCardClone = testimoniSlider.children[0].cloneNode(true);
                testimoniSlider.appendChild(firstCardClone);
                startSliderAnimation(keys.length);
            }
            
            attachCardEvents(data);
        } else {
            testimoniSlider.innerHTML = `<p style="text-align:center; width:100%;">Belum ada testimoni.</p>`;
        }
    });
}

function startSliderAnimation(totalDataReal) {
    if (!testimoniSlider) return;
    let currentIndex = 0;
    const cards = testimoniSlider.children;

    sliderInterval = setInterval(() => {
        currentIndex++;
        
        // Geser ke kanan dengan transisi halus
        for (let i = 0; i < cards.length; i++) {
            if(cards[i]) {
                cards[i].style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
                cards[i].style.transform = `translateX(-${currentIndex * 100}%)`;
            }
        }

        // Jika sampai di klona kartu pertama (ujung kanan)
        if (currentIndex === totalDataReal) {
            setTimeout(() => {
                currentIndex = 0;
                // Lompat kembali ke posisi kartu pertama secara instan (tanpa transisi geser kiri)
                for (let i = 0; i < cards.length; i++) {
                    if(cards[i]) {
                        cards[i].style.transition = "none";
                        cards[i].style.transform = `translateX(0%)`;
                    }
                }
            }, 500); // Eksekusi setelah animasi geser selesai berjalan
        }
    }, 2000); // Jeda perpindahan tiap komentar selama 2 detik
}

// ==========================================================================
// 4. UPDATE & DELETE CONTROLLER
// ==========================================================================
function attachCardEvents(dataSource) {
    document.querySelectorAll(".btn-edit-sm").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            if (!testimoniIdInput || !inputPesan || !formTitle || !btnSaveTestimoni || !btnCancelEdit) return;

            const id = e.currentTarget.getAttribute("data-id");
            const item = dataSource[id];

            testimoniIdInput.value = id;
            inputPesan.value = item.pesan;

            formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Ulasan Anda`;
            btnSaveTestimoni.innerHTML = `<i class="fa-solid fa-check"></i> Simpan Perubahan`;
            btnCancelEdit.style.display = "inline-flex";
        });
    });

    document.querySelectorAll(".btn-delete-sm").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            if (confirm("Hapus testimoni ini?")) {
                remove(ref(db, `testimonis/${id}`)).then(() => {
                    triggerToast("Testimoni telah dihapus. 🗑️");
                    if (testimoniIdInput && testimoniIdInput.value === id) resetFormMode();
                });
            }
        });
    });
}

if (btnCancelEdit) {
    btnCancelEdit.addEventListener("click", resetFormMode);
}

function resetFormMode() {
    if (!testimoniIdInput || !inputPesan || !formTitle || !btnSaveTestimoni || !btnCancelEdit) return;
    testimoniIdInput.value = "";
    inputPesan.value = "";
    formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Tulis Ulasan Anda`;
    btnSaveTestimoni.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Kirim`;
    btnCancelEdit.style.display = "none";
}

function triggerToast(message) {
    if (typeof window.showToast === "function") window.showToast(message);
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}
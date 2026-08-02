/* =========================
   MOBILE MENU
========================= */
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
const menuOverlay = document.getElementById('menuOverlay');

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.add('active');
  menuOverlay.classList.add('active');
});

closeMenu.addEventListener('click', closeMobileMenu);
menuOverlay.addEventListener('click', closeMobileMenu);

function closeMobileMenu() {
  mobileMenu.classList.remove('active');
  menuOverlay.classList.remove('active');
}

/* =========================
   HEADER SLIDER
========================= */
const headerSlides = document.querySelectorAll('.header-slider .slide');
let currentHeader = 0;

setInterval(() => {
  headerSlides[currentHeader].classList.remove('active');
  currentHeader++;
  if (currentHeader >= headerSlides.length) currentHeader = 0;
  headerSlides[currentHeader].classList.add('active');
}, 5000);

/* =========================
   ROOM SLIDER
========================= */
document.querySelectorAll('.slider').forEach((slider) => {
  const slides = slider.querySelector('.slides');
  const images = slider.querySelectorAll('img');
  const prev = slider.querySelector('.prev');
  const next = slider.querySelector('.next');
  const dots = slider.querySelectorAll('.dot');
  let index = 0;

  function updateSlider() {
    slides.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
  }

  next.addEventListener('click', () => {
    index++;
    if (index >= images.length) index = 0;
    updateSlider();
  });

  prev.addEventListener('click', () => {
    index--;
    if (index < 0) index = images.length - 1;
    updateSlider();
  });

  let startX = 0;
  slides.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
  slides.addEventListener('touchend', (e) => {
    let endX = e.changedTouches[0].clientX;
    let diff = startX - endX;
    if (diff > 50) { index++; if (index >= images.length) index = 0; }
    if (diff < -50) { index--; if (index < 0) index = images.length - 1; }
    updateSlider();
  });
});

/* =========================
   BOOKING CALCULATOR
========================= */
const roomWrapper = document.getElementById('roomWrapper');
const addRoomBtn = document.getElementById('addRoomBtn');

addRoomBtn.addEventListener('click', () => {
  const room = document.createElement('div');
  room.classList.add('room-item');
  room.innerHTML = `
    <div class="booking-grid">
      <select class="roomType">
        <option value="0">Pilih Tipe Kamar</option>
        <option value="400000">Superior Room</option>
        <option value="550000">Deluxe Room</option>
        <option value="1000000">VIP Room</option>
      </select>
      <input type="date" class="checkin">
      <input type="date" class="checkout">
    </div>
    <div class="room-total">Total : <span class="subtotal">Rp 0</span></div>
    <button type="button" class="remove-room">Hapus Kamar</button>
  `;
  roomWrapper.appendChild(room);
  attachEvents(room);
});

function attachEvents(room) {
  const roomType = room.querySelector('.roomType');
  const checkin = room.querySelector('.checkin');
  const checkout = room.querySelector('.checkout');
  const removeBtn = room.querySelector('.remove-room');

  roomType.addEventListener('change', calculateTotal);
  checkin.addEventListener('change', calculateTotal);
  checkout.addEventListener('change', calculateTotal);
  removeBtn.addEventListener('click', () => {
    room.remove();
    calculateTotal();
  });
}

document.querySelectorAll('.room-item').forEach(room => attachEvents(room));

function calculateTotal() {
  let grandTotal = 0;
  document.querySelectorAll('.room-item').forEach((room) => {
    const roomType = parseInt(room.querySelector('.roomType').value);
    const checkin = room.querySelector('.checkin').value;
    const checkout = room.querySelector('.checkout').value;
    const subtotal = room.querySelector('.subtotal');
    let total = 0;

    if (checkin && checkout) {
      const start = new Date(checkin);
      const end = new Date(checkout);
      const diff = (end - start) / (1000 * 60 * 60 * 24);
      if (diff > 0) total = diff * roomType;
    }

    subtotal.innerHTML = 'Rp ' + total.toLocaleString('id-ID');
    grandTotal += total;
  });

  document.getElementById('grandTotal').innerHTML = 'Rp ' + grandTotal.toLocaleString('id-ID');
}

/* =========================
   PAYMENT METHOD DETAIL
========================= */
const paymentMethodSelect = document.getElementById('paymentMethod');
const paymentDetail = document.getElementById('paymentDetail');

paymentMethodSelect.addEventListener('change', () => {
  const value = paymentMethodSelect.value;

 if (value === 'bank') {
  paymentDetail.classList.add('active');
  paymentDetail.innerHTML = `
    <h4>Transfer Bank</h4>
    <p>
      Silakan hubungi pihak Jagoci Inn untuk mendapatkan informasi
      pembayaran melalui transfer bank.
    </p>
  `;
}
    `;
  } else if (value === 'qris') {
    paymentDetail.classList.add('active');
    paymentDetail.innerHTML = `
      <h4>Pembayaran QRIS</h4>
      <p>Silahkan scan QRIS hotel untuk menyelesaikan pembayaran.</p>
      <div class="rekening">QRIS Jagoci Inn Hotel</div>
    `;
  } else {
    paymentDetail.classList.remove('active');
    paymentDetail.innerHTML = '';
  }
});

/* =========================
   PREVIEW BUKTI PEMBAYARAN
========================= */
const paymentProofInput = document.getElementById('paymentProof');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');

paymentProofInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    alert('File harus berupa gambar');
    return;
  }
  const imageURL = URL.createObjectURL(file);
  previewImage.src = imageURL;
  previewContainer.style.display = 'block';
});

/* =========================
   CONFIG BACKEND
========================= */
const API_URL = 'http://localhost:3000';
const socket = io(API_URL, { transports: ['websocket', 'polling'] });
const statusBox = document.getElementById('statusBooking');

/* =========================
   SUBMIT BOOKING
========================= */
document.getElementById('submitBooking').addEventListener('click', async (e) => {
  e.preventDefault();

  try {
    const name = document.querySelector('input[placeholder="Nama Lengkap"]').value.trim();
    const email = document.querySelector('input[placeholder="Email"]').value.trim();
    const phone = document.querySelector('input[placeholder="Nomor WhatsApp"]').value.trim();
    const payment = document.getElementById('paymentMethod').value;
    const note = document.querySelector('textarea').value.trim();
    const paymentProof = document.getElementById('paymentProof');

    if (!name || !phone) {
      statusBox.innerText = 'Nama dan nomor WA wajib diisi';
      statusBox.style.color = 'red';
      return;
    }

    const rooms = [];
    document.querySelectorAll('.room-item').forEach((room) => {
      const roomType = room.querySelector('.roomType');
      const checkin = room.querySelector('.checkin').value;
      const checkout = room.querySelector('.checkout').value;
      const subtotal = room.querySelector('.subtotal').innerText;

      if (roomType.value !== '0' && checkin && checkout) {
        rooms.push({
          roomType: roomType.options[roomType.selectedIndex].text,
          price: roomType.value,
          checkin,
          checkout,
          subtotal
        });
      }
    });

    if (rooms.length === 0) {
      statusBox.innerText = 'Pilih minimal 1 kamar';
      statusBox.style.color = 'red';
      return;
    }

    const total = document.getElementById('grandTotal').innerText;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('payment', payment);
    formData.append('note', note);
    formData.append('total', total);
    formData.append('rooms', JSON.stringify(rooms));

    if (paymentProof.files[0]) {
      formData.append('paymentProof', paymentProof.files[0]);
    }

    statusBox.innerText = 'Mengirim booking...';
    statusBox.style.color = 'orange';

    const res = await fetch(`${API_URL}/api/booking`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error('Server ' + res.status);

    const data = await res.json();

    if (data.success) {
      statusBox.innerText = '✔ Booking berhasil, notifikasi WA dikirim otomatis';
      statusBox.style.color = 'green';

      // Notifikasi WhatsApp dikirim OTOMATIS oleh BACKEND via Fonnte API:
      // 1. Hotel   (+62 821-1023-580) → mendapat detail booking + gambar bukti bayar
      // 2. Customer (nomor yg didaftarkan) → mendapat konfirmasi booking
    } else {
      statusBox.innerText = '❌ Booking gagal';
      statusBox.style.color = 'red';
    }
  } catch (err) {
    console.log(err);
    statusBox.innerText = 'Server error: ' + err.message;
    statusBox.style.color = 'red';
  }
});

/* =========================
   SOCKET STATUS
========================= */
socket.on('connect', () => { console.log('Socket connected'); });
socket.on('connect_error', (err) => { console.log('Socket Error:', err); });

socket.on('status', (data) => {
  if (data.status === 'processing') {
    statusBox.innerText = '⏳ Booking diproses...';
    statusBox.style.color = 'orange';
  }
  if (data.status === 'confirmed') {
    statusBox.innerText = '✔ Booking dikonfirmasi';
    statusBox.style.color = 'green';
  }
  if (data.status === 'failed') {
    statusBox.innerText = '❌ Booking gagal';
    statusBox.style.color = 'red';
  }
});

/* =========================
   NAVBAR SCROLL EFFECT
========================= */
window.addEventListener('scroll', function () {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

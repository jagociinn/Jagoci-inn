AOS.init({ duration: 1000, once: true });

// ================= MOBILE MENU =================
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.onclick = () => {
  mobileMenu.classList.toggle("active");
};

document.querySelectorAll(".mobile-menu a").forEach(a => {
  a.onclick = () => mobileMenu.classList.remove("active");
});

// ================= AUTO HITUNG MALAM =================
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const malam = document.getElementById("malam");

function hitungMalam() {
  if (checkin.value && checkout.value) {
    const inDate = new Date(checkin.value);
    const outDate = new Date(checkout.value);

    const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);

    malam.value = diff > 0 ? diff : 0;
    hitungTotal();
  }
}

checkin.addEventListener("change", hitungMalam);
checkout.addEventListener("change", hitungMalam);

// ================= TOTAL =================
function hitungTotal() {
  const kamar = document.getElementById("kamar").value;
  const malamVal = parseInt(malam.value) || 0;

  let harga = 0;

  if (kamar === "Superior Room") harga = 400000;
  if (kamar === "Deluxe Room") harga = 550000;
  if (kamar === "VIP Room") harga = 1000000;

  const total = harga * malamVal;

  document.getElementById("totalHarga").innerText =
    "Rp " + total.toLocaleString("id-ID");
}

// ================= QRIS =================
function showQris() {
  const qrisBox = document.getElementById("qrisBox");
  const metode = document.getElementById("pembayaran").value;

  qrisBox.style.display = metode === "QRIS" ? "block" : "none";
}

// ================= WHATSAPP FORMAT =================
function sendWhatsApp(nama, kamar, total, kode) {
  const nomor = "628211023580";

  const pesan = `
🏨 *BOOKING JAGOCI INN*

👤 Nama: ${nama}
🛏 Kamar: ${kamar}
💰 Total: ${total}
🧾 Kode: ${kode}

Terima kasih telah booking.
  `;

  const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank");
}

// ================= BOOKING =================
function buatInvoice() {
  const nama = document.getElementById("nama").value;
  const kamar = document.getElementById("kamar").value;
  const total = document.getElementById("totalHarga").innerText;
  const metode = document.getElementById("pembayaran").value;

  // VALIDASI
  if (!nama || !kamar || !checkin.value || !checkout.value || !metode) {
    alert("Lengkapi data booking dulu!");
    return;
  }

  const kode = "INV-" + Math.floor(Math.random() * 999999);

  // INVOICE
  document.getElementById("invoiceBox").style.display = "block";

  document.getElementById("invNama").innerText = "Nama: " + nama;
  document.getElementById("invKamar").innerText = "Kamar: " + kamar;
  document.getElementById("invTanggal").innerText =
    `Check-in: ${checkin.value} - Check-out: ${checkout.value}`;
  document.getElementById("invTotal").innerText = "Total: " + total;
  document.getElementById("invPembayaran").innerText = "Metode: " + metode;
  document.getElementById("invKode").innerText = "Kode: " + kode;

  // SIMPAN LOCAL STORAGE
  const data = { nama, kamar, total, kode };
  localStorage.setItem("booking_last", JSON.stringify(data));

  // WA AUTO SEND
  sendWhatsApp(nama, kamar, total, kode);

  alert("Booking sukses & invoice terkirim!");

  // RESET FORM
  document.querySelector(".booking-form").reset();
  document.getElementById("totalHarga").innerText = "Rp 0";
}

// ================= SLIDER ROOM =================
document.querySelectorAll(".slider").forEach(slider => {
  const slides = slider.querySelector(".slides");
  const imgs = slider.querySelectorAll("img");
  const next = slider.querySelector(".next");
  const prev = slider.querySelector(".prev");
  const dots = slider.querySelectorAll(".dot");

  let i = 0;

  function update() {
    slides.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach(d => d.classList.remove("active"));
    if (dots[i]) dots[i].classList.add("active");
  }

  next.onclick = () => {
    i = (i + 1) % imgs.length;
    update();
  };

  prev.onclick = () => {
    i = (i - 1 + imgs.length) % imgs.length;
    update();
  };

  dots.forEach((d, idx) => {
    d.onclick = () => {
      i = idx;
      update();
    };
  });

  // AUTO + PAUSE ON HOVER
  let auto = setInterval(() => {
    i = (i + 1) % imgs.length;
    update();
  }, 4000);

  slider.addEventListener("mouseenter", () => clearInterval(auto));
  slider.addEventListener("mouseleave", () => {
    auto = setInterval(() => {
      i = (i + 1) % imgs.length;
      update();
    }, 4000);
  });
});

// ================= HEADER SLIDER =================
const headerSlides = document.querySelectorAll(".header-slider .slide");
let h = 0;

setInterval(() => {
  headerSlides.forEach(s => s.classList.remove("active"));
  h = (h + 1) % headerSlides.length;
  headerSlides[h].classList.add("active");
}, 5000);
// ---- Foto carousel: ganti slide setiap 4.5 detik ----
const slides = document.querySelectorAll(".bg-slide");
let current = 0;
setInterval(() => {
  slides[current].classList.remove("active");
  current = (current + 1) % slides.length;
  slides[current].classList.add("active");
}, 4500);

// ---- Ganti nama tamu lewat parameter URL, misal ?tamu=Budi ----
const params = new URLSearchParams(window.location.search);
const tamu = params.get("tamu");
if (tamu) {
  document.getElementById("guest-name").textContent = decodeURIComponent(tamu);
}

// ---- Tombol "Buka Undangan" ----
const cover = document.getElementById("cover");
const openBtn = document.getElementById("open-btn");
cover.classList.add("opening");

openBtn.addEventListener("click", () => {
  cover.classList.add("hide");
  document.body.classList.remove("pre-open");
  document.getElementById("next-section").classList.remove("hidden");
  document.getElementById("floating-fab").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("section2-text").classList.add("show");
  }, 300);
  setTimeout(checkRevealOnScroll, 500);
});

// ---- Tombol musik: play/pause ----
const musicBtn = document.getElementById("music-btn");
const audio = document.getElementById("bg-audio");
let isPlaying = false;
musicBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play().catch(() => {});
  }
  isPlaying = !isPlaying;
  musicBtn.classList.toggle("playing", isPlaying);
});

// ---- Section 3+: animasi muncul/reset tiap kali elemen masuk-keluar layar (bisa replay, dua arah) ----
function checkRevealOnScroll() {
  document
    .querySelectorAll(
      ".dm-letter, .ayat-reveal, .pop-reveal, .reveal-up-scroll, .zoom-out-reveal, .title-expand, .zoom-in-reveal, .gallery-reveal",
    )
    .forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.88 && rect.bottom > 0;
      el.classList.toggle("in-view", isVisible);
    });
}
window.addEventListener("scroll", checkRevealOnScroll, { passive: true });
window.addEventListener("resize", checkRevealOnScroll);
document
  .querySelector(".invite-frame")
  .addEventListener("scroll", checkRevealOnScroll, { passive: true });
checkRevealOnScroll();

// ---- Countdown Save The Date ----
// GANTI tanggal & jam acara di bawah ini sesuai kebutuhan
const weddingDate = new Date("2026-10-16T09:00:00+07:00");

function updateCountdown() {
  const now = new Date();
  let diff = weddingDate - now;
  if (diff < 0) diff = 0;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  document.getElementById("cd-days").textContent = String(days).padStart(
    2,
    "0",
  );
  document.getElementById("cd-hours").textContent = String(hours).padStart(
    2,
    "0",
  );
  document.getElementById("cd-minutes").textContent = String(minutes).padStart(
    2,
    "0",
  );
  document.getElementById("cd-seconds").textContent = String(seconds).padStart(
    2,
    "0",
  );
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ---- Tombol "Simpan di Kalender": buka Google Calendar terisi otomatis ----
document.getElementById("save-calendar-btn").addEventListener("click", () => {
  // GANTI judul, deskripsi, lokasi, dan waktu (format UTC: YYYYMMDDTHHmmssZ) di bawah ini
  const title = encodeURIComponent("Pernikahan Dilan & Millea");
  const details = encodeURIComponent(
    "Dengan segala kerendahan hati kami mengundang Bapak/Ibu/Saudara/i.",
  );
  const location = encodeURIComponent("Nama Gedung, Alamat Lengkap");
  const start = "20270320T010000Z";
  const end = "20270320T040000Z";
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  window.open(url, "_blank");
});

// ---- Tombol "Hadiah Digital": tampilkan/sembunyikan daftar rekening ----
document.getElementById("gift-toggle-btn").addEventListener("click", () => {
  document.getElementById("gift-cards-wrap").classList.toggle("hidden");
});

// ---- Tombol "Copy": salin nomor rekening ----
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.target);
    const label = btn.querySelector(".copy-label");
    navigator.clipboard
      .writeText(target.textContent.trim())
      .then(() => {
        const original = label.textContent;
        label.textContent = "Tersalin!";
        setTimeout(() => {
          label.textContent = original;
        }, 1500);
      })
      .catch(() => {});
  });
});

// ---- RSVP: pilih status kehadiran (single-select) ----
let selectedStatus = null;
document.querySelectorAll(".rsvp-status-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".rsvp-status-btn").forEach((b) => {
      b.style.background = "transparent";
      b.style.color = "#1c2a3a";
    });
    btn.style.background = "var(--wine)";
    btn.style.color = "var(--ivory)";
    selectedStatus = btn.dataset.status;
  });
});

// ---- RSVP: riwayat ucapan ----
// CATATAN PENTING: ucapan disimpan di localStorage BROWSER INI SAJA, bukan database bersama.
// Artinya tiap tamu hanya akan melihat ucapannya sendiri di perangkatnya, bukan ucapan tamu lain.
// Untuk ucapan yang bisa dilihat semua tamu, perlu backend/database (mis. Google Sheets API, Firebase, dll) — beri tahu saya kalau mau dibuatkan.
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
// ---- Format waktu relatif: Hari ini / Kemarin / X hari lalu / X Minggu lalu / X Bulan lalu / X Tahun lalu ----
function formatRelativeTime(timestamp) {
  if (!timestamp) return "";
  const now = new Date();
  const then = new Date(timestamp);
  const startOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayDiff = Math.round(
    (startOfDay(now) - startOfDay(then)) / (1000 * 60 * 60 * 24),
  );

  if (dayDiff <= 0) return "Hari ini";
  if (dayDiff === 1) return "Kemarin";
  if (dayDiff < 7) return dayDiff + " hari lalu";
  const weekDiff = Math.floor(dayDiff / 7);
  if (weekDiff < 5)
    return weekDiff + (weekDiff === 1 ? " Minggu lalu" : " Minggu lalu");
  const monthDiff = Math.floor(dayDiff / 30);
  if (monthDiff < 12)
    return monthDiff + (monthDiff === 1 ? " Bulan lalu" : " Bulan lalu");
  const yearDiff = Math.floor(dayDiff / 365);
  return yearDiff + (yearDiff === 1 ? " Tahun lalu" : " Tahun lalu");
}
function loadRsvpHistory() {
  try {
    return JSON.parse(localStorage.getItem("rsvp-history") || "[]");
  } catch (e) {
    return [];
  }
}
function renderRsvpHistory() {
  const list = loadRsvpHistory();
  const wrap = document.getElementById("rsvp-history");
  wrap.innerHTML = list
    .slice()
    .reverse()
    .map(
      (item) => `
      <div class="rounded-xl p-4" style="background:#f4f4f2; border:1px solid #e5e5e5;">
        <div class="flex items-center justify-between">
          <span class="font-serif font-bold" style="color:#1c2a3a;">${escapeHtml(item.name)}</span>
          <span class="text-xs font-serif px-2 py-1 rounded-full" style="background:var(--wine); color:var(--ivory);">${escapeHtml(item.status)}</span>
        </div>
        <p class="font-serif text-sm text-[#555] mt-2">${escapeHtml(item.message)}</p>
        <p class="font-serif text-xs mt-2" style="color:#999;">${escapeHtml(formatRelativeTime(item.time))}</p>
      </div>
    `,
    )
    .join("");
}
renderRsvpHistory();

document.getElementById("rsvp-submit-btn").addEventListener("click", () => {
  const nameInput = document.getElementById("rsvp-name");
  const msgInput = document.getElementById("rsvp-message");
  const name = nameInput.value.trim();
  const message = msgInput.value.trim();
  if (!name || !selectedStatus) {
    alert("Isi nama dan pilih konfirmasi kehadiran dulu ya.");
    return;
  }
  const list = loadRsvpHistory();
  list.push({
    name,
    status: selectedStatus,
    message: message || "-",
    time: Date.now(),
  });
  localStorage.setItem("rsvp-history", JSON.stringify(list));
  nameInput.value = "";
  msgInput.value = "";
  renderRsvpHistory();
});

// Variabel untuk menyimpan status TTS
let isTTSEnabled = false;
// Variabel untuk menyimpan instance SpeechSynthesisUtterance
let currentUtterance = null;

// Fungsi untuk menginisialisasi TTS
function initTTS() {
  // Periksa apakah browser mendukung Web Speech API
  if ("speechSynthesis" in window) {
    // Dapatkan elemen switch TTS
    const ttsSwitch = document.getElementById("ttsSwitch");

    // Definisikan elemen-elemen yang ingin diberi fitur TTS
    const elements = document.querySelectorAll(
      ".menu-card, .menu-card-text, .card-image, .title, .h5, .setting-btn, #ttsSwitch"
    );

    // Fungsi untuk menangani event hover pada elemen
    const handleHover = (event) => {
      if (isTTSEnabled) {
        let text;
        if (event.target.classList.contains("setting-btn")) {
          text = "Tombol Menu";
        } else {
          text =
            event.target.getAttribute("aria-label") ||
            event.target.innerText ||
            event.target.textContent;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "id-ID"; // Mengatur bahasa ke Bahasa Indonesia

        // Jika ada ucapan sedang berlangsung, hentikan
        if (currentUtterance) {
          window.speechSynthesis.cancel();
        }

        // Simpan instance SpeechSynthesisUtterance terbaru
        currentUtterance = utterance;

        window.speechSynthesis.speak(utterance);
      }
    };

    // Tambahkan event listener untuk setiap elemen
    elements.forEach((element) => {
      element.addEventListener("mouseover", handleHover);
    });

    // Tambahkan event listener untuk switch TTS
    ttsSwitch.addEventListener("change", () => {
      isTTSEnabled = ttsSwitch.checked;
      if (isTTSEnabled) {
        speakText("Text-to-Speech diaktifkan");
      } else {
        speakText("Text-to-Speech dinonaktifkan");
      }
    });
  } else {
    console.error("Web Speech API tidak didukung pada browser ini.");
  }
}

// Fungsi untuk mengucapkan teks
function speakText(text) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    window.speechSynthesis.speak(utterance);
  }
}

// Panggil fungsi initTTS() saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", initTTS);

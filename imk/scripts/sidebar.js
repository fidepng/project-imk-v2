// sidebar.js
const initSidebar = () => {
  const settingBtn = document.querySelector(".setting-btn");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".overlay");
  const settingsIcon = document.querySelector(".settings-icon");

  if (!settingBtn || !sidebar || !overlay || !settingsIcon) {
    console.error(
      "Elemen tidak ditemukan. Sidebar tidak dapat diinisialisasi."
    );
    return;
  }

  let isOpen = false;

  const toggleSidebar = () => {
    isOpen = !isOpen;
    settingBtn.setAttribute("aria-expanded", isOpen);
    sidebar.setAttribute("aria-hidden", !isOpen);
    sidebar.classList.toggle("open", isOpen);
    overlay.classList.toggle("show", isOpen);
    settingsIcon.classList.toggle("rotate-open", isOpen);
    settingsIcon.classList.toggle("rotate-close", !isOpen);
  };

  settingBtn.addEventListener("click", toggleSidebar);
  overlay.addEventListener("click", toggleSidebar);

  document.addEventListener("click", (event) => {
    const isOutsideSidebar =
      !sidebar.contains(event.target) && !settingBtn.contains(event.target);
    if (isOutsideSidebar && isOpen) {
      toggleSidebar();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) {
      toggleSidebar();
    }
  });

  let touchStartX, touchEndX;

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isOpen) return;
    touchEndX = e.touches[0].clientX;
    const touchDiff = touchStartX - touchEndX;
    const sidebarWidth = sidebar.offsetWidth;

    if (touchDiff > 0 && touchDiff < sidebarWidth / 2) {
      sidebar.style.transform = `translateX(-${touchDiff}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!isOpen) return;
    const touchDiff = touchStartX - touchEndX;
    const sidebarWidth = sidebar.offsetWidth;

    if (touchDiff > sidebarWidth / 3) {
      toggleSidebar();
      sidebar.style.transform = "";
    } else {
      sidebar.style.transform = "";
    }
  };

  sidebar.addEventListener("touchstart", handleTouchStart, { passive: true });
  sidebar.addEventListener("touchmove", handleTouchMove, { passive: false });
  sidebar.addEventListener("touchend", handleTouchEnd);
};

export default initSidebar;
document.addEventListener("DOMContentLoaded", initSidebar);

document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburguer");
    const mobileMenu = document.querySelector(".mobile-menu");
    const blurBackground = document.querySelector(".blur-background");

    hamburger.addEventListener("click", function () {
        mobileMenu.classList.toggle("active");
        blurBackground.style.display = blurBackground.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function (event) {
        if (!mobileMenu.contains(event.target) && !hamburger.contains(event.target)) {
            mobileMenu.classList.remove("active");
            blurBackground.style.display = "none";
        }
    });

    const openModalButtons = document.querySelectorAll(".open-contact-modal");

    openModalButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const modalIndex = button.closest(".btn-contato").dataset.modalIndex;
            const modal = document.getElementById(`modal-contato-${modalIndex}`);
            modal.style.display = "block";
        });
    });

    const closeButtons = document.querySelectorAll("[class^='close']");
    const modais = document.querySelectorAll("[id^='modal-contato-']");

    closeButtons.forEach((span) => {
        span.addEventListener("click", function () {
            const modalIndex = span.closest(".modal").id.split("-")[2];
            const modal = document.getElementById(`modal-contato-${modalIndex}`);
            modal.style.display = "none";
        });
    });

    window.addEventListener("click", function (event) {
        modais.forEach((modal) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    });
});

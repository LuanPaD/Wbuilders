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
});
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

// window.addEventListener("scroll", function() {
//     var scrollArrow = document.getElementById("scrollArrow");

//     if (window.scrollY >= 10) {
//       scrollArrow.classList.add("visible");
//     } else {
//       scrollArrow.classList.remove("visible");
//     }
// });

document.addEventListener("DOMContentLoaded", function () {
    const zoomableImages = document.querySelectorAll(".zoomable");
    const overlays = document.querySelectorAll(".overlay");
    const zoomFrames = document.querySelectorAll(".zoom-frame");

    zoomableImages.forEach((image, index) => {
        image.addEventListener("click", function () {
            overlays[index].style.display = "block";
            zoomFrames[index].classList.add("active");
        });

        overlays[index].addEventListener("click", function () {
            overlays[index].style.display = "none";
            zoomFrames[index].classList.remove("active");
        });
    });
});
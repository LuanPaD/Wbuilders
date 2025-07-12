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

document.getElementById("exampleFormControlFile1").addEventListener("change", function() {
    var preview = document.getElementById("imagePreview");
    var file    = this.files[0];
    var reader  = new FileReader();

    reader.onload = function(event) {
        var image = new Image();
        image.src = event.target.result;
        image.style.maxWidth = "100%";
        image.style.maxHeight = "100%";
        preview.innerHTML = "";
        preview.appendChild(image);
    }

    if (file) {
        reader.readAsDataURL(file);
    }
});

function previewImage() {
    var preview = document.querySelector('#imagePreview');
    var image = document.querySelector('#image');
    var file = document.querySelector('#exampleFormControlFile1').files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        image.src = e.target.result;
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        image.src = '';
    }
}
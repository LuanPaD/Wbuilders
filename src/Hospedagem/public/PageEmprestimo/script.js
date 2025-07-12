$(document).ready(function () {
    var url_atual = window.location.origin;


    let dataSet = [];
    let dataSetNames = [];

    function fetchDataSet() {
        $.ajax({
            url: `${url_atual}/emails`,
            method: "GET",
            success: function (data) {
                dataSet = data;
            },
            error: function (xhr, status, error) {
                console.log("Erro na requisição:", error);
            }
        });
    }

    function fetchDataSetNames() {
        $.ajax({
            url: `${url_atual}/names`,
            method: "GET",
            success: function (data) {
                dataSetNames = data;
            },
            error: function (xhr, status, error) {
                console.log("Erro na requisição:", error);

            }
        });
    }


    function displayResultsNames(query) {
        var results = dataSetNames.filter(item =>
            item.toLowerCase().includes(query.toLowerCase())
        );

        var resultsContainer = $('#searchResultsNames');
        resultsContainer.empty();

        if (results.length > 0) {
            results.forEach(result => {
                resultsContainer.append('<p class="searchResultsNames">' + result + '</p>');
            });
        } else {
            resultsContainer.append('<p>Nenhum resultado encontrado</p>');
        }
    }



    function displayResults(query) {
        var results = dataSet.filter(item =>
            item.toLowerCase().includes(query.toLowerCase())
        );

        var resultsContainer = $('#searchResults');
        resultsContainer.empty();

        if (results.length > 0) {
            results.forEach(result => {
                resultsContainer.append('<p class="searchResult">' + result + '</p>');
            });
        } else {
            resultsContainer.append('<p>Nenhum resultado encontrado</p>');
        }
    }

    $('#searchInput').on('input', function () {
        var query = $(this).val();
        displayResults(query);
    });

    $('#searchResults').on('click', '.searchResult', function () {
        var selectedResult = $(this).text();
        $('#searchInput').val(selectedResult);
        $('#searchResults').empty();
    });

    $('#searchInputNames').on('input', function () {
        var query = $(this).val();
        displayResultsNames(query);
    });

    $('#searchResultsNames').on('click', '.searchResultsNames', function () {
        var selectedResult = $(this).text();
        $('#searchInputNames').val(selectedResult);
        $('#searchResultsNames').empty();
    });

    // Inicialização
    fetchDataSet();
    fetchDataSetNames()
});

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

document.getElementById("exampleFormControlFile1").addEventListener("change", function () {
    var preview = document.getElementById("imagePreview");
    var file = this.files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
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

    reader.onload = function (e) {
        image.src = e.target.result;
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        image.src = '';
    }
}
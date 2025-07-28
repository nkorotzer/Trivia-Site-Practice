let mainImage = document.querySelector("#mainImage");
let imageCaption = document.querySelector(".textCon");
let changeImageBtn = document.querySelector("#changeImageBtn");

changeImageBtn.addEventListener("click", function () {
    if (mainImage.getAttribute('src') === "./images/sun.jfif") {
        mainImage.setAttribute('src', "./images/fez.jfif");
        mainImage.setAttribute('alt', "A fez");
        imageCaption.textContent = "A fez";
    }
    else {
        mainImage.setAttribute('src', "./images/sun.jfif");
        mainImage.setAttribute('alt', "A sun hat");
        imageCaption.textContent = "A sun hat";
    }
})
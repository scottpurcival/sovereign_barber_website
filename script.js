function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function scrambleIt(b,a,css,text){
    var c = ".com";
    document.write('<a href="mailto:'+a+'@'+b+c+'" class="'+css+'">'+text+'</a>');
}

var galleryImages = [
    'images/gallery/haircut-1.jpg',
    'images/gallery/haircut-2.jpg',
    'images/gallery/haircut-3.jpg',
    'images/gallery/markets-1.jpg',
    'images/gallery/markets-2.jpg',
    'images/gallery/salon.jpg'
];
var galleryIndex = 0;

function openGallery(index) {
    galleryIndex = index;
    document.getElementById('gallery-modal-img').src = galleryImages[galleryIndex];
    document.getElementById('gallery-counter').textContent = (galleryIndex + 1) + ' / ' + galleryImages.length;
    document.getElementById('gallery-modal').classList.add('open');
    document.addEventListener('keydown', galleryKeyHandler);
}

function closeGallery() {
    document.getElementById('gallery-modal').classList.remove('open');
    document.removeEventListener('keydown', galleryKeyHandler);
}

function changeGalleryImage(dir) {
    galleryIndex = (galleryIndex + dir + galleryImages.length) % galleryImages.length;
    document.getElementById('gallery-modal-img').src = galleryImages[galleryIndex];
    document.getElementById('gallery-counter').textContent = (galleryIndex + 1) + ' / ' + galleryImages.length;
}

function galleryKeyHandler(e) {
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') changeGalleryImage(-1);
    if (e.key === 'ArrowRight') changeGalleryImage(1);
}
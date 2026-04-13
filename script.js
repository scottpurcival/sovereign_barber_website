var SHOPIFY_DOMAIN = '5wcehe-rv.myshopify.com';
var SHOPIFY_TOKEN  = 'c2de6091608d8eab69da4308ffe30bb3';
var storeLoaded    = false;

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

    if (tabName === 'Store') {
        loadStore();
    }
}

function loadStore() {
    if (storeLoaded) return;

    var query = JSON.stringify({
        query: '{ products(first: 50) { edges { node { title handle priceRange { minVariantPrice { amount currencyCode } } featuredImage { url altText } } } } }'
    });

    fetch('https://' + SHOPIFY_DOMAIN + '/api/2024-01/graphql.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN
        },
        body: query
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
        var products = data.data.products.edges;
        var grid = document.getElementById('store-grid');
        var loading = document.getElementById('store-loading');

        if (!products || products.length === 0) {
            loading.textContent = 'No products found.';
            return;
        }

        products.forEach(function (edge) {
            var p = edge.node;
            var price = parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2);
            var currency = p.priceRange.minVariantPrice.currencyCode;
            var imgUrl = p.featuredImage ? p.featuredImage.url : '';
            var imgAlt = p.featuredImage ? (p.featuredImage.altText || p.title) : p.title;
            var productUrl = 'https://' + SHOPIFY_DOMAIN + '/products/' + p.handle;

            var card = document.createElement('div');
            card.className = 'store-card';
            card.innerHTML =
                '<a href="' + productUrl + '" target="_blank" rel="noopener">' +
                (imgUrl ? '<img src="' + imgUrl + '" alt="' + imgAlt + '" class="store-card-img" loading="lazy">' : '') +
                '<div class="store-card-body">' +
                '<h3 class="store-card-title">' + p.title + '</h3>' +
                '<p class="store-card-price">' + currency + ' $' + price + '</p>' +
                '<span class="store-card-btn">Buy Now</span>' +
                '</div>' +
                '</a>';
            grid.appendChild(card);
        });

        storeLoaded = true;
        loading.style.display = 'none';
    })
    .catch(function () {
        var loading = document.getElementById('store-loading');
        loading.textContent = 'Unable to load products right now — click the tab to try again.';
    });
}

function scrambleIt(b,a,css,text){
    var c = ".com";
    document.write('<a href="mailto:'+a+'@'+b+c+'" class="'+css+'">'+text+'</a>');
}

var galleryImages = [
    'images/gallery/salon-1.jpg',
    'images/gallery/salon-2.jpg',
    'images/gallery/haircut-1.jpg',
    'images/gallery/haircut-2.jpg',
    'images/gallery/haircut-3.jpg',
    'images/gallery/haircut-4.jpg',
    'images/gallery/markets-1.jpg',
    'images/gallery/markets-2.jpg',
    'images/gallery/products-1.jpg',
    'images/gallery/products-2.jpg'
];
var galleryIndex = 0;

// Gallery scroll
var galleryPos       = 0;
var galleryLoopWidth = 2200; // 10 images × 220px
var gallerySpeed     = 44;   // px/s
var galleryLastTime  = null;
var galleryDragging  = false;
var galleryDragStartX   = 0;
var galleryDragStartPos = 0;
var galleryWasDrag   = false;

document.addEventListener('DOMContentLoaded', function () {
    var track = document.querySelector('.gallery-track');

    requestAnimationFrame(galleryTick);

    // Mouse drag
    track.addEventListener('mousedown', function (e) {
        galleryDragging  = true;
        galleryWasDrag   = false;
        galleryDragStartX   = e.clientX;
        galleryDragStartPos = galleryPos;
        galleryLastTime  = null;
        track.classList.add('dragging');
        e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
        if (!galleryDragging) return;
        var delta = e.clientX - galleryDragStartX;
        if (Math.abs(delta) > 4) galleryWasDrag = true;
        galleryPos = ((galleryDragStartPos - delta) % galleryLoopWidth + galleryLoopWidth) % galleryLoopWidth;
        track.style.transform = 'translateX(' + (-galleryPos) + 'px)';
    });

    document.addEventListener('mouseup', function () {
        if (!galleryDragging) return;
        galleryDragging = false;
        track.classList.remove('dragging');
    });

    // Touch drag
    track.addEventListener('touchstart', function (e) {
        galleryDragging  = true;
        galleryWasDrag   = false;
        galleryDragStartX   = e.touches[0].clientX;
        galleryDragStartPos = galleryPos;
        galleryLastTime  = null;
    }, { passive: true });

    track.addEventListener('touchmove', function (e) {
        if (!galleryDragging) return;
        var delta = e.touches[0].clientX - galleryDragStartX;
        if (Math.abs(delta) > 4) galleryWasDrag = true;
        galleryPos = ((galleryDragStartPos - delta) % galleryLoopWidth + galleryLoopWidth) % galleryLoopWidth;
        track.style.transform = 'translateX(' + (-galleryPos) + 'px)';
    }, { passive: true });

    track.addEventListener('touchend', function () {
        galleryDragging = false;
    });

    // Block click-on-thumb if the interaction was a drag
    track.addEventListener('click', function (e) {
        if (galleryWasDrag) {
            e.stopPropagation();
            e.preventDefault();
            galleryWasDrag = false;
        }
    }, true);
});

function galleryTick(timestamp) {
    if (!galleryDragging) {
        if (galleryLastTime !== null) {
            galleryPos += gallerySpeed * (timestamp - galleryLastTime) / 1000;
            if (galleryPos >= galleryLoopWidth) galleryPos -= galleryLoopWidth;
            document.querySelector('.gallery-track').style.transform = 'translateX(' + (-galleryPos) + 'px)';
        }
        galleryLastTime = timestamp;
    }
    requestAnimationFrame(galleryTick);
}

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
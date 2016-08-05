if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(function(registration) {
        registration.pushManager.getSubscription().then(function(subscription) {
            if (!subscription) {
                registration.pushManager.subscribe({ userVisibleOnly: true }).then(function(subscription) {
                    $.ajax({
                        url: '/subscribe',
                        type: 'post',
                        data: { subscription: JSON.parse(JSON.stringify(subscription)) }
                    });
                }).catch(function(error) {
                    console.error('Push notifications subscription failed.', error);
                });
            }
        });
    }).catch(function(error) {
        console.error('Service worker registration failed.', error);
    });
}





var bgimage = $('.slanted-background');
var bgindex = 0;
var backgrounds = [
    'url("/static/images/backgrounds/1.jpg")',
    'url("/static/images/backgrounds/2.jpg")',
    'url("/static/images/backgrounds/3.jpg")'
];

(function slideshow() {
    bgimage.css('background-image', backgrounds[bgindex]);
    bgindex = (bgindex + 1) % backgrounds.length;
    setTimeout(slideshow, 3000);
})();

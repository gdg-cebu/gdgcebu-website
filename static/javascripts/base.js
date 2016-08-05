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

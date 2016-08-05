function fetchEvents() {
    return fetch('/get-events').then(function(response) {
        return response.json();
    });
}


function renderEvent(container, template, data) {
    var event = $(template);
    event.find('.event__thumbnail')
        .attr('src', data.thumbnail)
        .attr('alt', data.name);
    event.find('.event__title').text(data.name);
    event.find('.event__info--when').text(data.date);
    event.find('.event__info--where').text(data.venue);
    event.find('p').text(data.description);
    if (!data.venue) {
        event.find('.event__info--where').addClass('hidden');
    }

    event.addClass('event--hidden');
    setTimeout(function() {
        event.removeClass('event--hidden');
    }, 0);

    container.append(event);
    return event;
}



var eventsContainer = $('.events');
var eventTemplate = $('template#event').html();

fetchEvents().then(function(events) {
    events.forEach(function(event) {
        if (!event.thumbnail) {
            event.thumbnail = 'gdg-logo-gray.png';
        }
        event.thumbnail = '/static/images/' + event.thumbnail;

        renderEvent(eventsContainer, eventTemplate, event);
    });
});

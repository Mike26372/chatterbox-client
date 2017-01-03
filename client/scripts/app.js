// YOUR CODE HERE:
var app = {
  server: 'https://api.parse.com/1/classes/messages',
  recentFetch: null,
  mostRecentQuery: '?order=-createdAt',
  fromLastFetchQuery: '?where=',
  greaterThanDateQueryObj: {
    'createdAt': {
      '$gte': {
        '__type': 'Date',
        'iso': '2016-11-21T00:00:00.000Z'
      }
    }
  }
};
  
app.init = () => {
  
  $('#main').on('click', '.username', (event) => {
    app.handleUsernameClick();
  });

  $('#fetch').on('click', (event) => {
    app.greaterThanDateQueryObj.createdAt.$gte.iso = '' + app.recentFetch.toISOString();
    app.fetch(`${app.fromLastFetchQuery}${JSON.stringify(app.greaterThanDateQueryObj)}`);
  });

  // app.renderRoom('lobby');
  app.fetch(app.mostRecentQuery);
  $('select').material_select();
};

app.send = (message) => {  
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      console.log(data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = (query = '') => {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: `${app.server}${query}`,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
      _.each(data.results.reverse(), (value) => {
        app.renderMessage(value);
      });
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
  app.recentFetch = new Date();
};

app.appendToPage = () => {

};

app.clearMessages = () => {
  $('#chats').children().remove(); 
};

app.renderMessage = (message) => {
  var messageContainer = $('<div>').addClass('card').addClass('horizontal');
  var messageNode = $('<div>').addClass('card-stacked');
  var userNode = $('<div>').addClass('username').addClass('card-action').append($('<a>'));
  userNode.find('a').text(`${message.username}`);
  var textNode = $('<div>').addClass('card-content').text(message.text);
  messageNode.append(textNode).append(userNode);
  messageContainer.append(messageNode);

  $('#chats').prepend(messageContainer);  
};

app.renderRoom = (room) => {
  $('#roomSelect').append(`<option class=blue-text darken-1-text value="${room.toLowerCase()}">${room}</option>`);
};

app.handleUsernameClick = () => {
  console.log('handleUsernameClick'); 
};

app.handleSubmit = () => {
  console.log('handleSubmit');
  var msgText = $('#message').val();
  if (msgText !== '') {
    var userName = window.location.search.split('=')[1];
    var currRoom = $('#roomSelect').val();

    var message = {
      username: userName,
      text: msgText,
      roomname: currRoom
    };
    app.send(message);
    $('#message').val('');
  } else {
    return false;
  }
};

$(document).ready( () => {
  app.init();

  $('form').submit(( event ) => {
    app.handleSubmit();
    event.preventDefault();
  });
});
  







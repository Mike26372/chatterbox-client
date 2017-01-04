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
  },
  lobbyQuery: '',
  rooms: ['lobby']
};
  
app.init = () => {
  
  $('#main').on('click', '.username', (event) => {
    app.handleUsernameClick();
  });

  $('#fetch').on('click', (event) => {
    app.greaterThanDateQueryObj.createdAt.$gte.iso = '' + app.recentFetch.toISOString();
    app.fetch(`${app.fromLastFetchQuery}${JSON.stringify(app.greaterThanDateQueryObj)}`);
  });

  app.fetch(app.mostRecentQuery);
  // app.fetchFromCurrRoom();

  $('select').material_select();

  $('#roomCreation').on('click', 'button', (event) => {
    var newRoom = $('#roomCreate').val();
    app.rooms.push(newRoom);
    app.renderRoom(newRoom, true);
    $('#roomSelect').material_select();
    $('#roomCreate').val('');
    $('#roomSelect').trigger('change');
  });

  $('#roomSelect').on('change', (event) => {
    console.log('select event');
    $('#chats').html('');
    app.fetchFromCurrRoom();
  });

  $('#chats').on('click', '.username', (event) => {
    let username = $(event.currentTarget).find('a').text();
    console.log(username);
    $(`.username:contains(${username})`).css( 'text-decoration', 'underline' );
  });
};

app.send = (message) => {  
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      console.log(data);
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.setTimeoutUtility = function() {
  app.greaterThanDateQueryObj.createdAt.$gte.iso = '' + app.recentFetch.toISOString();
  app.fetch(`${app.fromLastFetchQuery}${JSON.stringify(app.greaterThanDateQueryObj)}`);
};

app.fetch = (query = '') => {
  $.ajax({
    url: `${app.server}${query}`,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
      var newRooms = _.map(data.results.reverse(), (value) => {
        app.renderMessage(value);
        return value.roomname;
      });
      var uniqRooms = _.uniq(newRooms);
      console.log(uniqRooms);
      uniqRooms.forEach((value) => {
        if (app.rooms.indexOf(value) < 0 && value != null) {
          app.rooms.push(value);
          app.renderRoom(value);
          $('#roomSelect').material_select();
        }
      });
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
  app.recentFetch = new Date();
  // setTimeout(app.setTimeoutUtility, 3000);
};

app.fetchFromCurrRoom = function() {
  app.fetch(`${app.fromLastFetchQuery}{"roomname":"${$('#roomSelect').val()}"}`);
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

app.renderRoom = (room, selected = false) => {
  let $option = $(`<option class="blue-text darken-1-text" value="${room}"></option>`).text(room);
  $option.prop('selected', selected);
  $('#roomSelect').append($option);
  // currNode.find('option').prop('selected', selected);
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
  







// YOUR CODE HERE:
var app = {
  server: 'https://api.parse.com/1/classes/messages'
};
  
app.init = () => {
  
  $('#main').on('click', '.username', (event) => {
    app.handleUsernameClick();
  });



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

app.fetch = () => {  
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.clearMessages = () => {
  $('#chats').children().remove(); 
};

app.renderMessage = (message) => {
  $('#chats').append(`<div><span class="username">${message.username}<span>: ${message.text}</div>`);
};

app.renderRoom = (room) => {
  $('#roomSelect').append(`<option value="${room.toLowerCase()}">${room}</option>`);
};

app.handleUsernameClick = () => {
  console.log('handleUsernameClick');
};

app.handleSubmit = () => {
  console.log('handleSubmit');
};

$(document).ready( () => {
  app.init();

  $('form').submit(( event ) => {
    app.handleSubmit();
    event.preventDefault();
  });
});
  







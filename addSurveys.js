var newQuestion;
var surveyId, questions;
var jwt; // JSON Web Token for Security

// Work-around for missing JQuery.postJSON
jQuery["postJSON"] = function(url,data,callback) {
  var options = {
    url:url,
    type:'POST',
    data:JSON.stringify(data),
    contentType:'application/json',
    dataType:'json',
    success: callback
  };
  // If a JWT is present, add it to the request as an Authorization header
  if(jwt) options.beforeSend = function(xhr){xhr.setRequestHeader('Authorization','Bearer '+jwt);};
  $.ajax(options);
};

// Callback function for the POST that uploads the survey object
// The server will respond to the POST by returning the id number
// for the new created survey. We will need that later when we POST
// the questions for the survey.
function receiveId(data) {
  surveyId = data; // Save the id number to a global variable
  questions = []; // Create a new, empty list of questions

  // Hide part one and show part two
  $('#one').show();
  $('#two').show();
  $('#three').show();
}

// Event handler function for the Create button in section one
function createButton(){
  $('#title').show();
  $('#two').show();
}

// Event handler for the 'Add Question' button in section two
// The purpose of this function is to add a new question object to our
// global list of questions and then make a new div in the questions section
// that will display the new question.
function addQuestion() {
  newQuestion = {survey:$('#title').val(),question:$('#question').val(),responses:$('#responses').val(),attribute:$('#question')};


  // Whenever we create a new question we want to display it for the user to see. To do this we make
  // a new div for the question. The div contains two sub-divs: a left div that shows the text of
  // the question and either a text field for the answer or a set of radio buttons for the answer,
  // and a right div that contains a 'Remove Question' button.
  var newDiv = $('<div>'),
    leftCol = $('<div>').addClass('col-sm-10');
    rightCol = $('<div>').addClass('col-sm-2');
    newPar = $('<p>'),
    radioDiv = $('<div>');

  newPar.text(newQuestion.question);
  leftCol.append(newPar);

  if(newQuestion.responses.length == 0) {
    radioDiv.append($('<input>').attr('type','text'));
  } else {
    var choices = newQuestion.responses.split(',');
    var n;
    for(n = 0;n < choices.length;n++) {
      var label = $('<label>').addClass('radio-inline');
      label.append($('<input>').attr('type','radio'));
      label.append(choices[n]);
      radioDiv.append(label);
    }
  }
  leftCol.append(radioDiv);
  leftCol.addClass('underline');

  // The event handler function for all of our 'Remove Question' buttons is the
  // same function, removeQuestion. The way we differentiate the different buttons
  // is by passing an option second parameter to the JQuery on method that sets up
  // the event handler. That second parameter passes additional data to the event
  // handler that contains the index of the question and the div containing the
  // question. The event handler will use that additional data to handle the remove.
  var removeButton = $('<button>').addClass('btn btn-primary');
  removeButton.text('Remove Question');
  removeButton.click({n:newQuestion.length-1,div:newDiv},removeQuestion);
  rightCol.append(removeButton);
  newDiv.append(leftCol);
  newDiv.append(rightCol);

  $('#questions').append(newDiv);
}

// This is the event handler for the 'Remove Question' button.
// It differs from a standard event handler in that it makes use
// of the optional event parameter that JQuery passes to event
// handler functions. That event object will contain the extra data
// that we specified when we set up the 'Remove Question' button.
function removeQuestion(event) {
  // event.data.n is the index of the question that this button
  // was set up for. To indicate that this question has been removed
  // we locate the original question object in its array and add a
  // 'removed' property to it. The code below that uploads the questions
  // will check for the presence of this property: if it is present that
  // code will skip uploading that question.
  questions[event.data.n].removed = true;
  // event.data.div contains a reference to the div containing the
  // question to be removed. We simply tell that div to remove itself.
  event.data.div.remove();
}

// This is the event handler for the 'Done' button in section two.
function uploadSurvey() {
  // Upload the questions that have not been marked as removed
      $.postJSON('http://cmsc106.net/Lawrence/questions?group=GDT',newQuestion);
      
    }









// Event handler function for the document ready event.
function setUpButtons() {
  // Set up event handlers for the buttons
  $('#create').click(createButton);
  $('#add').click(addQuestion);
  $('#done').click(uploadSurvey);

  // Hide sections one, two and three
  $('#one').show();
  $('#two').hide();
  $('#three').hide();
}

$(document).ready(setUpButtons);

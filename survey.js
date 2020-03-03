var list = [];
var count = -1;
var profs = [];
var id = 0;
var question;
var people = [];
var greatestOverlap = 0;
var overlapsChecked = false;

jQuery["postJSON"] = function(url, data, callback) {
  $.ajax({
    url: url,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    dataType: 'json',
    success: callback
  });
};

jQuery["deleteJSON"] = function(url,callback) {
  $.ajax({
    url:url,
    type:'DELETE',
    success: callback
  });
};

function dataHandler(data) {
  list = data;
  buildSurvey();
}
function peopleHandler(data) {
  var i, profId;
  people = data;
  id = data[data.length - 1].id;
  // Update number of profs
  for(i = 0; i < data.length; i++) {
    if(data[i].role == 'Professor') {
      profId = data[i].id;
      profs.push(profId);
    }
  }
}

function buildSurvey() {
  var n, length, newQuestion, response, newResponse, responseArr, questionText;
  count = count + 1;

  // Update Question
  question = (list[count].attribute).trim();
  questionText = (list[count].question).trim();

  // Add new question
  $('#question').add('<span id="questionSpan">' + questionText + '</span>').appendTo('#question');

  // Prepare responses
  newResponse = list[count].responses;
  responseArr = newResponse.split(',');
  length = responseArr.length;

  // Add default selection
  $('#select').append('<option value="" disabled selected>Choose your option</option>');

  // Populate select
  for(n = 0; n < length; n++) {
    response = responseArr[n];
    $('#select').append('<option value="' + response + '">' + response + '</option>');
  }
}
function goBack() {
    window.location.assign("home.html");
}

function matchHandler() {
  var n, length, profId;
  length = profs.length;
  for(n = 0; n < length; n++) {
    profId = profs[n];
    getOverlap(profId);
  }
  overlapsChecked = true;
}
function getOverlap(profId) {
  $.getJSON('http://cmsc106.net/Lawrence/people/'+profId+'/overlap/'+id+'', overlap);
}

function overlap(data) {
  var curOverlap, prof;

  curOverlap = data.overlap;
  prof = data.one;

  if(curOverlap > greatestOverlap)
    greatestOverlap = curOverlap;
  if(greatestOverlap >= 1 && overlapsChecked == true)
    match(prof, greatestOverlap);
}

function match(prof, overlap) {
  var n, length, location, newElement;
  var profId = prof;
  var percentage = ((overlap / 6) * 100).toFixed(2);

  length = people.length;
  for(n = 0; n < length; n++) {
    if(people[n].id == profId) {
      location = n;
      break;
    }
  }

  // Build results div
  $('#surveyDiv').hide();
  $('#header').hide();
  $('#results').slideDown();
  $('#results').show();
  // Create percentage match element
  newElement = $('#percentage').html(percentage + '% ');
  $('#percentage').append(newElement);
  // Create professor name
  newElement = $('#profName').html('Professor ' + people[location].name);
  $('#profName').append(newElement);
  // Create department
  newElement = $('#profDepartment').html(people[location].description);
  $('#profDepartment').append(newElement);
  // Create office
  newElement = $('#profOffice').html(people[location].additional);
  $('#profOffice').append(newElement);

  // Delete person data - no longer needed
  $.deleteJSON('http://cmsc106.net/Lawrence/people/'+ id, confirmDelete)
}

function submitSurvey() {
  // Update progress bar to 100%
  $('#progress').html( '<div class="card-title"  id="progress" style="--progress: 100%">' );
  var response;

  // Record responses
  response = $('select option:selected').val();
  var trimmedResponse = response.trim();

  // Store response
  storeUser(question, trimmedResponse);
  // Begin mathcing process
  matchHandler();
}

function nextQuestion() {
  var response;

  // Record responses
  response = $('select option:selected').val();
  var trimmedResponse = response.trim();

  // Store response
  storeUser(question, trimmedResponse);

  // Check if it is the final question
  if(count >= list.length - 2) {
    $('button#next').hide();
    $('button#submit').show();
  }

  // Delete question and responses
  $('#questionSpan').remove();
  $('#select').empty();

  // Build next question
  buildSurvey();
  $( "#progress" ).html( '<div class="card-title"  id="progress" style="--progress: '+((count/list.length)*100)+'%">' );
}

function storeUser(q,r) {
  var response;

  // Get response
  response = r;

  // Construct an object
  var toPost = {person:id, name:question, value:response};
  // Post to server
  $.postJSON('http://cmsc106.net/Lawrence/attributes', toPost, confirmPost);
}

function confirmPost(data) {
}
function confirmDelete(data) {
}

function setUp() {
  // Get the questions
  $.getJSON('http://cmsc106.net/Lawrence/questions/one?group=GDT', dataHandler);
  // Get the people for id/match
  $.getJSON('http://cmsc106.net/Lawrence/people?group=GDT', peopleHandler);
  // Get the next question
  $('button#next').click(nextQuestion);
  // Hide submit button
  $('button#submit').hide();
  $('#results').hide();
  // Submit data for matching
  $('button#submit').click(submitSurvey);
// Sub
  $('button#back').click(goBack);

}

$(document).ready(setUp);

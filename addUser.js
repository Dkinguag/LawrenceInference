jQuery["postJSON"] = function(url,data,callback) {
  $.ajax({
    url:url,
    type:'POST',
    data:JSON.stringify(data),
    contentType:'application/json',
    dataType:'json',
    success: callback
  });
};
function profSignUp() {
  $('#roleSelectDiv').hide();
  $('#addProf').slideDown();
  $('#addProf').show();
}
function studentSignUp() {
  $('#roleSelectDiv').hide();
  $('#addStudent').slideDown();
  $('#addStudent').show();
}
function addProf() {
  var role, name, depart, office;
  role = 'Professor';
  name = $('#profName').val();
  depart = $('#profDepartment').val();
  office = $('#profOffice').val();
  // Construct an object
  var toPost = {name:name,description:depart,additional:office,role:role};
  // Post to server
  $.postJSON('http://cmsc106.net/Lawrence/people?group=GDT', toPost, confirmPost);
}
function addStudent() {
  var role, name, major;
  role = 'Student';
  name = $('#studentName').val();
  major = $('#studentMajor').val();
  var toPost = {name:name,role:role};
  // Post to server
  $.postJSON('http://cmsc106.net/Lawrence/people?group=GDT', toPost, confirmPost);
}
function confirmPost(data) {
  window.location.href = "survey.html";
}

function setUp() {
  $('#studentBtn').click(addStudent);
  $('#profBtn').click(addProf);
  $('button#student').click(studentSignUp);
  $('button#professor').click(profSignUp);
  $('#addStudent').hide();
  $('#addProf').hide();
}
$(document).ready(setUp);

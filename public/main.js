
function saveMarks() {
    // get current marks data from document
    var studentId = $('#studentId').val();
    var classTest1 = $('#0').val();
    var groupExercise = $('#1').val();
    var classTest2 = $('#2').val();
    var projectHomework = $('#3').val();
    var exam = $('#4').val();

    // AJAX call to update marks in database
    outData = {'marks[]': [studentId, classTest1, groupExercise, classTest2, projectHomework, exam]};
    $.get('updateMarks', outData, function(data, status) {
        if (data == "done") {
            updateDisplay();
        }
    })

}

// updates screen to reflect current marks data
function updateDisplay() {
    var classTest1 = Number($('#0').val());
    var groupExercise = Number($('#1').val());
    var classTest2 = Number($('#2').val());
    var projectHomework = Number($('#3').val());
    var exam = Number($('#4').val());
    var totalSba = classTest1 + groupExercise + classTest2 + projectHomework;
    var halfSba = totalSba / 2;
    var halfExam = exam / 2;
    var overallTotal = halfSba + halfExam;
    $('#totalSba').html(totalSba);
    $('#totalSbaB').html(totalSba);
    $('#halfSba').html(halfSba);
    $('#halfExam').html(halfExam);
    $('#overallTotal').html(overallTotal);

}

// call updateScreen() when the page loads
$(document).ready(function() {
    updateDisplay();
});
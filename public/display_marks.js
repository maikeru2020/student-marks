// updates screen to reflect current marks data
function updateDisplay() {
    var classTest1 = Number($('#0').html());
    var groupExercise = Number($('#1').html());
    var classTest2 = Number($('#2').html());
    var projectHomework = Number($('#3').html());
    var exam = Number($('#4').html());
    var totalSba = classTest1 + groupExercise + classTest2 + projectHomework;
    var halfSba = totalSba / 2;
    var halfExam = exam / 2;
    var overallTotal = halfSba + halfExam;
    $('#totalSba').html(totalSba);
    $('#halfSba').html(halfSba);
    $('#halfExam').html(halfExam);
    $('#overallTotal').html(overallTotal);

}

// call updateDisplay() when the page loads
$(document).ready(function() {
    updateDisplay();
});
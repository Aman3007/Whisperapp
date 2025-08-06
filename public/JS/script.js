 
function isEmail(email) {
  var regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  return regex.test(email);
}

function isPassword(password) {
  var regex = /^(?=.*[0-9])(?=.*[A-Z]).{6,12}$/;
  return regex.test(password);
}


$(document).ready( () =>{
let isEditing = false;
let currentEditIndex = null;

var errormessage = "";

$("form#register-form").on("submit", function (e) {
  var email = $("#username").val();
  var password = $("#password").val();

  if (!email || !password) {
    e.preventDefault();
    $("#error").html("<p>Please fill all the fields</p>");
    return;
  }

  if (!isEmail(email)) {
    e.preventDefault();
    $("#error").html("<p>Please enter a valid email</p>");
    $("#success").html("");
    return;
  }

  if (!isPassword(password)) {
    e.preventDefault();
    $("#error").html("<p>Password must be 6–12 characters, include at least 1 uppercase letter and 1 number</p>");
    $("#success").html("");
    return;
  }

  // If all is valid, clear errors and allow submission
  $("#error").html("");
});


$("#show").click(()=> {
  $("#password").attr("type", "text")
  $("#show").css("display", "none")
   $(".show").css("name", "eye")
  $("#hide").css("display", "inline")
   $(".hide").css("display", "inline")
})

$("#hide").click(()=> {
  $("#password").attr("type", "password")
  $("#hide").css("display", "none")
    $(".hide").css("display", "none")
  $("#show").css("display", "inline")
    $(".show").css("display", "inline")

})
$(document).on('click', '.edit-btn', function () {
  const secretText = $(this).attr('data-secret');
  const secretIndex = $(this).attr('data-index');

  console.log("Editing:", secretText);

  $('#users-secret').val(secretText); // Make sure this matches the id of your input
  $('#submitSecret').text("Update");
  $('#editIndex').val(secretIndex);

  isEditing = true;
  currentEditIndex = secretIndex;
});



// Handle Form Submission
$('#secretForm').on('submit', function (e) {
  e.preventDefault(); // prevent default form

  const secret = $('#users-secret').val();

  if (!secret) return;

  if (isEditing) {
    // Send PUT request
    const index = $('#editIndex').val();
    console.log(index)

    $.ajax({
      url: `/secrets/${index}`,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({ secret }),
  
      success: function () {
        location.reload(); 
      },
      error: function (err) {
        alert("Failed to update secret.");
      }
     });
  } else {
    // Normal POST for adding new secret
    $.ajax({
      url: '/secrets',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ secret }),
      success: function () {
        location.reload();
      },
      error: function (err) {
        alert("Failed to add secret.");
      }
    });
  }
});



});





function editProfile(){
    $("#edit-profile").toggleClass('d-none', false)
    $("#edit-button").toggleClass('d-none', true)
}


$(document).ready(function(){
    let today = new Date()
    let formattedDate = today.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    $('.date').text(formattedDate)
    
    $("#edit-button").toggleClass('d-none', false)

    $('#updateProfile').click(function(){
        if ((!($("#change-email").val()).includes("@")) || (($("#change-name").val()).trim() == "")) {
            alert("Username atau Email tidak Valid")
        } else {
            $("#name").text($("#change-name").val())
            $("#email").text($("#change-email").val())
            $("#edit-profile").toggleClass('d-none', true)
            $("#edit-button").toggleClass('d-none', false)
        }      
    })
})
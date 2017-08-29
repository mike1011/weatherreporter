//$(function () {
          var socket = io();
          
function addMessage(msg, pseudo) {
            console.log("===adding message====",msg,pseudo);
            var listing = "<div class='media message'>"+
                            "<div class='media-left'>"+
                                  "<span class='fa-stack fa-lg'>"+
                                        "<i class='fa fa-square-o fa-stack-2x'></i>"+
                                        "<i class='fa fa-user fa-stack-1x'></i>"+
                                  "</span>"+                       
                            "</div>"+
                            "<div class='media-body'>"+
                              "<h4 class='media-heading'>User</h4>"+
                              "<p>"+msg+"</p>"+
                            "</div>"+
                          "</div><hr>";  
//    $("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
$("#chatEntries").append(listing);
$('.body-panel').scrollTop($('.body-panel')[0].scrollHeight - $('.body-panel')[0].clientHeight);
}          

function sentMessage() {
    if ($('#messageInput').val() != "") 
    {
        socket.emit('message', $('#messageInput').val());
        addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
        $('#messageInput').val('');
    }
}
function setPseudo() {
    if ($("#pseudoInput").val() != "")
    {
        socket.emit('setPseudo', $("#pseudoInput").val());
        $('#chatControls').show();
        $('#pseudoInput').hide();
        $('#pseudoSet').hide();
    }
}

socket.on('message', function(data) {
    console.log("====this is =====111111");
    addMessage(data['message'], data['pseudo']);
});




$(function() {
    //$("#chatControls").hide();
    //$("#pseudoSet").click(function() {setPseudo()});
    $("input").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();    
            $("#submit").click();
        }
    });    
    $("#submit").click(function() {sentMessage();});
});
          
          
          $('#chat_message_form').submit(function(){
            socket.emit('chat message', $('#msg').val());
            $('#msg').val('');
            return false;
          });
          socket.on('chat message', function(msg){
            var listing = "<div class='media'>"+
                            "<div class='media-left'>"+
                                  "<span class='fa-stack fa-lg'>"+
                                        "<i class='fa fa-square-o fa-stack-2x'></i>"+
                                        "<i class='fa fa-user fa-stack-1x'></i>"+
                                  "</span>"+                       
                            "</div>"+
                            "<div class='media-body'>"+
                              "<h4 class='media-heading'>User</h4>"+
                              "<p>"+msg+"</p>"+
                            "</div>"+
                          "</div><hr>";
                          
                          
                       
                          
            $('#messages').append(listing);
            $('.body-panel').scrollTop($('.body-panel')[0].scrollHeight - $('.body-panel')[0].clientHeight);



            
            
          });
        //});
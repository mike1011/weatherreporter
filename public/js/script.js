/*global $,io*/
          var socket = io();
          
          
function addMessage(msg) {
            var dt = new Date();
            var timestamp = dt.toLocaleString() 
            console.log("===adding message====",msg,timestamp);
            var listing = "<div class='media message'>"+
                            "<div class='media-left'>"+
                                  "<span class='fa-stack fa-lg'>"+
                                        "<i class='fa fa-square-o fa-stack-2x'></i>"+
                                        "<i class='fa fa-user fa-stack-1x'></i>"+
                                  "</span>"+                       
                            "</div>"+
                            "<div class='media-body'>"+
                              "<h4 class='media-heading'>You <small><i>"+timestamp+"</i></small></h4>"+
                              "<p>"+msg+"</p>"+
                            "</div>"+
                          "</div>";  
//    $("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
$("#chatEntries").append(listing);
$('.body-panel').scrollTop($('.body-panel')[0].scrollHeight - $('.body-panel')[0].clientHeight);
}    

function addReply(msg) {
            var dt = new Date();
            var timestamp = dt.toLocaleString();

            console.log("===adding message====",msg,timestamp);
            var listing = "<div class='media message'>"+
                            "<div class='media-body text-right'>"+
                              "<h4 class='media-heading'>Chatbot <small><i>"+timestamp+"</i></small></h4>"+
                              "<p>"+msg+"</p>"+
                            "</div>"+
                            "<div class='media-right'>"+
                                  "<span class='fa-stack fa-lg'>"+
                                        "<i class='fa fa-square-o fa-stack-2x'></i>"+
                                        "<i class='fa fa-user-o fa-stack-1x'></i>"+
                                  "</span>"+                       
                            "</div>"+                            
                          "</div><hr>";  
//    $("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
$("#chatEntries").append(listing);
$('.body-panel').scrollTop($('.body-panel')[0].scrollHeight - $('.body-panel')[0].clientHeight);
} 

function sentMessage(msg) {
    if (msg != "") 
    {
        addMessage(msg);
        $.post( "wwo",$('form').serialize(), function( data ) {
            //console.log("=======response=====",JSON.stringify(data.result.fulfillment.speech));
            console.log("=======response=====",data);
            //message: $("#messageInput").val();
            addReply(data);
            

          
        });        
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
            $("#chatForm").submit();
        }
    });    

    $('#chatForm').submit(function(event) {
        event.preventDefault();
         var msg = $('#messageInput').val();
        sentMessage(msg);
        $('#messageInput').val('');
    
    });    
    
    
    
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


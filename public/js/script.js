/*global $,io*/
          var socket = io();
          
            function addMessage(msg, pseudo) {
                        var listing = "<div class='media message'>"+
                                        "<div class='media-left'>"+
                                              "<span class='fa-stack fa-lg'>"+
                                                    "<i class='fa fa-square-o fa-stack-2x'></i>"+
                                                    "<i class='fa fa-user fa-stack-1x'></i>"+
                                              "</span>"+                       
                                        "</div>"+
                                        "<div class='media-body'>"+
                                          "<h4 class='media-heading'>You</h4>"+
                                          "<p>"+msg+"</p>"+
                                        "</div>"+
                                      "</div>";  
            //    $("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
            $("#chatEntries").append(listing);
            $('.body-panel').scrollTop($('.body-panel')[0].scrollHeight - $('.body-panel')[0].clientHeight);
            }    

            function addReply(msg, pseudo) {
            var listing = "<div class='media message'>"+
                            "<div class='media-body text-right'>"+
                              "<h4 class='media-heading'>Chatbot</h4>"+
                              "<p>"+msg+"</p>"+
                            "</div>"+
                            "<div class='media-right'>"+
                                  "<span class='fa-stack fa-lg'>"+
                                        "<i class='fa fa-square-o fa-stack-2x'></i>"+
                                        "<i class='fa fa-user-o fa-stack-1x'></i>"+
                                  "</span>"+                       
                            "</div>"+                            
                          "</div><hr>";  

                            $("#chatEntries").append(listing);
                            $('.body-panel').scrollTop($('.body-panel')[0].scrollHeight - $('.body-panel')[0].clientHeight);
            } 
            //CALL THE API
            function sentMessage() {
                if ($('#messageInput').val() != "") 
                {
            
                    addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
                    $.post( "echo",$('form').serialize(), function( data ) {
                        console.log("=====INSPECT==response=====",data.result.fulfillment.speech);
                        addReply(data.result.fulfillment.speech, "Me", new Date().toISOString(), true);
                        $('#messageInput').val('');
            
                      
                    });        
                }
            }
            //NOT USED
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
                addMessage(data['message'], data['pseudo']);
            
            });



        //EVENTS FOR THE LANDING PAGE - FORM SUBMIT OR BUTTON CLICK TO CALL THE POST REQUEST
        $(function() {
            $("input").keypress(function(event) {
                if (event.which == 13) {
                    event.preventDefault();    
                    $("#chatForm").submit();
                }
            });    
        
            $('#chatForm').submit(function(event) {
                event.preventDefault();
                sentMessage();
            
            });    
            
            
            
        });//document ends
          
          


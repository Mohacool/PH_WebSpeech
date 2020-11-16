var speechRecognition = window.webkitSpeechRecognition
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var recognition = new speechRecognition()

var on = false;

var textbox = $("#textbox")
var instructions = $("#instructions")
var startbutton = $("#start-btn");

var content = ''

recognition.continuous = true
recognition.lang = 'fr-FR';
// recognition.lang = 'en-us';

// recognition is started
// recognition.onstart = function(){
//     instructions.text("Voice recognition is on")
// }
recognition.onspeechend = function(){
    instructions.text("No activity")
}

recognition.onerror = function(){
    instructions.text("Try again")
}

recognition.onresult = function(event){

    var current = event.resultIndex;
    var transcript = event.results[current][0].transcript;
    content += transcript;
    textbox.val(content);
    
    analyse(transcript);

}

$("#start-btn").click(function(event){
   
    if(content.length){
        content += ''
    }
    if (on==true){
        recognition.stop()
        instructions.text("Voice recognition is OFF")
        startbutton.text("Start")
        $("#start-btn").css({'background-color': '#dc3545'})

        on=false;
    }
    else{
        on=true;
        $("#start-btn").css({'background-color': '#4c9c58'})

        startbutton.text("Stop")
        recognition.start()
        instructions.text("Voice recognition is on")

    }
    
    
    
})

textbox.on('input',function(){
    content = $(this).val()
})

var sentence = "Hello how are you today i hope you are doing fine";
var sentence = "Le 24 février 1815, en France, un grand bateau appelé « le Pharaon » entre dans le port de Marseille. Le bateau avance très lentement et avec une apparence vraiment triste. Alors, certaines personnes curieuses sur la plate-forme du port se demandent si un accident est arrivé.";
$("#story").text(sentence);
var words = sentence.split(" ");
words = words.filter(word => word!="«" && word!="»");
console.log(words);

var at_word = 0;
var at_position = 0;
function analyse(transcript){
    
    // Get the words detected
    var words_detected = transcript.split(" ");

    // Clean up the list of words
    words_detected = words_detected.filter(function(e){return e }); 


    // words_detected = words_detected.filter(word => word!="" && word!="«");

    console.log(words_detected);
    
    // Loop through the words detected
    words_detected.forEach(function (item, index) {
        console.log(item, index);
        console.log("is "+item+"equal to "+words[at_word]);


        var stripped_word = words[at_word].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()«»]/g,"");
        // If the words match the current word we're at 
        if(item.toLowerCase()==stripped_word.toLowerCase()){
           

            // The text that can get highlighted (this gets smaller as you get more words)
            var current= $("#story").html().substring(at_position);

            // The text that got highlighted
            var previous =$("#story").html().substring(0,at_position);

            // Highlight the word that matched 
            var change = current.replace(words[at_word],"<mark>"+words[at_word]+"</mark>");

            console.log("previous="+previous);
            console.log("current="+current.substring(at_position));
            console.log("change="+change);
            $("#story").html(previous+change);

            // Increase the current position to include the marks
            at_position += item.length+14;

            console.log(at_position);

            // Increment the current word
            at_word +=1;

            console.log("==matched: We finished word #"+at_word);
            

        }

    });
    // $("#story").mark("hello");
    
}




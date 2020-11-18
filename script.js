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


// var sentence = "Hello how are you today i hope you are doing fine";
// var sentence = "Le 24 février 1815, en France, un grand bateau appelé « le Pharaon » entre dans le port de Marseille. Le bateau avance très lentement et avec une apparence vraiment triste. Alors, certaines personnes curieuses sur la plate-forme du port se demandent si un accident est arrivé.";
// $("#story").text(sentence);

var annotated_words=["bateau","se demandent","marin","Il a l’air calme","Crie","à bord","malheur","soulagé","la mer ","obéissent","inattendue","épée","survécu","voilà","le comptable","dextérité","saisit","laisse","surtout","des conseils","en jetant un regard","haine","l'île d'Elbe","au lieu de"];
var annotated_meanings = ["a boat","to ask oneself / to wonder","a sailor / a seaman ","il semble calme = he looks calm","to yell","on board","un problème = a misfortune","rassuré = relieved","the sea","obéir = to obey","unexpected","une épée = a sword","survived (verbe: survivre)","here is…","the accountant","agilité","to seize","laisser = to let / to give","above all","advices (masculin)","take a look","hatred / anger","l'île d'Elbe est fameuse pour être l'île d'exil de Napoléon en 1814-15","instead of"];


$.ajax({
    url: "chapter1.txt",
    dataType: "text",
    async: false,
    success: (content) => {


        let lines=content.split('\n');

        // var chapters = ["1 L’ARRIVÉE"];

        lines = lines.slice(1,); // Remove title

        

        // lines = lines.map( element => element.replace("",'<br>'));

        lines = lines.filter(e=> e.length!=1);

       

        lines = lines.map( element => element.replace("*",'&emsp;&emsp;'));
        lines = lines.map( element => element.replace("    ",'&emsp;&emsp;'));
        lines = lines.map(element => element+"<br><br>");

        // lines = lines.map(element => element.replace("«","<br>«"));
        $("#chapter_title").html("1 L’ARRIVÉE");


        console.log("lines------------------");
        console.log(lines);
        lines = lines.join(" ");
        console.log("I NEED TO GET HERE------------------");
        console.log(lines);



        // Go through every annotation in annotation_list and replace the annotations in the big string

        annotated_words.forEach(function (word, i) {

            // Gets the full annotation ex: sailor[1]
            let annot_number = i +1;
            let full_annotation = word+"["+annot_number+"]";
            console.log(full_annotation);

            // in the loop keep replacing blah[1],blah[2],blah[3]....
            lines = lines.replace(full_annotation,
                `<span class='annotate ${annot_number}' data-toggle="tooltip" data-placement="top" title="Tooltip on top">
                ${word}
                   
                    
                </span>`);
        })

        $("#story").html(lines);
    }
    
    
})

var sentence = $("#story").text(); // Fetch the story from the html 
console.log(sentence);

var words = sentence.split(" ");
words = words.filter(word => word!="«" && word!="»").filter(e=> e!="" && e!="  ").filter(e=> e!="\n");




console.log("words->");
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
    
    console.log(words);
    // Loop through the words detected
    words_detected.forEach(function (item, index) {
        console.log(item, index);
        console.log("is "+item+"equal to "+words[at_word]);


        var stripped_word = words[at_word].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()«»]/g,"");

        
        // If the words match the current word we're at 
        // item => the detected word 
        // stripped_word => word from story

        let detected_word = item.toLowerCase();
        let actual_word = stripped_word.toLowerCase().trim();

        if(detected_word == actual_word){
           

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

$(".annotate").hover(function(e){
    
    let annot_number = this.classList[1]-1;
    // $(".tooltiptext").text(annotated_meanings[annot_number]);
    // alert(annotated_meanings[annot_number]);
    $($('.annotate')).attr('data-original-title',annotated_meanings[annot_number]);

})




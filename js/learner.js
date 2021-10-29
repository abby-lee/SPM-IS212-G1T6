var get_all_URL = "http://localhost:5000/courses";
var materials_url = "http://localhost:5000/materials";
var quizzes_url = "http://localhost:5000/quizzes";
var quizquestions_url = "http://localhost:5000/quizquestions";

var app = new Vue({
    // binds the new Vue object to the HTML element with id="app".
    el: "#app",
    data: {
        searchStr: "",
        message: "There is a problem retrieving course data, please try again later.",
        statusMessage: "",

        // why quoted? 
        "courses": [],
        searchError: "",

        newCourseName: "",
        newCode: "",
        newDescription: "",
        newPrerequisites: "",
        // courseAdded: false,
        // addCourseError: "",

        "materials": [],
        "material_chapters": [],
        chapter_completed: 2,

        "quizquestions":[],
        course_code: 0, 
        class_section: "",
        quizid: 0,
        questiontext: "",
        questionoptions: "",
        answertext: "",
        graded: "",
    },
    methods: {

        getQuizQuestions: function () { 
            this.course_code = 1008;
            this.class_section = "G1";
            this.quizid = 3
            // this.course_code = localStorage.getItem("course_code");
            // this.class_section = localStorage.getItem("class_section");
            // this.quizid = localStorage.getItem("quizid");

            console.log(this.class_section)

            const response =
                fetch(`${quizquestions_url}/${this.class_section}/${this.course_code}/${this.quizid}`)
                .then(response => response.json())
                .then(data => {
                    console.log(response);
                    if (data.code === 404) {
                        // no course found in db
                        this.searchError = data.message;
                    } else {
                        this.quizquestions = data.data;
                        console.log(this.quizquestions);
                    }
                })
                .catch(error => {
                    // Errors when calling the service; such as network error, service offline, etc
                    console.log(this.searchError + error);
                });
        },
        checkAnswers: function(){
            this.course_code = 1008;
            this.class_section = "G1";
            this.quizid = 3
            console.log(this.quizid)

            const response =
                fetch(`${quizquestions_url}/${this.class_section}/${this.course_code}/${this.quizid}`)
                .then(response => response.json())
                .then(data => {
                    console.log(response);
                    if (data.code === 404) {
                        // no course found in db
                        this.searchError = data.message;
                    } else {
                        this.quizquestions = data.data;
                        console.log(this.quizquestions);

                        var marks = 0;
                        var form = document.getElementById(this.quizid),
                        //for each question
                        qnNum;
                        for (qnNum = 0; qnNum < quizquestions.length; qnNum++) {
                            qn = form[question.questiontext],
                            ansNum;
                            //check which option is chosen
                            for (ansNum = 0; ansNum < qn.length; ansNum++) {
                                if (qn[ansNum].checked) {

                                    // ????????????????????
                                    var option= parseInt(qn[ansNum].value);
                                }
                            }
                            this.answertext = localStorage.getItem("answertext")
                            if(option==this.answertext){ 
                                marks += 1;
                                document.writeln("Your answer is correct!"); 
                            }
                            else{
                                document.writeln("The correct answer is '" + this.answertext + "'.");
                            }
                        }
                    }
                })
                .catch(error => {
                    // Errors when calling the service; such as network error, service offline, etc
                    console.log(this.searchError + error);
                });
        },

        // startTimer: function (){
        //     this.course_code = 1008;
        //     this.class_section = "G1";
        //     this.quizid = 3;
        //     this.time = 10

        //     console.log(this.time)
            
        //     var counter = quiz.time + 0.5;
        //     setInterval(function() {
        //     counter--;
        //     if (counter >= 0) {
        //         span = document.getElementById("count");
        //         span.innerHTML = counter;
        //     }
        //     if (counter === 0) {
        //         alert('sorry, out of time');
        //         clearInterval(counter);
        //     }
        //     }, 1000);

        //     const response =
        //     fetch(`${quizzes_url}/${this.class_section}/${this.course_code}/${this.quizid}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log(response);
        //         if (data.code === 404) {
        //             // no course found in db
        //             this.searchError = data.message;
        //         } else {
        //             this.time = localStorage.getItem('time')
        //             var counter = quiz.time + 0.5;

        //         }
        //     })
        //     .catch(error => {
        //         // Errors when calling the service; such as network error, service offline, etc
        //         console.log(this.searchError + error);
        //     });


        // },
        // start: function() {
        //     document.getElementById("count").style="color:blue;";
        //     startTimer();
        // },
        // getMarks: function () {

        // },
        storeQuizForm: function(quizid) {
            localStorage.quizid = quizid
            // localStorage.questionid = questionid
        },
        getQuizForm: function() {
            console.log(localStorage.getItem("quizid"))
            return localStorage.getItem("quizid")
        },
        // storeQuizInfo: function (message) {
        //     // sessionStorage.course_code= ;
        //     console.log(message);
        //     localStorage.quizid = message;
        // },
        // getQuizInfo: function(){
        //     console.log(localStorage.getItem("quizid"));
        //     return localStorage.getItem("quizid")
        // },
        pageRefresh: function () {
            // this.getAllCourses();
            // this.getMaterials();
            // this.getQuizzes();
            this.getQuizForm();
            this.getQuizQuestions();
            this.checkAnswers();
            // this.getMarks();
            this.searchError = "";
            this.searchStr = "";
        }
    },
    created: function () {
        // on Vue instance created, load the course list
        // this.getAllCourses();
        // this.getMaterials();
        // this.getQuizzes();
        this.getQuizForm();
        this.getQuizQuestions();
        this.checkAnswers();
        // this.getQuizInfo();
    }

});
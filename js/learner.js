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

        // "quizzes": [],
        // quizid: 0,
        // time:0,
        // graded:"",

        "quizquestions":[],
        // questiontext:"",
        // questiontype:"",
        // questionoptions:"",
        // answertext:"",
        course_code = 1008,
        class_section = "G1",
        quizid = 3,
    },
    methods: {
        // getAllCourses: function () {
        //     const response =
        //     //sends an HTTP GET request from Vue to the npm api to search for all courses
        //         fetch(get_all_URL)
        //         //then() deal with asynchronous tasks
        //         // .json() returns json object of the result (message)
        //         .then(response => response.json())
        //         // print out message from response
        //         .then(data => {
        //             console.log(response);
        //             // no courses in db
        //             if (data.code === 404) {
        //                 //print error msg above
        //                 this.message = data.message;
        //             } else {
        //                 //get course list
        //                 this.courses = data.data.courses;
        //             }
        //         })
        //         // handle error - try,catch,error,finally
        //         .catch(error => {
        //             // print out error message 
        //             console.log(this.message + error);
        //         });
        // },
        // findCourse: function () {   
        //     const response =
        //         fetch(`${get_all_URL}/${this.searchStr}`)
        //         //then() deal with asynchronous tasks
        //         // .json() returns json object of the result (message)
        //         .then(response => response.json())
        //         // print out message from response
        //         .then(data => {
        //             console.log(response);
        //             // no course found in db
        //             if (data.code === 404) {
        //                 //print error msg above
        //                 this.searchError = data.message;
        //             } else {
        //                 //get course list
        //                 this.courses = data.data.courses;
        //                 //check for empty string in courses?
        //                 console.log(this.courses);
        //                 this.searchError = "";
        //             }
        //         })

        //         // handle error - try,catch,error,finally
        //         .catch(error => {
        //             // print out error message 
        //             console.log(this.searchError + error);
        //         });
        // },
        // getMaterials: function () { 
        //     // this.courseCode = localStorage.getItem("course_code");
        //     // this.classSection = localStorage.getItem("class_section")
        //     this.course_code = 1008;
        //     this.class_section = "G1";

        //     console.log(this.course_code)

        //     const response =
        //         fetch(`${materials_url}/${this.class_section}/${this.course_code}`)
        //         .then(response => response.json())
        //         .then(data => {
        //             console.log(response);
        //             if (data.code === 404) {
        //                 // no course found in db
        //                 this.searchError = data.message;
        //             } else {
        //                 this.materials = data.data;
        //                 console.log(this.materials);
        //                 for (let material of this.materials) {
        //                     if (!(this.material_chapters.includes(material.material_chapter))) {
        //                         this.material_chapters.push(material.material_chapter)
        //                     }
        //                 }
        //                 this.material_chapters.sort();
        //                 console.log(this.material_chapters);
        //             }
        //         })
        //         .catch(error => {
        //             // Errors when calling the service; such as network error, 
        //             // service offline, etc
        //             console.log(this.searchError + error);
        //         });
        // },
        // getQuizzes: function () { 
        //     // this.course_code = localStorage.getItem("course_code");
        //     // this.class_section = localStorage.getItem("class_section")
        //     this.course_code = 1008;
        //     this.class_section = "G1"

        //     console.log(this.course_code)

        //     const response =
        //         fetch(`${quizzes_url}/${this.class_section}/${this.course_code}`)
        //         .then(response => response.json())
        //         .then(data => {
        //             console.log(response);
        //             if (data.code === 404) {
        //                 // no course found in db
        //                 this.searchError = data.message;
        //             } else {
        //                 this.quizzes = data.data;
        //                 console.log(this.quizzes);
        //             }
        //         })
        //         .catch(error => {
        //             // Errors when calling the service; such as network error, 
        //             // service offline, etc
        //             console.log(this.searchError + error);
        //         });
        // },

        getQuizQuestions: function () { 
            this.course_code = 1008;
            this.class_section = "G1";
            this.quizid = 3
            // this.course_code = localStorage.getItem("course_code");
            // this.class_section = localStorage.getItem("class_section");
            // this.quizid = localStorage.getItem("quizid");

            console.log(this.class_section)

            const response =
                fetch(`${quizzes_url}/${this.class_section}/${this.course_code}/${this.quizid}`)
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
        storeQuizInfo: function (message) {
            // sessionStorage.course_code= ;
            console.log(message);
            localStorage.quizid = message;
        },
        getQuizInfo: function(){
            console.log(localStorage.getItem("quizid"));
            return localStorage.getItem("quizid")
        },
        pageRefresh: function () {
            // this.getAllCourses();
            // this.getMaterials();
            // this.getQuizzes();
            this.getQuizForm();
            this.getQuizQuestions();
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
        this.getQuizInfo();
    }

});
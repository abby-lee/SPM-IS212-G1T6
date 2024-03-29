var get_all_URL = "http://localhost:5000/courses";
var materials_url = "http://localhost:5000/materials";
var quiz_url = "http://localhost:5000/quizzes";


var app = new Vue({
    // binds the new Vue object to the HTML element with id="app".
    el: "#app",
    // computed: {

    // },
    data: {
        searchStr: "",
        message: "There is a problem retrieving course data, please try again later.",
        statusMessage: "",
        
        // why quoted? 
        "courses": [],
        searchError: "",
        course_code: 0,   
        class_section: "",
        
        "quizquestions":[],
        quizid: 0,     
        
        newCourseName: "",
        newCode: "",
        newDescription: "",
        newPrerequisites: "",
        // courseAdded: false,
        // addCourseError: "",

        "materials": [],
        "material_chapters": [],
        chapter_completed: 2,

        "eligibleCourses": [],
        "completedCoursesArr": [],
        "completedCoursesObjectArr": [],
        

        learners_eid: 0,        

        "quizzes": [],

        selected: ""
    },
    methods: {
        
        // getSelected: function() {
        //     return this.selected
        // },

        getEligibleCourses: function() {
            this.learners_eid = 1    

            const response = 
                fetch(`${get_all_URL}/${this.learners_eid}/eligible`)
                .then(response => response.json())
                .then(data => {
                    console.log(response);
                    if (data.code === 404) {
                        this.message = data.message;
                        console.log(this.message);
                    } else {
                        console.log(data.data.eligible_courses);
                        this.eligibleCourses = data.data.eligible_courses;
                        console.log(this.eligibleCourses);
                    }
                })
                .catch(error => {
                    console.log(this.message + error);
                });
        },
        
        getCompletedCourses: function() {
            this.learners_eid = 1 

            const response = 
                fetch(`${get_all_URL}/${this.learners_eid}/completed`)
                .then(response => response.json())
                .then(data => {
                    console.log(response);
                    if (data.code === 404) {
                        this.message = data.message;
                        console.log(this.message);
                    } else {
                        console.log(data.data.courses_completed);
                        this.completedCourses = data.data.courses_completed;
                        if (this.completedCourses.includes(',')) {
                            this.completedCoursesArr = this.completedCourses.split(', ');
                            console.log(this.completedCoursesArr);
                            
                        } else {
                            
                            this.completedCoursesArr = new Array(this.completedCourses); 
                            console.log(this.completedCoursesArr);
                        }
                        for (var i = 0; i < this.completedCoursesArr.length; i++) {
                
                            console.log(this.completedCoursesArr[i]);
                            const response =
                                fetch(`${get_all_URL}/searchTitle/${this.completedCoursesArr[i]}`)
                                .then(response => response.json())
                                .then(data => {
                                    console.log(response);
                                    if (data.code === 404) {
                                        // no course found in db
                                        this.searchError = data.message;
                                    } else {
                                        this.course = data.data;
                                        console.log(this.course);
                                        
                                        this.completedCoursesObjectArr.push(this.course[0]);
                                        console.log(this.completedCoursesObjectArr);
                                    }
                                })
                                .catch(error => {
                                    // Errors when calling the service; such as network error, 
                                    // service offline, etc
                                    console.log(this.searchError + error);
                                });
            
                                
                        }
                    }
                })
                .catch(error => {
                    console.log(this.message + error);
                });
        },
        // completedCoursesObjects: function () {
        //     // this.completedCoursesObjectArr = [];
        //     console.log(this.completedCoursesArr);
        //     for (var i = 0; i < this.completedCoursesArr.length; i++) {
                
        //         console.log(this.completedCoursesArr[i]);
        //         const response =
        //             fetch(`${get_all_URL}/searchTitle/${this.completedCoursesArr[i]}`)
        //             .then(response => response.json())
        //             .then(data => {
        //                 console.log(response);
        //                 if (data.code === 404) {
        //                     // no course found in db
        //                     this.searchError = data.message;
        //                 } else {
        //                     this.course = data.data;
        //                     console.log(this.course);
        //                     this.completedCoursesObjectArr.push(this.course);
        //                     console.log(this.completedCoursesObjectArr);
        //                 }
        //             })
        //             .catch(error => {
        //                 // Errors when calling the service; such as network error, 
        //                 // service offline, etc
        //                 console.log(this.searchError + error);
        //             });

                    
        //     }
        // },
        getAllCourses: function () {
            const response =
            //sends an HTTP GET request from Vue to the npm api to search for all courses
                fetch(get_all_URL)
                //then() deal with asynchronous tasks
                // .json() returns json object of the result (message)
                .then(response => response.json())
                // print out message from response
                .then(data => {
                    console.log(response);
                    // no courses in db
                    if (data.code === 404) {
                        //print error msg above
                        this.message = data.message;
                    } else {
                        //get course list
                        this.courses = data.data.courses;
                    }
                })
                // handle error - try,catch,error,finally
                .catch(error => {
                    // print out error message 
                    console.log(this.message + error);
                });
        },
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
        getMaterials: function () { 
            this.courseCode = 1003;
            this.classSection = "G2"

            console.log(this.courseCode)

            const response =
                fetch(`${materials_url}/${this.classSection}/${this.courseCode}`)
                .then(response => response.json())
                .then(data => {
                    console.log(response);
                    if (data.code === 404) {
                        // no course found in db
                        this.searchError = data.message;
                    } else {
                        this.materials = data.data;
                        console.log(this.materials);
                        for (let material of this.materials) {
                            if (!(this.material_chapters.includes(material.material_chapter))) {
                                this.material_chapters.push(material.material_chapter)
                            }
                        }
                        this.material_chapters.sort();
                        console.log(this.material_chapters);
                    }
                })
                .catch(error => {
                    // Errors when calling the service; such as network error, 
                    // service offline, etc
                    console.log(this.searchError + error);
                });
        },
        // getQuizzes: function () { 
        //     this.courseCode = 1003;
        //     this.classSection = "G2"

        //     console.log(this.courseCode)

        //     const response =
        //         fetch(`${quiz_url}/${this.classSection}/${this.courseCode}`)
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
        //     },
        // getQuizQuestions: function() { 
        //     // this.course_code = 1008;
        //     // this.class_section = "G1";
        //     // this.quizid = 3
        //     this.course_code = localStorage.getItem("course_code");
        //     this.class_section = localStorage.getItem("class_section");
        //     this.quizid = localStorage.getItem("quizid");

        //     console.log(this.class_section)

        //     const response =
        //         fetch(`${quiz_url}/${this.class_section}/${this.course_code}/${this.quizid}`)
        //         .then(response => response.json())
        //         .then(data => {
        //             console.log(response);
        //             if (data.code === 404) {
        //                 // no course found in db
        //                 this.searchError = data.message;
        //             } else {
        //                 this.quizquestions = data.data;
        //                 console.log(this.quizquestions);
        //             }
        //         })
        //         .catch(error => {
        //             // Errors when calling the service; such as network error, service offline, etc
        //             console.log(this.searchError + error);
        //         });
        // },   
        storeQuizForm: function(quizid) {
            localStorage.quizid = quizid
        },
        getQuizForm: function() {
            console.log(localStorage.getItem("quizid"))
            return localStorage.getItem("quizid")
        },
        storeCourseInfo: function (message) {
            console.log(message);
            localStorage.course_code = message;
        },
        getCourseInfo: function(){
            console.log(localStorage.getItem("course_code"));
            return localStorage.getItem("course_code")
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
            this.getEligibleCourses();
            this.getCompletedCourses();
            // this.completedCoursesObjects();
            this.getQuizQuestions();
            this.searchError = "";
            this.searchStr = "";
        }
    },
    created: function () {
        // on Vue instance created, load the course list
        this.getAllCourses();
        this.getEligibleCourses();
        this.getCompletedCourses();
        // this.completedCoursesObjects();
        // this.getQuizQuestions();
        // this.getQuizForm();
        this.selected;
        // this.getMaterials();
        // this.getQuizzes();
        // this.getQuizForm();
    }

});
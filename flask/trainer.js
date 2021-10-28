var get_all_URL = "http://localhost:5000/courses";
var section_url = "http://localhost:5000/sections";
var materials_url = "http://localhost:5000/materials";
var quizzes_url = "http://localhost:5000/quizzes";
var questions_url = "http://localhost:5000/questions";

var app = new Vue({
    el: "#app",
    // computed: 
    // },
    data: {
        searchStr: "",
        message: "There is a problem retrieving data, please try again later.",
        statusMessage: "",
        msg: "",

        "courses": [],
        searchError: "",
        course_code: 0,

        "sections":[],
        class_section:"",

        "materials": [],
        material_name: "",
        material_type: "",
        material_link: "",
        material_chapter: 0,

        "quizzes" :[],
        quizid: 0,
        time:0,
        graded:"",

        "questions":[],
        questiontext:"",
        questiontype:"",
        questionoptions:"",
        answertext:"",
    },
    methods: {
        getAllCourses: function () {
            // on Vue instance created, load the course list
            const response =
                fetch(get_all_URL)
                .then(response => response.json())
                .then(data => {
                    console.log(response);
                    if (data.code === 404) {
                        // no courses in db
                        this.message = data.message;
                    } else {
                        this.courses = data.data;
                        console.log(this.courses);
                    }
                })
                .catch(error => {
                    // Errors when calling the service; such as network error, 
                    // service offline, etc
                    console.log(this.message + error);

                });

        },
        findCourse: function () { 
            this.searchError = "";

            if (isNaN(this.searchStr)) {
                const response =
                    fetch(`${get_all_URL}/searchTitle/${this.searchStr}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(response);
                        if (data.code === 404) {
                            // no course found in db
                            this.searchError = data.message;
                        } else {
                            this.courses = data.data;
                            console.log(this.courses);
                        }
                    })
                    .catch(error => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        console.log(this.searchError + error);
                    });
                
            } else {
                const response =
                    fetch(`${get_all_URL}/search/${this.searchStr}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(response);
                        if (data.code === 404) {
                            // no course found in db
                            this.searchError = data.message;
                        } else {
                            this.courses = data.data;
                            console.log(this.courses);
                            this.searchError = "";
                        }
                    })
                    .catch(error => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        console.log(this.searchError + error);
                    });
            }
        },
        getSection: function () {
            // on Vue instance created, load the course list
            this.course_code = localStorage.getItem("course_code");
            console.log(this.course_code)

            const response =
                fetch(`${section_url}/${this.course_code}`)
                .then(response => response.json())
                .then(data => {
                    console.log(response);
                    if (data.code === 404) {
                        // no courses in db
                        this.message = data.message;
                    } else {
                        this.sections = data.data;
                        console.log(this.sections);
                    }
                })
                .catch(error => {
                    // Errors when calling the service; such as network error, 
                    // service offline, etc
                    console.log(this.message + error);

                });

        },
        getMaterials: function () { 
            this.course_code = localStorage.getItem("course_code");
            this.class_section = localStorage.getItem("class_section")

            const response =
                fetch(`${materials_url}/${this.class_section}/${this.course_code}`)
                .then(response => response.json())
                .then(data => {
                    console.log(response);
                    if (data.code === 404) {
                        // no course found in db
                        this.searchError = data.message;
                    } else {
                        this.materials = data.data;
                        console.log(this.materials);
                    }
                })
                .catch(error => {
                    // Errors when calling the service; such as network error, 
                    // service offline, etc
                    console.log(this.searchError + error);
                });
        },
        addMaterial: function () {
            this.course_code = localStorage.getItem("course_code");
            this.class_section = localStorage.getItem("class_section")

            console.log(this.materialName)
            let jsonData = JSON.stringify({
                course_code: this.course_code,
                class_section: this.class_section,
                material_name: this.material_name,
                material_type: this.material_type,
                material_link: this.material_link,
                material_chapter: this.material_chapter
            });

            if (this.material_name === "" ||  this.material_type === "" || this.material_link === "" || this.material_chapter === 0) {
                this.msg = "Please fill in required fields.";
            }
            fetch(`${materials_url}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: jsonData
            })
            .then(response => response.json())
            .then(data => {
                result = data.data;
                console.log(result);
                // 3 cases
                switch (data.code) {
                    case 200:
                        this.materialAdded = true;
                        this.statusMessage = data.message
                        
                        // refresh page
                        this.material_name = "";
                        this.material_type = "";
                        this.material_link = "";
                        this.material_chapter = 0;
                        this.pageRefresh()

                        break;
                
                    case 500:
                        this.errorMsg = data.message;
                        break;
                    default:
                        throw `${data.code}: ${data.message}`;
                }
            })
            .catch(error => {
                // Errors when calling the service; such as network error, 
                // service offline, etc
                this.errorMsg = this.statusMessage
                console.log(this.errorMsg);
            });
        },
        getQuizzes: function () { 
            this.course_code = localStorage.getItem("course_code");
            this.class_section = localStorage.getItem("class_section")

            const response =
                fetch(`${quizzes_url}/${this.class_section}/${this.course_code}`)
                .then(response => response.json())
                .then(data => {
                    console.log(response);
                    if (data.code === 404) {
                        // no course found in db
                        this.searchError = data.message;
                    } else {
                        this.quizzes = data.data;
                        console.log(this.quizzes);
                    }
                })
                .catch(error => {
                    // Errors when calling the service; such as network error, 
                    // service offline, etc
                    console.log(this.searchError + error);
                });
        },
        addQuiz: function () {
            // reset data to original setting
            // this.materialAdded = false;
            // this.errorMsg = "";
            // this.statusMessage = "";
            // this.msg = "";
            this.course_code = localStorage.getItem("course_code");
            this.class_section = localStorage.getItem("class_section")

            let jsonData = JSON.stringify({
                course_code: this.course_code,
                class_section: this.class_section,
                time: this.time,
                graded: this.graded,
            });
            console.log(jsonData)
            if (this.time === 0 || this.graded === "") {
                this.msg = "Please fill in required fields.";
            }
            fetch(`${quizzes_url}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: jsonData
            })
            .then(response => response.json())
            .then(data => {
                result = data.data;
                console.log(result[0].quizid);
                // 3 cases
                switch (data.code) {
                    case 200:
                        this.quizAdded = true;
                        this.statusMessage = data.message
                        
                        // refresh page
                        this.time = 0;
                        this.graded = "";
                        this.pageRefresh()

                        break;
                
                    case 500:
                        this.errorMsg = data.message;
                        break;
                    default:
                        throw `${data.code}: ${data.message}`;
                }
            })
            .catch(error => {
                // Errors when calling the service; such as network error, 
                // service offline, etc
                this.errorMsg = this.statusMessage
                console.log(this.errorMsg);
            });
        },
        getQuestions: function () { 
            this.course_code = localStorage.getItem("course_code");
            this.class_section = localStorage.getItem("class_section")
            this.quizid= localStorage.getItem("quizid");

            const response =
                fetch(`${questions_url}/${this.class_section}/${this.course_code}/${this.quizid}`)
                .then(response => response.json())
                .then(data => {
                    console.log(response);
                    if (data.code === 404) {
                        // no course found in db
                        this.searchError = data.message;
                    } else {
                        this.questions = data.data;
                        console.log(this.questions);
                    }
                })
                .catch(error => {
                    // Errors when calling the service; such as network error, 
                    // service offline, etc
                    console.log(this.searchError + error);
                });
        },
        addQuestion: function () {
            this.course_code = localStorage.getItem("course_code");
            this.class_section = localStorage.getItem("class_section")
            this.quizid= localStorage.getItem("quizid");

            if (this.questionoptions=== ""){
                this.questionoptions= "True, False"
            }

            let jsonData = JSON.stringify({
                quizid: this.quizid,
                class_section: this.class_section,
                course_code: this.course_code,
                questiontext: this.questiontext,
                questiontype: this.questiontype,
                questionoptions: this.questionoptions,
                answertext:this.answertext
            });
            console.log(jsonData)
            if (this.questiontext === "" || this.questiontype === "" || this.answertext==="") {
                this.msg = "Please fill in required fields.";
            }
            fetch(`${questions_url}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: jsonData
            })
            .then(response => response.json())
            .then(data => {
                result = data.data;
                console.log(result);
                // 3 cases
                switch (data.code) {
                    case 200:
                        this.questionAdded = true;
                        this.statusMessage = data.message
                        
                        // refresh page
                        // this.questionid = result[0].questionid;
                        this.questiontext = "";
                        this.questiontype= "";
                        this.questionoptions= "";
                        this.answertext="";

                        this.pageRefresh()

                        break;
                
                    case 500:
                        this.errorMsg = data.message;
                        break;
                    default:
                        throw `${data.code}: ${data.message}`;
                }
            })
            .catch(error => {
                // Errors when calling the service; such as network error, 
                // service offline, etc
                this.errorMsg = this.statusMessage
                console.log(this.errorMsg);
            });
        },
        storeCourseInfo: function (message) {
            // sessionStorage.course_code= ;
            console.log(message);
            localStorage.course_code = message;
        },
        getCourseInfo: function(){
            console.log(localStorage.getItem("course_code"));
            return localStorage.getItem("course_code")
        },
        storeSectionInfo: function (message) {
            // sessionStorage.course_code= ;
            console.log(message);
            localStorage.class_section = message;
        },
        getSectionInfo: function(){
            console.log(localStorage.getItem("class_section"));
            return localStorage.getItem("class_section")
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
            this.getAllCourses();
            this.getSection();
            this.getMaterials();
            this.getQuizzes();
            this.getQuestions();
            this.searchError = "";
            this.searchStr = "";
        }
    },
    created: function () {
        // on Vue instance created, load the course list
        this.getAllCourses();
        this.getSection();
        this.getMaterials();
        this.getQuizzes();
        this.getQuestions();
    }
});


var get_all_URL = "http://localhost:5000/courses";
var get_all_trainers = "http://localhost:5000/trainers";
var get_all_learners = "http://localhost:5000/learners";
var materials_url = "http://localhost:5000/materials";
var quizzes_url = "http://localhost:5000/quizzes";

var app = new Vue({
    el: "#app",
    // computed: 
    // },
    data: {
        searchStr: "",
        statusMessage: "",
        msg: "",

        // materialAdded = false,
        // statusMessage = "",
        // msg = "",

        errorMsg: "",

        "materials": [],

        courseCode: 0,
        classSection: "",
        materialName: "",
        materialID: 0,
        materialType: "",
        materialLink: "",
        materialChap: 0,

        "quizzes" :[],
        quizid: 0,
        time:0,
        graded:"",

    },
    methods: {
        getQuizzes: function () { 
            this.courseCode = 1003;
            this.classSection = "G2"

            const response =
                fetch(`${quizzes_url}/${this.classSection}/${this.courseCode}`)
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
        pageRefresh: function () {
            this.getQuizzes();
            this.searchError = "";
            this.searchStr = "";
        }
    },
    created: function () {
        // on Vue instance created, load the course list
        this.getQuizzes();
        // this.getQuizzes();
        // this.getAllTrainers();
    }
});
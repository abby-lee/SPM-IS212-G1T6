var get_all_URL = "http://localhost:5000/courses";
// var get_all_trainers = "http://localhost:5000/trainers";
// var get_all_learners = "http://localhost:5000/learners";

var app = new Vue({
    el: "#app",
    // computed: 
    // },
    data: {
        searchStr: "",
        message: "There is a problem retrieving data, please try again later.",
        statusMessage: "",
        msg: "",
        course_title: "",

        "courses": [],
        "trainers": [],
        "learners": [],
        searchError: "",

        newCourseTitle: "",
        newCode: "",
        newDescription: "",
        newPrerequisites: "",
        courseAdded: false,
        addCourseError: "",

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
        getAllQuestions
    },
    created: function () {
        // on Vue instance created, load the course list
        this.getAllQuestions();
        // this.getAllTrainers();
        // this.getAllLearners();
    }
});
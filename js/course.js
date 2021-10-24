var get_all_URL = "http://localhost:5000/courses";
var get_all_trainers = "http://localhost:5000/trainers";
var get_all_learners = "http://localhost:5000/learners";
var materials_url = "http://localhost:5000/materials";
var quizzes_url = "http://localhost:5000/quizzes"

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

        "quizzes" :[],
        quizid: 0,
        time:0,
        graded:"",

    },
    methods: {
        getMaterials: function () { 
            this.courseCode = 1003;
            this.classSection = "G2"

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
                    }
                })
                .catch(error => {
                    // Errors when calling the service; such as network error, 
                    // service offline, etc
                    console.log(this.searchError + error);
                });
        },
        addMaterial: function () {
            // reset data to original setting
            // this.materialAdded = false;
            // this.errorMsg = "";
            // this.statusMessage = "";
            // this.msg = "";

            console.log("hey")
            this.courseCode = 1003;
            this.classSection = "G2"

            console.log(this.materialName)
            let jsonData = JSON.stringify({
                course_code: this.courseCode,
                class_section: this.classSection,
                material_name: this.materialName,
                material_type: this.materialType,
                material_link: this.materialLink,
            });
            // console.log(jsonData)

            if (this.materialName === "" || this.materialID === "" || this.materialType === "" || this.materialLink === "") {
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
                        this.materialName = "";
                        this.materialType = "";
                        this.materialLink = "";
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
        getAllTrainers: function () {
            // on Vue instance created, load the trainer list
            const response =
                fetch(get_all_trainers)
                .then(response => response.json())
                .then(data => {
                    console.log(response);
                    if (data.code === 404) {
                        // no trainers in db
                        this.message = data.message;
                    } else {
                        this.trainers = data.data;
                        console.log(this.trainers);
                    }
                })
                .catch(error => {
                    // Errors when calling the service; such as network error, 
                    // service offline, etc
                    console.log(this.message + error);

                });

        },
        findTrainer: function () { 
            this.searchError = "";

            if (isNaN(this.searchStr)) {
                const response =
                    fetch(`${get_all_trainers}/${this.searchStr}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(response);
                        if (data.code === 404) {
                            // no trainer found in db
                            this.searchError = data.message;
                        } else {
                            this.trainers = data.data;
                            console.log(this.trainers);
                        }
                    })
                    .catch(error => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        console.log(this.searchError + error);
                    });
                
            } else {
                const response =
                    fetch(`${get_all_trainers}/eid/${this.searchStr}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(response);
                        if (data.code === 404) {
                            // no trainer found in db
                            this.searchError = data.message;
                        } else {
                            this.trainers = data.data;
                            console.log(this.trainers);
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
        getAllLearners: function () {
            // on Vue instance created, load the trainer list
            const response =
                fetch(get_all_learners)
                .then(response => response.json())
                .then(data => {
                    console.log(response);
                    if (data.code === 404) {
                        // no trainers in db
                        this.message = data.message;
                    } else {
                        this.learners = data.data;
                        console.log(this.learners);
                    }
                })
                .catch(error => {
                    // Errors when calling the service; such as network error, 
                    // service offline, etc
                    console.log(this.message + error);

                });

        },
        findLearner: function () { 
            this.searchError = "";

            if (isNaN(this.searchStr)) {
                const response =
                    fetch(`${get_all_learners}/${this.searchStr}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(response);
                        if (data.code === 404) {
                            // no learner found in db
                            this.searchError = data.message;
                        } else {
                            this.learners = data.data;
                            console.log(this.learners);
                        }
                    })
                    .catch(error => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        console.log(this.searchError + error);
                    });
                
            } else {
                const response =
                    fetch(`${get_all_learners}/eid/${this.searchStr}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(response);
                        if (data.code === 404) {
                            // no trainer found in db
                            this.searchError = data.message;
                        } else {
                            this.learners = data.data;
                            console.log(this.learners);
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
        addQuiz: function () {
            // reset data to original setting
            // this.materialAdded = false;
            // this.errorMsg = "";
            // this.statusMessage = "";
            // this.msg = "";
            this.courseCode = 1003;
            this.classSection = "G2"

            console.log("hey")

            let jsonData = JSON.stringify({
                course_code: this.courseCode,
                class_section: this.classSection,
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
                console.log(result);
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
        pageRefresh: function () {
            // this.getAllCourses();
            this.getMaterials();
            this.getQuizzes();
            this.searchError = "";
            this.searchStr = "";
        }
    },
    created: function () {
        // on Vue instance created, load the course list
        this.getQuizzes();
        this.getMaterials();
        // this.getQuizzes();
        // this.getAllTrainers();
    }
});
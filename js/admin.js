var get_all_URL = "http://localhost:5000/courses";
var get_all_trainers = "http://localhost:5000/trainers";
var get_all_learners = "http://localhost:5000/learners";

var app = new Vue({
    el: "#app",
    // computed: {
    // prereqPlaceholder: function () {
    //     return `${this.editPrerequisites}`
    //   }
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

        courseDeleted: false,

        edit: false,
        editCurrentCourse: "",
        editSuccessful: false,
        editCourseError: "",
        

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
        courseProfile: function(course_title) {
            this.searchError = "";
            this.course_title = course_title;
            console.log(course_title);

            const response =
                    fetch(`${get_all_URL}/searchTitle/${this.course_title}`)
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
                        searchError = 'Unable to retrieve course';
                        console.log(this.searchError + error);
                    });
                
        },
        
        addCourse: function () {
            // reset data to original setting
            this.courseAdded = false;
            this.addCourseError = "";
            this.statusMessage = "";
            this.msg = "";

            let jsonData = JSON.stringify({
                course_title: this.newCourseTitle,
                course_code: this.newCode,
                description: this.newDescription,
                prerequisites: this.newPrerequisites,
            });

            if (this.newCourseTitle === "" || this.newCode === "" || this.newDescription === "") {
                this.msg = "Please fill in required fields.";
                }
            else {
                fetch(`${get_all_URL}`, {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: jsonData
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        result = data.data;
                        //console.log(result);
                        // 3 cases
                        switch (data.code) {
                            case 201:
                                this.courseAdded = true;
                                this.statusMessage = data.message
                                
                                // refresh page
                                this.pageRefresh();

                                break;
                        
                            case 500:
                                this.addCourseError = data.message;
                                break;
                            default:
                                throw `${data.code}: ${data.message}`;
                        }
                    })
                
                .catch(error => {
                    // Errors when calling the service; such as network error, 
                    // service offline, etc
                    this.addCourseError = this.statusMessage
                    console.log(this.addCourseError);
                });
            }
        },
        editCourseForm: function (course) {
            //resets the data setting
            this.editSuccessful = false;
            this.editCurrentCourse = course;
            this.edit = true;

        },
        editCourse: function (course) {
            // reset data

            this.editCourseError = "";
            this.msg = "";

            let jsonData = JSON.stringify({
                course_code: this.editCurrentCourse.course_code,
                course_title: this.editCurrentCourse.course_title,
                description: this.editCurrentCourse.description,
                prerequisites: this.editCurrentCourse.prerequisites
            });
            if (this.editCurrentCourse.course_title === "" || this.editCurrentCourse.course_code === "" || this.editCurrentCourse.description === "") {
                this.msg = "Please fill in required fields.";
                }
            else {
            fetch(`${get_all_URL}`, {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: jsonData
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    result = data.data;
                    console.log(result);
                    // 3 cases
                    switch (data.code) {
                        case 200:
                            this.editSuccessful = true;

                            this.getAllCourses();

                            this.statusMessage = 'Successfully edited course details';

                            break;
                        case 404:
                            this.editCourseError = data.message;
                        case 500:
                            this.editCourseError = data.message;
                            break;
                        default:
                            throw `${data.code}: ${data.message}`;
                    }
                })
            }
        },
        del: function (course_code) {
            //reset all data to original setting
            this.course_code = course_code;
            this.courseDeleted = false;

            this.courseAdded = false;
            this.addCourseError = "";
            this.statusMessage = "";

            const response =
                fetch(`${get_all_URL}/${this.course_code}`, {
                    method: "DELETE",
                })
                .then(response => response.json())
                .then(data => {
                    console.log(response);
                    if (data.code === 404) {
                        // no course in db
                        this.message = data.message;
                        this.courses = [];
                    } else {
                        this.courseDeleted = true;
                        this.statusMessage = "The course has been successfully deleted!";
                    }
                })
                .catch(error => {
                    // Errors when calling the service; such as network error,
                    // service offline, etc
                    console.log(this.message + error);

                });

            //Front end Vue
            var idx = 0
            for (course of this.courses) {
                if (course.course_code == course_code) {
                    this.courses.splice(idx, 1) // remove this element
                    break
                }
                idx++
            }
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
        trainerProfile: function(trainers_name) {
            this.searchError = "";
            this.trainers_name = trainers_name;
            console.log(trainers_name);

            const response =
                    fetch(`${get_all_trainers}/${this.trainers_name}`)
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
        learnerProfile: function(learners_name) {
            this.searchError = "";
            this.learners_name = learners_name;
            console.log(learners_name);

            const response =
                    fetch(`${get_all_learners}/${this.learners_name}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(response);
                        if (data.code === 404) {
                            // no trainer found in db
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
                
        },
        pageRefresh: function () {
            this.getAllCourses();
            this.getAllTrainers();
            this.getAllLearners();
            this.searchError = "";
            this.searchStr = "";
        },
        storeCourseInfo: function () {
            pass
        }
    },
    created: function () {
        // on Vue instance created, load the course list
        this.getAllCourses();
        this.getAllTrainers();
        this.getAllLearners();
    }
});
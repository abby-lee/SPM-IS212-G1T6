var get_all_URL = "http://localhost:5000/courses";
var get_all_trainers = "http://localhost:5000/trainers";
var get_all_learners = "http://localhost:5000/learners";
var section_url = "http://localhost:5000/sections";

var app = new Vue({
    el: "#app",
    // computed: {
    
    // },
    mounted:function(){
        this.getCourseinfo(); //method1 will execute at pageload
        // this.getCourseSection();
        this.getLearnerInfo();
    },
    data: {
        searchStr: "",
        message: "There is a problem retrieving data, please try again later.",
        statusMessage: "",
        msg: "",
        course_title: "",

        "courses": [],
        "trainers": [],
        "learners": [],
        "eligibleCourses": [],
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
                            this.course = data.data;
                            console.log(this.course);
                            localStorage.clickedCourse = JSON.stringify(this.course);
                            console.log(localStorage.getItem("clickedCourse")); 
                        }
                    })
                    .catch(error => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        console.log(this.searchError + error);
                    });
                       
        },
       
        getCourseinfo: function(){
            clickedCourse = JSON.parse(localStorage.getItem("clickedCourse"));
            console.log(clickedCourse);

            const response =
                fetch(`${section_url}/${clickedCourse[0].course_code}`)
                .then(response => response.json())
                .then(data => {
                    console.log(response);
                    if (data.code === 404) {
                        // course has no section
                        this.message = data.message;
                    } else {
                        this.sections = data.data;
                        console.log(this.sections);
                        localStorage.sections = JSON.stringify(this.sections);
                        console.log(localStorage.getItem("sections")); 
                        courseSections = JSON.parse(localStorage.getItem("sections"));
                        console.log(courseSections);
                        console.log(courseSections.length);
                        if (courseSections.length == 0) {
                            document.getElementById("courseDetails").innerHTML = 
                            `
                            <H1> ${clickedCourse[0].course_title} </H1>
                            <h2> Course Code: ${clickedCourse[0].course_code} </h2>
                            <h3> Course Description: ${clickedCourse[0].description} </h3>
                            `;
                        } else {
                            document.getElementById("courseDetails").innerHTML = 
                            `
                            <H1> ${clickedCourse[0].course_title} </H1>
                            <h2> Course Code: ${clickedCourse[0].course_code} </h2>
                            <h3> Course Description: ${clickedCourse[0].description} </h3>
                            `;
                            for (let i = 0; i < courseSections.length; i++) {
                                const response =
                                    fetch(`${get_all_trainers}/eid/${courseSections[i].trainers_eid}`)
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log(response);
                                        if (data.code === 404) {
                                            // no trainer found in db
                                            this.searchError = data.message;
                                        } 
                                        else {
                                            this.trainer = data.data;
                                            console.log(this.trainer);
                                            console.log(this.trainer[0].trainers_name);
                                            
                                            document.getElementById("section").innerHTML = 
                                            `
                                            <h4> Sections: </h4>
                                            <ul> 
                                                <li> <a target="_blank" href="courseSection.html" @click="storeCourseSection(courseSections[i].class_section);"> ${courseSections[i].class_section} </a>, Section Trainer: ${this.trainer[0].trainers_name} </li>
                                            </ul>
                                            `;
                                             
                                        }    
                                    })
                                    // 
                                    .catch(error => {
                                        // Errors when calling the service; such as network error, 
                                        // service offline, etc
                                        console.log(this.searchError + error);
                                    });
                            } 
                        }
                    }
                })
                    .catch(error => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        console.log(this.message + error);

                    });

            
           
        },
        storeCourseSection: function (sectionInfo) {
            console.log(sectionInfo);
            localstorage.clickedSection = sectionInfo;
        },
        getCourseSection: function(){
            console.log(localStorage.getItem("clickedSection"));
            sectionData = localStorage.getItem("clickedSection");
            document.getElementById("sectionNumber").innerHTML = `${sectionData}`;
            // document.getElementById("trainer").innerHTML = `${sectionData[sectionTrainer]}`;
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
                            // no learner found in db
                            this.searchError = data.message;
                        } else {
                            this.learners = data.data;
                            console.log(this.learners);
                            localStorage.learner = JSON.stringify(this.learners);
                            console.log(localStorage.getItem("learner"));
                        }
                    })
                    .catch(error => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        console.log(this.searchError + error);
                    });
        },

        getLearnerInfo: function() {
            learnerInfo = JSON.parse(localStorage.getItem("learner"));
            console.log(learnerInfo);
            document.getElementById("learnerInfo").innerHTML =
            `<h1> ${learnerInfo[0].learners_name}</h1>
            <h3> Learner ID: ${learnerInfo[0].learners_eid} </h3>
            <h3> Learner's Email: ${learnerInfo[0].learners_email} </h3>
            <h3> Courses Completed: ${learnerInfo[0].courses_completed} </h3>
            <h3> Qualifications: ${learnerInfo[0].learners_qualifications} </h3>
            <button type="button" class="btn btn-primary" @click="getEligibleCourses(learnerInfo[0].learners_eid)" data-toggle="modal" data-target="#exampleModalCenter">
            Assign Courses
            </button>
            `;        
        },
         
        //get eligible courses for learner
        getEligibleCourses: function (learners_eid) {
        learnerInfo = JSON.parse(localStorage.getItem("learner")); 
        console.log(learnerInfo);
        learners_eid = learnerInfo[0].learners_eid;
            const response =
                    fetch(`http://localhost:5000/${learners_eid}/courses`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(response);
                        if (data.code === 404) {
                            // no eligible courses
                            this.searchError = data.message;
                        } else {
                            this.eligibleCourses = data.data;
                            console.log(this.eligibleCourses);
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
            this.getCourseinfo();
            
            // this.getCourseSection();
            //this.getLearnerInfo();
            this.getEligibleCourses();
            this.searchError = "";
            this.searchStr = "";
        },
    
    },
    created: function () {
        // on Vue instance created, load the course list
        this.getAllCourses();
        this.getAllTrainers();
        this.getAllLearners();
        //this.getSection();
        // this.getCourseinfo();
        //this.getLearnerInfo();
    }
});
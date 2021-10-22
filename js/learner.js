var get_all_URL = "http://localhost:5001/courses";


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
    },
    methods: {
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
        findCourse: function () {   
            const response =
                fetch(`${get_all_URL}/${this.searchStr}`)
                //then() deal with asynchronous tasks
                // .json() returns json object of the result (message)
                .then(response => response.json())
                // print out message from response
                .then(data => {
                    console.log(response);
                    // no course found in db
                    if (data.code === 404) {
                        //print error msg above
                        this.searchError = data.message;
                    } else {
                        //get course list
                        this.courses = data.data.courses;
                        //check for empty string in courses?
                        console.log(this.courses);
                        this.searchError = "";
                    }
                })

                // handle error - try,catch,error,finally
                .catch(error => {
                    // print out error message 
                    console.log(this.searchError + error);
                });
        },
    },
    created: function () {
        // on Vue instance created, load the course list
        this.getAllCourses();
    }

});
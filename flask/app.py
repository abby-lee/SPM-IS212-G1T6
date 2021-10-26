from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from sqlalchemy.exc import SQLAlchemyError

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/lms_database'
#Mac config
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root' + \
#                                         '@localhost:8889/lms_database'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_size': 100,
                                           'pool_recycle': 280}

db = SQLAlchemy(app)

CORS(app)

class Courses(db.Model):
    __tablename__ = 'courses'

    course_code = db.Column(db.Integer, primary_key=True)
    course_title = db.Column(db.String(26))
    description = db.Column(db.String(1000))
    prerequisites = db.Column(db.String(1000))

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result
    

class Trainers(db.Model):
    __tablename__ = 'trainers'

    trainers_eid = db.Column(db.Integer, primary_key=True)
    trainers_name = db.Column(db.String(26))
    trainers_email = db.Column(db.String(1000))
    qualifications = db.Column(db.String(1000))
    specialisation = db.Column(db.String(1000))

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result
        
class Sections(db.Model):
    __tablename__ = 'sections'

    class_section = db.Column(db.String(2), primary_key=True)
    course_code = db.Column(db.Integer, db.ForeignKey(Courses.course_code), primary_key=True)
    class_size = db.Column(db.Integer)
    duration = db.Column(db.Integer)
    trainers_eid = db.Column(db.Integer, db.ForeignKey(Trainers.trainers_eid))
    vacancies = db.Column(db.Integer)

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result

class Learners(db.Model):
    __tablename__ = 'learners'

    learners_eid = db.Column(db.Integer, primary_key=True)
    learners_name = db.Column(db.String(26))
    learners_email = db.Column(db.String(1000))
    learners_qualifications = db.Column(db.String(1000))
    courses_completed = db.Column(db.String(1000))

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result

class Admins(db.Model):
    __tablename__ = 'admins'

    admins_eid = db.Column(db.Integer, primary_key=True)
    admins_name = db.Column(db.String(26))
    admins_email = db.Column(db.String(1000))

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result

class Progress(db.Model):
    __tablename__ = 'progress'

    learners_eid = db.Column(db.Integer, db.ForeignKey(Learners.learners_eid), primary_key=True)
    course_code = db.Column(db.Integer, db.ForeignKey(Courses.course_code), primary_key=True)
    class_section = db.Column(db.Integer, db.ForeignKey(Sections.class_section), primary_key=True)
    chapter_completed = db.Column(db.Integer)
    

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result

    def __init__(self, course_code, learners_eid, class_section, chapter_completed):
        self.course_code = course_code
        self.learners_eid = learners_eid
        self.class_section = class_section
        self.chapter_completed = chapter_completed

class Quizzes(db.Model):
    __tablename__ = 'quizzes'
    quizid= db.Column(db.Integer, primary_key=True, autoincrement=True)
    class_section = db.Column(db.String(2), db.ForeignKey(Sections.class_section), primary_key=True)
    course_code = db.Column(db.Integer, db.ForeignKey(Courses.course_code), primary_key=True)
    time = db.Column(db.Integer)
    graded = db.Column(db.String(2))

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result

class Quizquestions(db.Model):
    __tablename__ = 'quizquestions'
    questionid= db.Column(db.Integer, primary_key=True, autoincrement=True)
    quizid= db.Column(db.Integer, db.ForeignKey(Quizzes.quizid), primary_key=True)
    class_section = db.Column(db.String(2), db.ForeignKey(Sections.class_section), primary_key=True)
    course_code = db.Column(db.Integer, db.ForeignKey(Courses.course_code), primary_key=True)
    questiontext = db.Column(db.String(1000))
    questiontype = db.Column(db.String(4))
    questionoptions = db.Column(db.String(1000))
    answertext = db.Column(db.String(1000))

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result


class Materials(db.Model):
    __tablename__ = 'materials'

    material_id= db.Column(db.Integer ,primary_key=True, autoincrement=True)
    class_section = db.Column(db.String(2), db.ForeignKey(Sections.class_section), primary_key=True)
    course_code = db.Column(db.Integer, db.ForeignKey(Courses.course_code), primary_key=True)
    material_name= db.Column(db.String(100))
    material_type = db.Column(db.String(100))
    material_link = db.Column(db.String(1000))
    material_chapter = db.Column(db.Integer)

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result

db.create_all()

#get all courses
@app.route("/courses")
def courses():
    course_list = Courses.query.all()
    return jsonify(
        {
            "data": [courses.to_dict()
                     for courses in course_list]
        }
    ), 200

#get eligible courses
@app.route("/<int:learners_eid>/courses")
def eligible_courses(learners_eid):
    eligible_courses = []
    course_list = Courses.query.all()
    if course_list:
        for course in course_list:
            prerequisites = request.args.get('prerequisites', course.prerequisites)   
            if prerequisites == "":
                eligible_courses.append(course.to_dict())
            else:
                learner = Learners.query.filter_by(learners_eid=learners_eid).first()
                if learner:
                    completed_courses = request.args.get('courses_completed', learner.courses_completed)        
                    if completed_courses == prerequisites:
                        eligible_courses.append(course.to_dict())
        return jsonify(
            {
                "code": 200,
                "data": {
                    "learner_eid": learners_eid,
                    "courses_completed": eligible_courses
                }
            }
        )
    return jsonify (
        {
            "code": 404,
            "data": {
                "learner_eid": learners_eid
            },
            "message": "No eligible courses found."
        }
    )

## NEED CHANGE ##
# get learners by course 
@app.route("/learners/<int:course_code>")
def learner_by_course(course_code):
    learners = Learners.query.filter_by(course_code=course_code).all()
    if learners:
        return jsonify({
            "data": [learner.to_dict() for learner in learners]
        }), 200
    else:
        course_list = Courses.query.all()
        if course_code not in course_list:
            return jsonify({
                "message": "Course does not exist"
            }), 404
        return jsonify({
            "message": "No learners in this course."
        }), 404


## NEED CHANGE ##
# add learner to course 
@app.route("/enrols", methods=['POST'])
@cross_origin()
def add_learner():
    data = request.get_json()
    print(data)
    if not all(key in data.keys() for
               key in ('learners_eid', 'course_code',
                       'class_section')):
        return jsonify({
            "message": "Incorrect JSON object provided."
        }), 500
    learner = Enrols(**data)
    print(learner)
    try:
        db.session.add(learner)
        db.session.commit()
        return jsonify(learner.to_dict()), 201
    except SQLAlchemyError as e:
        print(str(e))
        db.session.rollback()
        return jsonify({
            "message": "Unable to commit to database."
        }), 500


## NEED CHANGE ##
# remove learner from course
@app.route("/enrols/<int:course_code>/<string:learners_eid>", methods=['DELETE'])
def delete_book(course_code, learners_eid):
    learnertoremove = Enrols.query.filter_by(course_code=course_code , learners_eid=learners_eid).first()
    if learnertoremove:
        db.session.delete(learnertoremove)
        db.session.commit()
        return jsonify(
            {
                "code": 200,
                "data": {
                    "course_code": course_code,
                    "learners_eid" : learners_eid
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "data": {
                "course_code": course_code,
                "learners_eid" : learners_eid
            },
            "message": "Learner in this course not found."
        }
    ), 404

#get all trainers
@app.route("/trainers")
def get_trainers():
    search_name = request.args.get('trainers_name')
    if search_name:
        trainers_list = Trainers.query.filter(Trainers.trainers_name.contains(search_name))
    else:
        trainers_list = Trainers.query.all()
    return jsonify(
        {
            "data": [trainer.to_dict() for trainer in trainers_list]
        }
    ), 200

#get all section by course
@app.route("/sections/<int:course_code>")
def get_sections(course_code):
    section_list = Sections.query.filter_by(course_code=course_code).all()
    return jsonify(
        {
            "data": [sections.to_dict()
                     for sections in section_list]
        }
    ), 200

#assign trainer a to section of a course -> update to section
@app.route("/sections/<string:class_section>/<int:course_code>", methods=['PUT'])
def update_section(class_section, course_code):
    sections = Sections.query.filter_by(class_section=class_section, course_code=course_code).first()
    if sections:
        data = request.get_json()
        sections.trainers_eid = data['trainers_eid']
        db.session.commit()
        return jsonify(
            {
                "code": 200,
                "data": sections.to_dict()
            }
        )
    return jsonify(
        {
            "code": 404,
            "data": {
                "class_section": class_section,
                "course_code": course_code
            },
            "message": "Class not found."
        }
    ), 404

#add quiz
#step 1 create quiz 
@app.route("/quizzes", methods=['POST'])
@cross_origin()
def add_quiz():
    data = request.get_json()
    if not all(key in data.keys() for
               key in ('class_section', 'course_code',
                       'time', 'graded')):
        return jsonify({
            "message": "Incorrect JSON object provided."
        }), 500
    quiz = Quizzes(**data)
    try:
        db.session.add(quiz)
        db.session.commit()
        return jsonify(
            {
                "code": 200,
                "message": "Quiz has been added successfully.",
                "data": [quiz.to_dict()]
            }
            ), 200
    except SQLAlchemyError as e:
        print(str(e))
        db.session.rollback()
        return jsonify({
            "message": "Unable to commit to database."
        }), 500

#step2 add questions and answer
@app.route("/questions", methods=['POST'])
@cross_origin()
def add_questions():
    data = request.get_json()
    if not all(key in data.keys() for
               key in ('quizid', 'class_section', 'course_code',
                       'questiontext', 'questiontype', 'questionoptions', 'answertext')):
        return jsonify({
            "message": "Incorrect JSON object provided."
        }), 500
    quizquestion = Quizquestions(**data)
    try:
        db.session.add(quizquestion)
        db.session.commit()
        return jsonify(
            {
                "code": 200,
                "message": "Question has been added successfully.",
                "data": [quizquestion.to_dict()]
            }
            ), 200
    except SQLAlchemyError as e:
        print(str(e))
        db.session.rollback()
        return jsonify({
            "message": "Unable to commit to database."
        }), 500

#get all quizzes for that section and course
@app.route("/quizzes/<string:class_section>/<int:course_code>")
def get_quizzes(class_section, course_code):
    quiz_list = Quizzes.query.filter_by(class_section=class_section, course_code=course_code).all()
    return jsonify(
        {
            "data": [quiz.to_dict()
                     for quiz in quiz_list]
        }
    ), 200

#get quiz questions
@app.route("/questions/<string:class_section>/<int:course_code>/<int:quizid>")
def get_questions(class_section, course_code, quizid):
    question_list = Quizquestions.query.filter_by(class_section=class_section, course_code=course_code, quizid=quizid).all()
    return jsonify(
        {
            "data": [question.to_dict()
                     for question in question_list]
        }
    ), 200


#get all class materials related to the course
@app.route("/materials/<string:class_section>/<int:course_code>")
@cross_origin()
def get_class_material(class_section, course_code):
    material_list = Materials.query.filter_by(class_section=class_section, course_code=course_code).all()
    return jsonify(
        {
            "data": [material.to_dict()
                     for material in material_list]
        }
    ), 200


#add course material
@app.route("/materials", methods=['POST'])
@cross_origin()
def add_material():
    data = request.get_json()
    print(data)
    if not all(key in data.keys() for
               key in ('course_code',
                       'class_section', 
                       'material_name', 
                       'material_type', 
                       'material_link',
                       'material_chapter')):
        return jsonify({
            "message": "Incorrect JSON object provided."
        }), 500
    material = Materials(**data)
    print(material)
    try:
        db.session.add(material)
        db.session.commit()
        return jsonify(
            {
                "code": 200,
                "message": "Course has been added successfully.",
                "data": [material.to_dict()]
            }
            ), 200
    except SQLAlchemyError as e:
        print(str(e))
        db.session.rollback()
        return jsonify({
            "code": 500,
            "message": "Unable to add material to database."
        }), 500

#search course by course code
@app.route("/courses/search/<int:course_code>")
def find_by_course_code(course_code):
    courseByCourseCode = Courses.query.filter_by(course_code=course_code).first()
    if courseByCourseCode:
        return jsonify(
            {
                "code": 200,
                "data": [courseByCourseCode.to_dict()]
            }
        ), 200
    return jsonify(
        {
            "code": 404,
            "message": "Course code not found."
        }
    ), 404

#search course by course title
@app.route("/courses/searchTitle/<string:course_title>")
def find_by_course_title(course_title):
    coursebyTitle = Courses.query.filter_by(course_title=course_title).first()
    if coursebyTitle:
        return jsonify(
            {
                "code": 200,
                "data": [coursebyTitle.to_dict()]
            }
        ), 200
    return jsonify(
        {
            "code": 404,
            "message": "Course title not found."
        }
    ), 404

#get courses by course code
@app.route("/courses/<int:course_code>")
def courses_by_code(course_code):
    course_by_code = Courses.query.filter_by(course_code=course_code).first()
    if course_by_code:
        return jsonify(
            {
                "data": [course_by_code.to_dict()]
            }
        ), 200
    else: 
        return jsonify(
            {
                "code": 404,
                "message": "Course code not found."
            }
        ), 404

#course creation
@app.route("/courses", methods=['POST'])
@cross_origin()
def addCourse():
    data = request.get_json()
    print(data)
    if not all(key in data.keys() for
               key in ('course_title', 'course_code',
                       'description', 'prerequisites')):
        return jsonify({
            "code": 500,
            "message": "Required fields not provided."
        }), 500
    course = Courses(**data)
    print(course)
    try:
        db.session.add(course)
        db.session.commit()
        return jsonify(
            {
                "code": 201,
                "message": "Course has been added successfully.",
                "data": [course.to_dict()]
            }
            ), 201

    except SQLAlchemyError as e:
        print(str(e))
        db.session.rollback()
        return jsonify(
            {
            "code": 500,
            "message": "Unable to add course to database."
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

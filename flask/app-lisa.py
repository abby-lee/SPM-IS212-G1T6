from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from sqlalchemy.exc import SQLAlchemyError

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root' + \
                                        '@localhost:8889/lms_database'
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
            "message": "No eligible courses."
        }
    )

#get learners completed courses 
@app.route("/<int:learners_eid>/completed")
def completed_courses(learners_eid):
    learner = Learners.query.filter_by(learners_eid=learners_eid).first()
    if learner:
        completed_courses = request.args.get('courses_completed', learner.courses_completed)        
        if completed_courses == None:
                return jsonify(
                    {
                        "code": 404,
                        "data": {
                            "learner_eid": learners_eid
                        },
                        "message": "No completed courses."
                    }
                )
        return jsonify(
            {
                "code": 200,
                "data": {
                    "learner_eid": learners_eid,
                    "courses_completed": completed_courses
                }
            }
        )

#get all sections by course
@app.route("/courses/<int:course_code>/section")
def get_sections(course_code):
    section_list = Sections.query.filter_by(course_code=course_code).all()
    return jsonify(
        {
            "data": [sections.to_dict()
                     for sections in section_list]
        }
    ), 200

#get course prerequisites 
@app.route("/courses/<int:course_code>/prerequisites")
def course_prerequisites(course_code):
    course = Courses.query.filter_by(course_code=course_code).first()
    if course:
        prerequisites_list = request.args.get('prerequisites', course.prerequisites)        
        if prerequisites_list == None:
            return jsonify(
                {
                    "code": 404,
                    "data": {
                        "course_code": course_code
                    },
                    "message": "No prerequisites"
                }
            )
        return jsonify(
            {
                "code": 200,
                "data": {
                    "course_code": course_code,
                    "prerequisites": prerequisites_list
                }
            }
        )

#self enrol - add learner to course
@app.route("/selfenrol", methods=['POST'])
@cross_origin()
def self_enrol():
    data = request.get_json()
    if not all(key in data.keys() for
               key in ('learners_eid', 'course_code',
                       'class_section', 'chapter_completed')):
        return jsonify(
            {
            "message": "Incorrect JSON object provided."
            }
        ), 500
    learner = Progress(**data)
    try:
        db.session.add(learner)
        db.session.commit()
        return jsonify(
            {
                "code": 200,
                "message": "Learner has been successfully added to course",
                "data": [learner.to_dict()]
            }
        ), 200
    except SQLAlchemyError as e:
        print(str(e))
        db.session.rollback()
        return jsonify(
            {
                "code": 500,
                "message": "Unable to add learner to course."
            }
        ), 500

# get class size by course and section
# @app.route("/course/<int:course_code>/<string:class_section>/classsize")
# def get_class_size(course_code, class_section):
#     course = Sections.query.filter_by(course_code=course_code, class_section=class_section).first()
#     if course:
#         class_size = request.args.get('class_size', course.class_size)
#         return jsonify(
#             {
#                 "code": 200,
#                 "data": {
#                     "course_code": course_code,
#                     "class_section": class_section,
#                     "class_size": class_size
#                 }
#             }
#         ), 200
#     return jsonify(
#         {
#             "code": 404,
#             "data": {
#                 "course_code": course_code,
#                 "class_section": class_section
#             },
#             "message": "Course and section not found."
#         }
#     ), 404

# # get class size by course and section
# @app.route("/course/<int:course_code>/<string:class_section>/vacancies")
# def get_class_size(course_code, class_section):
#     course = Sections.query.filter_by(course_code=course_code, class_section=class_section).first()
#     if course:
#         vacancies = request.args.get('vacancies', course.vacancies)
#         return jsonify(
#             {
#                 "code": 200,
#                 "data": {
#                     "course_code": course_code,
#                     "class_section": class_section,
#                     "vacancies": vacancies
#                 }
#             }
#         ), 200
#     return jsonify(
#         {
#             "code": 404,
#             "data": {
#                 "course_code": course_code,
#                 "class_section": class_section
#             },
#             "message": "Vacancies not found."
#         }
#     ), 404

# #get all trainers BY COURSE AND SECTION
# @app.route("/trainers")
# def get_trainers():
#     search_name = request.args.get('trainers_name')
#     if search_name:
#         trainers_list = Trainers.query.filter(Trainers.trainers_name.contains(search_name))
#     else:
#         trainers_list = Trainers.query.all()
#     return jsonify(
#         {
#             "data": [trainer.to_dict() for trainer in trainers_list]
#         }
#     ), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
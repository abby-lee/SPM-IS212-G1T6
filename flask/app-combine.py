from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from sqlalchemy.exc import SQLAlchemyError

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/lms_database'
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
    class_section = db.Column(db.String(2), db.ForeignKey(Sections.class_section))
    course_code = db.Column(db.Integer, db.ForeignKey(Courses.course_code))

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

class Enrols(db.Model):
    __tablename__ = 'enroling'

    learners_eid = db.Column(db.Integer, db.ForeignKey(Learners.learners_eid), primary_key=True)
    course_code = db.Column(db.Integer, db.ForeignKey(Courses.course_code), primary_key=True)
    class_section = db.Column(db.Integer, db.ForeignKey(Sections.class_section), primary_key=True)
    #learners_eid = db.Column(db.Integer, db.ForeignKey('learners_eid'), primary_key=True)
    #course_code = db.Column(db.Integer, db.ForeignKey('course_code'), primary_key=True)

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

    def __init__(self, course_code, learners_eid, class_section):
        self.course_code = course_code
        self.learners_eid = learners_eid
        self.class_section = class_section


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

# get learners by course 
@app.route("/courses/<int:course_code>")
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

#get all sections
@app.route("/sections")
def get_sections():
    section_list = Sections.query.all()
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

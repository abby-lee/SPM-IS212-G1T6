from flask import Flask, request, jsonify, render_template
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

class Quizanswers(db.Model):
    __tablename__ = 'quizanswers'
    questionid= db.Column(db.Integer, db.ForeignKey(Quizquestions.questionid) ,primary_key=True)
    quizid= db.Column(db.Integer, db.ForeignKey(Quizzes.quizid), primary_key=True)
    class_section = db.Column(db.String(2), db.ForeignKey(Sections.class_section), primary_key=True)
    course_code = db.Column(db.Integer, db.ForeignKey(Courses.course_code), primary_key=True)
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

db.create_all()

# 1 Get all quizzes by section and course code
@app.route("/<int:course_code>/<string:class_section>/quizzes")
def getQuizzes(course_code, class_section):
    quizzes = Quizzes.query.filter_by(course_code=course_code, class_section=class_section).all()
    if quizzes:
        return jsonify({
            "data": [quiz.to_dict() for quiz in quizzes]
        }), 200
    return jsonify({
        "code": 404,
        "data": {
            "course_code": course_code,
            "class_section": class_section,
        },
        "message": "No quizzes created yet."
    })

# 2. Display quiz questions as a form
@app.route("/<int:course_code>/<string:class_section>/<int:quizid>")
def getQuizQuestions(course_code, class_section, quizid):
    quizquestions = Quizquestions.query.filter_by(course_code=course_code, class_section=class_section, quizid=quizid).all()
    # if request.method == 'POST':
    for quizquestion in quizquestions:
        question = quizquestion.questiontext
        # singleoptions = []
        options = quizquestion.questionoptions
        # for option in options:
            # singleoptions = singleoptions.append(option)
            # singleoptions = option
        return jsonify({
            "code": 200,
            "data": {
                "questiontext": question,
                "questionoptions": options
            }
        })
        # return render_template('quiz_learner.html', title='Quiz Questions', question=question, singleoptions=singleoptions)
    # if quizquestions:
    #     return jsonify({
    #         "code": 200,
    #         "data": {
    #             "data": [question.to_dict() for question in quizquestions]
    #         }
    #     })

    return jsonify({
        "code": 404,
        "data": {
            "course_code": course_code,
            "class_section": class_section,
        },
        "message": "Quiz does not exist."
    }), 404

# 3. Set timer



# answers = []
# 4. Automatically mark on submit/on timer run out with the quizanswers table
# @app.route("/<int:course_code>/<string:class_section>/<int:quizid>", methods=['GET','POST'])
# def checkquizanswers(course_code, class_section, quizid):
#     quizquestions = Quizquestions.query.filter_by(course_code=course_code, class_section=class_section, quizid=quizid).all()
#     if quizquestions:
        # return jsonify({
        #     "data": [quizquestion.to_dict() for quizquestion in quizquestions]
        # }), 200
        # form = QuizQuestionsForm();
        # if form.validate_on_submit():
        #     quizquestion = form.quizquestion.data
        #     questions = Quizquestions(quizquestion)
        #     db.session.add(questions)
        #     db.session.commit()
        # quizquestions = Quizquestions.query.all()
    #     print(request.form.get('question_answer'))
    #     # return render_template('quiz_learner.html',form=form)
    #     return render_template('quiz_learner.html')

    # return jsonify({
    #     "code": 404,
    #     "data": {
    #         "course_code": course_code,
    #         "class_section": class_section,
    #     },
    #     "message": "Error with quiz submission."
    # }), 404


1. 

2. 

3. give grade



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
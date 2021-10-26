from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from sqlalchemy.exc import SQLAlchemyError
from flask_wtf import FlaskForm as Form
from wtforms import RadioField
from wtforms.validators import ValidationError

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

# @app.route("/<int:course_code>/<string:class_section>/<int:quizid>")
# def getQuizQuestions(course_code, class_section, quizid):
#     qnsid = Quizquestions.query.filter_by(course_code=course_code, class_section=class_section, quizid=quizid).all()
#     if qnsid:
#         choices = []
#         getchoices = request.args.get('questionoptions', Quizquestions.questionoptions)
#         choices = getchoices.split(',')   #??????
#         return jsonify({
#             "data": {
#                 "questionoptions" : choices
#             }
#             # "data": [qns.to_dict() for qns in qnsid]
#         }),200
#     else:
#         return jsonify({
#             "code": 404,
#             "data": {
#                 "course_code": course_code,
#                 "class_section": class_section
#             },
#             "message": "No quiz questions created yet."
#         })
# 2. Display quiz questions as a form
@app.route("/<int:course_code>/<string:class_section>/<int:quizid>")
def getQuizForm(course_code, class_section, quizid):
    qid = Quizquestions.query.filter_by(course_code=course_code, class_section=class_section, quizid=quizid).all()
    if qid:
        form = Quizquestions() 
        for qns in qid:
        # type = request.args.get('questiontype', qns.questiontype)
        # question = request.args.get('questiontext', qns.questiontype)
            choices = []
            options = request.args.get('questionoptions', qns.questionoptions)
            choices = options.split(',')
            if choices.count() > 2:   #mcq
                RadioField(qns.questiontext, choices=choices, validators=qns.answertext)
            else:   #true/false
                RadioField(Quizquestions.questiontext, choices=['True', 'False'], validators=Quizquestions.answertext)
        return render_template('quiz.html', form=form, choices=choices)


        # validators=CorrectAnswer(Quizquestions.answertext))
        # @app.route(‘/passed’)
        # if form.validate_on_submit(): 
        #     return redirect(url_for('passed'))
        # def __call__(self, form, field):
        #     message = 'Incorrect answer.'
        #     if field.data != self.answer:
        #         raise ValidationError(message)



    # if request.method == 'POST':
    # for quizquestion in quizquestions:
    #     question = quizquestion.questiontext
        # singleoptions = []
        # options = quizquestion.questionoptions
        # for option in options:
            # singleoptions = singleoptions.append(option)
            # singleoptions = option
      
        # return render_template('quiz_learner.html', title='Quiz Questions', question=question, singleoptions=singleoptions)
    


# 3. Set timer
# @app.route("</int:course_code>/<string:class_section>/<int:quizid>")


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


# 1. check questions answers to selected 

# 2. 

# 3. give grade



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
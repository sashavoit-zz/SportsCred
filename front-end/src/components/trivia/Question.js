
class Question {
    constructor (question, option1, option2, option3, answer) {
        this.question = question;
        this.option1 = option1;
        this.option2 = option2;
        this.option3 = option3;
        this.answer = answer;
    }
    getQuestion () {
        return this.question;
    }
    getOption1 () {
        return this.option1;
    }
    getOption2 () {
        return this.option2;
    }
    getOption3 () {
        return this.option3;
    }
    getAnswer () {
        return this.answer;
    }
}
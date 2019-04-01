import { UserAnswer } from './userAnswer.model';

export class UserSurvey {
    constructor(
        public surveyFlag: boolean,
        // public answers: UserAnswer[]
        public answers: Array<string>
    ) {}
}

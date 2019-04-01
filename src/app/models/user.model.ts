import { UserSurvey } from './userSurvey.model';

export class User {
    constructor(
        public email: string,
        public survey: UserSurvey[]
    ) {}
}


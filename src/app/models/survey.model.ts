import { Question } from './question.model';

export class Survey {
    constructor(
        // public completed: number,
        public title: string,
        public description: string,
        public dateFrom: string,
        public dateTo: string,
        public imgUrl: string,
        public questions: Question[],
    ) {}
}

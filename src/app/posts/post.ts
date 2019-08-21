export class Post {
    id: number;
    title: string;
    thumbnailImageSrc: string;
    username: string;
    content: string;
    
    comment_amount: number;
    is_public: boolean;

    created_at: string;
    modified_at: string;

    constructor() {
        
    }
}

export class CaseStudy extends Post {
    id: number;
    roles: string;
    time_spent: string;
    projectType?: string;
    clientType?: string;
    demonstratedSkills?: string;

    constructor(
        
    ) {
        super();

    }
}

export class HighlightedCaseStudy {
    id: number;
    
    highlightedAbstract?: string;
    leaderWords?: string;
    leaderAction?: string;    
    caseStudy: CaseStudy;
}
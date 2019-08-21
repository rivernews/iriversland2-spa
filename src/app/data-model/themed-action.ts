import { s3MediaResource } from "./s3-media-resource";

class ThemedAction {
    constructor(
        public image: s3MediaResource, 
        public icon: string, 
        public label: string, 
        public description: string, 
        public routerLink: string
    ) {

    }
}

export {
    ThemedAction
};
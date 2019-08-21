class s3MediaResource {
    public url: string;
    public name: string; // (optional) for description of the image

    private s3BaseURL: string = `https://s3.us-east-2.amazonaws.com/iriversland2-media/`;

    constructor(
        path: string,
        name?
    ) {
        if (path.includes('//')) {
            this.url = path;
        }
        else {
            this.url = `${this.s3BaseURL}${path}`;
        }
        if (name) this.name = name;
    }
}

export {
    s3MediaResource
};
import { s3MediaResource } from "../data-model/s3-media-resource";
import { ThemedAction } from "../data-model/themed-action";

export let THEMED_ACTIONS = {
    portfolio: new ThemedAction(
        new s3MediaResource(`editor_uploads/home/design_work.compressed.jpg`),
        `view_carousel`,
        `Portfolio`,
        `View more of my case studies`,
        `/portfolio`
    ),
    blog: new ThemedAction(
        new s3MediaResource(`editor_uploads/home/coffee.compressed.jpg`), 
        `format_align_left`,
        `Blog`,
        `Things I'm working on & life`,
        `/blog`
    ),
    design: new ThemedAction(
        new s3MediaResource(`editor_uploads/home/collaborate.compressed.jpg`), // TODO: 
        `format_color_fill`,
        `Design`,
        `How I build and design this website, from scratch`,
        `/design-lang-system`
    ),
    profile: new ThemedAction(
        new s3MediaResource(`editor_uploads/home/profile-pro.jpg`), // home/collaborate.compressed.jpg
        `person_pin`,
        `Profile`,
        ``,
        `/about`
    ),
};

// export let PORTFOLIO_COVER_IMAGES = {
//     1: new s3MediaResource(
//         `https://s3.us-east-2.amazonaws.com/iriversland2-media/editor_uploads/case-studies/2018-06-13-1/cover-rev-01.jpg`,
//         `501`
//     ),
//     3: new s3MediaResource(
//         `https://s3.us-east-2.amazonaws.com/iriversland2-media/editor_uploads/case-studies/2018-06-13-3/cover-slate-bg.jpg`,
//         `MeL`
//     ),
//     4: new s3MediaResource(
//         `https://iriversland2-media.s3.amazonaws.com/editor_uploads/case-studies/2018-06-13-4/cover-rev-02.jpg`,
//         `BB`
//     ),
//     7: new s3MediaResource(
//         `https://s3.us-east-2.amazonaws.com/iriversland2-media/editor_uploads/case-studies/2018-06-14-7/play-music.jpeg`,
//         `YouBox`
//     ),
//     2: new s3MediaResource(
//         `https://iriversland2-media.s3.amazonaws.com/editor_uploads/case-studies/2018-06-13-2/cover-rev-02.jpg`,
//         `UMSI Redesign`
//     ),
//     6: new s3MediaResource(
//         `https://s3.us-east-2.amazonaws.com/iriversland2-media/editor_uploads/case-studies/2018-06-14-6/cover-slate-bg.jpg`,
//         `emoji`
//     ),
    
//     // academic innovation
//     38: new s3MediaResource(
//         `https://s3.us-east-2.amazonaws.com/iriversland2-media/editor_uploads/case-studies/2018-11-05-38/problem-roulette-only-cover.jpg`,
//         `Academic Innovation`
//     ),
// };

// export let HIGHLIGHT_COVER_IMAGES = {
//     1: {
//         resource : new s3MediaResource(
//             `editor_uploads/case-studies/2018-06-13-1/affinity-wall-working.compressed.jpg`,
//         ),
//         cssPosition: `0% 50%`,
//     },
//     3: {
//         resource : new s3MediaResource(
//             `editor_uploads/case-studies/2018-06-13-3/usability_test_recording.jpg`,
//         ),
//         cssPosition: `100% 50%`,        
//     },
//     4: {
//         resource : new s3MediaResource(
//             PORTFOLIO_COVER_IMAGES[4].url,
//         ),
//         cssPosition: `50% 50%`,
//         cssPositionMobile: `25% 0%`        
//     }
// };

export let MAJOR_ROLE_EDUCATIONS = [
    {
        media: new s3MediaResource(
            `brands/um.png`,
        ),
        fullName: `University of Michigan`,
        degree: `M.S. in Information, Human-Computer Interaction track`,
        year: `Class of 2019`,
    },
    {
        media: new s3MediaResource(
            `brands/nthu-full-w-eng.gif`,
        ),
        fullName: `National Tsing Hua University`,
        degree: `B.S. in Computer Science, specialize in Computer Vision, Virtual Reality and Augment Reality`,
        year: `Class of 2015`,
    },
];

export let MAJOR_ROLE_TOOL_LIST = [

    // design
    new s3MediaResource(
        `brands/sketch.png`,
        `Sketch`
    ),
    new s3MediaResource(
        `brands/invision.svg`,
        `InVision`
    ),
    new s3MediaResource(
        `brands/illustrator.svg`,
        `Illustrator`
    ),
    new s3MediaResource(
        `brands/ps.svg`,
        `Photoshop`
    ),

    // frontend
    new s3MediaResource(
        `brands/angular.svg`,
        `Angular`
    ),
    new s3MediaResource(
        `brands/react-dark-rounded-rev-01.png`,
        `React`
    ),
    new s3MediaResource(
        `brands/vue.png`,
        `Vue`
    ),
    new s3MediaResource(
        `brands/rxjs.png`,
        `RxJS`
    ),

    // others and fundamentals
    new s3MediaResource(
        `brands/d3.png`,
        `D3`
    ),
    new s3MediaResource(
        `brands/js.png`,
        `JavaScript ES6`
    ),
    new s3MediaResource(
        `brands/sass.png`,
        `SASS/SCSS`
    ),
    new s3MediaResource(
        `brands/css3.png`,
        `CSS3`
    ),
    // new s3MediaResource(
    //     `brands/html5.png`,
    //     `HTML5`
    // ),

    // backend and devOps
    new s3MediaResource(
        `brands/django-light.svg`,
        `Django`
    ),
    new s3MediaResource(
        `brands/drf.png`,
        `Django REST framework`
    ),
    new s3MediaResource(
        `brands/aws-full-stripped.svg`,
        `AWS`
    ),
];


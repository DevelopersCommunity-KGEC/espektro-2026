export interface TimelineItem {
    id: number;
    img: string;
    imgBW: string;
    position: {
        top?: string;
        left?: string;
        right?: string;
        bottom?: string;
        transform?: string;
        width?: string;
        height?: string;
    };
    border: string;
    description: string;
    era: string;
    title: string;
    body: string;
    textPosition?: {
        top?: string;
        left?: string;
        right?: string;
        bottom?: string;
        width?: string;
        height?: string;
        textAlign?: "left" | "right" | "center" | "justify";
    };
}

export const timelineData: TimelineItem[] = [
    {
        id: 1,
        img: 'images/img1.webp',
        imgBW: 'images/imgbw1.webp',
        position: { top: '50vh', left: '17%', width: '35vw', height: 'auto' },
        border: 'right-bottom',
        description: 'Charyapada Era',
        era: '8th–12th Century',
        title: 'Charyapada Era',
        body: 'The mystic script on palm leaves that marks the dawn of the Bengali language.',
        textPosition: { bottom: '2%', left: '10%', width: '80%' }
    },
    {
        id: 2,
        img: 'images/img2.webp',
        imgBW: 'images/imgbw2.webp',
        position: { top: '55vh', left: '25%', width: '35vw', height: 'auto' },
        border: 'left-bottom',
        description: 'Vaishnav Bhakti Movement',
        era: '15th–16th Century',
        title: 'Vaishnav Bhakti Movement',
        body: 'A cultural revolution of love and devotion, united by the divine rhythm of the Mridanga.',
        textPosition: { top: '65%', left: '0', width: '100%' }
    },
    {
        id: 3,
        img: 'images/img3.webp',
        imgBW: 'images/imgbw3.webp',
        position: { top: '50vh', left: '35%', width: '33vw', height: 'auto' },
        border: 'right-top',
        description: 'Mangalkavya & Medieval Literature',
        era: '16th–18th Century',
        title: 'Mangalkavya & Medieval Literature',
        body: 'The golden age of epic narratives, where quill and ink turned folktales into grand literature.',
        textPosition: { bottom: '0%', left: '15%', width: '80%' }
    },
    {
        id: 4,
        img: 'images/img4.webp',
        imgBW: 'images/imgbw4.webp',
        position: { top: '55vh', left: '47%', width: '40vw', height: 'auto' },
        border: 'left-top',
        description: 'Baul & Folk Spiritual Tradition',
        era: '17th–19th Century',
        title: 'Baul & Folk Spiritual Tradition',
        body: "The Ektara's single string performs a raw, spiritual song in search of the divine within.",
        textPosition: { bottom: '0%', left: '10%', width: '80%' }
    },
    {
        id: 5,
        img: 'images/img5.webp',
        imgBW: 'images/imgbw5.webp',
        position: { top: '50vh', left: '55%', width: '50vw', height: 'auto' },
        border: 'right-bottom',
        description: 'Bengal Renaissance',
        era: '19th Century',
        title: 'Bengal Renaissance',
        body: "An intellectual awakening of reform and artistry that redefined Bengal's modern identity.",
        textPosition: { bottom: '10%', left: '4%', width: '80%' }
    },
    {
        id: 6,
        img: 'images/img6.webp',
        imgBW: 'images/imgbw6.webp',
        position: { top: '55vh', left: '65%', width: '35vw', height: 'auto' },
        border: 'left-top',
        description: 'Swadeshi & Cultural Nationalism',
        era: 'Early 20th Century',
        title: 'Swadeshi & Cultural Nationalism',
        body: 'The Charkha spun threads of defiance, becoming the ultimate symbol of self-reliance and freedom.',
        textPosition: { bottom: '5%', left: '12%', width: '80%' }
    },
    {
        id: 7,
        img: 'images/img7.webp',
        imgBW: 'images/imgbw7.webp',
        position: { top: '50vh', left: '75%', width: '35vw', height: 'auto' },
        border: 'left-top',
        description: 'Language Movement & Modern Identity',
        era: '1950s',
        title: 'Language Movement & Modern Identity',
        body: 'A single character rose to become the ultimate fortress of our linguistic identity.',
        textPosition: { top: '59%', left: '14%', width: '80%' }
    },
    {
        id: 8,
        img: 'images/img8.webp',
        imgBW: 'images/imgbw8.webp',
        position: { top: '55vh', left: '85%', width: '35vw', height: 'auto' },
        border: 'left-top',
        description: 'Contemporary Bengali Culture',
        era: '21st Century',
        title: 'Contemporary Bengali Culture',
        body: 'From heritage to the modern screen, the clapperboard signals a dynamic artistic evolution.',
        textPosition: { bottom: '8%', left: '14%', width: '80%' }
    }
];

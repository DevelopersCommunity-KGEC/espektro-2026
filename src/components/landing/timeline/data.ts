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
        description: 'Ancient Terracotta Temples',
        era: '17th Century',
        title: 'Ancient Terracotta Temples',
        body: 'Exquisite temples of Bishnupur showcasing intricate terracotta artistry.',
        textPosition: { bottom: '2%', left: '10%', width: '80%' }
    },
    {
        id: 2,
        img: 'images/img2.webp',
        imgBW: 'images/imgbw2.webp',
        position: { top: '55vh', left: '25%', width: '35vw', height: 'auto' },
        border: 'left-bottom',
        description: 'Terracotta Horse Craftsmanship',
        era: 'Traditional',
        title: 'Bankura Horse Craft',
        body: 'A symbol of Indian handicrafts, the terracotta horse of Bankura is world-famous.',
        textPosition: { top: '65%', left: '0', width: '100%' }
    },
    {
        id: 3,
        img: 'images/img3.webp',
        imgBW: 'images/imgbw3.webp',
        position: { top: '50vh', left: '35%', width: '33vw', height: 'auto' },
        border: 'right-top',
        description: 'Celebrate Tradition',
        era: 'Festive',
        title: 'Celebrate Tradition',
        body: 'The vibrant festivals of Bengal bring people together in joy and harmony.',
        textPosition: { bottom: '0%', left: '15%', width: '80%' }
    },
    {
        id: 4,
        img: 'images/img4.webp',
        imgBW: 'images/imgbw4.webp',
        position: { top: '55vh', left: '47%', width: '40vw', height: 'auto' },
        border: 'left-top',
        description: 'Historical Currency',
        era: 'Pre-Independence',
        title: 'Historical Currency',
        body: 'A glimpse into the economic history and coin minting of the region.',
        textPosition: { bottom: '0%', left: '10%', width: '80%' }
    },
    {
        id: 5,
        img: 'images/img5.webp',
        imgBW: 'images/imgbw5.webp',
        position: { top: '50vh', left: '55%', width: '50vw', height: 'auto' },
        border: 'right-bottom',
        description: 'Victoria Memorial',
        era: '1921',
        title: 'Victoria Memorial',
        body: 'An iconic marble building in Kolkata dedicated to the memory of Queen Victoria.',
        textPosition: { bottom: '10%', left: '4%', width: '80%' }
    },
    {
        id: 6,
        img: 'images/img6.webp',
        imgBW: 'images/imgbw6.webp',
        position: { top: '55vh', left: '65%', width: '35vw', height: 'auto' },
        border: 'left-top',
        description: 'Heritage Transport',
        era: '1873',
        title: 'Heritage Tram',
        body: 'Asia\'s oldest operating electric tram network, a symbol of Kolkata\'s heritage.',
        textPosition: { bottom: '5%', left: '12%', width: '80%' }
    },
    {
        id: 7,
        img: 'images/img7.webp',
        imgBW: 'images/imgbw7.webp',
        position: { top: '50vh', left: '75%', width: '35vw', height: 'auto' },
        border: 'left-top',
        description: 'Netaji Subhas Chandra Bose',
        era: '1897-1945',
        title: 'Netaji Subhas Bose',
        body: 'A defiant patriot and hero of India\'s struggle for independence.',
        textPosition: { top: '59%', left: '14%', width: '80%' }
    },
    {
        id: 8,
        img: 'images/img8.webp',
        imgBW: 'images/imgbw8.webp',
        position: { top: '55vh', left: '85%', width: '35vw', height: 'auto' },
        border: 'left-top',
        description: 'Yellow Taxi',
        era: 'Iconic',
        title: 'Yellow Taxi',
        body: 'The classic Ambassador taxis are an enduring symbol of Kolkata\'s streets.',
        textPosition: { bottom: '8%', left: '14%', width: '80%' }
    }
];

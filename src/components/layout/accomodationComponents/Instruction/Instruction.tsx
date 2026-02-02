import React from 'react';
// import profileImg from './profile.jpg'; 
// import style from './style.module.scss';
import { InstructionWrapper, Text, Title, Col } from "./InstructionStyled";

// interface StackItem {
//     name: string;
// }

export const Instruction: React.FC = () => {
    // const stackList1: StackItem[] = [
    //     { name: 'React.js' },
    //     { name: 'Angular' },
    //     { name: 'Bootstrap' },
    //     { name: 'SASS' },
    //     { name: 'Git' }
    // ];

    // const stackList2: StackItem[] = [
    //     { name: 'JavaScript' },
    //     { name: 'TypeScript' },
    //     { name: 'CSS3' },
    //     { name: 'HTML5' },
    //     { name: 'WordPress' }
    // ];

    return (
        // <section className={style.instruction}>
        //     <div className={`${style['width-wrapper']} ${style['flex-control']}`} >
        //         <div className={style['col-left']}>
        //             {/* <AOSElement duration="900"> */}
        //             <h2>About me</h2>
        //             {/* </AOSElement> */}
        //             <div className={style['text-content']}>
        //                 {/* <AOSElement duration="900"> */}
        //                 <p>
        //                     I am a self-taught Front End Web Developer passionate about utilizing
        //                     my skills and expertise to create technology and solutions that deliver value
        //                     and empowers individuals to achieve their goals.
        //                 </p>
        //                 {/* </AOSElement> */}
        //                 {/* <AOSElement duration="900"> */}
        //                 <p>
        //                     Since 2021 I have been assisting local business owners by creating
        //                     visually appealing, accessible & performant websites for their businesses,
        //                     providing them with a stronger online presence that will help their
        //                     overall success.
        //                 </p>
        //                 {/* </AOSElement> */}
        //                 {/* <AOSElement duration="900"> */}
        //                 <p>
        //                     Here is the stack of technologies I work with:
        //                 </p>
        //                 {/* </AOSElement> */}
        //             </div>
        //             {/* <AOSElement duration="900"> */}
        //             <div className={`${style['stack-list-container']} ${style['flex-control']}`}>
        //                 <ul className={style['stack-list-left']}>
        //                     {stackList1.map((item, index) => (
        //                         <li className={style['list-item']} key={index}>
        //                             {item.name}
        //                         </li>
        //                     ))}
        //                 </ul>
        //                 <ul className={style['stack-list-right']}>
        //                     {stackList2.map((item, index) => (
        //                         <li className={style['list-item']} key={index}>
        //                             {item.name}
        //                         </li>
        //                     ))}
        //                 </ul>
        //             </div>
        //             {/* </AOSElement> */}
        //         </div>
        //         <div className={style['col-right']}>
        //             {/* <AOSElement duration="900"> */}
        //             {/* <figure className={style['profile-img-container']}>
        //       <img src={''} className={style['profile-img']} alt="Jarol Riera profile picture"/>
        //     </figure> */}
        //             {/* </AOSElement> */}
        //         </div>
        //     </div>
        // </section>

        <InstructionWrapper>
            <Title>
                Terms And Conditions
            </Title>
            <Col>
                <Text>Registration will be confirmed after verifying payment details within the specified period.</Text>
                <Text>No refunds are available once registration is complete.</Text>
                <Text>Espektro'25 will take place in two parts: Techtix from March 24 to March 26 and Exotica from April 3 to April 6. Accommodation will be provided during the event dates for both parts. No accommodation will be available outside these dates.</Text>
                <Text>After checking the Govt. ID proof, accommodation will be provided.</Text>
                <Text>Adherence to the Terms and Conditions is required, aligning with KGEC Students' Union regulations.</Text>
            </Col>
        </InstructionWrapper>
    );
};

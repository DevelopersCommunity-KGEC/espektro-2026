import  { ReactElement } from "react";
import { UserIcon, GearIcon } from "../icons"; 

interface InfoItem {
  id: string;
  icon: ReactElement;
  title: string;
  text: string;
}

const InfoMock: InfoItem[] = [
  
  {
    id: "gear",
    icon: <GearIcon/>,
    title: "REGULATIONS",
    text: "Fees once paid are non-refundable. No visitors permitted",
  },
  {
    id: "user",
    icon: <UserIcon/>,
    title: "CONTACT",
    text: "RAHUL MIRZA (+91 8927602770), SK IFTIKAR UDDIN (8250780480)",
  },
];

export default InfoMock;

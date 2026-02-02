import React, { useEffect, useMemo, useState } from "react";
import {
  AccordionSwitch,
  AccordionBody,
  AccordionItem,
  AccordionStyled,
  AccordionText,
  AccordionTitle,
  AccordionWrapper,
  Title,
  Header,
} from "./AccordionStyled";
import { MinusIcon, PlusIcon } from "../icons";
import { instructorsFaq, usersFaq } from "./faqLists";
import { KeyWords } from "./KeyWords";

const makeOpenItemId = (index: number, id: string) => `${index}_${id}`;

interface FaqItem {
  id: string;
  title: string;
  text: string;
}

const FaqAccordion: React.FC<{
  openItems: string[];
  handleItemClick: (itemId: string) => void;
  array: {
    id: string;
    title: string;
    text: string;
  }[];
}> = ({ openItems, handleItemClick, array }) =>
    useMemo(() => {
      return array.map((item, index) => {
        const open = openItems.includes(makeOpenItemId(index, item.id));
        return (
          <AccordionItem key={item.id} $isOpen={open}>
            <AccordionSwitch
              onClick={() => handleItemClick(makeOpenItemId(index, item.id))}
              $isOpen={open}
            >
              {open ? <MinusIcon /> : <PlusIcon />}
            </AccordionSwitch>
            <AccordionTitle
              onClick={() => handleItemClick(makeOpenItemId(index, item.id))}
            >
              {item.title}
            </AccordionTitle>
            <AccordionBody $isOpen={open}>
              <AccordionText dangerouslySetInnerHTML={{ __html: item.text }} />
            </AccordionBody>
          </AccordionItem>
        );
      });
    }, [openItems, array]);

const Accordion: React.FC<{ filterBySearch: string[] }> = ({
  filterBySearch,
}) => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [activeTab] = useState<{ users: boolean; instructors: boolean }>({ users: true, instructors: false });
  const [usersFAQ, setUsersFAQ] = useState(usersFaq);
  const [instructorsFAQ, setInstructorsFAQ] = useState(instructorsFaq);
  const [filterData, setFilterData] = useState<{
    id: string;
    title: string;
    text: string;
  }[][]>([]);


  const searchStringInArray = (baseData: FaqItem[], searchedItem: string[]) => {
    const filterData: FaqItem[] = [];
    for (let item of baseData) {
      for (let keyWord of searchedItem) {
        if (keyWord.length > 0) {
          if (keyWord === '') {
            return [];
          }
          if (
            item?.title?.toLowerCase()?.includes(keyWord.toLowerCase()) ||
            item?.text?.toLowerCase()?.includes(keyWord.toLowerCase())
          ) {
            filterData.push(item);
          }
        }
      }
    }
    return [...new Set(filterData)];
  };

  const checkMatch = (keywords: string[], searchData: string[]) => {
    let isSearched = false;
    for (let i = 0; i < keywords.length; i++) {
      for (let j = 0; j < searchData.length; j++) {
        if (keywords[i] === searchData[j]) {
          return (isSearched = true);
        }
      }
    }
    return isSearched;
  };

  const resetSearch = () => {
    setFilterData([usersFaq]);
    setInstructorsFAQ(instructorsFaq);
    setUsersFAQ(usersFaq);
  };

  // Check if the SearchData contains at least one of keywords.
  const isKeyWordRequired = () => {
    if (activeTab.users) {
      filterBySearch.length <= 1 && resetSearch();
      return checkMatch(KeyWords.user, filterBySearch);
    } else {
      filterBySearch.length <= 1 && resetSearch();
      return checkMatch(KeyWords.instructors, filterBySearch);
    }
  };


  useEffect(() => {
    if ((filterBySearch.length === 1 && filterBySearch[0] === '') || filterBySearch.length === 0) {
      if (activeTab.users) {
        setFilterData([usersFAQ]);
      } else {
        setFilterData([instructorsFAQ]);
      }
      return;
    }
    if (isKeyWordRequired()) {
      if (activeTab.users) {
        const mathArray = searchStringInArray(usersFaq, filterBySearch);
        setFilterData([mathArray]);
      } else {
        const mathArray = searchStringInArray(instructorsFaq, filterBySearch);
        setFilterData([mathArray]);
      }
    }
  }, [filterBySearch, activeTab]);

  const handleItemClick = (itemId: string) => {
    setOpenItems((prev) => {
      let next: string[];
      if (prev.includes(itemId)) {
        next = [];
      } else {
        next = [itemId];
      }
      return next;
    });
  };

  return (
    <AccordionWrapper>
      <Header>
        <Title>Frequently asked questions</Title>
      </Header>
      <AccordionStyled>
        <FaqAccordion
          openItems={openItems}
          handleItemClick={handleItemClick}
          array={filterData.flat()}
        />
      </AccordionStyled>
    </AccordionWrapper>
  );
};

export default Accordion;

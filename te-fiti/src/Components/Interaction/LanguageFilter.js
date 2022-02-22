import React, { useEffect, useState } from "react";
import { Languages, Order } from "../utilities/utils";
import Select from "react-select";

const LanguageList = (props) => {
  const [List, setList] = useState([]);
  const [languageToShow, setLanguageToShow] = useState(
    Languages[window.navigator.language.replace("_", "-").substr(0, 2)]
  );

  const ChangeLanguage = (data) => {
    props.setLanguage(data.value);
    setLanguageToShow(Languages[data.value]);
  };
  //Select all the languages

  //Load all options on the Select
  const Options = () => {
    let opt = [];

    List.map((Language) => {
      const temp = { value: Language, label: Languages[Language] };
      opt.push(temp);
      return 0;
    });

    opt.sort((a, b) => {
      if (a.label > b.label) {
        return 1;
      }
      if (a.label < b.label) {
        return -1;
      }
      return 0;
    });

    let languageOrdered = [];

    languageOrdered.push({ value: "al", label: "All Languages" });

    opt.map((data) => {
      languageOrdered.push({ value: data.value, label: data.label });
      return 0;
    });

    return languageOrdered;
  };

  //Load all languages depending of resources
  useEffect(() => {
    setList(Order(props.DataResource));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  useEffect(() => {
    setLanguageToShow(Languages[props.language.substr(0, 2)]);
  }, [props.language]);

  //language list have to match only with the languages on the resources

  return (
    <div>
      <Select
        placeholder={languageToShow}
        onChange={ChangeLanguage}
        options={Options()}
        className="LanguageSelect"
      />
    </div>
  );
};

export default LanguageList;

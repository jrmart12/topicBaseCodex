import React, { useEffect, useState } from "react";
import { LanguagesCode as Languages } from "../utilities/utils";
import Select from "react-select";

const LanguageListComplete = (props) => {
  const LanguageList = Languages;
  const [languageToShow, setLanguageToShow] = useState("");

  const ChangeLanguage = (data) => {
    props.setLanguage(data.value);
    setLanguageToShow(LanguageList[data.value]);
  };

  const Options = () => {
    let opt = [];
    Object.entries(LanguageList).map((Language) => {
      let temp = { value: Language[0], label: Language[1] };
      opt.push(temp);
      return 0;
    });
    return opt;
  };
  //to listen when the language change a show the language of the resource or the web browser
  useEffect(() => {
    setLanguageToShow(Languages[props.language]);
  }, [props, languageToShow]);

  //language list tiene que ser solo los idiomas que concuerden con los recursos no mas
  /**<Dropdown
      menuAlign="left"
      show={show}
      onMouseLeave={() => {
        setShow(false);
      }}
    >
      <Dropdown.Toggle
        as="input"
        id="SearchLanguageInput"
        onChange={SearchLanguage}
        onClick={() => {
          if (show) {
            setShow(false);
          } else {
            setShow(true);
          }
        }}
        autoComplete="off"
      ></Dropdown.Toggle>
      <Dropdown.Menu as="ul" id="LanguageList">
        {Object.entries(LanguageList).map((Language) => (
          <Dropdown.Item
            as="li"
            className="Item"
            id="Language"
            onClick={() => {
              ChangeLanguage(Language);
            }}
            value={Language[0]}
          >
            {Language[1]}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown> */
  //Select sent a object when you select an option
  return (
    <div>
      <Select
        placeholder={`${languageToShow}`}
        onChange={ChangeLanguage}
        id="LanguageList"
        options={Options()}
      />
    </div>
  );
};

export default LanguageListComplete;

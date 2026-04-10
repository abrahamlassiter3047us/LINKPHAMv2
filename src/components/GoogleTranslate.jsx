import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    const applyLanguage = (select) => {
      let userLang;

      try {
        const location = JSON.parse(localStorage.getItem("location") || "{}");
        userLang = location?.lang;
        console.log(userLang);
      } catch {
        console.warn("Invalid location in localStorage");
      }

      if (userLang && select.value !== userLang) {
        select.value = userLang;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

    const waitForWidgetLoad = (attempts = 10) => {
      const select = document.querySelector(".goog-te-combo");

      if (select) {
        applyLanguage(select);
      } else if (attempts > 0) {
        setTimeout(() => waitForWidgetLoad(attempts - 1), 500);
      }
    };

    if (!window.googleTranslateInitialized) {
      window.googleTranslateInitialized = true;

      window.googleTranslateElementInit = () => {
        if (!window.google?.translate) return;

        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
          },
          "google_translate_element"
        );

        waitForWidgetLoad();
      };

      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      waitForWidgetLoad();
    }
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;

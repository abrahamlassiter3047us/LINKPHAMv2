import React, { useEffect, useRef } from "react";

const GoogleTranslate = () => {
  const intervalRef = useRef(null);

  useEffect(() => {
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

      const existingScript = document.querySelector(
        'script[src*="translate.google.com"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
    } else {
      waitForWidgetLoad();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const waitForWidgetLoad = () => {
    intervalRef.current = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");

      if (select) {
        let userLang;

        try {
          const location = JSON.parse(localStorage.getItem("location") || "{}");
          userLang = location.lang;
        } catch (e) {
          console.warn("Invalid location in localStorage");
        }

        if (userLang && select.value !== userLang) {
          select.value = userLang;
          select.dispatchEvent(new Event("change"));
        }

        clearInterval(intervalRef.current);
      }
    }, 500);
  };

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;

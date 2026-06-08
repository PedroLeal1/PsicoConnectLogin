"use client";

import { useEffect } from "react";

export default function LegalHashScroller() {
  useEffect(() => {
    function scrollToHash() {
      const hash = window.location.hash;

      if (!hash) return;

      const id = hash.replace("#", "");
      const element = document.getElementById(id);

      if (!element) return;

      setTimeout(() => {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    }

    scrollToHash();

    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return null;
}
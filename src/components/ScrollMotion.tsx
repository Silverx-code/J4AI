"use client";

import { useEffect } from "react";

const TARGET_SELECTOR = "main > section, main .card";

export default function ScrollMotion({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const targets = new WeakSet<Element>();
    const pages = new WeakSet<Element>();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let revealObserver: IntersectionObserver | null = null;
    if (!reduceMotion && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.scrollVisible = "true";
            observer.unobserve(entry.target);
          }
        }
      }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
      revealObserver = observer;
    }

    const initPage = (main: Element) => {
      if (pages.has(main)) return;
      pages.add(main);
      main.classList.add("motion-page-enter");
    };

    const initTarget = (element: Element) => {
      if (targets.has(element)) return;
      targets.add(element);
      const item = element as HTMLElement;
      item.classList.add("scroll-motion-item");

      const siblings = Array.from(item.parentElement?.children ?? []).filter((child) => child.matches(TARGET_SELECTOR));
      const position = Math.max(0, siblings.indexOf(element));
      item.style.setProperty("--scroll-delay", `${Math.min(position * 65, 260)}ms`);

      const rect = item.getBoundingClientRect();
      if (!revealObserver || (rect.top < window.innerHeight * 0.9 && rect.bottom > 0)) {
        item.dataset.scrollVisible = "true";
      } else {
        revealObserver.observe(element);
      }
    };

    const scan = (root: ParentNode) => {
      if (root instanceof Element && root.matches("main")) initPage(root);
      root.querySelectorAll("main").forEach(initPage);
      if (root instanceof Element && root.matches(TARGET_SELECTOR)) initTarget(root);
      root.querySelectorAll(TARGET_SELECTOR).forEach(initTarget);
    };

    scan(document);
    document.documentElement.classList.add("motion-enabled");

    const mutationObserver = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) scan(node);
        });
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      revealObserver?.disconnect();
      document.documentElement.classList.remove("motion-enabled");
    };
  }, []);

  return <>{children}</>;
}

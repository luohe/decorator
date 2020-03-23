/*
 * @license
 * Copyright (c) 2018, the Gago Inc All rights reserved.
 * @author: xiaZQ (xiazhiqiang@gagogroup.com)
 * @created: 2019/12/9 3:09 PM
 */
import React, { createRef, useEffect } from "react";
import hoistStatics from "hoist-non-react-statics";

function getScale(width: number) {
  const clientWidth = document.documentElement.clientWidth;
  try {
    return clientWidth / width;
  } catch (e) {
    console.error(e);
    return 1;
  }
}

const BIG_SCREEN_HTML_CLASS = "big-screen-html";
const BIG_SCREEN_BODY_ID = "big-screen-id";

/**
 * 给大屏页面使用，自动适配页面大小
 *
 * @export
 * @template P
 * @param {number} [width=1920]
 * @param {number} [height=1080]
 * @returns
 */
export function scalePage<P>(width: number = 1920 , height: number = 1080) {
  return (component: React.ComponentClass) => {

    const ScaleC = (props: P) => {
      /** 控制 scale 的元素 */
      const scaleNodeRef = createRef<HTMLDivElement>();
      /** 切换大屏页面的htmlclass */
      const setBigScreenHtmlClass = (isBigScreen: boolean) => {
        const currrentHtmlClass = document.documentElement.getAttribute("class") || "";
        const nextHtmlClass = isBigScreen
          ? `${currrentHtmlClass} ${BIG_SCREEN_HTML_CLASS}`
          : currrentHtmlClass.replace(BIG_SCREEN_HTML_CLASS, "");

        document.documentElement.setAttribute("class", nextHtmlClass);
      };

      /** 修改scale */
      const resizeScale = () => {
        const scaleNode = scaleNodeRef.current;
        if (!scaleNode) return;
        scaleNode.style.transform = `scale(${getScale(width)})`;
      };

      useEffect(() => {
        setBigScreenHtmlClass(true);
        window.addEventListener("resize", resizeScale);

        return () => {
          setBigScreenHtmlClass(false);
          window.addEventListener("resize", resizeScale);
        };
      });

      return React.createElement(
        "div",
        {
          style: { width, height, transform: `scale(${getScale(width)})`, transformOrigin: "left top" },
          id: BIG_SCREEN_BODY_ID, ref: scaleNodeRef,
        },
        React.createElement(component, props),
      );
    };

    ScaleC.displayName = `scalePage(${component.displayName || component.name})`;
    ScaleC.WrappedComponent = component;

    return hoistStatics(ScaleC, component);
  };
}

import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Scrollbar.scss";
import { makeLogger } from "ts-loader/dist/logger";

const Scrollbar = React.memo((props) => {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);

  // top  тамба сверху
  const [currentPositionFromTop, setCurrentPositionFromTop] = useState(0);

  const [currentPosition, setCurrentPosition] = useState(0);
  const [scrollbarThumbHeight, setScrollbarThumbHeight] = useState(20);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const { clientHeight, scrollHeight } = contentRef.current;

    const viewableRatio = clientHeight / scrollHeight;
    setScrollbarThumbHeight(viewableRatio * clientHeight);
    scrollRef.current.style.height = `${scrollbarThumbHeight}px`;

    contentRef.current.addEventListener("scroll", handleScrollContent, true);
    return () => {
      contentRef.current.removeEventListener("scroll", handleScrollContent, true);
    };
  }, [contentRef.current]);

  useEffect(() => {
    //scrollRef.current.style.top = `${currentPositionFromTop}px`;
  }, [currentPositionFromTop]);

  const handleScrollContent = (e: any) => {
    const { scrollHeight, scrollTop, offsetHeight } = contentRef.current;
    //console.log(scrollTop, scrollHeight, offsetHeight);
    const newCurrentPosition = (scrollTop / scrollHeight) * offsetHeight;
    //console.log('NEW CURRENT POS', newCurrentPosition);
    setCurrentPositionFromTop(newCurrentPosition);
  };

  const handleThumbMouseDown = useCallback((e) => {
    setCurrentPosition(e.clientY);
    //console.log(e.clientY);
    console.log("MOUSE DOWN", e);
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      e.preventDefault();
      //console.log(e.clientY, e.pageY, e.offsetY);
      if (isDragging) {
        const { scrollHeight, scrollTop, offsetHeight } = contentRef.current;

        const step = e.clientY - currentPosition;
        //const percent = step * (scrollHeight / offsetHeight);
        setCurrentPositionFromTop(Math.min(Math.max(0,currentPositionFromTop + step), offsetHeight - scrollbarThumbHeight));

        setCurrentPosition(e.clientY);

        // contentRef.current.scrollTop = Math.min(
        //   contentRef.current.scrollTop + percent,
        //   scrollHeight - offsetHeight
        // );
        contentRef.current.scrollTop += ((scrollHeight / offsetHeight) * step);
      }
    },
    [isDragging, currentPosition, currentPositionFromTop]
  );

  const handleMouseUp = useCallback(
    (e) => {
      setIsDragging(false);
      console.log("MOUSE UP");
    },
    [isDragging]
  );

  const handleMouseLeave = useCallback(
    (e) => {
      console.log("MOUSE LEAVE");
    },
    [isDragging]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseUp]);

  const testFunc = () => {
    contentRef.current.scrollTop = 50;
  }

  return (
    <div ref={ref} className="container">
      <div className="content" ref={contentRef}>
        {props.children}
      </div>
      <div className="scrollbar">
        <div
          className="scrollbar-thumb"
          ref={scrollRef}
          onMouseDown={handleThumbMouseDown}
          style={{ top: currentPositionFromTop}}
        />
      </div>
      {/*<button*/}
      {/*  onClick={testFunc}*/}
      {/*  style={{ background: "white", position: "absolute", bottom: "100px" }}*/}
      {/*>*/}
      {/*  TEST*/}
      {/*</button>*/}
    </div>
  );
});

export default Scrollbar;

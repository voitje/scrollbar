import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Scrollbar.scss";

const Scrollbar = React.memo((props) => {
  const ref = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
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
    console.log('HEIGHT', scrollbarThumbHeight);
    thumbRef.current.style.height = `${scrollbarThumbHeight}px`;

    contentRef.current.addEventListener("scroll", handleScrollContent, true);
    return () => {
      contentRef.current.removeEventListener("scroll", handleScrollContent, true);
    };
  }, [contentRef.current]);

  const handleScrollContent = (e: any) => {
    const { scrollHeight, scrollTop, offsetHeight } = contentRef.current;
    //console.log(scrollTop, scrollHeight, offsetHeight);
    const newCurrentPosition = (scrollTop / scrollHeight) * offsetHeight;
    //console.log('NEW CURRENT POS', newCurrentPosition);
    setCurrentPositionFromTop(newCurrentPosition);
  };

  const handleThumbMouseDown = useCallback((e) => {
    e.stopPropagation();
    console.log('handleThumbMouseDown');
    setCurrentPosition(e.clientY);
    //console.log(e.clientY);
    //console.log("MOUSE DOWN", e);
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
        console.log('MOUSE MOVE THIMB HEIGHT', scrollbarThumbHeight);
        setCurrentPositionFromTop(Math.min(Math.max(0,currentPositionFromTop + step), offsetHeight - scrollbarThumbHeight));

        setCurrentPosition(e.clientY);

        // contentRef.current.scrollTop = Math.min(
        //   contentRef.current.scrollTop + percent,
        //   scrollHeight - offsetHeight
        // );
        contentRef.current.scrollTop += ((scrollHeight / offsetHeight) * step);
      }
    },
    [isDragging, currentPosition, scrollbarThumbHeight, currentPositionFromTop]
  );

  const handleMouseUp = useCallback(
    (e) => {
      setIsDragging(false);
      //console.log("MOUSE UP");
    },
    [isDragging]
  );

  const handleMouseLeave = useCallback(
    (e) => {
      //console.log("MOUSE LEAVE");
    },
    [isDragging]
  );

  const handleMouseDownScrollBar = useCallback((e: any) => {
    console.log('handleMouseDownScrollBar');
    //console.log('MOUSE DOWN', e.offsetY, scrollbarThumbHeight );
    const { scrollHeight, scrollTop, offsetHeight } = contentRef.current;
    //setCurrentPosition(e.clientY);
    //console.log(e.offsetY < scrollbarThumbHeight);
    contentRef.current.scrollTop = e.offsetY < scrollbarThumbHeight
      ? (e.offsetY * scrollHeight) / offsetHeight
      : (e.offsetY * scrollHeight) / offsetHeight - (scrollbarThumbHeight / 2);
    //console.log(currentPosition);
  }, [currentPosition, scrollbarThumbHeight]);

  const handleClickScrollBar = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('CLICK', scrollbarThumbHeight);
  }

  // useEffect(() => {
  //   console.log('CHE BUDET', scrollbarThumbHeight);},[scrollbarThumbHeight])

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

  useEffect(() => {
    scrollBarRef.current.addEventListener('mousedown',  handleMouseDownScrollBar);
    scrollBarRef.current.addEventListener('click', () => handleClickScrollBar);
    return () => {
      scrollBarRef.current.removeEventListener('mousedown', handleMouseDownScrollBar);
      scrollBarRef.current.removeEventListener('click', () => handleClickScrollBar)
    }
  }, [scrollBarRef, scrollbarThumbHeight])

  useEffect(() => {
    thumbRef.current.addEventListener('mousedown', handleThumbMouseDown);
    return () => {
      thumbRef.current.removeEventListener('mousedown', handleThumbMouseDown)
    }
  }, [thumbRef])

  const testFunc = () => {
    contentRef.current.scrollTop = 50;
  }

  return (
    <div ref={ref} className="container">
      <div className="content" ref={contentRef}>
        {props.children}
      </div>
      <div
        className="scrollbar"
        ref={scrollBarRef}
      >
        <div
          className="scrollbar-thumb"
          ref={thumbRef}
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

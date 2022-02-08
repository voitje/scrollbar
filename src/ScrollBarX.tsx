import React, { useCallback, useEffect, useRef, useState } from "react";
import "./ScrollbarX.scss";

const ScrollbarX = React.memo((props) => {
  const ref = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);

  // top  тамба сверху
  const [currentPositionFromLeft, setCurrentPositionFromLeft] = useState(0);

  const [currentPosition, setCurrentPosition] = useState(0);
  const [scrollbarThumbWidth, setScrollbarThumbWidth] = useState(20);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const { clientWidth, scrollWidth } = contentRef.current;

    const viewableRatio = clientWidth / scrollWidth;
    setScrollbarThumbWidth(viewableRatio * clientWidth);
    thumbRef.current.style.width = `${scrollbarThumbWidth}px`

    contentRef.current.addEventListener("scroll", handleScrollContent, true);
    return () => {
      contentRef.current.removeEventListener("scroll", handleScrollContent, true);
    };
  }, [contentRef.current]);




  // scroll на колесико
  const handleScrollContent = (e: any) => {
    const { scrollWidth, scrollLeft, offsetWidth } = contentRef.current;
    const newCurrentPosition = (scrollLeft / scrollWidth) * offsetWidth;
    setCurrentPositionFromLeft(newCurrentPosition);
  };

  // зажатие на тхамб
  const handleThumbMouseDown = useCallback((e) => {
    e.stopPropagation();
    console.log('handleThumbMouseDown');
    setCurrentPosition(e.clientX);
    //console.log(e.clientY);
    //console.log("MOUSE DOWN", e);
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      e.preventDefault();
      if (isDragging) {
        const { scrollWidth, scrollLeft, offsetWidth } = contentRef.current;

        const step = e.clientX - currentPosition;
        setCurrentPositionFromLeft(Math.min(Math.max(0,currentPositionFromLeft + step), offsetWidth - scrollbarThumbWidth));
        setCurrentPosition(e.clientX);
        contentRef.current.scrollLeft += ((scrollWidth / offsetWidth) * step);
      }
    },
    [isDragging, currentPosition, scrollbarThumbWidth, currentPositionFromLeft]
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
    // const { scrollHeight, scrollTop, offsetHeight } = contentRef.current;
    // contentRef.current.scrollTop = e.offsetY < scrollbarThumbWidth
    //   ? (e.offsetY * scrollHeight) / offsetHeight
    //   : (e.offsetY * scrollHeight) / offsetHeight - (scrollbarThumbWidth / 2);

    const { scrollWidth, scrollLeft, offsetWidth } = contentRef.current;
    contentRef.current.scrollLeft = e.offsetX < scrollbarThumbWidth
      ? (e.offsetX * scrollWidth) / offsetWidth
      : (e.offsetX * scrollWidth) / offsetWidth - (scrollbarThumbWidth / 2);
  }, [currentPosition, scrollbarThumbWidth]);

  const handleClickScrollBar = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('CLICK', scrollbarThumbWidth);
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
    if(scrollBarRef.current && contentRef.current) {
      //scrollBarRef.current.style.width = contentRef.current.style.width;
      console.log('????', scrollBarRef.current.style.width, contentRef.current.style.width);
    }

    scrollBarRef.current.addEventListener('mousedown',  handleMouseDownScrollBar);
    scrollBarRef.current.addEventListener('click', () => handleClickScrollBar);
    return () => {
      scrollBarRef.current.removeEventListener('mousedown', handleMouseDownScrollBar);
      scrollBarRef.current.removeEventListener('click', () => handleClickScrollBar)
    }
  }, [scrollBarRef, scrollbarThumbWidth])

  useEffect(() => {
    thumbRef.current.addEventListener('mousedown', handleThumbMouseDown);
    return () => {
      thumbRef.current.removeEventListener('mousedown', handleThumbMouseDown)
    }
  }, [thumbRef])

  useEffect(() => {
    if(scrollBarRef.current && contentRef.current) {
      scrollBarRef.current.style.width = `${contentRef.current.offsetWidth}px`;
      console.log('????', scrollBarRef.current.offsetWidth, contentRef.current.offsetWidth);
    }
  }, [scrollBarRef, contentRef])

  const testFunc = () => {
    contentRef.current.scrollTop = 50;
  }

  return (
    <div ref={ref} className="containerX">
      <div className="contentX" ref={contentRef}>
        {props.children}
      </div>
      <div
        className="scrollbarX"
        ref={scrollBarRef}
      >
        <div
          className="scrollbarX-thumb"
          ref={thumbRef}
          style={{ left: currentPositionFromLeft}}
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

export default ScrollbarX;

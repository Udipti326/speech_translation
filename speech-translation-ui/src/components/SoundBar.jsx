import React, { useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import music from "../assets/u-said-it-v13-1167.mp3";

const Box = styled.div`
  display: flex;
  cursor: pointer;
  z-index: 25;

  & > *:nth-child(1) {
    animation-delay: 0.2s;
  }
  & > *:nth-child(2) {
    animation-delay: 0.3s;
  }
  & > *:nth-child(3) {
    animation-delay: 0.4s;
  }
  & > *:nth-child(4) {
    animation-delay: 0.5s;
  }
  & > *:nth-child(5) {
    animation-delay: 0.6s;
  }
`;

const play = keyframes`
    0% {
        transform: scaleY(1);
    }
    50% {
        transform: scaleY(2);
    }
    100% {
        transform: scaleY(1);
    }

`;

const Line = styled.span`
  background: #000000;
  border: 1px solid #FCF6F4;
  animation: ${play} 1s ease infinite;
  height: 1rem;
  width: 4px;
  margin: 0 0.1rem;
  animation-play-state: ${(props) => (props.click ? "running" : "paused")};
`;

function SoundBar(props) {
  const ref = useRef(null);
  const [click, setClick] = useState(true);

  const handleClick = () => {
    setClick(!click);

    if (!click) ref.current.play();
    else ref.current.pause();
  };
  return (
    <Box onClick={() => handleClick()} id="sound-bar-icon">
      <Line click={click} />
      <Line click={click} />
      <Line click={click} />
      <Line click={click} />
      <Line click={click} />

      <audio src={music} ref={ref} loop />
    </Box>
  );
}

export default SoundBar;
import React from "react";

// background: linear-gradient(135deg,#fa00ff,#00e0ff 50%,#fa00ff);
// animation: vZKGD 3s linear infinite alternate-reverse;

function GradientText({ text }) {
  const customStyle = {
    // background: "linear-gradient(135deg,#fa00ff,#00e0ff 50%,#fa00ff)",
    // animation: "3s linear infinite alternate-reverse",
    // animationPlayState: "paused",
    // backgroundClip: "text",
    // backgroundSize: "500%",
    // color: "#0000",
  };
  return (
    <div className=" fs-6 link-primary" style={customStyle}>
      {text}
    </div>
  );
}

export default GradientText;

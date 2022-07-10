// YJS with React.JS using y-webrtc
import React, { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { v4 as uuidv4 } from "uuid";
import { WebrtcProvider } from "y-webrtc";
import { getDeltaOperations } from "../yfs/deltas";

export default function Editor() {
  const doc = useRef(new Y.Doc());
  const oldContent = useRef("");
  const sharedString = useRef(doc.current.getText());
  const [inputValue, setInputValue] = useState(
    sharedString.current.toString() ?? ""
  );

  useEffect(() => {
    new WebrtcProvider(uuidv4(), doc.current);
    if (oldContent.current.length > 0) {
      setInputValue(oldContent.current);
    }
    sharedString.current.observe((YEvent) => {
      setInputValue(sharedString.current.toString());
    });
  }, []);

  const handleChange = (e) => {
    const deltas = getDeltaOperations(oldContent.current, e.target.value);
    sharedString.current.applyDelta(deltas);

    oldContent.current = e.target.value;
  };

  return (
    <>
      <p>Basic textarea with YJS </p>
      <p>Type something:</p>
      <textarea
        value={inputValue}
        onChange={handleChange}
        style={{ width: "100%", height: "100%" }}
      />
    </>
  );
}

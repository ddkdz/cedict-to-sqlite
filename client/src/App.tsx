import React, { useState } from "react";
import styled from "styled-components";
import './App.css';

const server = "http://localhost:8090";
const containeBorderRadius = "15px";
const ccedictDefaultUrl = "https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip";

const Container = styled.div`
  width: 50%;
  position: fixed;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  border-radius: ${containeBorderRadius};
  border: 2px solid palevioletred;
  padding: 20px;
  color: palevioletred;
  display:inline-block;
`;
 
const SubSection = styled.section`
  background: palevioletred;
  color: #282c34;
  border-radius: ${containeBorderRadius};
  padding: 20px;
  margin-bottom: 20px;
  display: inline-block;
  box-sizing: border-box;
  width: 100%;
`;

const UrlInput = styled.input`
  border-radius: 3px;
  border: 1px solid palevioletred;
  display: block;
  width: 100%;
  margin: 0 0 1em;
  padding: 20px;
  ::placeholder {
    color: palevioletred;
  }
  background-color: #282c34;
  border-radius: ${containeBorderRadius};
  color: palevioletred;
  font-size: 14px;
  box-sizing: border-box;
`;

const Button = styled.button`
  cursor: pointer;
  background: transparent;
  font-size: 16px;
  border-radius: 15px;
  color: palevioletred;
  border: 2px solid palevioletred;
  padding: 0.25em 1em;
  transition: 0.5s all ease-out;
  &:hover {
    background-color: palevioletred;
    color: white;
  }
  float: right;
`;

const BulletedSubTitle = (props: {number: string, text: string}) => {
  return (
    <h2><span className="circle">{props.number}</span>{props.text}</h2>
  );
};

const App = () => {
  const [urlValue, setUrl] = useState(ccedictDefaultUrl);
  const [processing, setProcessing] = useState(false);
  
  const generateDatabaseFile = async () => {
    setProcessing(true);
   
    const response = await fetch(server + "/v1/files/upload", {
      method: "POST",
      headers : {
        "Content-Type" : "application/json;charset=utf-8"
      },
      body: JSON.stringify({cedictUrl: urlValue})
    });
 
    if (response.ok) {
      const result = await response.json();
      window.open(server + "/v1/files/download?file=" + result.dbFile, "_blank");
      setProcessing(false);
    } else {
      setProcessing(false);
      alert("HTTP Error: " + response.status);
    }
  };

  return (
      <Container>

        <h1>CC-CEDICT &#8594; Sqlite3</h1>

        <SubSection>
          <BulletedSubTitle number="1" text="Use the URL below or provide another URL to a CC-CEDICT archive."></BulletedSubTitle>
          <UrlInput type="text" value={urlValue} onChange={event => {setUrl(event.target.value)}}></UrlInput>
        </SubSection> 
  
        <SubSection>
          <BulletedSubTitle number="2" text="Click Generate to download a Sqlite3 database."></BulletedSubTitle>
        </SubSection> 

        <Button disabled={processing} onClick={event => {generateDatabaseFile()}}>{processing ? "Processing..." : "Generate"}</Button>

      </Container>
  );
};

export default App;
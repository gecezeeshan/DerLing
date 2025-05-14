import React from 'react'   

const translation = () => {
  const [translation, setTranslation] = useState("");
  const [result, setResult] = useState("");
  const [translate, setTranslate] = useState("");


    
  const handleTranslate = async () => {
    if (translate) {
      let _translate = await getExampleSentence(translate);
      setTranslated(_translate);
    } else {
      setTranslated("Please enter a word to translate.");
    }
  };

  const handleClear = async () => {
    setTranslate("");
    setTranslated("");
    setTranslation("");
  };

  const handleTranslateToDutch = async () => {
    if (translate) {
      let _translate = await getDutchFromEnglish(translate);
      setTranslated(_translate);
    } else {
      setTranslated("Please enter a word to translate.");
    }
  };

  const handleTranslateToArabic = async () => {
    if (translate) {
      let _translate = await getArabicFromEnglish(translate);
      setTranslated(_translate);
    } else {
      setTranslated("Please enter a word to translate.");
    }
  };

  const getExampleSentence = async (word) => {
    try {
      const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=de&tl=en&q=${encodeURIComponent(word)}`;
      const response = await axios.get(url);
      return JSON.stringify(response.data[0]);
      //setTranslation();
    } catch (error) {
      console.error("Translation error", error);
      return "Failed to translate.";
      //setTranslation("Failed to translate.");
    }
  };



  const getDutchFromEnglish = async (word) => {
    try {
      const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=de&q=${encodeURIComponent(word)}`;
      const response = await axios.get(url);
      return JSON.stringify(response.data[0]);
      //setTranslation();
    } catch (error) {
      console.error("Translation error", error);
      return "Failed to translate.";
      //setTranslation("Failed to translate.");
    }
  };



  const getArabicFromEnglish = async (word) => {
    try {
      const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=ar&q=${encodeURIComponent(word)}`;
      const response = await axios.get(url);
      return JSON.stringify(response.data[0]);
      //setTranslation();
    } catch (error) {
      console.error("Translation error", error);
      return "Failed to translate.";
      //setTranslation("Failed to translate.");
    }
  };


  return (
    <>
      <div className="">Quick Translate</div>
            <textarea className="input" value={translate} onChange={(e) => setTranslate(e.target.value)} style={{ width: "80%" }} >

            </textarea>
            {/* <input type="text" className="input" value={translate} onChange={(e) => setTranslate(e.target.value)} /> */}
            <button onClick={() => handleClear()} style={{ margin: 5, padding: 10 }}>
              Clear
            </button>
            <button onClick={() => handleTranslate()} style={{ margin: 5, padding: 10 }}>
              To English
            </button>
            <button onClick={() => handleTranslateToDutch()} style={{ margin: 5, padding: 10 }}>
              To Dutch
            </button>
            <button onClick={() => handleTranslateToArabic()} style={{ margin: 5, padding: 10 }}>
              To Arabic
            </button>
            {translated && (
              <>
                <center>
                  <div className="tranlationDiv">{translated}</div>
                </center>
              </>
            )}
            </>


  )
}

export default translation
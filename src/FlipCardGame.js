import { useEffect, useState } from "react";
import './FlipCardGame.css';
import axios from "axios";


const FlipCardGame = ({ items, lang, onFinish }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [knownCount, setKnownCount] = useState(0);
    const [unknownCount, setUnknownCount] = useState(0);
    const [translation, setTranslation] = useState("");

    if (!items || items.length === 0) return <div>Loading words...</div>;

    const currentWord = items[currentIndex];

    useEffect(() => {
        const fetchTranslation = async () => {
            const currentWord = items[currentIndex];
            const text = lang === "de" ? currentWord.usage : currentWord.arabicUsage;

            try {
                const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${lang}&tl=en&q=${encodeURIComponent(text)}`;
                const response = await axios.get(url);
                const translated = response.data?.[0];
                setTranslation(translated ? JSON.stringify(translated).replace(/"/g, "") : "No translation found.");
            } catch (error) {
                console.error("Translation fetch error:", error);
                setTranslation("⚠️ Failed to fetch translation.");
            }
        };

        if (items && items.length > 0) {
            fetchTranslation();
        }


    }, [currentIndex, lang, items]);

    const handleFlip = () => setIsFlipped(!isFlipped);



    const getExampleSentence = async (word) => {
        try {
            const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=de&tl=en&q=${encodeURIComponent(word)}`;
            const response = await axios.get(url);
            return JSON.stringify(response.data[0]);
        } catch (error) {
            console.error("Translation error", error);
            return "Failed to translate.";
        }
    };


    const handleAnswer = async (known) => {
        if (known) setKnownCount(prev => prev + 1);
        else setUnknownCount(prev => prev + 1);

        setIsFlipped(false); // reset flip state

        if (currentIndex < items.length - 1) {

            const fetchTranslation = async () => {
                let currentWord1 = items[currentIndex];
                let _translate = await getExampleSentence(currentWord1.usage);
                setTranslation(_translate.replace(/"/g, ""));
            }
            setCurrentIndex(prev => prev + 1);
            fetchTranslation();
        } else {
            onFinish?.({
                known: knownCount + (known ? 1 : 0),
                unknown: unknownCount + (known ? 0 : 1),
                total: items.length
            });
        }

    };

    return (
        <div className="flip-card-container">

            {/* ✅ SCORE INFO */}
            <div style={{ marginBottom: 15, fontWeight: "bold" }}>
                Word {currentIndex + 1} / {items.length} | ✅ Known: {knownCount} | ❌ Don't Know: {unknownCount}
            </div>

            <div className={`flip-card ${isFlipped ? "flipped" : ""}`} onClick={handleFlip}>
                <div className="flip-card-front">
                    <h2>{lang === "de" ? currentWord.german : currentWord.arabic}</h2>
                </div>
                <div className="flip-card-back">
                    <h3 style={{ marginBottom: "8px" }}>{currentWord.english}</h3>
                    <p style={{ fontStyle: "italic", fontSize: 14, marginTop: 0 }}>
                        {lang === "de" ? currentWord.usage : currentWord.arabicUsage}
                    </p>
                    <pre className="translationEnglish">{translation}</pre>
                </div>
            </div>

            <div style={{ marginTop: 20 }}>
                <button onClick={() => handleAnswer(true)} style={{ margin: 5, padding: 10 }}>I Know</button>
                <button onClick={() => handleAnswer(false)} style={{ margin: 5, padding: 10 }}>I Don't Know</button>
            </div>
        </div>
    );
};

export default FlipCardGame;

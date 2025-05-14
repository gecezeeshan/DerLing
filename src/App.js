import './App.css';
import DerTranslate from "./DerTranslate";
import DerGame from "./DerGame";

export default function VocabGame() {



  return (
    <>

      <div className="container">
        <div className="row">
          <div className="column">
            <>
              <DerGame></DerGame>
            </>
          </div>
          <div className="column">

            <DerTranslate></DerTranslate>


          </div>
        </div>
      </div>


    </>
  );
}

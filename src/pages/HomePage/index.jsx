import React, { useState,useEffect} from "react";
import MyPopup from "../../components/popup";
import GoogleTranslate from '../../components/GoogleTranslate';


const HomePage = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <>
      <GoogleTranslate/>
      <img src="img/block_4.png" />
      <div className="card-text">
          <p className="card-type">Review Request</p>
          <h4><img src="img/block_lock.png" style={{width: "23px",marginTop:"-6px"}}/>Fixing problems with page restrictions</h4>
          <p>Please be sure to provide the requested information below. Failure to provide this information may delay the processing of your appeal.</p>
          <div className="btn-wrapper">
              <div onClick={handleSubmit} id="start" className="button fb-blue w-100">
                 Request review
              </div>
          </div>
      </div>
      <MyPopup isOpen={isPopupOpen} onClose={closePopup} />
    </>
);
}

export default HomePage;

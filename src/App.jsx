import { useState } from 'react'
import './App.css'
import APIForm from './components/APIForm';

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;


function App() {
  const [count, setCount] = useState(0)

  const [inputs, setInputs] = useState({
    url: "",
    format: "",
    no_ads: "",
    no_cookie_banners: "",
    width: "",
    height: "",
  });


  const submitForm = () => {
    let defaultValues = {
      format: "jpeg",
      no_ads: "true",
      no_cookie_banners: "true",
      width: "1920",
      height: "1080",
    };

    let validInputs = { ...inputs };

    if (inputs.url === "" || inputs.url === " ") {
      alert("You forgot to submit an url!");
    } else {
      
      for (const [key, value] of Object.entries(validInputs)) {
        if (value == "" || (key === "width" && (isNaN(value) || value < 0 || value > 7680)) || (key === "height" && (isNaN(value) || value < 0 || value > 4320))) {
          validInputs[key] = defaultValues[key]
        }
      }
      makeQuery(validInputs);
    }
  }
  
  const makeQuery = (validInputs) => {
    let wait_until = "network_idle";
    let response_type = "json";
    let fail_on_status = "400%2C404%2C500-511";
    let url_starter = "https://";
    let fullURL = url_starter + validInputs.url;
    let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${validInputs.format}&width=${validInputs.width}&height=${validInputs.height}&no_cookie_banners=${validInputs.no_cookie_banners}&no_ads=${validInputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;
    callAPI(query).catch(console.error);
  }


  

  const [currentImage, setCurrentImage] = useState(null);

  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();
    console.log(json);
    if (json.url == null) {
      alert("Oops! Something went wrong with that query, let's try again!")
        }
    else {
      setCurrentImage(json.url);
      reset();
    }
  }


  const reset = () => {
    setInputs({
      url: "",
      format: "",
      no_ads: "",
      no_cookie_banners: "",
      width: "",
      height: "",
    });
  }


  return (
    <>
      <div className="whole-page">
        <h1>Build Your Own Screenshot! 📸</h1>
        
        <APIForm
          inputs={inputs}
          handleChange={(e) =>
            setInputs((prevState) => ({
              ...prevState,
              [e.target.name]: e.target.value.trim(),
            }))
          }
          onSubmit={submitForm}
          currentImage={currentImage}
        />
        <br></br>

      </div>

    </>
  )
}

export default App

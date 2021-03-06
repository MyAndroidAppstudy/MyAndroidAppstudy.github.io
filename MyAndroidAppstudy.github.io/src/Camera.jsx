import React, { useState, useRef, useEffect } from "react";
import { Camera } from "react-camera-pro";
import "./App.css";
import axios from 'axios';
import * as tf from "@tensorflow/tfjs";
import { Navigate, useNavigate } from "react-router";
import * as tmImage from '@teachablemachine/image';
//import { model } from "@tensorflow/tfjs";
import Resizer from "react-image-file-resizer";
import Modal from "./Modal";
import styled from "styled-components";
import asdf from "./Loginpage"

import tempimage from "./showExampleImg.png"
import finishPage_zepeto from "finishPage_zepeto";

const Wrapper = styled.div`
  background-position: center;
  
  width: 70%;
  height: 70%;
  left:0px;
  right:0px;
  margin: auto 0;
  margin-top: 2rem;
  margin-bottom :2rem;
    z-index: 1;
`;
const FullScreenImagePreview = styled.div`
  width: 100%;
  height: 100%;
  z-index: 100;
  position: absolute;
  background-color: black;
  ${({ image }) => (image ? `background-image:  url(${image});` : '')}
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const Component = () => {

  const camera = useRef(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [selectedFile, setSelectedFile] = useState('');
  const [image, setImage] = useState(tempimage);
  const navigate = useNavigate();
  const [showImage, setShowImage] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [Check, setCheck] = useState(false);
  const [Check2, setCheck2] = useState(false);
  const canvasRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(true);
  const [readyModalOpen, setReadyModalOpen] = useState(false);
  const [readyModalOpen2, setReadyModalOpen2] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  }; 
  const readyCloseModal = () => {
    setReadyModalOpen(false);
  }
  const readyCloseModal2 = () => {
    setReadyModalOpen2(false);
  }
  //const [photo,setPhoto] = useState('');

  // teachable machine ?????? ???????????? ??????
  const URL = "https://teachablemachine.withgoogle.com/models/7TVFokN0L/";
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  const [predictionArr, setPredictionArr] = useState([]);
  let maxPredictions;
  let model;
  let imagenametemp;
  //?????? ??????
  const todayTime = () => {
    let now = new Date().toString();
    return now;
  }
  // ????????? resize

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        416,
        416,
        "PNG",
        122,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });


  async function init() {
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

  }



  async function predict() {


    setCheck2(false);
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();



    // image png ??? ?????? ??? -> predict ??? ?????? ???????????? ?????????? or  base64 ????????? ????????????????


    const tempImg = document.getElementById('srcImg');
    const prediction = await model.predict(tempImg, false);

    for (let i = 0; i < maxPredictions; i++) {
      const classPrediction = prediction[i].probability;
      console.log(prediction[i].className + ": " + classPrediction);
      //console.log(prediction[i].probability);
    }
    
    
    if (prediction[0].probability >= 0.0) {
      setCheck(true);
      
      // alert("?????? ???????????????! ????????? ???????????? ????????? ???????????????!")
      //submit();
      setReadyModalOpen(true);
    }
    else {
      setCheck(false);

      //alert("?????? ?????? ?????????");
      setReadyModalOpen2(true);
    }
    setCheck2(true);
  }

  const dataURLtoFile = (dataurl, fileName) => {

    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  }

  const submit = async () => {
    if (Check == true) {
      // ?????? ?????? ?????? ?????? 
      console.log(image);
      const convertedFile = dataURLtoFile(image, "anonymous" + ".png");
      console.warn(convertedFile);

      //?????? ????????? ??????
      const file = convertedFile;
      const imagetemp = await resizeFile(file);
      console.log(imagetemp);

      const newFile = dataURLtoFile(imagetemp, "tempo" + ".png");
      

     if(typeof window !== "undefined"){
        window.sessionStorage.setItem("image", imagetemp);
        //window.sessionStoarage.setItem("imageName",imagetemp.name)
       // window.location.href = "/YoloPage";
      }


      // ????????? ????????? ???????????? ???????????? ????????? ???????????? ?????? ?????????.
      const data = new FormData();
      data.append('file', newFile);
      console.warn(newFile);

      let url = "/uploader";

      axios.post(url, data, {
        // ????????? formdata??? posting ??????
      })
        .then(res => {
          //?????? ??????
          console.warn(res);
        }).catch(err => {
          console.log(err);
        });


      setTimeout(() => {
       // navigate('/Loading');
       navigate('/YoloPage');
      }, 2000);
    }
    else {
      if(Check2 == false)
      alert("????????? ????????? ?????????!")
      else if(Check == false)
      alert("????????? ?????? ????????? ?????? ?????? ?????????!")
    }
  }
  console.log(readyModalOpen);

  return (

    <div>
      {showImage ? (

        <div className="App-header3">
          {readyModalOpen && <Modal open close={readyCloseModal} header= "?????? ???????????????!">
            ?????? ???????????????! ????????? ???????????? ????????? ???????????????!
          </Modal>}
          {readyModalOpen2 && <Modal open close={readyCloseModal2} header= "?????? ???????????????!">
          ????????? ???????????? ???????????? ?????? ?????? ?????????!
          </Modal>}
          <Wrapper>
            <img id="srcImg"
              className="temp" src={image} alt='????????? ????????????'>
            </img>
          </Wrapper>
          <button type="submit" className="buttonshow_camera2"
            onClick={() => submit()}> ?????????</button>
          <button type="submit" className="buttonshow_camera2"
            onClick={() => setShowImage(false)}> ?????? ??????</button>

        </div>

      ) : (
        <div className="App-header3">
          <Modal open={modalOpen} close={closeModal} header= "?????? ?????? ??????">
          ?????? ???????????? ???????????????!
            <img  style={{ width: "100%", height: "100%x" }} src = {tempimage}></img>
          </Modal>
          <Wrapper>
            <Camera ref={camera} className="temp"
              numberOfCamerasCallback={setNumberOfCameras}
              aspectRatio={1 / 1}
              facingMode='environment'
              errorMessages={{
                noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
                permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                switchCamera:
                  'It is not possible to switch camera to different one because there is only one video device accessible.',
                canvas: 'Canvas is not supported.',
              }}
            />
          </Wrapper>


          <button className="buttonshow_camera"
            onClick={() => {
              const photo = (camera.current.takePhoto());
              setImage(photo);
              setShowImage(true);
              predict();

            }}

          > ?????? ??????</button>

          <button className="buttonshow_camera"
            hidden={numberOfCameras <= 1}
            onClick={() => {
              const photo = (camera.current.switchCamera());
              setImage(photo);
              predict();
            }}
          >????????? ?????? </button>

        </div>
      )
      }
    </div>

  );
}

export default Component;
const video=document.getElementById("video")


Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExressionNet.loadFromUri("/models")
]).then(startVideo());

function startVideo(){
    return false; /*act/inact yap*/
    navigator.getUserMedia({
        video:{}
    },
    stream =>(video.srcObject=stream), err=>console.log(err));
}
// 100 ms bir api üzerinden bilgiler çekicek 
video.addEventListener("play",()=>{
    const canvas=faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const boxSize={
        width:video.width,
        height:video.height,
     };
     faceapi.matchDimensions(canvas,boxSize);

    setInterval(async()=>{
        const detections=await faceapi.detecAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        canvas.getContext("2d").clearRect(0,0, canvas.width, canvas.height);
        const resizedDetections=faceapi.resizedResults(detections, boxSize );
        faceapi.draw.drawDetections(canvas,resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    },100)

});

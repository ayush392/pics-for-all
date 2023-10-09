const multer = require("multer");
const firebase = require("firebase/app");
const fbStorage = require("firebase/storage");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const storage = fbStorage.getStorage(app);
const upload = multer({ storage: multer.memoryStorage() });

const getImageURL = async (req) => {
  console.log(req, "firebase22");
  const storageRef = fbStorage.ref(
    storage,
    `files/${req.file.filename + " " + Date()}`
  );

  const metadata = {
    contentType: req.file.mimetype,
  };

  // Upload the file in the bucket storage
  const snapshot = await fbStorage.uploadBytesResumable(
    storageRef,
    req.file.buffer,
    metadata
  );
  //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

  // Grab the public url
  const downloadURL = await fbStorage.getDownloadURL(snapshot.ref);

  return downloadURL;
};

module.exports = { storage, upload, getImageURL };

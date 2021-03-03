import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import "firebase/analytics";

/**
 * @author 박진호
 * @version 1.0
 * @summary firebase 설정 파일
 */

var firebaseConfig = {
  apiKey: "AIzaSyCXSgDJHxhc7C7i5xxUghDhP4dwkNvdvHU",
  authDomain: "project-for-developer.firebaseapp.com",
  databaseURL: "https://project-for-developer-default-rtdb.firebaseio.com",
  projectId: "project-for-developer",
  storageBucket: "project-for-developer.appspot.com",
  messagingSenderId: "779772457500",
  appId: "1:779772457500:web:7c2e6be322d9dac1c4a5d9",
  measurementId: "G-MJ3SQW1H2S",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  // firebase.analytics();
} else {
  firebase.app();
}

export default firebase;

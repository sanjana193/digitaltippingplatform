// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyANFMLhxnMiKWiW_TeV_2irswBONJogux8",
    authDomain: "digitaltipping.firebaseapp.com",
    projectId: "digitaltipping",
    storageBucket: "digitaltipping.appspot.com",
    messagingSenderId: "1028902624608",
    appId: "1:1028902624608:web:101410a2bbd20316701205",
    measurementId: "G-HHTG6R4CH6"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // Function to fetch and display user data
  function fetchUserData() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        const db = firebase.firestore();
        const userRef = db.collection("users").doc(user.uid);
  
        userRef.get().then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            // Update HTML with user data
            document.getElementById("profile-name").textContent = userData.name;
            document.getElementById("profile-email").textContent = userData.email;
            document.getElementById("profile-payment-id").textContent = userData.paymentId;
  
            // Display profile photo if available
            if (userData.photoURL) {
              const profileImg = document.getElementById("profile-img");
              profileImg.src = userData.photoURL;
              profileImg.alt = "Profile Picture";
            }
  
            // Display points and badges dynamically
            document.getElementById("userPoints").textContent = userData.points;
            document.getElementById("badge1").textContent = userData.badge1;
            document.getElementById("badge2").textContent = userData.badge2;
          } else {
            console.log("No such document!");
          }
        }).catch((error) => {
          console.error("Error fetching document: ", error);
        });
      } else {
        // No user is signed in.
        console.log("No user signed in.");
      }
    });
  }
  
  // Call fetchUserData when the page loads
  document.addEventListener("DOMContentLoaded", function() {
    fetchUserData();
  });
  
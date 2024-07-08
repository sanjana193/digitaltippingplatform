// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyANFMLhxnMiKWiW_TeV_2irswBONJogux8",
  authDomain: "digitaltipping.firebaseapp.com",
  projectId: "digitaltipping",
  storageBucket: "digitaltipping.appspot.com",
  messagingSenderId: "1028902624608",
  appId: "1:1028902624608:web:101410a2bbd20316701205",
  measurementId: "G-HHTG6R4CH6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to Firebase services
var auth = firebase.auth();
var firestore = firebase.firestore();
var storage = firebase.storage();

// Function to fetch user data from Firestore
function fetchUserDataMenu() {
  var userId = firebase.auth().currentUser.uid;
  var docRef = firebase.firestore().collection("users").doc(userId);

 // Example of using Firestore real-time listener
 docRef.get().then((doc) => {
  if (doc.exists) {
    var userData = doc.data();
    console.log("User Data Retrieved:", userData);
    updateProfileMenu(userData);
  } else {
    console.log("No such document!");
  }
}).catch((error) => {
  console.error("Error getting document:", error);
});
}
// Function to update profile section in HTML
function updateProfileMenu(userData) {
  var profilePhotoElement = document.getElementById("profile-photo");
  var profileNameElement = document.getElementById("user-name");
  var profileEmailElement = document.getElementById("user-email");
  var loyaltyPointsElement = document.getElementById("loyaltyPoints");

  console.log("Profile Photo Element:", profilePhotoElement); // Log profilePhotoElement
  console.log("Profile Name Element:", profileNameElement); // Log profileNameElement
  console.log("Profile Email Element:", profileEmailElement); // Log profileEmailElement
  console.log("Loyalty Points Element:", loyaltyPointsElement); // Log loyaltyPointsElement

  profilePhotoElement.src = userData.profilePhoto || "images/default-profile.png";
  profileNameElement.textContent = userData.name || "Name";
  profileEmailElement.textContent = userData.email || "Email";
  loyaltyPointsElement.textContent = userData.loyaltyPoints || "0";
}

// Monitor authentication state changes
auth.onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in
    console.log("User is signed in:", user.uid);
    fetchUserDataMenu(); // Fetch user data
  } else {
    // No user is signed in
    console.log("No user signed in.");
    // Handle this case if necessary
  }
});
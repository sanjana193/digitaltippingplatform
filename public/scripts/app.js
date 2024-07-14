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
function fetchUserData(userId) {
  var userRef = firestore.collection("users").doc(userId);

  userRef.get().then(function(doc) {
    if (doc.exists) {
      var userData = doc.data();
      // Update profile section in HTML
      updateProfile(userData);
    } else {
      console.log("No such document!");
    }
  }).catch(function(error) {
    console.log("Error getting document:", error);
  });
}

// Function to update profile section in HTML
function updateProfile(userData) {
  var profilePhotoElement = document.getElementById("profile-photo");
  var profileNameElement = document.getElementById("user-name");
  var profileEmailElement = document.getElementById("user-email");
  var loyaltyPointsElement = document.getElementById("loyaltyPoints");

  profilePhotoElement.src = userData.profilePhoto || "images/default-profile.png";
  profileNameElement.textContent = userData.name || "Name";
  profileEmailElement.textContent = userData.email || "Email";
  loyaltyPointsElement.textContent = `Points Earned: ${user.loyaltyPoints || 0}`;
}

// Monitor authentication state changes
auth.onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in, fetch user data
    fetchUserData(user.uid);
  } else {
    // No user is signed in
    console.log("No user signed in.");
  }
});

function logout() {
  auth.signOut().then(() => {
      console.log('User signed out.');
      // Redirect to sign-in page
      window.location.href = 'index.html';
  }).catch((error) => {
      console.error('Error signing out: ', error);
  });
}

// Add event listener to logout button
document.querySelector('.logout').addEventListener('click', (e) => {
  e.preventDefault();
  logout();
});

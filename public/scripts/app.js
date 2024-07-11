// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth-compat.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore-compat.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANFMLhxnMiKWiW_TeV_2irswBONJogux8",
  authDomain: "digitaltipping.firebaseapp.com",
  projectId: "digitaltipping",
  storageBucket: "digitaltipping.appspot.com",
  messagingSenderId: "1028902624608",
  appId: "1:1028902624608:web:101410a2bbd20316701205",
  measurementId: "G-HHTG6R4CH6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Fetch user profile data
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userId = user.uid;
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById('user-name').textContent = userData.name;
            document.getElementById('user-email').textContent = userData.email;
            document.getElementById('points').textContent = `Points Earned: ${userData.loyaltyPoints}`;

            // Profile photo
            const profilePhoto = document.getElementById('profile-photo');
            if (userData.profilePhotoURL) {
                profilePhoto.src = userData.profilePhotoURL;
            }
        } else {
            console.log('No such document!');
        }
    } else {
        console.log('No user is signed in.');
    }
});

// Log out function
document.querySelector('.logout').addEventListener('click', async () => {
    try {
        await signOut(auth);
        alert('User signed out successfully');
        window.location.reload();  // Optionally, you can redirect the user to a login page
    } catch (error) {
        console.error('Error signing out:', error);
    }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-storage.js";
import firebaseConfig from '/firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = e.target.name.value;
      const email = e.target.email.value;
      const password = e.target.password.value;
      const loyaltyPoints = parseInt(e.target['loyaltyPoints'].value); // Convert loyaltyPoints to integer
      const profilePhoto = e.target['profile-photo'].files[0];

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User created:', user);

        // Upload profile photo to Firebase Storage
        const storageRef = ref(storage, 'profile_photos/' + user.uid + '/' + profilePhoto.name);
        await uploadBytes(storageRef, profilePhoto);
        const profilePhotoURL = await getDownloadURL(storageRef);
        console.log('Profile photo uploaded:', profilePhotoURL);

        // Store user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name,
          email,
          profilePhoto: profilePhotoURL,
          loyaltyPoints // Include loyaltyPoints in Firestore document
        });

        console.log('User data stored in Firestore');
        alert('User signed up and data stored successfully.');
        window.location.href = 'homew.html'; // Redirect to homew.html
      } catch (error) {
        console.error('Error signing up:', error);
        alert('Error signing up: ' + error.message);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;

      try {
        await signInWithEmailAndPassword(auth, email, password); // Ensure signInWithEmailAndPassword is correctly imported
        console.log('User logged in successfully');
        alert('User logged in successfully.');
        window.location.href = 'homew.html'; // Redirect to homew.html
      } catch (error) {
        console.error('Error logging in:', error);
        alert('Error logging in: ' + error.message);
      }
    });
  }
});

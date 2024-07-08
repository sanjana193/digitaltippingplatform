import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getAuth, onAuthStateChanged, updateEmail } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-storage.js";
import firebaseConfig from '/firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', () => {
  const editProfileForm = document.getElementById('edit-profile-form');

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        editProfileForm.name.value = userData.name || '';
        editProfileForm.email.value = userData.email || '';
        editProfileForm['payment-id'].value = userData.paymentId || '';
      }

      editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const paymentId = e.target['payment-id'].value;
        const profilePhoto = e.target['profile-photo'].files[0];

        const updates = {};
        if (name) updates.name = name;
        if (paymentId) updates.paymentId = paymentId;

        try {
          if (email) {
            await updateEmail(user, email);
            updates.email = email;
          }

          if (profilePhoto) {
            const storageRef = ref(storage, 'profile_photos/' + user.uid + '/' + profilePhoto.name);
            await uploadBytes(storageRef, profilePhoto);
            const profilePhotoURL = await getDownloadURL(storageRef);
            updates.profilePhoto = profilePhotoURL;
          }

          await updateDoc(doc(db, 'users', user.uid), updates);

          alert('Profile updated successfully.');
          window.location.href = 'homew.html';
        } catch (error) {
          console.error('Error updating profile:', error);
          alert('Error updating profile: ' + error.message);
        }
      });
    } else {
      console.error('No user logged in');
      alert('No user logged in');
    }
  });
});

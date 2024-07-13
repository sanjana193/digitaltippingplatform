import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { getFirestore, doc, setDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";

import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-storage.js";
import firebaseConfig from '/firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Function to generate a random OTP
function generateOTP() {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

// Function to send OTP to user's email
async function sendEmail(email, otp) {
  try {
    await auth.sendPasswordResetEmail(email, { // Using sendPasswordResetEmail for simplicity, replace with custom email logic if necessary
      url: `https://your-website.com/verify-otp?email=${email}&otp=${otp}`, // Example URL to redirect for OTP verification
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const sendOTPButton = document.getElementById('send-otp');
  const otpInput = document.getElementById('otp');
  const signupButton = document.getElementById('signup-button');

  if (signupForm) {
    // Send OTP button click event listener
    sendOTPButton.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = signupForm.email.value;

      try {
        // Generate OTP
        const otp = generateOTP();

        // Send OTP to Firestore
        await setDoc(doc(db, 'otp_requests', email), { otp });

        // Send OTP to user's email
        await sendEmail(email, otp);

        // Show OTP input field
        document.getElementById('otp-section').style.display = 'block';
        sendOTPButton.disabled = true; // Disable send OTP button after sending OTP
      } catch (error) {
        console.error('Error sending OTP or email:', error);
        // Handle error (display message or retry option)
      }
    });

    // Signup form submit event listener
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = signupForm.name.value;
      const email = signupForm.email.value;
      const password = signupForm.password.value;
      const loyaltyPoints = parseInt(signupForm.loyaltyPoints.value); // Convert loyaltyPoints to integer
      const profilePhoto = signupForm['profile-photo'].files[0];
      const userOTP = otpInput.value;

      try {
        // Verify OTP from Firestore
        const otpDoc = await getDoc(doc(db, 'otp_requests', email));
        if (otpDoc.exists()) {
          const storedOTP = otpDoc.data().otp;
          if (storedOTP !== userOTP) {
            throw new Error('Invalid OTP');
          }
          // Delete OTP document after verification
          await deleteDoc(doc(db, 'otp_requests', email));

          // Create user with email and password
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
            loyaltyPoints
          });

          console.log('User data stored in Firestore');
          alert('User signed up and data stored successfully.');
          window.location.href = 'homew.html'; // Redirect to homew.html after successful signup
        } else {
          throw new Error('OTP not found or expired. Please resend OTP.');
        }
      } catch (error) {
        console.error('Error signing up:', error);
        alert('Error signing up: ' + error.message);
      }
    });
  }
});


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, you can redirect or update UI accordingly
      console.log("User signed in:", user);
    } else {
      // User is signed out
      console.log("User signed out");
    }
  });
  
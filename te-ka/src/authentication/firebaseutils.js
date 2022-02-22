import { auth, googleProvider } from "../firebase";
const SignIn = async () => {
  await auth
    .signInWithPopup(googleProvider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      //var credential = result.credential; //
      // This gives you a Google Access Token. You can use it to access the Google API.
      //var token = credential.accessToken;
      // The signed-in user info.
      //var user = result.user;
      window.location.reload();
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      //var errorCode = error.code;
      //var errorMessage = error.message;
      // The email of the user's account used.
      //var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      //var credential = error.credential;
      // ...
    });
};

const LogOut = () => {
  auth
    .signOut()
    .then(() => {
      console.log("Log Out");
      sessionStorage.clear();
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
};

export { SignIn, LogOut };

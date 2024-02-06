// Import the Firebase Authentication SDK
import { auth } from 'firebase';

// Log out the user
auth().signOut()
    .then(() => {
        console.log('User logged out successfully');
    })
    .catch((error) => {
        console.error('Error logging out:', error);
    });

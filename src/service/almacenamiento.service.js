import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export const uploadImageAndGetURL = async (file, pathPrefix = 'productos') => {
  try {
    const uniqueName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${pathPrefix}/${uniqueName}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
  }
};

export const deleteImageByURL = async (imageURL) => {
  try {
    const storageRef = ref(storage, imageURL);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
  }
};

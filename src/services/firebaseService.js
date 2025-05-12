import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const PRESETS_COLLECTION = 'presets';

/**
 * Save a preset to Firestore
 * @param {Object} preset - The preset object to save
 * @returns {Promise<string>} - The ID of the saved preset
 */
export const savePresetToFirebase = async (preset) => {
  try {
    // Add timestamp and isPublic flag
    const presetWithMetadata = {
      ...preset,
      createdAt: serverTimestamp(),
      isPublic: true // Set all presets as public by default
    };
    
    const docRef = await addDoc(collection(db, PRESETS_COLLECTION), presetWithMetadata);
    return docRef.id;
  } catch (error) {
    console.error('Error saving preset to Firebase:', error);
    throw error;
  }
};

/**
 * Get a preset by ID
 * @param {string} presetId - The ID of the preset to get
 * @returns {Promise<Object>} - The preset object
 */
export const getPresetById = async (presetId) => {
  try {
    const docRef = doc(db, PRESETS_COLLECTION, presetId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('No such preset exists!');
      return null;
    }
  } catch (error) {
    console.error('Error getting preset:', error);
    throw error;
  }
};

/**
 * Get all public presets
 * @returns {Promise<Array>} - Array of preset objects
 */
export const getPublicPresets = async () => {
  try {
    const q = query(
      collection(db, PRESETS_COLLECTION),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(50) // Limit to 50 most recent presets
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting public presets:', error);
    throw error;
  }
};

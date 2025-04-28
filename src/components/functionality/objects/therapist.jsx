import Utilities from "../../general/utilities";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

class Therapist {
  /**
   * Creates a Therapist instance.
   * @param {string} nameSurname - The full name of the therapist.
   * @param {Array} allowedProductsIds - Array of product IDs this therapist is allowed for.
   * @param {string|null} id - Document ID in Firestore (default is null).
   */
  constructor(nameSurname, allowedProductsIds, id = null) {
    this.nameSurname = nameSurname;
    this.allowedProductsIds = allowedProductsIds;
    this.id = id;
  }

  /**
   * Set the Firestore context.
   * @param {object} context - The context containing the Firestore instance.
   */
  static setContext(context) {
    // Support both a direct Firestore instance or an object with a firestore property.
    this._db = context.firestore ? context.firestore : context;
  }

  /**
   * Getter for the Firestore instance.
   * Throws an error if the context is not set.
   */
  static get db() {
    if (!this._db) {
      throw new Error(
        "Firestore context not set. Please call Therapist.setContext(context) first."
      );
    }
    return this._db;
  }

  // Define the collection name used in Firestore.
  static collectionName = "therapists";

  /**
   * Add a new therapist document to Firestore.
   * @returns {Promise<DocumentReference>} A promise resolving to the document reference.
   */
  async add() {
    const therapistData = {
      nameSurname: this.nameSurname,
      allowedProductsIds: this.allowedProductsIds,
    };

    try {
      const docRef = await addDoc(
        collection(Therapist.db, Therapist.collectionName),
        therapistData
      );
      Utilities.consoleLog("Therapist added with ID: " + docRef.id);
      return docRef;
    } catch (error) {
      Utilities.consoleLog("Error adding therapist: " + error);
      throw error;
    }
  }

  /**
   * Retrieve all therapist documents (one-time fetch).
   * @returns {Promise<Array<Therapist>>} A promise resolving to an array of Therapist instances.
   */
  static async getAll() {
    try {
      const therapistsSnapshot = await getDocs(
        collection(Therapist.db, Therapist.collectionName)
      );
      const therapists = [];
      therapistsSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const therapist = new Therapist(
          data.nameSurname,
          data.allowedProductsIds,
          docSnap.id
        );
        therapists.push(therapist);
      });
      return therapists;
    } catch (error) {
      Utilities.consoleLog("Error retrieving therapists: " + error);
      throw error;
    }
  }

  /**
   * Listen for real-time updates for a specific therapist document
   * that has a given product ID in its allowedProductsIds field.
   *
   * @param {string} therapistId - The document ID of the therapist.
   * @param {string} productId - The product ID to check in allowedProductsIds.
   * @param {function} callback - A callback function with the signature (therapist, error).
   *                              When the document is updated, the therapist instance is passed.
   *                              If not found or an error occurs, therapist will be null.
   * @returns {function} unsubscribe function to cancel the real-time listener.
   */
  static listenTherapistByIdAndProduct(therapistId, productId, callback) {
    if (typeof callback !== "function") {
      console.error(
        "Invalid callback provided to listenTherapistByIdAndProduct"
      );
      callback = () => {}; // fallback no-op
    }

    // Query by the document ID (using the special __name__ field) and ensure the allowedProductsIds includes productId.
    const q = query(
      collection(Therapist.db, Therapist.collectionName),
      where("__name__", "==", therapistId),
      where("allowedProductsIds", "array-contains", productId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let therapist = null;
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          therapist = new Therapist(
            data.nameSurname,
            data.allowedProductsIds,
            docSnap.id
          );
        });
        Utilities.consoleLog(
          "Realtime listener update: Retrieved therapist " +
            (therapist ? therapist.id : "not found")
        );
        callback(therapist, null);
      },
      (error) => {
        Utilities.consoleLog("Error listening for therapist: " + error);
        callback(null, error);
      }
    );
    return unsubscribe;
  }
}

export default Therapist;

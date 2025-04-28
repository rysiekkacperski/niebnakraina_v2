import Utilities from "../../general/utilities";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

class VisitMode {
  /**
   * Creates a new VisitMode instance.
   * 
   * @param {string} name - The internal name (required).
   * @param {string} fullName - The full name displayed to users (required).
   * @param {Object} [img={img: "", alt: ""}] - An object with image URL and alternative text.
   * @param {string|null} [id=null] - The document ID (defaults to null).
   */
  constructor(name, fullName, img = { img: "", alt: "" }, id = null) {
    this.name = name;
    this.fullName = fullName;
    this.img = img;
    this.id = id;
  }

  // Set the Firestore instance from the provided context.
  static setContext(context) {
    this._db = context.firestore ? context.firestore : context;
  }

  // Getter for the Firestore instance.
  static get db() {
    if (!this._db) {
      throw new Error("Firestore context not set. Please call VisitMode.setContext(context) first.");
    }
    return this._db;
  }

  // The Firestore collection name for visit modes.
  static collectionName = "visitMode";

  /**
   * Adds a new visitMode document to Firestore.
   * @returns {Promise} A promise that resolves with the added document reference.
   */
  async add() {
    const visitModeData = {
      name: this.name,
      fullName: this.fullName,
      img: this.img,
    };

    try {
      const docRef = await addDoc(
        collection(VisitMode.db, VisitMode.collectionName),
        visitModeData
      );
      Utilities.consoleLog("VisitMode added with ID: " + docRef.id);
      return docRef;
    } catch (error) {
      Utilities.consoleLog("Error adding visitMode: " + error);
      throw error;
    }
  }

  /**
   * Retrieves a visitMode document by its ID.
   * @param {string} id - The Firestore document ID.
   * @returns {Promise<VisitMode|null>} A promise that resolves with a VisitMode instance or null if not found.
   */
  static async getById(id) {
    try {
      const docRef = doc(VisitMode.db, VisitMode.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const visitMode = new VisitMode(data.name, data.fullName, data.img);
        visitMode.id = docSnap.id;
        return visitMode;
      } else {
        return null;
      }
    } catch (error) {
      Utilities.consoleLog("Error retrieving visitMode by id: " + error);
      throw error;
    }
  }

  /**
   * Retrieves visitMode documents by an array of IDs.
   * @param {Array<string>} ids - An array of Firestore document IDs.
   * @returns {Promise<Array<VisitMode>>} A promise that resolves with an array of VisitMode instances.
   */
  static async getByIds(ids) {
    try {
      // Use Promise.all to parallelize retrieval for each ID.
      const promises = ids.map(id => VisitMode.getById(id));
      const results = await Promise.all(promises);
      // Filter out any null results (documents that were not found).
      return results.filter(item => item !== null);
    } catch (error) {
      Utilities.consoleLog("Error retrieving visitModes by ids: " + error);
      throw error;
    }
  }

  /**
   * Retrieves all visitMode documents from Firestore.
   * @returns {Promise<Array<VisitMode>>} A promise that resolves with an array of VisitMode instances.
   */
  static async getAll() {
    try {
      const querySnapshot = await getDocs(collection(VisitMode.db, VisitMode.collectionName));
      const visitModes = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const visitMode = new VisitMode(data.name, data.fullName, data.img, docSnap.id);
        visitMode.id = docSnap.id;
        visitModes.push(visitMode);
      });
      return visitModes;
    } catch (error) {
      Utilities.consoleLog("Error retrieving visitModes: " + error);
      throw error;
    }
  }

  /**
   * Updates an existing visitMode document.
   * @returns {Promise<boolean>} A promise that resolves to true if the update is successful.
   */
  async update() {
    if (!this.id) throw new Error("VisitMode ID is required for updates.");
    const docRef = doc(VisitMode.db, VisitMode.collectionName, this.id);
    try {
      await updateDoc(docRef, {
        name: this.name,
        fullName: this.fullName,
        img: this.img,
      });
      return true;
    } catch (error) {
      Utilities.consoleLog("Error updating visitMode: " + error);
      throw error;
    }
  }
}

export default VisitMode;

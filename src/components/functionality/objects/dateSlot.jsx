import {
  collection,
  addDoc,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  getCountFromServer,
} from "firebase/firestore";

class DateSlot {
  /**
   * Constructs a new DateSlot.
   *
   * @param {any} datetime - The date and time of the slot.
   * @param {string} therapistNameSurname - The therapist's name and surname.
   * @param {string} therapistId - The therapist's unique ID.
   * @param {Array} allowedProductsIds - Array of allowed product IDs.
   * @param {boolean} [isFree=true] - Indicates if the slot is free.
   * @param {any} [currentlyOccupyingUser=null] - The user currently occupying the slot.
   * @param {any} [visitId=null] - The visit ID associated with the slot.
   * @param {string|null} [id=null] - The document ID (assigned by Firestore).
   */
  constructor(datetime, therapistNameSurname, therapistId, allowedProductsIds, isFree = true, currentlyOccupyingUser = null, visitId = null, id = null) {
    this.datetime = datetime;
    this.therapistNameSurname = therapistNameSurname;
    this.therapistId = therapistId;
    this.allowedProductsIds = allowedProductsIds;
    this.isFree = isFree;
    this.currentlyOccupyingUser = currentlyOccupyingUser;
    this.visitId = visitId;
    this.id = id;
  }

  /**
   * Sets the Firestore context. Must be called before using any other methods.
   * @param {Object} context - Either a Firestore instance or an object containing a firestore property.
   */
  static setContext(context) {
    this._db = context.firestore ? context.firestore : context;
  }

  /**
   * Returns the Firestore instance.
   * @throws {Error} if Firestore context is not set.
   */
  static get db() {
    if (!this._db) {
      throw new Error("Firestore context not set. Please call DateSlot.setContext(context) first.");
    }
    return this._db;
  }

  // Define the collection name.
  static collectionName = "dateSlots";

  /**
   * Adds this DateSlot instance to Firestore.
   * @returns {Promise} that resolves with the document reference.
   */
  async add() {
    const dateSlotData = {
      datetime: this.datetime,
      therapistNameSurname: this.therapistNameSurname,
      therapistId: this.therapistId,
      allowedProductsIds: this.allowedProductsIds,
      isFree: this.isFree,
      currentlyOccupyingUser: this.currentlyOccupyingUser,
      visitId: this.visitId,
    };

    try {
      const docRef = await addDoc(
        collection(DateSlot.db, DateSlot.collectionName),
        dateSlotData
      );
      console.log("DateSlot added with ID:", docRef.id);
      return docRef;
    } catch (error) {
      console.error("Error adding DateSlot:", error);
      throw error;
    }
  }

  /**
   * Updates the DateSlot document in Firestore.
   * @returns {Promise<boolean>} that resolves to true if successful.
   */
  async update() {
    if (!this.id) throw new Error("DateSlot ID is required for updates.");
    const docRef = doc(DateSlot.db, DateSlot.collectionName, this.id);
    const updatedData = {
      datetime: this.datetime,
      therapistNameSurname: this.therapistNameSurname,
      therapistId: this.therapistId,
      allowedProductsIds: this.allowedProductsIds,
      isFree: this.isFree,
      currentlyOccupyingUser: this.currentlyOccupyingUser,
      visitId: this.visitId,
    };

    try {
      await updateDoc(docRef, updatedData);
      console.log("DateSlot updated with ID:", this.id);
      return true;
    } catch (error) {
      console.error("Error updating DateSlot:", error);
      throw error;
    }
  }

  /**
   * Deletes the DateSlot document from Firestore.
   * @returns {Promise<boolean>} that resolves to true if successful.
   */
  async delete() {
    if (!this.id) throw new Error("DateSlot ID is required for deletion.");
    const docRef = doc(DateSlot.db, DateSlot.collectionName, this.id);
    try {
      await deleteDoc(docRef);
      console.log("DateSlot deleted with ID:", this.id);
      return true;
    } catch (error) {
      console.error("Error deleting DateSlot:", error);
      throw error;
    }
  }

  /**
   * Updates only the currentlyOccupyingUser field.
   * @param {string|null} userId - The new user ID (or null to clear occupancy).
   * @returns {Promise<boolean>} that resolves to true if successful.
   */
  async updateCurrentlyOccupyingUser(userId) {
    if (!this.id) throw new Error("DateSlot ID is required for updating currentlyOccupyingUser.");
    const docRef = doc(DateSlot.db, DateSlot.collectionName, this.id);
    try {
      await updateDoc(docRef, { currentlyOccupyingUser: userId });
      this.currentlyOccupyingUser = userId;
      console.log("DateSlot's currentlyOccupyingUser updated to:", userId);
      return true;
    } catch (error) {
      console.error("Error updating currentlyOccupyingUser:", error);
      throw error;
    }
  }

  /**
   * Clears the currentlyOccupyingUser field by setting it to null.
   * @returns {Promise<boolean>} that resolves to true if successful.
   */
  async clearOccupancy() {
    return await this.updateCurrentlyOccupyingUser(null);
  }

  /**
   * Generic helper to listen for DateSlots based on given constraints.
   * Invokes the callback with (dateSlots, lastVisible, error).
   */
  static listenDateSlotsByConstraints(constraints, lastDoc, callback, pageSize = 5) {
    if (typeof callback !== "function") {
      console.error("Callback must be a function.");
      callback = () => {};
    }
    const allConstraints = [
      ...constraints,
      orderBy("datetime"),
      limit(pageSize)
    ];
    if (lastDoc && typeof lastDoc.data === "function") {
      allConstraints.push(startAfter(lastDoc));
    }
    const q = query(collection(DateSlot.db, DateSlot.collectionName), ...allConstraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const dateSlots = [];
        let lastVisible = null;
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const dateSlot = new DateSlot(
            data.datetime,
            data.therapistNameSurname,
            data.therapistId,
            data.allowedProductsIds,
            data.isFree,
            data.currentlyOccupyingUser,
            data.visitId,
            docSnap.id
          );
          dateSlots.push(dateSlot);
          lastVisible = docSnap;
        });
        console.log(`Realtime update: Retrieved ${dateSlots.length} DateSlots.`);
        callback(dateSlots, lastVisible, null);
      },
      (error) => {
        console.error("Error in realtime listener for DateSlots:", error);
        callback([], null, error);
      }
    );
    return unsubscribe;
  }

  /**
   * Generic count function for DateSlots matching given filters.
   * @param {Array} filters - Array of Firestore query constraints.
   * @returns {Promise<number>} that resolves with the count.
   */
  static async countDateSlotsByFilters(filters = []) {
    try {
      const q = query(collection(DateSlot.db, DateSlot.collectionName), ...filters);
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;
      console.log(`Total dateSlots count for filters ${JSON.stringify(filters)}: ${count}`);
      return count;
    } catch (error) {
      console.error("Error counting dateSlots: " + error);
      throw error;
    }
  }

  /**
   * Counts the date slots for a given product.
   * If freeOnly is true, only free slots (isFree === true) are counted.
   * @param {string} productId - The product ID to filter by.
   * @param {boolean} freeOnly - Whether to count only free slots.
   * @returns {Promise<number>} that resolves with the count.
   */
  static async countDateSlotsByProductId(productId, freeOnly) {
    const filters = [where("allowedProductsIds", "array-contains", productId)];
    if (freeOnly) {
      filters.push(where("isFree", "==", true));
    }
    return await DateSlot.countDateSlotsByFilters(filters);
  }

  /**
   * Listens in realtime for DateSlots filtered by productId.
   * If freeOnly is true, only slots where isFree === true are returned.
   * The callback is invoked as (dateSlots, lastVisible, error).
   *
   * @param {string} productId - The product ID to filter by.
   * @param {boolean} freeOnly - Whether to include only free slots.
   * @param {any} lastDoc - The last document from a previous query (for pagination).
   * @param {function} callback - Callback receiving (dateSlots, lastVisible, error).
   * @param {number} [pageSize=5] - Number of documents per page.
   * @returns {function} unsubscribe function.
   */
  static listenDateSlotsByProductId(productId, freeOnly, lastDoc, callback, pageSize = 5) {
    const constraints = [where("allowedProductsIds", "array-contains", productId)];
    if (freeOnly) {
      constraints.push(where("isFree", "==", true));
    }
    const allConstraints = [
      ...constraints,
      orderBy("datetime"),
      limit(pageSize)
    ];
    if (lastDoc && typeof lastDoc.data === "function") {
      allConstraints.push(startAfter(lastDoc));
    }
    const q = query(collection(DateSlot.db, DateSlot.collectionName), ...allConstraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const dateSlots = [];
        let lastVisible = null;
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const dateSlot = new DateSlot(
            data.datetime,
            data.therapistNameSurname,
            data.therapistId,
            data.allowedProductsIds,
            data.isFree,
            data.currentlyOccupyingUser,
            data.visitId,
            docSnap.id
          );
          dateSlots.push(dateSlot);
          lastVisible = docSnap;
        });
        console.log(`Realtime update: Retrieved ${dateSlots.length} DateSlots.`);
        callback(dateSlots, lastVisible, null);
      },
      (error) => {
        console.error("Error in realtime listener for DateSlots:", error);
        callback([], null, error);
      }
    );
    return unsubscribe;
  }

  /**
   * Listens in realtime for DateSlots filtered by therapistId.
   */
  static listenDateSlotsByTherapistId(therapistId, lastDoc, callback, pageSize = 5) {
    const constraints = [where("therapistId", "==", therapistId)];
    return DateSlot.listenDateSlotsByConstraints(constraints, lastDoc, callback, pageSize);
  }

  /**
   * Retrieves date slots for a given therapistId (one-time fetch).
   */
  static async getDateSlotsByTherapistId(therapistId) {
    try {
      const q = query(
        collection(DateSlot.db, DateSlot.collectionName),
        where("therapistId", "==", therapistId)
      );
      const querySnapshot = await getDocs(q);
      const dateSlots = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const dateSlot = new DateSlot(
          data.datetime,
          data.therapistNameSurname,
          data.therapistId,
          data.allowedProductsIds,
          data.isFree,
          data.currentlyOccupyingUser,
          data.visitId,
          docSnap.id
        );
        dateSlots.push(dateSlot);
      });
      return dateSlots;
    } catch (error) {
      console.error("Error retrieving DateSlots by therapistId:", error);
      throw error;
    }
  }
}

export default DateSlot;

import { collection, addDoc, doc, deleteDoc, getDocs, getDoc, query, where } from "firebase/firestore";
import Utilities from "../../utilities";

class Visit {
  constructor(userCreatingId, therapistId, isAdult, patientId, type, productId, mode, dateSlotId, paymentMethod, id = null) {
    this.userCreatingId = userCreatingId;
    this.therapistId = therapistId;
    this.isAdult = isAdult;
    this.patientId = patientId;
    this.type = type;
    this.productId = productId;
    this.mode = mode;
    this.dateSlotId = dateSlotId;
    this.paymentMethod = paymentMethod;
    this.id = id; // Firestore document ID (optional)
  }

  // Set the Firestore instance from the provided context.
  // If the context has a 'firestore' property, it will be used; otherwise the context is assumed to be the Firestore instance.
  static setContext(context) {
    this._db = context.firestore ? context.firestore : context;
  }

  // Getter for the Firestore instance.
  static get db() {
    if (!this._db) {
      throw new Error("Firestore context not set. Please call Visit.setContext(context) first.");
    }
    return this._db;
  }

  static collectionName = "visits";

  // Add a new visit document to Firestore (document ID is auto-generated).
  async add() {
    const visitData = {
      userCreatingId: this.userCreatingId,
      therapistId: this.therapistId,
      isAdult: this.isAdult,
      patientId: this.patientId,
      type: this.type,
      productId: this.productId,
      mode: this.mode,
      dateSlotId: this.dateSlotId,
      paymentMethod: this.paymentMethod,
    };

    try {
      Utilities.consoleLog("Adding new visit...");
      const docRef = await addDoc(collection(Visit.db, Visit.collectionName), visitData);
      Utilities.consoleLog("Visit added with ID: " + docRef.id);
      return docRef;
    } catch (error) {
      Utilities.consoleLog("Error adding visit: " + error);
      throw error;
    }
  }

  // Delete a visit document from Firestore based on its document ID.
  static async deleteById(visitId) {
    try {
      Utilities.consoleLog("Deleting visit with ID: " + visitId);
      const docRef = doc(Visit.db, Visit.collectionName, visitId);
      await deleteDoc(docRef);
      Utilities.consoleLog("Visit deleted with ID: " + visitId);
      return true;
    } catch (error) {
      Utilities.consoleLog("Error deleting visit: " + error);
      throw error;
    }
  }

  // Retrieve a visit by its Firestore document ID.
  static async getById(visitId) {
    try {
      Utilities.consoleLog("Retrieving visit with ID: " + visitId);
      const docRef = doc(Visit.db, Visit.collectionName, visitId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        Utilities.consoleLog("Visit found with ID: " + visitId);
        const data = docSnap.data();
        return new Visit(
          data.userCreatingId,
          data.therapistId,
          data.isAdult,
          data.patientId,
          data.type,
          data.productId,
          data.mode,
          data.dateSlotId,
          data.paymentMethod,
          docSnap.id
        );
      } else {
        Utilities.consoleLog("No visit found with ID: " + visitId);
        return null;
      }
    } catch (error) {
      Utilities.consoleLog("Error retrieving visit: " + error);
      throw error;
    }
  }

  // Retrieve all visits for a given therapist ID.
  static async getByTherapistId(therapistId) {
    try {
      Utilities.consoleLog("Retrieving visits for therapist ID: " + therapistId);
      const q = query(
        collection(Visit.db, Visit.collectionName),
        where("therapistId", "==", therapistId)
      );
      const querySnapshot = await getDocs(q);
      const visits = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        visits.push(new Visit(
          data.userCreatingId,
          data.therapistId,
          data.isAdult,
          data.patientId,
          data.type,
          data.productId,
          data.mode,
          data.dateSlotId,
          data.paymentMethod,
          docSnap.id
        ));
      });
      Utilities.consoleLog("Found " + visits.length + " visits for therapist ID: " + therapistId);
      return visits;
    } catch (error) {
      Utilities.consoleLog("Error retrieving visits: " + error);
      throw error;
    }
  }
}

export default Visit;
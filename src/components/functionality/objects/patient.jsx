import Utilities from "../../general/utilities";

import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  updateDoc,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  getCountFromServer,
} from "firebase/firestore";

class Patient {
  constructor(ownerId, name, age, isAdult, therapistsIds=[], id=null) {
    this.ownerId = ownerId;
    this.name = name;
    this.age = age;
    this.isAdult = isAdult;
    this.therapistsIds = therapistsIds;
    this.id = id;
  }

  // Set the Firestore instance from the provided context.
  static setContext(context) {
    this._db = context.firestore ? context.firestore : context;
  }

  // Getter for the Firestore instance.
  static get db() {
    if (!this._db) {
      throw new Error("Firestore context not set. Please call Patient.setContext(context) first.");
    }
    return this._db;
  }

  static collectionName = "patients";

  // Add a new patient document.
  async add() {
    const patientData = {
      ownerId: this.ownerId,
      name: this.name,
      age: this.age,
      isAdult: this.isAdult,
      therapistsIds: this.therapistsIds,
    };

    try {
      const docRef = await addDoc(
        collection(Patient.db, Patient.collectionName),
        patientData
      );
      Utilities.consoleLog("Patient added with ID: " + docRef.id);
      return docRef;
    } catch (error) {
      Utilities.consoleLog("Error adding patient: " + error);
      throw error;
    }
  }

  // Retrieve a patient by document ID.
  static async getById(id) {
    try {
      const docRef = doc(Patient.db, Patient.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const patient = new Patient(data.ownerId, data.name, data.age, data.isAdult);
        patient.id = docSnap.id;
        patient.therapistsIds = data.hasOwnProperty("therapistsIds") ? data.therapistsIds : [];
        return patient;
      } else {
        return null;
      }
    } catch (error) {
      Utilities.consoleLog("Error retrieving patient by id: " + error);
      throw error;
    }
  }

  // Retrieve all patients for a given ownerId (one-time fetch).
  static async getByOwnerId(ownerId) {
    try {
      const q = query(
        collection(Patient.db, Patient.collectionName),
        where("ownerId", "==", ownerId)
      );
      const querySnapshot = await getDocs(q);
      const patients = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const patient = new Patient(data.ownerId, data.name, data.age);
        patient.id = docSnap.id;
        patient.isAdult = data.hasOwnProperty("isAdult") ? data.isAdult : null;
        patient.therapistsIds = data.hasOwnProperty("therapistsIds") ? data.therapistsIds : [];
        patients.push(patient);
      });
      return patients;
    } catch (error) {
      Utilities.consoleLog("Error retrieving patients by ownerId: " + error);
      throw error;
    }
  }

  // Update an existing patient document by ownerId.
  async update() {
    if (!this.id) throw new Error("Patient ID is required for updates.");
    const docRef = doc(Patient.db, Patient.collectionName, this.id);
    try {
      await updateDoc(docRef, {
        ownerId: this.ownerId,
        name: this.name,
        age: this.age,
        isAdult: this.isAdult,
        therapistsIds: this.therapistsIds,
      });
      return true;
    } catch (error) {
      Utilities.consoleLog("Error updating patient: " + error);
      throw error;
    }
  }

  // Generic helper to listen for patients with given constraints.
  static listenPatientsByConstraints(constraints, lastDoc, callback, pageSize = 5) {

    if (typeof callback !== "function") {
      console.error("Invalid callback provided to listenPatientsByConstraints");
      callback = () => {}; // Fallback to a no-op function
    }
    
    const allConstraints = [
      ...constraints,
      orderBy("name"),
      limit(pageSize)
    ];

    if (lastDoc && typeof lastDoc.data === "function") {
      allConstraints.push(startAfter(lastDoc));
    }
    
    const q = query(collection(Patient.db, Patient.collectionName), ...allConstraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const patients = [];
        let lastVisible = null;
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const patient = new Patient(data.ownerId, data.name, data.age, data.isAdult);
          patient.id = docSnap.id;
          patient.therapistsIds = data.hasOwnProperty("therapistsIds") ? data.therapistsIds : [];
          patients.push(patient);
          lastVisible = docSnap;
        });
        Utilities.consoleLog("Realtime listener update: Retrieved " + patients.length + " patients.");
        callback(patients, lastVisible, null);
      },
      (error) => {
        Utilities.consoleLog("Error listening for patients: " + error);
        callback([], null, error);
      }
    );
    return unsubscribe;
  }

  /**
   * Listen to patients in real-time for a given ownerId with an optional isAdult filter and pagination.
   * Retrieves 'pageSize' documents per page.
   */
  static listenPatientsByOwnerId(ownerId, isAdult, lastDoc, callback, pageSize = 5) {
    const constraints = [where("ownerId", "==", ownerId)];
    if (typeof isAdult !== "undefined") {
      constraints.push(where("isAdult", "==", isAdult));
    }
    return Patient.listenPatientsByConstraints(constraints, lastDoc, callback, pageSize);
  }

  /**
   * Listen to patients in real-time for a given therapistId with pagination.
   * Retrieves 'pageSize' documents per page.
   * Note: The isAdult filter is not applied when querying by therapistId.
   */
  static listenPatientsByTherapistId(therapistId, lastDoc, callback, pageSize = 5) {
    const constraints = [where("therapistsIds", "array-contains", therapistId)];
    return Patient.listenPatientsByConstraints(constraints, lastDoc, callback, pageSize);
  }

  // Generic count function for multiple filters.
  static async countPatientsByFilters(filters = []) {
    try {
      const q = query(collection(Patient.db, Patient.collectionName), ...filters);
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;
      Utilities.consoleLog(`Total patients count for filters ${JSON.stringify(filters)}: ${count}`);
      return count;
    } catch (error) {
      Utilities.consoleLog("Error counting patients: " + error);
      throw error;
    }
  }

  // Count patients by ownerId and optional isAdult filter.
  static async countPatientsByOwnerId(ownerId, isAdult) {
    const filters = [where("ownerId", "==", ownerId)];
    if (typeof isAdult !== "undefined") {
      filters.push(where("isAdult", "==", isAdult));
    }
    return await Patient.countPatientsByFilters(filters);
  }

  // Count patients by therapistId
  static async countPatientsByTherapistId(therapistId) {
    const filters = [where("therapistsIds", "array-contains", therapistId)];
    return await Patient.countPatientsByFilters(filters);
  }

}

export default Patient;

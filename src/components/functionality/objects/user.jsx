import { collection, addDoc, query, where, getDocs, updateDoc } from "firebase/firestore";

class User {
  constructor(userId, phoneNumber, prefix='', nameSurname='', age='') {
    this.userId = userId;
    this.phoneNumber = phoneNumber;
    this.prefix = prefix;
    this.nameSurname = nameSurname;
    this.age = age;
  }

  // Set the Firestore instance from the provided context.
  // If the context is an object with a "firestore" property, it will use that; otherwise, it assumes the context is the Firestore instance.
  static setContext(context) {
    this._db = context.firestore ? context.firestore : context;
  }

  // Getter for the Firestore instance.
  static get db() {
    if (!this._db) {
      throw new Error("Firestore context not set. Please call User.setContext(context) first.");
    }
    return this._db;
  }

  static collectionName = "users";

  // Add a new user document to Firestore (document ID is auto-generated)
  async add() {
    const userData = {
      userId: this.userId,
      prefix: this.prefix,
      phoneNumber: this.phoneNumber,
      nameSurname: this.nameSurname,
      age: this.age,
    };

    try {
      const docRef = await addDoc(collection(User.db, User.collectionName), userData);
      return docRef;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }

  // Adds a user from auth where the phoneNumber is already provided with a prefix.
  // This method extracts the prefix from the phone number and stores them separately.
  async addFromAuth() {
    // If the phone number starts with '+' indicating the presence of a prefix, extract it.
    if (this.phoneNumber && this.phoneNumber.startsWith("+")) {
      const match = this.phoneNumber.match(/^(\+\d+)(.*)$/);
      if (match) {
        this.prefix = match[1]; // e.g., "+1"
        this.phoneNumber = match[2].trim(); // the rest of the number without the prefix
      }
    }

    const userData = {
      userId: this.userId,
      prefix: this.prefix,
      phoneNumber: this.phoneNumber,
      nameSurname: this.nameSurname,
      age: this.age,
    };

    try {
      const docRef = await addDoc(collection(User.db, User.collectionName), userData);
      return docRef;
    } catch (error) {
      console.error("Error adding user from auth:", error);
      throw error;
    }
  }

  // Retrieve a user by userId field. Returns a new User instance if found.
  static async getByUserId(userId) {
    const q = query(
      collection(User.db, User.collectionName),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    // Assuming userId is unique and returning the first match.
    const docData = querySnapshot.docs[0].data();
    return new User(
      docData.userId,
      docData.phoneNumber,
      docData.prefix,
      docData.nameSurname,
      docData.age
    );
  }

  // Update an existing user document by userId field.
  async update() {
    const q = query(
      collection(User.db, User.collectionName),
      where("userId", "==", this.userId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return false;
    }
    // Get the first document matching the query.
    const docRef = querySnapshot.docs[0].ref;
    try {
      await updateDoc(docRef, {
        prefix: this.prefix,
        phoneNumber: this.phoneNumber,
        nameSurname: this.nameSurname,
        age: this.age,
      });
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}

export default User;
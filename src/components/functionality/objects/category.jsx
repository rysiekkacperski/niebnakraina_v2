import Utilities from "../../general/utilities";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

class Category {
  /**
   * Creates a new Category instance.
   * 
   * @param {string} name - The internal name (required).
   * @param {string} shownName - The name displayed to users (required).
   * @param {Array<string>} [description=[]] - An array of description strings.
   * @param {Object} [img={img: "", alt: ""}] - An object with image URL and alternative text.
   * @param {Array<string>} [keywords=[]] - An array of keyword strings.
   * @param {string} [shortDescription=""] - A short description.
   * @param {string} [slogan=""] - A slogan.
   * @param {string|null} [id=null] - The document ID (defaults to null).
   */
  constructor(
    name,
    shownName,
    description = [],
    img = { img: "", alt: "" },
    svg = { src: "", alt: "" },
    keywords = [],
    shortDescription = "",
    slogan = "",
    id = null
  ) {
    this.name = name;
    this.shownName = shownName;
    this.description = description;
    this.img = img;
    this.svg = svg
    this.keywords = keywords;
    this.shortDescription = shortDescription;
    this.slogan = slogan;
    this.id = id;
  }

  // Set the Firestore instance from the provided context.
  static setContext(context) {
    this._db = context.firestore ? context.firestore : context;
  }

  // Getter for the Firestore instance.
  static get db() {
    if (!this._db) {
      throw new Error("Firestore context not set. Please call Category.setContext(context) first.");
    }
    return this._db;
  }

  // The Firestore collection name for categories.
  static collectionName = "category";

  /**
   * Adds a new category document to Firestore.
   * @returns {Promise} A promise that resolves with the added document reference.
   */
  async add() {
    const categoryData = {
      name: this.name,
      shownName: this.shownName,
      description: this.description,
      img: this.img,
      svg: this.svg,
      keywords: this.keywords,
      shortDescription: this.shortDescription,
      slogan: this.slogan,
    };

    try {
      const docRef = await addDoc(
        collection(Category.db, Category.collectionName),
        categoryData
      );
      Utilities.consoleLog("Category added with ID: " + docRef.id);
      return docRef;
    } catch (error) {
      Utilities.consoleLog("Error adding category: " + error);
      throw error;
    }
  }

  /**
   * Retrieves a category document by its ID.
   * @param {string} id - The Firestore document ID.
   * @returns {Promise<Category|null>} A promise that resolves with a Category instance or null if not found.
   */
  static async getById(id) {
    try {
      const docRef = doc(Category.db, Category.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const category = new Category(
          data.name,
          data.shownName,
          data.description,
          data.img,
          data.svg,
          data.keywords,
          data.shortDescription,
          data.slogan
        );
        category.id = docSnap.id;
        return category;
      } else {
        return null;
      }
    } catch (error) {
      Utilities.consoleLog("Error retrieving category by id: " + error);
      throw error;
    }
  }

  /**
   * Retrieves all category documents from Firestore.
   * @returns {Promise<Array<Category>>} A promise that resolves with an array of Category instances.
   */
  static async getAll() {
    try {
      const querySnapshot = await getDocs(collection(Category.db, Category.collectionName));
      const categories = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const category = new Category(
          data.name,
          data.shownName,
          data.description,
          data.img,
          data.svg,
          data.keywords,
          data.shortDescription,
          data.slogan
        );
        category.id = docSnap.id;
        categories.push(category);
      });
      return categories;
    } catch (error) {
      Utilities.consoleLog("Error retrieving categories: " + error);
      throw error;
    }
  }

  /**
   * Updates an existing category document.
   * @returns {Promise<boolean>} A promise that resolves to true if update is successful.
   */
  async update() {
    if (!this.id) throw new Error("Category ID is required for updates.");
    const docRef = doc(Category.db, Category.collectionName, this.id);
    try {
      await updateDoc(docRef, {
        name: this.name,
        shownName: this.shownName,
        description: this.description,
        img: this.img,
        svg: this.svg,
        keywords: this.keywords,
        shortDescription: this.shortDescription,
        slogan: this.slogan,
      });
      return true;
    } catch (error) {
      Utilities.consoleLog("Error updating category: " + error);
      throw error;
    }
  }
}

export default Category;
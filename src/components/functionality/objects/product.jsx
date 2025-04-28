import Utilities from "../../general/utilities";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

/**
 * Class representing a product.
 * This class encapsulates product properties and methods for interacting with Firestore.
 */
class Product {
  /**
   * Creates a new Product instance.
   *
   * @param {string} categoryId - The category identifier.
   * @param {boolean} forAdults - Indicates if the product is for adults.
   * @param {boolean} forChildren - Indicates if the product is for children.
   * @param {string} fullName - The full name of the product.
   * @param {string} name - The short name of the product.
   * @param {Array} visitModeIds - An array of visit mode identifiers.
   * @param {boolean} shownInOffer - Indicates if the product is shown in the offer.
   * @param {boolean} combined - Indicates if the product is a combined product.
   * @param {Array} combinedProductsIds - Array of combined product identifiers.
   * @param {Array} onSaleId - Array of sale/promotion identifiers.
   * @param {string} url - The product URL.
   * @param {string} siteTitle - The title of the product page.
   * @param {Array} oldUrls - Array of old product URLs.
   * @param {Array} description - Array of product descriptions.
   * @param {Array} shortDescription - Array of short product descriptions.
   * @param {Array} FAQ - Array of FAQ objects (each with a question and answer).
   * @param {Array} steps - Array of step objects (each with header, img, alt, and description).
   * @param {Array} incentives - Array of incentive objects (each with text, img, and actionButtonName).
   * @param {Array} keywords - Array of keywords.
   * @param {Array} pricing - Array of pricing objects (each with name and price).
   * @param {string|null} [id=null] - The document ID (defaults to null).
   */
  constructor(
    categoryId,
    forAdults,
    forChildren,
    fullName,
    name,
    visitModeIds,
    shownInOffer = false,
    combined = false,
    combinedProductsIds = [],
    onSaleId = [],
    url = "",
    siteTitle = "",
    oldUrls = [],
    description = [],
    shortDescription = [],
    FAQ = [],
    steps = [],
    incentives = [],
    keywords = [],
    pricing = [],
    id = null
  ) {
    this.categoryId = categoryId;
    this.forAdults = forAdults;
    this.forChildren = forChildren;
    this.fullName = fullName;
    this.name = name;
    this.visitModeIds = visitModeIds;
    this.shownInOffer = shownInOffer;
    this.combined = combined;
    this.combinedProductsIds = combinedProductsIds;
    this.onSaleId = onSaleId;
    this.url = url;
    this.siteTitle = siteTitle;
    this.oldUrls = oldUrls;
    this.description = description;
    this.shortDescription = shortDescription;
    this.FAQ = FAQ;
    this.steps = steps;
    this.incentives = incentives;
    this.keywords = keywords;
    this.pricing = pricing;
    this.id = id;
  }

  /**
   * Sets the Firestore instance from the provided context.
   * @param {Object} context - The Firestore context.
   */
  static setContext(context) {
    this._db = context.firestore ? context.firestore : context;
  }

  /**
   * Getter for the Firestore instance.
   * @throws Error if the Firestore context is not set.
   */
  static get db() {
    if (!this._db) {
      throw new Error("Firestore context not set. Please call Product.setContext(context) first.");
    }
    return this._db;
  }

  // Firestore collection name for products.
  static collectionName = "product";

  /**
   * Adds a new product document to Firestore.
   * @returns {Promise} A promise that resolves with the added document reference.
   */
  async add() {
    // Create a data object from instance properties (excluding the id).
    const productData = { ...this };
    delete productData.id;
    try {
      const docRef = await addDoc(
        collection(Product.db, Product.collectionName),
        productData
      );
      Utilities.consoleLog("Product added with ID: " + docRef.id);
      return docRef;
    } catch (error) {
      Utilities.consoleLog("Error adding product: " + error);
      throw error;
    }
  }

  /**
   * Retrieves a product document by its ID.
   * @param {string} id - The Firestore document ID.
   * @returns {Promise<Product|null>} A promise that resolves with a Product instance or null if not found.
   */
  static async getById(id) {
    try {
      const docRef = doc(Product.db, Product.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Construct a new Product instance from the retrieved data.
        return new Product(
          data.categoryId,
          data.forAdults,
          data.forChildren,
          data.fullName,
          data.name,
          data.visitModeIds,
          data.shownInOffer,
          data.combined,
          data.combinedProductsIds,
          data.onSaleId,
          data.url,
          data.siteTitle,
          data.oldUrls,
          data.description,
          data.shortDescription,
          data.FAQ,
          data.steps,
          data.incentives,
          data.keywords,
          data.pricing,
          docSnap.id
        );
      } else {
        return null;
      }
    } catch (error) {
      Utilities.consoleLog("Error retrieving product by id: " + error);
      throw error;
    }
  }

  /**
   * Retrieves all product documents that match the given categoryId.
   * @param {string} categoryId - The category identifier to filter by.
   * @returns {Promise<Array<Product>>} A promise that resolves with an array of Product instances.
   */
  static async getByCategoryId(categoryId) {
    try {
      const q = query(
        collection(Product.db, Product.collectionName),
        where("categoryId", "==", categoryId)
      );
      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        products.push(new Product(
          data.categoryId,
          data.forAdults,
          data.forChildren,
          data.fullName,
          data.name,
          data.visitModeIds,
          data.shownInOffer,
          data.combined,
          data.combinedProductsIds,
          data.onSaleId,
          data.url,
          data.siteTitle,
          data.oldUrls,
          data.description,
          data.shortDescription,
          data.FAQ,
          data.steps,
          data.incentives,
          data.keywords,
          data.pricing,
          docSnap.id
        ));
      });
      return products;
    } catch (error) {
      Utilities.consoleLog("Error retrieving products by categoryId: " + error);
      throw error;
    }
  }

  /**
   * Retrieves product documents by category and age.
   * 
   * Only adds a condition for an age group if the corresponding parameter is true.
   * For example, if called with (categoryId, false, true), it will return all products with
   * the given categoryId that have forChildren === true, regardless of forAdults.
   *
   * @param {string} categoryId - The category identifier.
   * @param {boolean} forAdults - If true, only include products where forAdults is true.
   *                              If false, do not filter based on forAdults.
   * @param {boolean} forChildren - If true, only include products where forChildren is true.
   *                                If false, do not filter based on forChildren.
   * @returns {Promise<Array<Product>>} A promise that resolves with an array of Product instances.
   */
  static async getByCategoryAndAge(categoryId, forAdults, forChildren) {
    try {
      const conditions = [where("categoryId", "==", categoryId)];
      if (forAdults === true) conditions.push(where("forAdults", "==", true));
      if (forChildren === true) conditions.push(where("forChildren", "==", true));
      const q = query(collection(Product.db, Product.collectionName), ...conditions);
      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        products.push(new Product(
          data.categoryId,
          data.forAdults,
          data.forChildren,
          data.fullName,
          data.name,
          data.visitModeIds,
          data.shownInOffer,
          data.combined,
          data.combinedProductsIds,
          data.onSaleId,
          data.url,
          data.siteTitle,
          data.oldUrls,
          data.description,
          data.shortDescription,
          data.FAQ,
          data.steps,
          data.incentives,
          data.keywords,
          data.pricing,
          docSnap.id
        ));
      });
      return products;
    } catch (error) {
      Utilities.consoleLog("Error retrieving products by category and age: " + error);
      throw error;
    }
  }

  /**
   * Updates an existing product document.
   * @returns {Promise<boolean>} A promise that resolves to true if the update is successful.
   */
  async update() {
    if (!this.id) throw new Error("Product ID is required for updates.");
    const docRef = doc(Product.db, Product.collectionName, this.id);
    try {
      // Create an updated data object from instance properties (excluding the id).
      const updatedData = { ...this };
      delete updatedData.id;
      await updateDoc(docRef, updatedData);
      return true;
    } catch (error) {
      Utilities.consoleLog("Error updating product: " + error);
      throw error;
    }
  }

  /**
   * Retrieves the visit modes of a product given its ID.
   * Returns the visitModeIds array.
   * @param {string} productId - The product identifier.
   * @returns {Promise<Array>} A promise that resolves with the array of visit mode IDs.
   */
  static async getVisitModesDetails(productId) {
    try {
      const product = await Product.getById(productId);
      if (!product) throw new Error("Product not found.");
      return product.visitModeIds;
    } catch (error) {
      Utilities.consoleLog("Error retrieving visit modes: " + error);
      throw error;
    }
  }

  /**
   * Retrieves a single product document based on the provided URL or if the URL exists in the oldUrls array.
   * It first checks for an exact match on the "url" field. If not found, it checks if the URL exists in the "oldUrls" array.
   *
   * @param {string} url - The URL to search for.
   * @returns {Promise<Product|null>} A promise that resolves with a Product instance or null if not found.
   */
  static async getByUrlOrOldUrl(url) {
    try {
      // Query for products where the "url" field matches the provided URL.
      const q1 = query(
        collection(Product.db, Product.collectionName),
        where("url", "==", url)
      );
      const snapshot1 = await getDocs(q1);
      if (!snapshot1.empty) {
        // Return the first product found.
        const docSnap = snapshot1.docs[0];
        const data = docSnap.data();
        return new Product(
          data.categoryId,
          data.forAdults,
          data.forChildren,
          data.fullName,
          data.name,
          data.visitModeIds,
          data.shownInOffer,
          data.combined,
          data.combinedProductsIds,
          data.onSaleId,
          data.url,
          data.siteTitle,
          data.oldUrls,
          data.description,
          data.shortDescription,
          data.FAQ,
          data.steps,
          data.incentives,
          data.keywords,
          data.pricing,
          docSnap.id
        );
      }
      // If no product is found by URL, query for products where the "oldUrls" array contains the provided URL.
      const q2 = query(
        collection(Product.db, Product.collectionName),
        where("oldUrls", "array-contains", url)
      );
      const snapshot2 = await getDocs(q2);
      if (!snapshot2.empty) {
        const docSnap = snapshot2.docs[0];
        const data = docSnap.data();
        return new Product(
          data.categoryId,
          data.forAdults,
          data.forChildren,
          data.fullName,
          data.name,
          data.visitModeIds,
          data.shownInOffer,
          data.combined,
          data.combinedProductsIds,
          data.onSaleId,
          data.url,
          data.siteTitle,
          data.oldUrls,
          data.description,
          data.shortDescription,
          data.FAQ,
          data.steps,
          data.incentives,
          data.keywords,
          data.pricing,
          docSnap.id
        );
      }
      return null;
    } catch (error) {
      Utilities.consoleLog("Error retrieving product by url or oldUrls: " + error);
      throw error;
    }
  }
}

export default Product;

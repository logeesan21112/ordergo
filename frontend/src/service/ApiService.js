import axios from "axios";
import CryptoJS from "crypto-js";

export default class ApiService {

  static BASE_URL = process.env.REACT_APP_BASE_URL + "/api";
  static ENCRYPTION_KEY = "ordergo-order-management";

  // encrypt data
  static encrypt(data) {
    return CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY.toString());
  }

  // decrypt data
  static decrypt(data) {
    const bytes = CryptoJS.AES.decrypt(data, this.ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // save token
  static saveToken(token) {
    const encryptedToken = this.encrypt(token);
    localStorage.setItem("token", encryptedToken);
  }

  // get token
  static getToken() {
    const encryptedToken = localStorage.getItem("token");
    if (!encryptedToken) return null;
    return this.decrypt(encryptedToken);
  }

  // save role
  static saveRole(role) {
    const encryptedRole = this.encrypt(role);
    localStorage.setItem("role", encryptedRole);
  }

  // get role
  static getRole() {
    const encryptedRole = localStorage.getItem("role");
    if (!encryptedRole) return null;
    return this.decrypt(encryptedRole);
  }

  // clear auth
  static clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  // get auth headers
  static getHeader() {
    const token = this.getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  /** AUTH **/

  static async registerUser(registerData) {
      const isFormData = registerData instanceof FormData;
      const response = await axios.post(`${this.BASE_URL}/auth/register`, registerData, {
          headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      return response.data;
  }

  static async loginUser(loginData) {
    const response = await axios.post(`${this.BASE_URL}/auth/login`, loginData);
    return response.data;
  }

  static logout() {
    this.clearAuth();
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static isAdmin() {
    return this.getRole() === "ADMIN";
  }

  /** USERS **/

  static async getAllUsers() {
    const response = await axios.get(`${this.BASE_URL}/users/all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getLoggedInUserInfo() {
    const response = await axios.get(`${this.BASE_URL}/users/current`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getUserById(userId) {
    const response = await axios.get(`${this.BASE_URL}/users/${userId}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async updateUser(userId, userData) {
    const isFormData = userData instanceof FormData;
    const response = await axios.put(`${this.BASE_URL}/users/update/${userId}`, userData, {
      headers: {
        ...this.getHeader(),
        ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
      },
    });
    return response.data;
  }

  static async deleteUser(userId) {
    const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getUserDeliveries(userId) {
    const response = await axios.get(`${this.BASE_URL}/users/deliveries/${userId}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  /** DELIVERIES **/

  static async addDelivery(body) {
    const response = await axios.post(`${this.BASE_URL}/deliveries/add`, body, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getAllDeliveries(filter) {
    const response = await axios.get(`${this.BASE_URL}/deliveries/all`, {
      headers: this.getHeader(),
      params: { filter },
    });
    return response.data;
  }

  static async updateDelivery(deliveryId, body) {
    const response = await axios.put(`${this.BASE_URL}/deliveries/update/${deliveryId}`, body, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async deleteDeliveryById(deliveryId) {
    const response = await axios.delete(`${this.BASE_URL}/deliveries/delete/${deliveryId}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getDeliveriesByMonthAndYear(month, year) {
    const response = await axios.get(`${this.BASE_URL}/deliveries/by-month-year`, {
      headers: this.getHeader(),
      params: { month, year },
    });
    return response.data;
  }

  static async getDeliveryById(deliveryId) {
    const response = await axios.get(`${this.BASE_URL}/deliveries/${deliveryId}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async updateDeliveryStatus(deliveryId, status) {
    const response = await axios.put(`${this.BASE_URL}/deliveries/${deliveryId}/status`, status, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getAllDeliveryLocations() {
    const response = await axios.get(`${this.BASE_URL}/deliveries/locations`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  /** EXPENSES **/

  static async addExpense(body) {
    const response = await axios.post(`${this.BASE_URL}/expenses/add`, body, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getAllExpenses() {
    const response = await axios.get(`${this.BASE_URL}/expenses/all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async updateExpense(expenseId, body) {
    const response = await axios.put(`${this.BASE_URL}/expenses/edit/${expenseId}`, body, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async deleteExpenseById(expenseId) {
    const response = await axios.delete(`${this.BASE_URL}/expenses/delete/${expenseId}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async addPettyCash(body) {
    const response = await axios.post(`${this.BASE_URL}/petty-cash/receive`, body, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  /** REVIEWS / DASHBOARD **/

  static async getTodayTotals() {
    const response = await axios.get(`${this.BASE_URL}/reviews/today/totals`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getSummaryReviews() {
    const response = await axios.get(`${this.BASE_URL}/reviews/daily-totals`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getUserReviews(userId) {
    const response = await axios.get(`${this.BASE_URL}/reviews/by-user/${userId}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getDateReviews(date) {
    const response = await axios.get(`${this.BASE_URL}/reviews/by-date/${date}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getUserDateReviews(userId, date) {
    const response = await axios.get(`${this.BASE_URL}/reviews/by-user/${userId}/date/${date}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  /** VENDORS **/

  static async addVendor(formData) {
    const response = await axios.post(`${this.BASE_URL}/vendors/add`, formData, {
      headers: {
        ...this.getHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  static async updateVendor(formData) {
    const response = await axios.put(`${this.BASE_URL}/vendors/update`, formData, {
      headers: {
        ...this.getHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  static async getAllVendors() {
    const response = await axios.get(`${this.BASE_URL}/vendors/all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getVendorById(vendorId) {
    const response = await axios.get(`${this.BASE_URL}/vendors/${vendorId}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async deleteVendor(vendorId) {
    const response = await axios.delete(`${this.BASE_URL}/vendors/delete/${vendorId}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }
}
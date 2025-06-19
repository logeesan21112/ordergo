import axios from "axios";
import CryptoJS from "crypto-js";

export default class ApiService {

    static BASE_URL = process.env.REACT_APP_BASE_URL + "/api";
    static ENCRYPTION_KEY = "quickman-order-management";

    // Encryption / Decryption

    // encrypt data using cryptoJs
    static encrypt(data) {
        return CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY.toString());
    }

    // decrypt data using cryptoJs
    static decrypt(data) {
        const bytes = CryptoJS.AES.decrypt(data, this.ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    // save token with encryption
    static saveToken(token) {
        const encryptedToken = this.encrypt(token);
        localStorage.setItem("token", encryptedToken)
    }

    // retrieve the token
    static getToken() {
        const encryptedToken = localStorage.getItem("token");
        if (!encryptedToken) return null;
        return this.decrypt(encryptedToken);
    }

    // save role with encryption
    static saveRole(role) {
        const encryptedRole = this.encrypt(role);
        localStorage.setItem("role", encryptedRole)
    }

    // retrieve the role
    static getRole() {
        const encryptedRole = localStorage.getItem("role");
        if (!encryptedRole) return null;
        return this.decrypt(encryptedRole);
    }

    // clear authentication info
    static clearAuth() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    // generate authorization headers
    static getHeader() {
        const token = this.getToken();
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }


    /** AUTHENTICATION: LOGIN & REGISTER **/

    static async registerUser(registerData) {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registerData)
        return response.data;
    }

    static async loginUser(loginData) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginData)
        return response.data;
    }

    // Logout helper
    static logout() {
        this.clearAuth()
    }

    static isAuthenticated() {
        const token = this.getToken();
        return !!token;
    }

    static isAdmin() {
        const role = this.getRole();
        return role === "ADMIN";
    }


    /** USERS / PROFILE **/

    static async getAllUsers() {
        const response = await axios.get(`${this.BASE_URL}/users/all`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getLoggedInUsesInfo() {
        const response = await axios.get(`${this.BASE_URL}/users/current`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getUserById(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/${userId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async updateUser(userId, userData) {
        const response = await axios.put(`${this.BASE_URL}/users/update/${userId}`, userData, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async deleteUser(userId) {
        const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }


    /** ORDERS / TRANSACTIONS **/

    static async sellProduct(body) {
        const response = await axios.post(`${this.BASE_URL}/transactions/sell`, body, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getAllTransactions(filter) {
        const response = await axios.get(`${this.BASE_URL}/transactions/all`, {
            headers: this.getHeader(),
            params: { filter }
        });
        return response.data;
    }

    static async updateTransaction(transactionId, body) {
        const response = await axios.put(`${this.BASE_URL}/transactions/update/${transactionId}`, body, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async deleteTransactionById(transactionId) {
        const response = await axios.delete(`${this.BASE_URL}/transactions/delete/${transactionId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async geTransactionsByMonthAndYear(month, year) {
        const response = await axios.get(`${this.BASE_URL}/transactions/by-month-year`, {
            headers: this.getHeader(),
            params: {
                month: month,
                year: year
            }
        });
        return response.data;
    }

    static async getTransactionById(transactionId) {
        const response = await axios.get(`${this.BASE_URL}/transactions/${transactionId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async updateTransactionStatus(transactionId, status) {
        const response = await axios.put(`${this.BASE_URL}/transactions/${transactionId}`, status, {
            headers: this.getHeader()
        });
        return response.data;
    }


    /** EXPENSES / CHARGES **/

    static async addCharge(body) {
        const response = await axios.post(`${this.BASE_URL}/charges/add`, body, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getAllCharges() {
        const response = await axios.get(`${this.BASE_URL}/charges/all`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async updateCharge(chargeId, body) {
        const response = await axios.put(`${this.BASE_URL}/charges/edit/${chargeId}`, body, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async deleteChargeById(chargeId) {
        const response = await axios.delete(`${this.BASE_URL}/charges/delete/${chargeId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async addPattyCash(body) {
        const response = await axios.post(
            `${this.BASE_URL}/pattycash/receive`,
            body,
            { headers: this.getHeader() }
        );
        return response.data;
    }


    /** DASHBOARD / REVIEWS **/

    static async getTodayTotals() {
        const response = await axios.get(`${this.BASE_URL}/reviews/today/totals`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async getSummaryReviews() {
        const response = await axios.get(`${this.BASE_URL}/reviews/daily-totals`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getUserReviews(userId) {
        const response = await axios.get(`${this.BASE_URL}/reviews/by-user/${userId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getDateReviews(date) {
        const response = await axios.get(`${this.BASE_URL}/reviews/by-date/${date}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getUserDateReviews(userId, date) {
        const response = await axios.get(`${this.BASE_URL}/reviews/by-user/${userId}/date/${date}`, {
            headers: this.getHeader()
        });
        return response.data;
    }


    /** VENDOR / PRODUCTS **/

    static async addProduct(formData) {
        const response = await axios.post(`${this.BASE_URL}/products/add`, formData, {
            headers: {
                ...this.getHeader(),
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }

    static async updateProduct(formData) {
        const response = await axios.put(`${this.BASE_URL}/products/update`, formData, {
            headers: {
                ...this.getHeader(),
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }

    static async getAllProducts() {
        const response = await axios.get(`${this.BASE_URL}/products/all`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getProductById(productId) {
        const response = await axios.get(`${this.BASE_URL}/products/${productId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async searchProduct(searchValue) {
        const response = await axios.get(`${this.BASE_URL}/products/search`, {
            params: { searchValue },
            headers: this.getHeader()
        });
        return response.data;
    }

    static async deleteProduct(productId) {
        const response = await axios.delete(`${this.BASE_URL}/products/delete/${productId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }


    /** LOCATIONS **/

    static async getAllTransactionLocations() {
        const response = await axios.get(`${this.BASE_URL}/transactions/locations`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    // (No separate methods for riders specifically here, but can be added if you have related API)

}

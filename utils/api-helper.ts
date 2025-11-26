import { APIRequestContext, expect } from '@playwright/test';

/**
 * Helper para interacciones con la API de automationexercise.com
 */
export class ApiHelper {
  readonly request: APIRequestContext;
  readonly baseURL: string = 'https://automationexercise.com/api';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Login via API
   */
  async login(email: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    const response = await this.request.post(`${this.baseURL}/verifyLogin`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formData.toString(),
    });

    return response;
  }

  /**
   * Obtener lista de productos
   */
  async getProductsList() {
    const response = await this.request.get(`${this.baseURL}/productsList`);
    return response;
  }

  /**
   * Crear cuenta de usuario
   */
  async createAccount(userData: {
    name: string;
    email: string;
    password: string;
    title?: string;
    birth_date?: string;
    birth_month?: string;
    birth_year?: string;
    firstname?: string;
    lastname?: string;
    company?: string;
    address1?: string;
    address2?: string;
    country?: string;
    zipcode?: string;
    state?: string;
    city?: string;
    mobile_number?: string;
  }) {
    const formData = new URLSearchParams();
    Object.entries(userData).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const response = await this.request.post(`${this.baseURL}/createAccount`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formData.toString(),
    });

    return response;
  }

  /**
   * Obtener detalles de usuario por email
   */
  async getUserDetailByEmail(email: string) {
    const formData = new URLSearchParams();
    formData.append('email', email);

    const response = await this.request.get(`${this.baseURL}/getUserDetailByEmail?${formData.toString()}`);
    return response;
  }

  /**
   * Eliminar cuenta
   */
  async deleteAccount(email: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    const response = await this.request.delete(`${this.baseURL}/deleteAccount`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formData.toString(),
    });

    return response;
  }

  /**
   * Buscar producto
   */
  async searchProduct(searchTerm: string) {
    const formData = new URLSearchParams();
    formData.append('search_product', searchTerm);

    const response = await this.request.post(`${this.baseURL}/searchProduct`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formData.toString(),
    });

    return response;
  }
}

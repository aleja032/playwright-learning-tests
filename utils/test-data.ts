/**
 * Datos de prueba centralizados
 */

import { title } from "process";

export const TEST_USERS = {
  valid: {
    email: 'testqauser@example.com',
    password: 'Test@123',
    name: 'Testuser',
  },
  billingAddress: {
      title: "Your delivery address",
      fullName: "Mr. Testuser user",
      company: "Something",
      street: "kane Street,falt no 234,usa",
      country: "usa",
      cityZip: "newyork new 144258",
      state: "India",
      phone: "235478961",
      commentCheckout: "Por favor, entregar en la mañana",
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'wrongpass',
  },
  nonExistent: {
    email: 'nonexistent@example.com',
    password: 'anypassword',
  },
};

export const PAYMENT_DATA = {
  cardName: 'Test User',
  cardNumber: '4111111111111111',
  cvc: '123',
  expiryMonth: '12',
  expiryYear: '2027',

};
export const successMessage = "Congratulations! Your order has been confirmed!";

export function generateRandomEmail(): string {
  const timestamp = Date.now();
  return `testuser${timestamp}@example.com`;
}

export function generateUserData() {
  const timestamp = Date.now();
  return {
    name: `Test User ${timestamp}`,
    email: generateRandomEmail(),
    password: 'Test@123',
    title: 'Mr',
    birth_date: '15',
    birth_month: '5',
    birth_year: '1990',
    firstname: 'Test',
    lastname: 'User',
    company: 'Test Company',
    address1: '123 Test Street',
    address2: 'Apt 4B',
    country: 'United States',
    zipcode: '12345',
    state: 'California',
    city: 'Los Angeles',
    mobile_number: '1234567890',
  };
}

class Subscriber {
  constructor(subscriberData = {}) {
    this.email = subscriberData.email;
    this.firstName = subscriberData.firstName;
    this.lastName = subscriberData.lastName;
    this.isNotified = subscriberData.isNotified || false; // Track if we've sent launch email
    this.subscribedAt = subscriberData.subscribedAt || new Date();
    this.source = subscriberData.source || 'website'; // Track where they signed up
  }

  // Validate subscriber data
  validate() {
    const errors = [];

    if (!this.email || this.email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('Please provide a valid email address');
    }

    // First name is optional but validate if provided
    if (this.firstName && this.firstName.trim().length === 0) {
      errors.push('First name cannot be empty if provided');
    }

    // Last name is optional but validate if provided
    if (this.lastName && this.lastName.trim().length === 0) {
      errors.push('Last name cannot be empty if provided');
    }

    return errors;
  }

  // Email validation helper
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Normalize email (lowercase, trim)
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }

  // Convert to database object
  toObject() {
    return {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      isNotified: this.isNotified,
      subscribedAt: this.subscribedAt,
      source: this.source
    };
  }

  // Get display name
  getDisplayName() {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    } else if (this.firstName) {
      return this.firstName;
    } else if (this.lastName) {
      return this.lastName;
    }
    return this.email;
  }
}

module.exports = Subscriber;

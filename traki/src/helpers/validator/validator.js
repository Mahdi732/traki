export const validators = {
    email: (email) => {
        if (email.trim() == "") {
            return {
                isValid: false,
                message: "the email is empty please type email with crrect format"
            }
        }
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            return {
                isValid: false,
                message: "the email is not respect the correct format"
            }
        }
        return {
            isValid: true,
            message: "email is valid"
        }
    },

    password: (password) => {
        const errors = [];
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[@$!%*?&]/.test(password);
        const minLength = password.trim().length >= 8;

        if (!minLength) {
            errors.push("Password must be at least 8 characters long.");
        }
        if (!hasUpperCase) {
            errors.push("Password must contain at least one uppercase letter.");
        }
        if (!hasLowerCase) {
            errors.push("Password must have at least one lowercase letter.");
        }
        if (!hasNumber) {
            errors.push("Password must have at least one number.");
        }
        if (!hasSpecial) {
            errors.push("Password must have at least one special character.");
        }

        return errors.length ? {
            isValid: true,
            message: "password is valid"
        } : {
            isValid: false,
            message: errors
        }
    },
    name: (name) => {
        if (name.trim() == '') {
            return {
                isValid: false,
                message: "the should at least contain more than 4 character"
            }
        }

        return {
            isValid: true,
            message: "name is valid"
        }
    },

    // Truck validators
    plateNumber: (plateNumber) => {
        if (!plateNumber.trim()) {
            return {
                isValid: false,
                message: "Plate number is required"
            }
        }
        return {
            isValid: true,
            message: "Plate number is valid"
        }
    },

    make: (make) => {
        if (!make.trim()) {
            return {
                isValid: false,
                message: "Make (manufacturer) is required"
            }
        }
        return {
            isValid: true,
            message: "Make is valid"
        }
    },

    model: (model) => {
        if (!model.trim()) {
            return {
                isValid: false,
                message: "Model is required"
            }
        }
        return {
            isValid: true,
            message: "Model is valid"
        }
    },

    year: (year) => {
        if (!year) {
            return {
                isValid: false,
                message: "Year is required"
            }
        }
        const yearNum = parseInt(year);
        const currentYear = new Date().getFullYear();
        
        if (yearNum < 1900 || yearNum > currentYear + 1) {
            return {
                isValid: false,
                message: `Year must be between 1900 and ${currentYear + 1}`
            }
        }
        return {
            isValid: true,
            message: "Year is valid"
        }
    },

    capacity: (capacity) => {
        if (!capacity) {
            return {
                isValid: false,
                message: "Capacity is required"
            }
        }
        const capacityNum = parseInt(capacity);
        if (capacityNum <= 0) {
            return {
                isValid: false,
                message: "Capacity must be greater than 0"
            }
        }
        return {
            isValid: true,
            message: "Capacity is valid"
        }
    }
}
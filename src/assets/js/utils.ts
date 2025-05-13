import { AllowedValidityKeys } from "./types";

/**
 * Validation messages to use
 */
const validationMessages: Record<AllowedValidityKeys, string> = {
    valueMissing: 'This field is required',
    typeMismatch: 'Please provide a valid value',
    patternMismatch: 'Please provide a valid phone number',
    tooShort: 'Name should have at least 2 characters long'
}

/**
 * Function that adds new hidden field to be used to store unmaked phone value.
 * 
 * @param phoneInput Input to be masked
 * @param fieldPrefix Prefix to use as part of the id on new hidden input created
 * @returns void
 */
export function initMaskedPhoneInput(phoneInput: HTMLInputElement, fieldPrefix: string) {
    // Create an unique id to assign to new hidden field to append
    // converting date value to hex for a shorter version
    const idSuffix = Date.now().toString(16);
    const fieldName = phoneInput.getAttribute('name')?.trim();

    // Check if the field passed has a valid `name` attribute, else, return earlier
    // meaning, no masking will happen on the field
    if (false === !!fieldName) {
        return;
    }

    // Add a new `data-id` to input received to link new hidden field later
    phoneInput.dataset.idSuffix = idSuffix;

    // Create new hidden field to store unmasked value
    const hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('id', `${fieldPrefix}-${idSuffix}`);
    hiddenField.setAttribute('name', fieldName);

    // Append new created field as sibling of received element
    phoneInput.insertAdjacentElement('afterend', hiddenField);

    // Remove name attribute from received field, so, that value does not gets send
    phoneInput.removeAttribute('name');
}

/**
 * Function used to mask the phone field input and store unmasked value on appropriate input
 * 
 * @param e  Event resulting from input on phone field
 * @param fieldPrefix String used to retrieve the hidden input to use
 * @returns void
 */
export function handleInputPhoneField(e: InputEvent, fieldPrefix: string) {
    const input = e.target as HTMLInputElement;

    // Get prefix value from input, so, we can update the unmasked value to send
    const suffix = input.dataset.idSuffix;
    
    // Keep only digits from input's value
    const digits = input.value.replace(/\D/g, '').slice(0, 10);
    const lenDigits = digits.length;
    const selectionStart = input.selectionStart || 0; // Will be used to smart position the cursor

    let maskedNumber = '';

    // Append first opening parentheses
    if (0 < lenDigits) {
        maskedNumber = `(${digits.slice(0, 3)}`;
    }

    // Append closing parentheses
    if (4 <= lenDigits) {
        maskedNumber = `${maskedNumber}) ${digits.slice(3, 6)}`;
    }

    // Append dash
    if (7 <=lenDigits ) {
        maskedNumber = `${maskedNumber}-${digits.slice(6)}`;
    }

    // Before modifying the input with the masked value, track cursor offset from end
    const oldOffset = input.value.length - selectionStart;

    // Set value to visible input 
    input.value = maskedNumber;

    // Set value to hidden input, only if the digits lenght === 10 aka when the phone number is complete
    if (10 === lenDigits) {
        // Retrieve hiddden input
        const hiddenInput = document.getElementById(`${fieldPrefix}-${suffix}`) as HTMLInputElement | null;

        // If no input was retrieved return earlier
        if (null === hiddenInput) {
            return;
        }

        // Set value to hidden input
        hiddenInput.value = digits;
    }

    // Get new position where we'll be moving the cursor to allow editing from the middle
    const newCursorPosition = maskedNumber.length - oldOffset;
    input.setSelectionRange(newCursorPosition, newCursorPosition);
}

/**
 * Function used to handle form submission, it validates the inputs and send the information when the form is valid
 * 
 * @param e The submit event
 */
export function handleFormSubmission(e: SubmitEvent) {
    // Prevent form submission
    e.preventDefault();

    let isFormValid = true;
    const form = e.target as HTMLFormElement;

    const elements = getInputsFromForm(form);

    elements.forEach((input) => {
        if (false === input.checkValidity()) {
            isFormValid = false;
            validateInput(input);
        }
    })

    // Submit form
    if (true === isFormValid) {
        const ctaButton = e.submitter as HTMLButtonElement | HTMLInputElement;

        ctaButton.classList.add('loading');
        ctaButton.setAttribute('disabled', 'disabled');

        submitForm(form)
        .then(response => console.log(response))
        .catch(error => console.error({error}))
        .finally(() => {
            ctaButton.classList.remove('loading');
            ctaButton.textContent = 'Submitted';
        });
    }
}

function submitForm(form: HTMLFormElement): Promise<Response> {
    const action = form.action;
    const data = new FormData(form);
    const method = form.method.toUpperCase();

    // If no action is set, return
    if (false === !!action) {
        return Promise.reject(new Error('Cannot send form because no action was provided'));
    }

    const fetchOptions: RequestInit = {
        method,
        headers: {},
    };

    if ('GET' === method) {
        const params = new URLSearchParams(data as any).toString();
        return fetch(`${action}?${params}`, fetchOptions);
    } else {
        fetchOptions.body = data;
        return fetch(action, fetchOptions);
    }
}

/**
 * Function used to retrieve the validation message for the element received as parameter.
 * 
 * @param element The element to retrieve validation message
 * @returns 
 */
function getValidationMessage(element: HTMLInputElement): string {
    const validity = element.validity;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    // Add stricter email validation
    if ('email' === element.type && false === emailRegex.test(element.value)) {
        element.setCustomValidity('Please, provide a valid email address');
    } else {
        element.setCustomValidity('');
    }

    // Check if we have validation issues
    for (const key in validity) {
        if (true === validity[key as keyof ValidityState]) {
            let validationMessage = validationMessages[key as keyof ValidityState] || element.validationMessage;

            // if issue is typeMismatch and input type is email, then send custom message for email
            if ('typeMismatch' === key && 'email' === element.type) {
                validationMessage = 'Please, provide a valid email address';
            }

            return validationMessage;
        }
    }

    // return empty string when we don't have validation issues
    return '';
}

/**
 * Function that validates the input received as parameter and set error message and class when invalid
 * 
 * @param input Input to validate
 * @returns 
 */
export function validateInput(input: HTMLInputElement) {
    const message = getValidationMessage(input);

    // get input div parent
    const parent = input.parentElement;

    // In case we're not able to get a valid parent, return earlier
    if (false === !!parent) {
        return;
    }

    // Set message data attr to input
    parent.dataset.errorMessage = message;
    false === !!message ? parent.classList.remove('invalid-field') : parent.classList.add('invalid-field');
}

/**
 * Function that returns all the inputs that belongs to the form that is passed as parameter
 * 
 * @param form The form to use to retrieve the inputs
 * @returns 
 */
export function getInputsFromForm(form: HTMLFormElement): HTMLInputElement[] {
    return Array.from(form.elements).filter((el) => el instanceof HTMLInputElement);
}
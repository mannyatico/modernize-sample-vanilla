import {
    initMaskedPhoneInput,
    handleInputPhoneField,
    handleFormSubmission,
    validateInput,
    getInputsFromForm,
} from "./assets/js/utils";

(function() {
    const FIELD_PREFIX = 'phoneField';
    // Get all forms to validate
    const forms = document.querySelectorAll('.form-wrapper__form') as NodeListOf<HTMLFormElement>;
    // Get all phone inputs to mask
    const phoneFields = document.querySelectorAll('.use-phone-mask');
    
    // Add masking to all phone fields retrieved
    phoneFields.forEach((input) => {
        // Add hidden input to store unmasked phone value
        initMaskedPhoneInput(input as HTMLInputElement, FIELD_PREFIX);

        // Add listener to mask values when user inputs their phone number
        input.addEventListener('input', (e) => handleInputPhoneField(e as InputEvent, FIELD_PREFIX))
    });
    
    forms.forEach((form) => {
        // Handle form validation and submission 
        form.addEventListener('submit', (e) => handleFormSubmission(e as SubmitEvent))

        // Get only input fields from form
        const inputs = getInputsFromForm(form);

        // Add a blur event listener to each field retrieved
        inputs.forEach((el) => el.addEventListener('blur', (e) => {
            const field = e.target as HTMLInputElement;
            validateInput(field);
        }));
    });
})();
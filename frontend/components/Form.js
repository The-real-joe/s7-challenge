import React, { useEffect, useState } from 'react';
import * as yup from 'yup';

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
};

// 👇 Here you will create your schema.
const validationSchema = yup.object().shape({
  fullName: yup.string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required('Full Name is required'),
  size: yup.string()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
    .required('Size is required'),
});

// 👇 This function will be used to validate your form.
const validateForm = async (data) => {
  try {
    await validationSchema.validate(data, { abortEarly: false });
    return null; // No errors
  } catch (err) {
    return err.errors.reduce((acc, curr) => {
      acc[curr.split(' ')[0]] = curr; // Extract the field name from the error message
      return acc;
    }, {});
  }
};

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
];

export default function Form() {
  const [formData, setFormData] = useState({
    fullName: '',
    size: '',
    toppings: {}
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prevData => ({
        ...prevData,
        toppings: {
          ...prevData.toppings,
          [name]: checked
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = await validateForm(formData);
    if (formErrors) {
      setErrors(formErrors);
      setSubmitStatus('failure');
    } else {
      // Submit logic here
      setErrors({});
      setSubmitStatus('success');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {submitStatus === 'success' && <div className='success'>Thank you for your order!</div>}
      {submitStatus === 'failure' && <div className='failure'>Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
            placeholder="Type full name"
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <div className='error'>{errors.fullName}</div>}
        </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
          >
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
          {errors.size && <div className='error'>{errors.size}</div>}
        </div>
      </div>

      <div className="input-group">
        {/* Dynamically generate checkboxes */}
        {toppings.map(topping => (
          <label key={topping.topping_id}>
            <input
              name={topping.text}
              type="checkbox"
              checked={formData.toppings[topping.text] || false}
              onChange={handleChange}
            />
            {topping.text}<br />
          </label>
        ))}
      </div>
      <input type="submit" disabled={!formData.fullName || !formData.size} />
    </form>
  );
}

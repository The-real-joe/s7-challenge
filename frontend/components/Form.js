import React, { useEffect, useState } from 'react'
import * as yup from 'yup'


// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}


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
const validationForm = async (data) => {
  try {
    const valid = await validationSchema.validate(data)
    return [null, valid]
  } catch (err) {
    const error = err.message
    return [error, null]
  }
}


// 👇 This function will be used to validate your form.
const validateForm = async (data) => {
  try {
    const valid = await formSchema.validate(data)
    return [null, valid]
  } catch (err) {
    const error = err.message
    return [error, null]
  }
}

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]



export default function Form() {
  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [values, setValues] = useState({
    fullName: '',
    size: '',
    pepperoni: false,
    peppers: false,
    pineapple: false,
    mushrooms: false,
    ham: false,
  })
  const [errors, setErrors] = useState()
  const [success, setSuccess] = useState()


  const onSubmit = (event) => {
    event.preventDefault()
    setErrors()
    setSuccess()
    validationForm(values)
      .then((result) => {
        if (result[1]) {
          setSuccess('Thank you for your order!')
        } else {
          setErrors(result[0])
        }
      })
      .catch((err) => console.error(err))
  }
  const updateFormMode= (event) =>{
    setValues({
      ...values,
      [event.target.id]: event.target.value
    })
    if ((event.target.id== "fullName" && event.target.value.length >= 3) && (event.target.id== "size" && event.target.value !== "")) {
      setSubmitDisabled(true)
    }else if (event.target.id== "fullName" && event.target.value.length < 3){
      setSubmitDisabled(false)
    }

  
}

  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {success && <div className='success'>{success}</div>}
      {errors && <div className='failure'>{errors}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input onChange={(event) =>updateFormMode(event)} placeholder="Type full name" id="fullName" type="text" />
        </div>
        {errors && <div className='error'>Bad value</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size">
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors && <div className='error'>Bad value</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}

        <label key="1">
          <input
            name="Pepperoni"
            type="checkbox"
          />
          Pepperoni<br />
        </label>

        <label key="2">
          <input
            name="Green Peppers"
            type="checkbox"
          />
          Green Peppers<br />
        </label>

        <label key="3">
          <input
            name="Pineapple"
            type="checkbox"
          />
          Pineapple<br />
        </label>

        <label key="4">
          <input
            name="Mushrooms"
            type="checkbox"
          />
          Mushrooms<br />
        </label>

        <label key="5">
          <input
            name="Ham"
            type="checkbox"
          />
          Ham<br />
        </label>
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit"  disabled={!submitDisabled} />
    </form>

    
  )
}

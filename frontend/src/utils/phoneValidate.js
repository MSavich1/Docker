import * as Yup from "yup";

const phoneRegExp = /((8|\+7)-?)?\(?\d{3}\)?-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}/

export const createNumberValidate = () => {
   return Yup.string().matches(phoneRegExp, 'Phone number is not valid')
}
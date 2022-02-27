import React from 'react';
import {
  Formik,
} from 'formik';

function createControl() {
  return {
      validateForms: async function validateForms(){
          const microformsNames = Object.keys(this.microforms);
          const microformsValidation = microformsNames.map((microformName) => {
              return this.microforms[microformName].validateForm();
          });

          const validateResults = await Promise.all(microformsValidation);
          const hasMicroformsErrors = validateResults.some((validationResult) => {
              return (Object.keys(validationResult).length > 0);
          });

          return hasMicroformsErrors;
      },
      getAllValues: function getAllValues() {
          const formsValues = {};

          const microformsNames = Object.keys(this.microforms);
          microformsNames.forEach((microformName) => {
              formsValues[microformName] = this.microforms[microformName].values;
          });

          return formsValues;
      },
      /* Список всех микроформ */
      microforms: {},
  }
}

/**
 * Хук для создание коллекций микроформ и управления ими
 */
export function useMicroform() {
    const defaultContextValue = {
      /* Список всех микроформ */
      microformsList: {},
      /* Эффект для обновления микроформ */
      changeMicroformsList: () => {},
      /* Специальный объект для управления формами извне (Внешнее API) */
      microformsControl: createControl(),
    }

    const [MicroformsContext] = React.useState(React.createContext(defaultContextValue));

    MicroformsContext.displayName = 'MicroformContext';

    const [microformsControl] = React.useState(createControl());

    function MicroformContext(props) {
        const { children } = props;
        const [microformsList, changeMicroformsList] = React.useState({});

        return (
            <React.Fragment>
                <MicroformsContext.Provider value={ {
                    microformsList,
                    changeMicroformsList,
                    microformsControl,
                } }
                >
                    { children }
                </MicroformsContext.Provider>
            </React.Fragment>
        );
    }

    function Microform(props) {
        const {
            name,
            options,
            children,
        } = props;

        return (
            <MicroformsContext.Consumer>
                { (microformsContextValue) => (
                    <Formik
                        { ...options }
                    >
                        { (formikProps) => (
                            <FormHelper
                                name={ name }
                                formikProps={ formikProps }
                                microformsContextValue={ microformsContextValue }
                                options={ options }
                            >
                                { children }
                            </FormHelper>
                        ) }
                    </Formik>
                ) }
            </MicroformsContext.Consumer>
        );
    }

   

    function FormHelper(props) {
        const {
            name: microformName,
            formikProps,
            microformsContextValue,
            children,
        } = props;

        const {
            microformsList: microforms,
            changeMicroformsList,
            microformsControl: control,
        } = microformsContextValue;

        /* При изменении формы обновляем ссылки для внешнего API */
        React.useEffect(() => {
            control.microforms[microformName] = {
                values: formikProps.values,
                validateForm: formikProps.validateForm,
            };

            return function cleanup() {
                delete microforms[microformName];
            };
        }, [formikProps]); // eslint-disable-line

        /* При изменении значений формы вызывается хук для принудительного рендера MacroForm чтобы дочерние элементы так же получили рендер с новыми значениями */
        React.useEffect(() => {
            changeMicroformsList({
                ...microforms,
            });
        }, [formikProps.values]);  // eslint-disable-line

        return (
            <React.Fragment>
                { children(formikProps, microformsControl) }
            </React.Fragment>
        );
    }

    const [api] = React.useState({
        MicroformContext,
        Microform,
        microformsControl,
    });

    return api;
}

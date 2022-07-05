import { useState } from "react";
import style from "./Forms.module.css"
import { Channel } from "./Channel/index";
import { Social } from "./Social/index";
import { PhoneNumber } from "./PhoneNumber/index";
import { useMicroform } from "../../utils/microFormik";
import { TOKEN } from "../../constants";


export const Forms = ({ setAuth }) => {
  const { MicroformContext, Microform, microformsControl } = useMicroform();
  const [check, setCheck] = useState(false);
  const [valid, setValid] = useState(null);

  const onClickCheck = async () => {
    const valid = await microformsControl.validateForms();
    const validInput =
      await microformsControl.microforms.channel.validateForm();

    if (!valid) {
      setCheck(true);
    }
    setValid(validInput);
  };
  
  const onClickLogOut = () => {
    localStorage.removeItem(TOKEN);
    setAuth(false);
  };

  return (
    <>
      {!check ? (
        <>
          <button onClick={onClickLogOut}>Log out</button>
          <MicroformContext>
            <Channel microform={Microform} />
            <PhoneNumber microform={Microform} />
            <Social microform={Microform} />
          </MicroformContext>
          <button onClick={onClickCheck}>check</button>
          {valid &&
            Object.entries(valid).map((el) => (
              <div className={style.requiredField}>
                {[el[0]]}: {[el[1]]}
              </div>
            ))}
        </>
      ) : (
        <div>Misson complete</div>
      )}
    </>
  );
};

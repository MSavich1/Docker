import { Channel } from "./Channel/Channel";
import { Social } from "./Social/Social";
import { PhoneNumber } from "./PhoneNumber/PhoneNumber";
import { useMicroform } from "../../utils/microFormik";
import { useState } from "react";

export const Forms = ({ setAuth }) => {
  const { MicroformContext, Microform, microformsControl } = useMicroform();
  const [check, setCheck] = useState(false);
  const [valid, setValid] = useState(null)

  const onClickCheck = async () => {
    const valid = await microformsControl.validateForms();
    const validInput = await microformsControl.microforms.channel.validateForm();
    if (!valid) {
      setCheck(true);
    }
    setValid(validInput)
  };
  const onClickLogOut = () => {
    localStorage.removeItem("token");
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
          {valid && Object.entries(valid).map(el => <div style={{padding:"5px"}}>{[el[0]]}: {[el[1]]}</div>)}
        </>
        
      ) 
      : <div>Misson complete</div>}
    </>
  );
};

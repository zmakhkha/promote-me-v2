import React, { useState } from "react";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";

export type ImageItem = {
  id: string;
  file?: File;
  url?: string;
  isProfile: boolean;
};

const CompleteProfileModal = () => {

	// useEffect(()=>{
	// 	const f1()=>{
	// 		console.log("hhua");
	// 	}
	// 	f1();
	// })
	// const f1()=>{
	// 	console.log("hhua");
	// }
	// useEffect(()=>{
	// 	f1();
	// })
  const [step, setStep] = useState(1);

  let content;
  switch (step) {
    case 1:
		content = <Step2 setStep={setStep} />;
		break;
		case 2:
		content = <Step1 setStep={setStep} />;
      // Add respective Step component for Step 2, 3, 4
      break;
    case 3:
      content = <div>Step 3 Content</div>;
      break;
    case 4:
      content = <div>Step 4 Content</div>;
      break;
    default:
      content = <div>Unknown step</div>;
  }

  return <>{content}</>;
};

export default CompleteProfileModal;

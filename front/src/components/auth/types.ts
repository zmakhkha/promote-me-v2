export type RegisterFormData = {
	email: string;
	confirmationCode: string;
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	gender: string;
	lookingFor: string;
	interests: string[];
	photo: File | null;
  };


export interface USerProfile {
	email: string;
	id : number;
	isOnline : boolean;
	username : string;
	first_name : string;
	last_name : string;
	age : number;
	gender : string;
	location : string;
	bio : string;
    interests: [],
	// interests : string;
	status : string;
	image_url : string;
	snapchat : string;
	instagram : string;
	tiktok : string;
	points : number;
	likes : number;
	views : number;
	
  }
  
export interface ApiError {
	response?: {
	  data?: {
		detail?: string;
	  };
	};
	message?: string; // Fallback error message
  }
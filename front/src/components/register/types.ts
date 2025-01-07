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
  
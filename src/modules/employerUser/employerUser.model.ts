import mongoose, { Schema, Document } from 'mongoose';
import { IEmployerCompanyInfo, IEmployerFoundingInfo, IEmployerSocialMedia, IEmployerContact } from './employerUser.interface'; // Import the interface
const employerCompanyInfoSchema = new Schema<IEmployerCompanyInfo>({
    logo: {
      filePathURL: { type: String, required: false },
      fileOriginalName: { type: String, required: false },
      fileServerName: { type: String, required: false },
      pathA: { type: String, required: false }
    },
    banner: {
      filePathURL: { type: String, required: false },
      fileOriginalName: { type: String, required: false },
      fileServerName: { type: String, required: false },
      pathA: { type: String, required: false }
    },
    companyName: { type: String, required: false },
    aboutUs: { type: String, required: false },
    userId: { type: mongoose.Types.ObjectId, ref: 'generalUser', required: false },
    email: { type: String, required: true }
  });
  
  const EmployerCompanyInfo = mongoose.model<IEmployerCompanyInfo>('EmployerCompanyInfo', employerCompanyInfoSchema);
  const employerFoundingInfoSchema = new Schema<IEmployerFoundingInfo>({
    organizationType: { type: String, required: false },
    industryType: { type: String, required: false },
    teamSize: { type: String, required: false },
    foundIN: { type: Date, required: false },
    companyWebsite: { type: String, required: false },
    companyVision: { type: String, required: false },
    userId: { type: mongoose.Types.ObjectId, ref: 'generalUser', required: false },
    email: { type: String, required: true }
  });
  
  const EmployerFoundingInfo = mongoose.model<IEmployerFoundingInfo>('EmployerFoundingInfo', employerFoundingInfoSchema);
  const employerSocialMediaSchema = new Schema<IEmployerSocialMedia>({
    facebookLink: { type: String, required: false },
    xLink: { type: String, required: false },
    instagramLink: { type: String, required: false },
    linkedinLink: { type: String, required: false },
    userId: { type: mongoose.Types.ObjectId, ref: 'generalUser', required: false },
    email: { type: String, required: true }
  });
  const EmployerSocialMedia = mongoose.model<IEmployerSocialMedia>('EmployerSocialMedia', employerSocialMediaSchema);

  const employerContactSchema = new Schema<IEmployerContact>({
    fullAddress: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    userId: { type: mongoose.Types.ObjectId, ref: 'generalUser', required: false },
    email: { type: String, required: true }
  });
  
  const EmployerContact = mongoose.model<IEmployerContact>('EmployerContact', employerContactSchema);
  export { EmployerCompanyInfo,EmployerFoundingInfo,EmployerSocialMedia,EmployerContact };
// src/features/resume/resumeSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Define interfaces for better type safety (optional, can be removed if not using TypeScript)
const initialPersonalInfo = {
  firstName: '',
  lastName: '',
  professionalTitle: '',
  phoneNumber: '',
  emailAddress: '',
  skype: '',
  linkedIn: '',
  portfolio: '',
  profilePicture: '',
  fatherName: '',
  motherName: '',
  spouseName: '',
  nid: '',
  passport: '',
  address: { street: '', city: '', postal: '', country: '' },
  permanentAddress: { street: '', city: '', postal: '', country: '' },
};

const initialWorkExperience = {
  companyName: '',
  position: '',
  city: '',
  country: '',
  from: '',
  to: '',
  currentlyWorking: false,
  description: [],
};

const initialEducation = {
  institutionName: '',
  fieldOfStudy: '',
  degree: '',
  city: '',
  country: '',
  from: '',
  to: '',
  gpa: '',
  honors: '',
  currentlyStudying: false,
  description: [],
};

const initialTraining = {
  name: '',
  institution: '',
  duration: '',
  from: '',
  to: '',
  description: [],
};

const initialCertification = {
  name: '',
  authority: '',
  urlCode: '',
  date: '',
  description: [],
};

const initialSkillCategory = {
  category: '',
  skills: [{ name: '', level: '' }],
};

const initialReference = {
  name: '',
  position: '',
  company: '',
  phone: '',
  email: '',
  relationship: '',
};

const initialState = {
  personalInfo: { ...initialPersonalInfo },
  careerObjective: '',
  careerSummary: '',
  workExperience: [],
  education: [],
  trainings: [],
  certifications: [],
  skills: [],
  references: [],
  template: 'Smart', // Default template, added for dynamic selection
  lastUpdated: '2025-08-16T18:14:00+06:00', // Timestamp for last update
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    // Reset the entire resume state
    resetResume: () => initialState,

    // Personal Information
    updatePersonalInfo(state, action) {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },

    // Career Sections
    updateCareerObjective(state, action) {
      state.careerObjective = action.payload;
    },
    updateCareerSummary(state, action) {
      state.careerSummary = action.payload;
    },

    // Work Experience
    addWorkExperience(state) {
      state.workExperience.push({ ...initialWorkExperience });
    },
    updateWorkExperience(state, action) {
      const { index, data } = action.payload;
      if (state.workExperience[index]) {
        state.workExperience[index] = { ...state.workExperience[index], ...data };
      }
    },
    removeWorkExperience(state, action) {
      state.workExperience.splice(action.payload, 1);
    },
    addDescriptionToWork(state, action) {
      const { index } = action.payload;
      if (state.workExperience[index]) {
        state.workExperience[index].description.push('');
      }
    },
    updateDescriptionToWork(state, action) {
      const { workIndex, descIndex, value } = action.payload;
      if (state.workExperience[workIndex] && state.workExperience[workIndex].description[descIndex] !== undefined) {
        state.workExperience[workIndex].description[descIndex] = value;
      }
    },
    removeDescriptionFromWork(state, action) {
      const { workIndex, descIndex } = action.payload;
      if (state.workExperience[workIndex] && state.workExperience[workIndex].description[descIndex] !== undefined) {
        state.workExperience[workIndex].description.splice(descIndex, 1);
      }
    },

    // Education
    addEducation(state) {
      state.education.push({ ...initialEducation });
    },
    updateEducation(state, action) {
      const { index, data } = action.payload;
      if (state.education[index]) {
        state.education[index] = { ...state.education[index], ...data };
      }
    },
    removeEducation(state, action) {
      state.education.splice(action.payload, 1);
    },
    addDescriptionToEducation(state, action) {
      const { index } = action.payload;
      if (state.education[index]) {
        state.education[index].description.push('');
      }
    },
    updateDescriptionToEducation(state, action) {
      const { educationIndex, descIndex, value } = action.payload;
      if (state.education[educationIndex] && state.education[educationIndex].description[descIndex] !== undefined) {
        state.education[educationIndex].description[descIndex] = value;
      }
    },
    removeDescriptionFromEducation(state, action) {
      const { educationIndex, descIndex } = action.payload;
      if (state.education[educationIndex] && state.education[educationIndex].description[descIndex] !== undefined) {
        state.education[educationIndex].description.splice(descIndex, 1);
      }
    },

    // Trainings
    addTraining(state) {
      state.trainings.push({ ...initialTraining });
    },
    updateTraining(state, action) {
      const { index, data } = action.payload;
      if (state.trainings[index]) {
        state.trainings[index] = { ...state.trainings[index], ...data };
      }
    },
    removeTraining(state, action) {
      state.trainings.splice(action.payload, 1);
    },
    addDescriptionToTraining(state, action) {
      const { index } = action.payload;
      if (state.trainings[index]) {
        state.trainings[index].description.push('');
      }
    },
    updateDescriptionToTraining(state, action) {
      const { trainingIndex, descIndex, value } = action.payload;
      if (state.trainings[trainingIndex] && state.trainings[trainingIndex].description[descIndex] !== undefined) {
        state.trainings[trainingIndex].description[descIndex] = value;
      }
    },
    removeDescriptionFromTraining(state, action) {
      const { trainingIndex, descIndex } = action.payload;
      if (state.trainings[trainingIndex] && state.trainings[trainingIndex].description[descIndex] !== undefined) {
        state.trainings[trainingIndex].description.splice(descIndex, 1);
      }
    },

    // Certifications
    addCertification(state) {
      state.certifications.push({ ...initialCertification });
    },
    updateCertification(state, action) {
      const { index, data } = action.payload;
      if (state.certifications[index]) {
        state.certifications[index] = { ...state.certifications[index], ...data };
      }
    },
    removeCertification(state, action) {
      state.certifications.splice(action.payload, 1);
    },
    addDescriptionToCertification(state, action) {
      const { index } = action.payload;
      if (state.certifications[index]) {
        state.certifications[index].description.push('');
      }
    },
    updateDescriptionToCertification(state, action) {
      const { certificationIndex, descIndex, value } = action.payload;
      if (state.certifications[certificationIndex] && state.certifications[certificationIndex].description[descIndex] !== undefined) {
        state.certifications[certificationIndex].description[descIndex] = value;
      }
    },
    removeDescriptionFromCertification(state, action) {
      const { certificationIndex, descIndex } = action.payload;
      if (state.certifications[certificationIndex] && state.certifications[certificationIndex].description[descIndex] !== undefined) {
        state.certifications[certificationIndex].description.splice(descIndex, 1);
      }
    },

    // Skills
    addSkillCategory(state) {
      state.skills.push({ ...initialSkillCategory });
    },
    updateSkillCategory(state, action) {
      const { index, category } = action.payload;
      if (state.skills[index]) {
        state.skills[index].category = category;
      }
    },
    removeSkillCategory(state, action) {
      state.skills.splice(action.payload, 1);
    },
    addSkillToCategory(state, action) {
      const { index } = action.payload;
      if (state.skills[index]) {
        state.skills[index].skills.push({ name: '', level: '' });
      }
    },
    updateSkillInCategory(state, action) {
      const { catIndex, skillIndex, data } = action.payload;
      if (state.skills[catIndex] && state.skills[catIndex].skills[skillIndex]) {
        state.skills[catIndex].skills[skillIndex] = { ...state.skills[catIndex].skills[skillIndex], ...data };
      }
    },
    removeSkillFromCategory(state, action) {
      const { catIndex, skillIndex } = action.payload;
      if (state.skills[catIndex] && state.skills[catIndex].skills[skillIndex]) {
        state.skills[catIndex].skills.splice(skillIndex, 1);
      }
    },

    // References
    addReference(state) {
      state.references.push({ ...initialReference });
    },
    updateReference(state, action) {
      const { index, data } = action.payload;
      if (state.references[index]) {
        state.references[index] = { ...state.references[index], ...data };
      }
    },
    removeReference(state, action) {
      state.references.splice(action.payload, 1);
    },

    // Template Management
    setTemplate(state, action) {
      state.template = action.payload; // Dynamically set the template
      state.lastUpdated = new Date().toISOString(); // Update timestamp
    },
  },
});

export const {
  resetResume,
  updatePersonalInfo,
  updateCareerObjective,
  updateCareerSummary,
  addWorkExperience,
  updateWorkExperience,
  removeWorkExperience,
  addDescriptionToWork,
  updateDescriptionToWork,
  removeDescriptionFromWork,
  addEducation,
  updateEducation,
  removeEducation,
  addDescriptionToEducation,
  updateDescriptionToEducation,
  removeDescriptionFromEducation,
  addTraining,
  updateTraining,
  removeTraining,
  addDescriptionToTraining,
  updateDescriptionToTraining,
  removeDescriptionFromTraining,
  addCertification,
  updateCertification,
  removeCertification,
  addDescriptionToCertification,
  updateDescriptionToCertification,
  removeDescriptionFromCertification,
  addSkillCategory,
  updateSkillCategory,
  removeSkillCategory,
  addSkillToCategory,
  updateSkillInCategory,
  removeSkillFromCategory,
  addReference,
  updateReference,
  removeReference,
  setTemplate,
} = resumeSlice.actions;

export default resumeSlice.reducer;
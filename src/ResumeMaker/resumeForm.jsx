// src/components/ResumeForm.js
import  { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useCreateResumeMutation,
  useGetResumeQuery,
  useUpdateResumeMutation,
  useDeleteResumeMutation,
  useAddWorkExperienceMutation,
  useDeleteWorkExperienceMutation,
  useAddEducationMutation,
  useDeleteEducationMutation,
  useAddReferenceMutation,
  useDeleteReferenceMutation,
  useGetJobDescriptionSuggestionMutation,
  useGetSkillsSuggestionMutation,
  useGetCareerObjectiveSuggestionMutation,
  useGetCareerSummarySuggestionMutation,
} from '../context/resumeApi';
import {
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
  resetResume,
} from '../context/resumeSlice';
import InputField from '../Components/InputField';
import SectionItem from '../Components/SectionItem';
import jsPDF from 'jspdf';
import '../assets/ResumeForm.css';

// eslint-disable-next-line react/prop-types
const ResumeForm = ({ resumeId }) => {
  const resume = useSelector((state) => state.resume);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const firstErrorRef = useRef(null);

  // API hooks
  const { data: resumeData, isLoading: isFetching, error: fetchError } = useGetResumeQuery(resumeId, { skip: !resumeId });
  const [createResume, { isLoading: isCreating }] = useCreateResumeMutation();
  const [updateResume, { isLoading: isUpdating }] = useUpdateResumeMutation();
  const [deleteResume, { isLoading: isDeleting }] = useDeleteResumeMutation();
  const [addWorkExperienceApi] = useAddWorkExperienceMutation();
  const [deleteWorkExperienceApi] = useDeleteWorkExperienceMutation();
  const [addEducationApi] = useAddEducationMutation();
  const [deleteEducationApi] = useDeleteEducationMutation();
  const [addReferenceApi] = useAddReferenceMutation();
  const [deleteReferenceApi] = useDeleteReferenceMutation();
  const [getJobDescriptionSuggestion] = useGetJobDescriptionSuggestionMutation();
  const [getSkillsSuggestion] = useGetSkillsSuggestionMutation();
  const [getCareerObjectiveSuggestion] = useGetCareerObjectiveSuggestionMutation();
  const [getCareerSummarySuggestion] = useGetCareerSummarySuggestionMutation();

  // Sync API data with Redux store
  useEffect(() => {
    if (resumeData) {
      // Clear existing state
      dispatch(resetResume());
      dispatch(updatePersonalInfo(resumeData.personalInfo || {}));
      dispatch(updateCareerObjective(resumeData.careerObjective || ''));
      dispatch(updateCareerSummary(resumeData.careerSummary || ''));
      resumeData.workExperience?.forEach((exp) => {
        dispatch(addWorkExperience());
        dispatch(updateWorkExperience({ index: resume.workExperience.length, data: exp }));
      });
      resumeData.education?.forEach((edu) => {
        dispatch(addEducation());
        dispatch(updateEducation({ index: resume.education.length, data: edu }));
      });
      resumeData.trainings?.forEach((train) => {
        dispatch(addTraining());
        dispatch(updateTraining({ index: resume.trainings.length, data: train }));
      });
      resumeData.certifications?.forEach((cert) => {
        dispatch(addCertification());
        dispatch(updateCertification({ index: resume.certifications.length, data: cert }));
      });
      resumeData.skills?.forEach((cat) => {
        dispatch(addSkillCategory());
        dispatch(updateSkillCategory({ index: resume.skills.length - 1, category: cat.category }));
        cat.skills.forEach((skill) => {
          dispatch(addSkillToCategory({ index: resume.skills.length - 1 }));
          dispatch(updateSkillInCategory({ catIndex: resume.skills.length - 1, skillIndex: resume.skills[resume.skills.length - 1].skills.length - 1, data: skill }));
        });
      });
      resumeData.references?.forEach((ref) => {
        dispatch(addReference());
        dispatch(updateReference({ index: resume.references.length, data: ref }));
      });
    }
  }, [resumeData, dispatch]);

  // Focus on first error
  useEffect(() => {
    if (Object.keys(errors).length > 0 && firstErrorRef.current) {
      firstErrorRef.current.focus();
    }
  }, [errors]);

  // Validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    // Personal Info
    if (!resume.personalInfo.firstName) newErrors.firstName = 'First Name is required';
    if (!resume.personalInfo.lastName) newErrors.lastName = 'Last Name is required';
    if (!resume.personalInfo.emailAddress) newErrors.emailAddress = 'Email Address is required';
    else if (!/\S+@\S+\.\S+/.test(resume.personalInfo.emailAddress)) newErrors.emailAddress = 'Invalid email format';
    if (resume.personalInfo.phoneNumber && !/^\+?[\d\s-]{10,}$/.test(resume.personalInfo.phoneNumber)) newErrors.phoneNumber = 'Invalid phone number format';

    // Work Experience
    resume.workExperience.forEach((exp, index) => {
      if (!exp.companyName) newErrors[`workExperience[${index}].companyName`] = 'Company Name is required';
      if (!exp.position) newErrors[`workExperience[${index}].position`] = 'Position is required';
      if (!exp.from) newErrors[`workExperience[${index}].from`] = 'Start date is required';
    });

    // Education
    resume.education.forEach((edu, index) => {
      if (!edu.institutionName) newErrors[`education[${index}].institutionName`] = 'Institution Name is required';
      if (!edu.fieldOfStudy) newErrors[`education[${index}].fieldOfStudy`] = 'Field of Study is required';
      if (!edu.degree) newErrors[`education[${index}].degree`] = 'Degree is required';
      if (!edu.from) newErrors[`education[${index}].from`] = 'Start date is required';
    });

    // References
    resume.references.forEach((ref, index) => {
      if (!ref.name) newErrors[`reference[${index}].name`] = 'Name is required';
      if (!ref.position) newErrors[`reference[${index}].position`] = 'Position is required';
      if (!ref.company) newErrors[`reference[${index}].company`] = 'Company is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [resume]);

  // Handlers
  const handlePersonalChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch(updatePersonalInfo({ [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, [dispatch]);

  const handleAddressChange = useCallback((e, addrType) => {
    const { name, value } = e.target;
    dispatch(updatePersonalInfo({ [addrType]: { ...resume.personalInfo[addrType], [name]: value } }));
  }, [dispatch, resume.personalInfo]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      try {
        let response;
        if (resumeId) {
          response = await updateResume({ id: resumeId, data: resume }).unwrap();
        } else {
          // eslint-disable-next-line no-unused-vars
          response = await createResume(resume).unwrap();
        }
        setErrors({});
        generatePDF(resume);
        alert('Resume saved successfully!');
      } catch (err) {
        setErrors({ form: 'Error submitting resume: ' + (err.data?.message || err.message) });
      }
    },
    [createResume, updateResume, resumeId, resume, validateForm]
  );

  const handleDelete = useCallback(async () => {
    if (resumeId && window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResume(resumeId).unwrap();
        setErrors({});
        alert('Resume deleted successfully!');
        dispatch(resetResume());
        navigate('/dashboard'); // Redirect to dashboard
      } catch (err) {
        setErrors({ form: 'Error deleting resume: ' + (err.data?.message || err.message) });
      }
    }
  }, [deleteResume, resumeId, dispatch, navigate]);

  const handleSaveSectionItem = useCallback(
    async (type, index) => {
      setLoadingStates((prev) => ({ ...prev, [`${type}-${index}`]: true }));
      try {
        if (type === 'workExperience') {
          await addWorkExperienceApi({ id: resumeId, workExp: resume.workExperience[index] }).unwrap();
        } else if (type === 'education') {
          await addEducationApi({ id: resumeId, education: resume.education[index] }).unwrap();
        } else if (type === 'reference') {
          await addReferenceApi({ id: resumeId, reference: resume.references[index] }).unwrap();
        }
        setErrors({});
        alert(`${type} saved successfully!`);
      } catch (err) {
        setErrors({ [`${type}-${index}`]: `Error saving ${type}: ${err.data?.message || err.message}` });
      } finally {
        setLoadingStates((prev) => ({ ...prev, [`${type}-${index}`]: false }));
      }
    },
    [addWorkExperienceApi, addEducationApi, addReferenceApi, resumeId, resume]
  );

  const handleDeleteSectionItem = useCallback(
    async (type, index) => {
      setLoadingStates((prev) => ({ ...prev, [`${type}-${index}-delete`]: true }));
      try {
        if (type === 'workExperience') {
          await deleteWorkExperienceApi({ id: resumeId, index }).unwrap();
          dispatch(removeWorkExperience(index));
        } else if (type === 'education') {
          await deleteEducationApi({ id: resumeId, index }).unwrap();
          dispatch(removeEducation(index));
        } else if (type === 'reference') {
          await deleteReferenceApi({ id: resumeId, index }).unwrap();
          dispatch(removeReference(index));
        }
        setErrors({});
        alert(`${type} deleted successfully!`);
      } catch (err) {
        setErrors({ [`${type}-${index}`]: `Error deleting ${type}: ${err.data?.message || err.message}` });
      } finally {
        setLoadingStates((prev) => ({ ...prev, [`${type}-${index}-delete`]: false }));
      }
    },
    [deleteWorkExperienceApi, deleteEducationApi, deleteReferenceApi, resumeId, dispatch]
  );

  const handleGetJobDescription = useCallback(
    async (index) => {
      setLoadingStates((prev) => ({ ...prev, [`workExperience-${index}-desc`]: true }));
      try {
        const workExp = resume.workExperience[index];
        const response = await getJobDescriptionSuggestion(workExp).unwrap();
        response.data.suggestions.forEach((desc) => {
          dispatch(addDescriptionToWork({ index }));
          dispatch(updateDescriptionToWork({ workIndex: index, descIndex: resume.workExperience[index].description.length - 1, value: desc }));
        });
        setErrors({});
      } catch (err) {
        setErrors({ [`workExperience-${index}`]: 'Error getting job description: ' + (err.data?.message || err.message) });
      } finally {
        setLoadingStates((prev) => ({ ...prev, [`workExperience-${index}-desc`]: false }));
      }
    },
    [getJobDescriptionSuggestion, resume.workExperience, dispatch]
  );

  const handleGetSkillsSuggestion = useCallback(async () => {
    setLoadingStates((prev) => ({ ...prev, skills: true }));
    try {
      const response = await getSkillsSuggestion(resume.workExperience).unwrap();
      dispatch(addSkillCategory());
      dispatch(updateSkillCategory({ index: resume.skills.length - 1, category: 'Technical Skills' }));
      response.data.suggestions.technical.forEach((skill) => {
        dispatch(addSkillToCategory({ index: resume.skills.length - 1 }));
        dispatch(updateSkillInCategory({ catIndex: resume.skills.length - 1, skillIndex: resume.skills[resume.skills.length - 1].skills.length - 1, data: { name: skill, level: 'Advanced' } }));
      });
      dispatch(addSkillCategory());
      dispatch(updateSkillCategory({ index: resume.skills.length - 1, category: 'Soft Skills' }));
      response.data.suggestions.soft.forEach((skill) => {
        dispatch(addSkillToCategory({ index: resume.skills.length - 1 }));
        dispatch(updateSkillInCategory({ catIndex: resume.skills.length - 1, skillIndex: resume.skills[resume.skills.length - 1].skills.length - 1, data: { name: skill, level: 'Advanced' } }));
      });
      setErrors({});
    } catch (err) {
      setErrors({ skills: 'Error getting skills suggestion: ' + (err.data?.message || err.message) });
    } finally {
      setLoadingStates((prev) => ({ ...prev, skills: false }));
    }
  }, [getSkillsSuggestion, resume.workExperience, resume.skills, dispatch]);

  const handleGetCareerObjective = useCallback(async () => {
    setLoadingStates((prev) => ({ ...prev, careerObjective: true }));
    try {
      const response = await getCareerObjectiveSuggestion({ workExperiences: resume.workExperience, education: resume.education }).unwrap();
      dispatch(updateCareerObjective(response.data.suggestion));
      setErrors({});
    } catch (err) {
      setErrors({ careerObjective: 'Error getting career objective: ' + (err.data?.message || err.message) });
    } finally {
      setLoadingStates((prev) => ({ ...prev, careerObjective: false }));
    }
  }, [getCareerObjectiveSuggestion, resume.workExperience, resume.education, dispatch]);

  const handleGetCareerSummary = useCallback(async () => {
    setLoadingStates((prev) => ({ ...prev, careerSummary: true }));
    try {
      const response = await getCareerSummarySuggestion({ workExperiences: resume.workExperience, education: resume.education }).unwrap();
      dispatch(updateCareerSummary(response.data.suggestion));
      setErrors({});
    } catch (err) {
      setErrors({ careerSummary: 'Error getting career summary: ' + (err.data?.message || err.message) });
    } finally {
      setLoadingStates((prev) => ({ ...prev, careerSummary: false }));
    }
  }, [getCareerSummarySuggestion, resume.workExperience, resume.education, dispatch]);

  const generatePDF = useCallback((data) => {
    const doc = new jsPDF();
    let yPos = 20;

    const addText = (text, x, y, options = {}) => {
      if (!text || text === 'undefined') return y; // Skip empty or invalid text
      const lines = doc.splitTextToSize(text, options.maxWidth || 170);
      doc.text(lines, x, y, options);
      return y + (options.lineHeight || 7) * lines.length;
    };

    const checkPage = () => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
    };

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    yPos = addText(`${data.personalInfo.firstName || ''} ${data.personalInfo.lastName || ''}`, 20, yPos, { lineHeight: 12 });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    yPos = addText(data.personalInfo.professionalTitle || '', 20, yPos);
    yPos = addText(`${data.personalInfo.emailAddress || ''} | ${data.personalInfo.phoneNumber || ''}`, 20, yPos);
    yPos = addText(
      `${data.personalInfo.address.street || ''}, ${data.personalInfo.address.city || ''}, ${data.personalInfo.address.postal || ''}, ${data.personalInfo.address.country || ''}`,
      20,
      yPos
    );
    if (data.personalInfo.linkedIn) yPos = addText(`LinkedIn: ${data.personalInfo.linkedIn}`, 20, yPos);
    if (data.personalInfo.portfolio) yPos = addText(`Portfolio: ${data.personalInfo.portfolio}`, 20, yPos);
    yPos += 5;
    checkPage();

    // Career Objective
    if (data.careerObjective) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      yPos = addText('Career Objective', 20, yPos, { lineHeight: 10 });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      yPos = addText(data.careerObjective, 20, yPos, { maxWidth: 170, lineHeight: 7 });
      checkPage();
    }

    // Career Summary
    if (data.careerSummary) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      yPos = addText('Career Summary', 20, yPos, { lineHeight: 10 });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      yPos = addText(data.careerSummary, 20, yPos, { maxWidth: 170, lineHeight: 7 });
      checkPage();
    }

    // Work Experience
    if (data.workExperience.length) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      yPos = addText('Work Experience', 20, yPos, { lineHeight: 10 });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      data.workExperience.forEach((exp) => {
        checkPage();
        yPos = addText(`${exp.position || ''} at ${exp.companyName || ''}, ${exp.city || ''}, ${exp.country || ''}`, 20, yPos);
        yPos = addText(`${exp.from || ''} - ${exp.to || 'Present'}`, 20, yPos);
        exp.description.forEach((desc) => {
          yPos = addText(`• ${desc || ''}`, 25, yPos, { maxWidth: 160 });
          checkPage();
        });
        yPos += 5;
      });
      checkPage();
    }

    // Education
    if (data.education.length) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      yPos = addText('Education', 20, yPos, { lineHeight: 10 });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      data.education.forEach((edu) => {
        checkPage();
        yPos = addText(`${edu.degree || ''} in ${edu.fieldOfStudy || ''}, ${edu.institutionName || ''}, ${edu.city || ''}, ${edu.country || ''}`, 20, yPos);
        yPos = addText(`${edu.from || ''} - ${edu.to || 'Present'}`, 20, yPos);
        if (edu.gpa) yPos = addText(`GPA: ${edu.gpa}`, 20, yPos);
        if (edu.honors) yPos = addText(`Honors: ${edu.honors}`, 20, yPos);
        edu.description.forEach((desc) => {
          yPos = addText(`• ${desc || ''}`, 25, yPos, { maxWidth: 160 });
          checkPage();
        });
        yPos += 5;
      });
      checkPage();
    }

    // Trainings
    if (data.trainings.length) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      yPos = addText('Trainings', 20, yPos, { lineHeight: 10 });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      data.trainings.forEach((train) => {
        checkPage();
        yPos = addText(`${train.name || ''}, ${train.institution || ''}`, 20, yPos);
        yPos = addText(`Duration: ${train.duration || ''}, ${train.from || ''} - ${train.to || ''}`, 20, yPos);
        train.description.forEach((desc) => {
          yPos = addText(`• ${desc || ''}`, 25, yPos, { maxWidth: 160 });
          checkPage();
        });
        yPos += 5;
      });
      checkPage();
    }

    // Certifications
    if (data.certifications.length) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      yPos = addText('Certifications', 20, yPos, { lineHeight: 10 });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      data.certifications.forEach((cert) => {
        checkPage();
        yPos = addText(`${cert.name || ''}, ${cert.authority || ''}`, 20, yPos);
        yPos = addText(`Date: ${cert.date || ''}`, 20, yPos);
        if (cert.urlCode) yPos = addText(`URL: ${cert.urlCode}`, 20, yPos);
        cert.description.forEach((desc) => {
          yPos = addText(`• ${desc || ''}`, 25, yPos, { maxWidth: 160 });
          checkPage();
        });
        yPos += 5;
      });
      checkPage();
    }

    // Skills
    if (data.skills.length) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      yPos = addText('Skills', 20, yPos, { lineHeight: 10 });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      data.skills.forEach((cat) => {
        checkPage();
        yPos = addText(cat.category || '', 20, yPos);
        cat.skills.forEach((skill) => {
          yPos = addText(`• ${skill.name || ''} - ${skill.level || ''}`, 25, yPos);
          checkPage();
        });
        yPos += 5;
      });
      checkPage();
    }

    // References
    if (data.references.length) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      yPos = addText('References', 20, yPos, { lineHeight: 10 });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      data.references.forEach((ref) => {
        checkPage();
        yPos = addText(`${ref.name || ''}, ${ref.position || ''} at ${ref.company || ''}`, 20, yPos);
        yPos = addText(`Phone: ${ref.phone || ''}, Email: ${ref.email || ''}`, 20, yPos);
        yPos = addText(`Relationship: ${ref.relationship || ''}`, 20, yPos);
        yPos += 5;
      });
    }

    doc.save(`${data.personalInfo.firstName || 'resume'}_${data.personalInfo.lastName || ''}_resume.pdf`);
  }, [resume]);

  if (isFetching) return <div className="text-center p-6 text-gray-600">Loading...</div>;
  if (fetchError) return <div className="text-center p-6 text-red-500" role="alert">Error: {fetchError.data?.message || fetchError.message}</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md" aria-labelledby="resume-form-title">
      <h2 id="resume-form-title" className="text-2xl font-bold mb-6 text-center text-gray-800">Resume Builder</h2>
      <div role="alert" aria-live="assertive" className="mb-4">
        {errors.form && <div className="text-red-500 text-center">{errors.form}</div>}
      </div>

      {/* Personal Information */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            name="firstName"
            value={resume.personalInfo.firstName}
            onChange={handlePersonalChange}
            required
            error={errors.firstName}
            ref={errors.firstName ? firstErrorRef : null}
          />
          <InputField label="Last Name" name="lastName" value={resume.personalInfo.lastName} onChange={handlePersonalChange} required error={errors.lastName} />
          <InputField label="Professional Title" name="professionalTitle" value={resume.personalInfo.professionalTitle} onChange={handlePersonalChange} />
          <InputField label="Phone Number" name="phoneNumber" value={resume.personalInfo.phoneNumber} onChange={handlePersonalChange} type="tel" error={errors.phoneNumber} />
          <InputField label="Email Address" name="emailAddress" value={resume.personalInfo.emailAddress} onChange={handlePersonalChange} type="email" required error={errors.emailAddress} />
          <InputField label="Skype" name="skype" value={resume.personalInfo.skype} onChange={handlePersonalChange} />
          <InputField label="LinkedIn" name="linkedIn" value={resume.personalInfo.linkedIn} onChange={handlePersonalChange} />
          <InputField label="Portfolio" name="portfolio" value={resume.personalInfo.portfolio} onChange={handlePersonalChange} />
          <InputField label="Profile Picture URL" name="profilePicture" value={resume.personalInfo.profilePicture} onChange={handlePersonalChange} />
          <InputField label="Father's Name" name="fatherName" value={resume.personalInfo.fatherName} onChange={handlePersonalChange} />
          <InputField label="Mother's Name" name="motherName" value={resume.personalInfo.motherName} onChange={handlePersonalChange} />
          <InputField label="Spouse's Name" name="spouseName" value={resume.personalInfo.spouseName} onChange={handlePersonalChange} />
          <InputField label="NID" name="nid" value={resume.personalInfo.nid} onChange={handlePersonalChange} />
          <InputField label="Passport" name="passport" value={resume.personalInfo.passport} onChange={handlePersonalChange} />
        </div>
        <h4 className="text-md font-medium mt-4 mb-2 text-gray-700">Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Street" name="street" value={resume.personalInfo.address.street} onChange={(e) => handleAddressChange(e, 'address')} />
          <InputField label="City" name="city" value={resume.personalInfo.address.city} onChange={(e) => handleAddressChange(e, 'address')} />
          <InputField label="Postal" name="postal" value={resume.personalInfo.address.postal} onChange={(e) => handleAddressChange(e, 'address')} />
          <InputField label="Country" name="country" value={resume.personalInfo.address.country} onChange={(e) => handleAddressChange(e, 'address')} />
        </div>
        <h4 className="text-md font-medium mt-4 mb-2 text-gray-700">Permanent Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Street" name="street" value={resume.personalInfo.permanentAddress.street} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
          <InputField label="City" name="city" value={resume.personalInfo.permanentAddress.city} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
          <InputField label="Postal" name="postal" value={resume.personalInfo.permanentAddress.postal} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
          <InputField label="Country" name="country" value={resume.personalInfo.permanentAddress.country} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
        </div>
      </section>

      {/* Career Objective and Summary */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Career Objective & Summary</h3>
        <div className="space-y-4">
          <div>
            <InputField label="Career Objective" type="textarea" value={resume.careerObjective} onChange={(e) => dispatch(updateCareerObjective(e.target.value))} error={errors.careerObjective} />
            <button
              type="button"
              className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center"
              onClick={handleGetCareerObjective}
              disabled={loadingStates.careerObjective}
              aria-label="Get AI-generated career objective"
            >
              {loadingStates.careerObjective ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                'Get AI Career Objective'
              )}
            </button>
            {errors.careerObjective && <div className="text-red-500 text-sm mt-1">{errors.careerObjective}</div>}
          </div>
          <div>
            <InputField label="Career Summary" type="textarea" value={resume.careerSummary} onChange={(e) => dispatch(updateCareerSummary(e.target.value))} error={errors.careerSummary} />
            <button
              type="button"
              className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center"
              onClick={handleGetCareerSummary}
              disabled={loadingStates.careerSummary}
              aria-label="Get AI-generated career summary"
            >
              {loadingStates.careerSummary ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                'Get AI Career Summary'
              )}
            </button>
            {errors.careerSummary && <div className="text-red-500 text-sm mt-1">{errors.careerSummary}</div>}
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Work Experience</h3>
        {resume.workExperience.map((exp, index) => (
          <div key={index}>
            <SectionItem
              item={exp}
              index={index}
              fields={[
                { label: 'Company Name', name: 'companyName', required: true },
                { label: 'Position', name: 'position', required: true },
                { label: 'City', name: 'city' },
                { label: 'Country', name: 'country' },
                { label: 'From', name: 'from', type: 'date', required: true },
                { label: 'To', name: 'to', type: 'date' },
              ]}
              updateAction={updateWorkExperience}
              removeAction={removeWorkExperience}
              addDescAction={addDescriptionToWork}
              updateDescAction={updateDescriptionToWork}
              removeDescAction={removeDescriptionFromWork}
              checkboxField={{ name: 'currentlyWorking', label: 'Currently Working' }}
              onSave={resumeId ? handleSaveSectionItem.bind(null, 'workExperience') : null}
              onDelete={resumeId ? handleDeleteSectionItem.bind(null, 'workExperience') : null}
              onGetDescription={handleGetJobDescription}
              isSaving={loadingStates[`workExperience-${index}`]}
              isDeleting={loadingStates[`workExperience-${index}-delete`]}
              isSuggestingDesc={loadingStates[`workExperience-${index}-desc`]}
              sectionName="Work Experience"
              dispatch={dispatch}
            />
            {errors[`workExperience-${index}`] && <div className="text-red-500 text-sm mt-1">{errors[`workExperience-${index}`]}</div>}
          </div>
        ))}
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => dispatch(addWorkExperience())}
          aria-label="Add Work Experience"
        >
          Add Work Experience
        </button>
      </section>

      {/* Education */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Education</h3>
        {resume.education.map((edu, index) => (
          <div key={index}>
            <SectionItem
              item={edu}
              index={index}
              fields={[
                { label: 'Institution Name', name: 'institutionName', required: true },
                { label: 'Field of Study', name: 'fieldOfStudy', required: true },
                { label: 'Degree', name: 'degree', required: true },
                { label: 'City', name: 'city' },
                { label: 'Country', name: 'country' },
                { label: 'From', name: 'from', type: 'date', required: true },
                { label: 'To', name: 'to', type: 'date' },
                { label: 'GPA', name: 'gpa' },
                { label: 'Honors', name: 'honors' },
              ]}
              updateAction={updateEducation}
              removeAction={removeEducation}
              addDescAction={addDescriptionToEducation}
              updateDescAction={updateDescriptionToEducation}
              removeDescAction={removeDescriptionFromEducation}
              checkboxField={{ name: 'currentlyStudying', label: 'Currently Studying' }}
              onSave={resumeId ? handleSaveSectionItem.bind(null, 'education') : null}
              onDelete={resumeId ? handleDeleteSectionItem.bind(null, 'education') : null}
              isSaving={loadingStates[`education-${index}`]}
              isDeleting={loadingStates[`education-${index}-delete`]}
              sectionName="Education"
              dispatch={dispatch}
            />
            {errors[`education-${index}`] && <div className="text-red-500 text-sm mt-1">{errors[`education-${index}`]}</div>}
          </div>
        ))}
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => dispatch(addEducation())}
          aria-label="Add Education"
        >
          Add Education
        </button>
      </section>

      {/* Trainings */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Trainings</h3>
        {resume.trainings.map((train, index) => (
          <div key={index}>
            <SectionItem
              item={train}
              index={index}
              fields={[
                { label: 'Name', name: 'name', required: true },
                { label: 'Institution', name: 'institution', required: true },
                { label: 'Duration', name: 'duration' },
                { label: 'From', name: 'from', type: 'date', required: true },
                { label: 'To', name: 'to', type: 'date' },
              ]}
              updateAction={updateTraining}
              removeAction={removeTraining}
              addDescAction={addDescriptionToTraining}
              updateDescAction={updateDescriptionToTraining}
              removeDescAction={removeDescriptionFromTraining}
              sectionName="Training"
              dispatch={dispatch}
            />
            {errors[`training-${index}`] && <div className="text-red-500 text-sm mt-1">{errors[`training-${index}`]}</div>}
          </div>
        ))}
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => dispatch(addTraining())}
          aria-label="Add Training"
        >
          Add Training
        </button>
      </section>

      {/* Certifications */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Certifications</h3>
        {resume.certifications.map((cert, index) => (
          <div key={index}>
            <SectionItem
              item={cert}
              index={index}
              fields={[
                { label: 'Name', name: 'name', required: true },
                { label: 'Authority', name: 'authority', required: true },
                { label: 'URL/Code', name: 'urlCode' },
                { label: 'Date', name: 'date', type: 'date', required: true },
              ]}
              updateAction={updateCertification}
              removeAction={removeCertification}
              addDescAction={addDescriptionToCertification}
              updateDescAction={updateDescriptionToCertification}
              removeDescAction={removeDescriptionFromCertification}
              sectionName="Certification"
              dispatch={dispatch}
            />
            {errors[`certification-${index}`] && <div className="text-red-500 text-sm mt-1">{errors[`certification-${index}`]}</div>}
          </div>
        ))}
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => dispatch(addCertification())}
          aria-label="Add Certification"
        >
          Add Certification
        </button>
      </section>

      {/* Skills */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Skills</h3>
        <button
          type="button"
          className="mb-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center"
          onClick={handleGetSkillsSuggestion}
          disabled={loadingStates.skills}
          aria-label="Get AI-generated skills suggestion"
        >
          {loadingStates.skills ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Generating...
            </>
          ) : (
            'Get AI Skills Suggestion'
          )}
        </button>
        {errors.skills && <div className="text-red-500 text-sm mb-2">{errors.skills}</div>}
        {resume.skills.map((cat, catIndex) => (
          <div key={catIndex} className="border p-4 mb-4 rounded-md bg-gray-50">
            <InputField
              label="Category"
              name="category"
              value={cat.category}
              onChange={(e) => dispatch(updateSkillCategory({ index: catIndex, category: e.target.value }))}
              required
              error={errors[`skills[${catIndex}].category`]}
            />
            {cat.skills.map((skill, skillIndex) => (
              <div key={skillIndex} className="flex gap-4 mb-2 items-end">
                <InputField
                  label="Skill Name"
                  name="name"
                  value={skill.name}
                  onChange={(e) => dispatch(updateSkillInCategory({ catIndex, skillIndex, data: { name: e.target.value } }))}
                  className="flex-1"
                  required
                  error={errors[`skills[${catIndex}][${skillIndex}].name`]}
                />
                <InputField
                  label="Level"
                  name="level"
                  value={skill.level}
                  onChange={(e) => dispatch(updateSkillInCategory({ catIndex, skillIndex, data: { level: e.target.value } }))}
                  className="flex-1"
                />
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 text-sm"
                  onClick={() => dispatch(removeSkillFromCategory({ catIndex, skillIndex }))}
                  aria-label={`Remove skill ${skillIndex + 1}`}
                >
                  Remove Skill
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
              onClick={() => dispatch(addSkillToCategory({ index: catIndex }))}
              aria-label={`Add skill to category ${cat.category}`}
            >
              Add Skill
            </button>
            <button
              type="button"
              className="mt-2 ml-4 text-red-500 hover:text-red-700 text-sm"
              onClick={() => dispatch(removeSkillCategory(catIndex))}
              aria-label={`Remove category ${cat.category}`}
            >
              Remove Category
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => dispatch(addSkillCategory())}
          aria-label="Add Skill Category"
        >
          Add Skill Category
        </button>
      </section>

      {/* References */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">References</h3>
        {resume.references.map((ref, index) => (
          <div key={index}>
            <SectionItem
              item={ref}
              index={index}
              fields={[
                { label: 'Name', name: 'name', required: true },
                { label: 'Position', name: 'position', required: true },
                { label: 'Company', name: 'company', required: true },
                { label: 'Phone', name: 'phone', type: 'tel' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Relationship', name: 'relationship' },
              ]}
              updateAction={updateReference}
              removeAction={removeReference}
              onSave={resumeId ? handleSaveSectionItem.bind(null, 'reference') : null}
              onDelete={resumeId ? handleDeleteSectionItem.bind(null, 'reference') : null}
              isSaving={loadingStates[`reference-${index}`]}
              isDeleting={loadingStates[`reference-${index}-delete`]}
              sectionName="Reference"
              dispatch={dispatch}
            />
            {errors[`reference-${index}`] && <div className="text-red-500 text-sm mt-1">{errors[`reference-${index}`]}</div>}
          </div>
        ))}
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => dispatch(addReference())}
          aria-label="Add Reference"
        >
          Add Reference
        </button>
      </section>

      {/* Form Actions */}
      <div className="flex gap-4 justify-center">
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center"
          disabled={isCreating || isUpdating}
          aria-label="Save and Generate Resume"
        >
          {isCreating || isUpdating ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Saving...
            </>
          ) : (
            'Save & Generate Resume'
          )}
        </button>
        {resumeId && (
          <button
            type="button"
            className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 disabled:bg-red-400 flex items-center"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Delete Resume"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Deleting...
              </>
            ) : (
              'Delete Resume'
            )}
          </button>
        )}
      </div>
    </form>
  );
};

export default ResumeForm;
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
// src/components/ResumePreview.js

const ResumePreview = ({ resume, template }) => {
  // Find template class from templates array
  const templateStyle = templates.find(t => t.name === template)?.class || 'bg-white';

  return (
    <div className={`p-6 ${templateStyle} overflow-y-auto h-full border`}>
      <h1 className="text-2xl font-bold mb-2">{resume.personalInfo.firstName} {resume.personalInfo.lastName}</h1>
      <p className="text-lg mb-1">{resume.personalInfo.professionalTitle}</p>
      <p className="text-sm mb-4">{resume.personalInfo.emailAddress} | {resume.personalInfo.phoneNumber}</p>
      {/* Render career objective, summary, work experience, etc. as HTML */}
      <section className="mb-4">
        <h2 className="text-xl font-semibold">Work Experience</h2>
        {resume.workExperience.map((exp, idx) => (
          <div key={idx} className="mb-2">
            <p className="font-medium">{exp.position} at {exp.companyName}</p>
            <p className="text-sm">{exp.from} - {exp.to || 'Present'}</p>
            <ul className="list-disc pl-5">
              {exp.description.map((desc, dIdx) => <li key={dIdx}>{desc}</li>)}
            </ul>
          </div>
        ))}
      </section>
      {/* Similar for other sections */}
    </div>
  );
};

export default ResumePreview;
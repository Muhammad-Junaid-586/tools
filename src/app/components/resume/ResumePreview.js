  import '../../cv.css';
  const ResumePreview = ({ data, template = 'professional' }) => {
  const { personalInfo, experience, education, skills, projects } = data;
  
  // Template-specific styling
  const templateStyles = {
    professional: {
      headerBg: 'bg-blue-800',
      headerText: 'text-white',
      sectionBorder: 'border-blue-800',
      skillBg: 'bg-blue-100 text-blue-800'
    },
    modern: {
      headerBg: 'bg-gradient-to-r from-green-600 to-teal-600',
      headerText: 'text-white',
      sectionBorder: 'border-green-600',
      skillBg: 'bg-green-100 text-green-800'
    },
    creative: {
      headerBg: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      headerText: 'text-white',
      sectionBorder: 'border-purple-600',
      skillBg: 'bg-purple-100 text-purple-800'
    }
  };
  
  const style = templateStyles[template] || templateStyles.professional;

  // Set default photo path
  const defaultPhoto = '/images/junaid.JPG';

  return (
    <div className="print-container">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className={`${style.headerBg} ${style.headerText} p-6`}>
          <div className="flex flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">{personalInfo.name}</h1>
              <p className="text-xl mt-1">{personalInfo.title}</p>
            </div>
            <div className="mb-3 md:mt-0 flex items-center">
              <img 
                src={personalInfo.photo || defaultPhoto} 
                alt={personalInfo.name} 
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
              />
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm decMT-cv-print">
            {personalInfo.email && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {personalInfo.location}
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Summary */}
          {personalInfo.summary && (
            <section className="mb-6">
              <h2 className={`text-xl font-semibold border-b-2 ${style.sectionBorder} pb-2 mb-3 text-gray-800`}>
                Professional Summary
              </h2>
              <p className="text-gray-700">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-xl font-semibold border-b-2 ${style.sectionBorder} pb-2 mb-3 text-gray-800`}>
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                      <span className="text-gray-600 mt-1 md:mt-0">{exp.period}</span>
                    </div>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                    <p className="text-gray-600 mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

            {/* Projects */}
            {projects && projects.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-xl font-semibold border-b-2 ${style.sectionBorder} pb-2 mb-3 text-gray-800`}>
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                      <span className="text-gray-600 mt-1 md:mt-0">{project.period}</span>
                    </div>
                    {project.technologies && (
                      <div className="mt-2">
                        <p className="text-gray-700 font-medium">Technologies: {project.technologies}</p>
                      </div>
                    )}
                    <p className="text-gray-600 mt-2">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-xl font-semibold border-b-2 ${style.sectionBorder} pb-2 mb-3 text-gray-800`}>
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                      <span className="text-gray-600 mt-1 md:mt-0">{edu.period}</span>
                    </div>
                    <p className="text-gray-700">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className={`text-xl font-semibold border-b-2 ${style.sectionBorder} pb-2 mb-3 text-gray-800`}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className={`${style.skillBg} px-3 py-1 rounded-full text-sm`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
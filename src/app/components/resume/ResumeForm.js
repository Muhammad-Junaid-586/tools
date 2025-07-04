import { useState } from 'react';

export default function ResumeForm({ data, onSave }) {

   // Set default photo path
   const defaultPhoto = '/images/junaid.JPG';
  
   const initialData = {
     ...data,
     personalInfo: {
       ...data.personalInfo,
       photo: data.personalInfo.photo || defaultPhoto
     }
   };

   const [formData, setFormData] = useState(initialData);
  const [photoPreview, setPhotoPreview] = useState(initialData.personalInfo.photo);

  const handleChange = (e, section, index) => {
    const { name, value } = e.target;
    
    if (section) {
      const updatedSection = [...formData[section]];
      updatedSection[index] = { ...updatedSection[index], [name]: value };
      setFormData({ ...formData, [section]: updatedSection });
    } else {
      setFormData({ ...formData, personalInfo: { ...formData.personalInfo, [name]: value } });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      alert('Please select an image file (jpg, png, etc.)');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setFormData({
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          photo: reader.result
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        photo: null
      }
    });
  };

  const addItem = (section) => {
    const newItem = section === 'experience' ? 
      { id: Date.now(), position: '', company: '', period: '', description: '' } :
      { id: Date.now(), degree: '', institution: '', period: '' };
    
    setFormData({
      ...formData,
      [section]: [...formData[section], newItem]
    });
  };

  const removeItem = (section, id) => {
    setFormData({
      ...formData,
      [section]: formData[section].filter(item => item.id !== id)
    });
  };

  const handleSkillsChange = (e) => {
    setFormData({
      ...formData,
      skills: e.target.value.split(',').map(skill => skill.trim())
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        Edit Your Resume
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Info */}
        <section>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photo Upload */}
            <div className="md:col-span-2 flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 border-2 border-dashed flex items-center justify-center overflow-hidden">
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm text-center">
                    <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                  
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  JPG or PNG, max 2MB
                </p>
              </div>
            </div>
            
            {/* Personal Info Fields */}
            {[
              { label: 'Full Name', name: 'name', required: true },
              { label: 'Professional Title', name: 'title', required: true },
              { label: 'Email', name: 'email', type: 'email', required: true },
              { label: 'Phone', name: 'phone' },
              { label: 'Location', name: 'location' }
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-600 mb-1">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={formData.personalInfo[field.name]}
                  onChange={(e) => handleChange(e)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required={field.required}
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Professional Summary</label>
              <textarea
                name="summary"
                value={formData.personalInfo.summary}
                onChange={(e) => handleChange(e)}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 h-32"
                placeholder="Briefly describe your professional background and key skills"
              />
            </div>
          </div>
        </section>

        {/* Rest of the form remains the same */}
        {/* Experience Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Work Experience</h3>
            <button
              type="button"
              onClick={() => addItem('experience')}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Experience
            </button>
          </div>
          
          {formData.experience.map((exp, index) => (
            <div key={exp.id} className="mb-6 p-4 border rounded-md bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-700">Experience #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeItem('experience', exp.id)}
                  className="text-red-500 hover:text-red-700 flex items-center text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Position', name: 'position', required: true },
                  { label: 'Company', name: 'company', required: true },
                  { label: 'Period (e.g., 2020 - Present)', name: 'period' }
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{field.label}</label>
                    <input
                      type="text"
                      name={field.name}
                      value={exp[field.name]}
                      onChange={(e) => handleChange(e, 'experience', index)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required={field.required}
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={exp.description}
                    onChange={(e) => handleChange(e, 'experience', index)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your responsibilities and achievements"
                  />
                </div>
              </div>
            </div>
          ))}
        </section>


         {/* Projects Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-700">Projects</h3>
          <button
            type="button"
            onClick={() => addItem('projects')}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Project
          </button>
        </div>
        
        {formData.projects.map((project, index) => (
          <div key={project.id} className="mb-6 p-4 border rounded-md bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-gray-700">Project #{index + 1}</h4>
              <button
                type="button"
                onClick={() => removeItem('projects', project.id)}
                className="text-red-500 hover:text-red-700 flex items-center text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={project.name}
                  onChange={(e) => handleChange(e, 'projects', index)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Period</label>
                <input
                  type="text"
                  name="period"
                  value={project.period}
                  onChange={(e) => handleChange(e, 'projects', index)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Jan 2023 - Mar 2023"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Technologies</label>
                <input
                  type="text"
                  name="technologies"
                  value={project.technologies}
                  onChange={(e) => handleChange(e, 'projects', index)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  name="description"
                  value={project.description}
                  onChange={(e) => handleChange(e, 'projects', index)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the project and your contributions"
                />
              </div>
            </div>
          </div>
        ))}
      </section>


        {/* Education Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Education</h3>
            <button
              type="button"
              onClick={() => addItem('education')}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Education
            </button>
          </div>
          
          {formData.education.map((edu, index) => (
            <div key={edu.id} className="mb-6 p-4 border rounded-md bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-700">Education #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeItem('education', edu.id)}
                  className="text-red-500 hover:text-red-700 flex items-center text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Degree', name: 'degree', required: true },
                  { label: 'Institution', name: 'institution', required: true },
                  { label: 'Period (e.g., 2014 - 2018)', name: 'period' }
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{field.label}</label>
                    <input
                      type="text"
                      name={field.name}
                      value={edu[field.name]}
                      onChange={(e) => handleChange(e, 'education', index)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required={field.required}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Skills Section */}
        <section>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Skills</h3>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              List your skills (comma separated)
            </label>
            <textarea
              value={formData.skills.join(', ')}
              onChange={handleSkillsChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
              placeholder="e.g., JavaScript, React, Project Management, Team Leadership"
            />
            <p className="mt-2 text-sm text-gray-500">Add at least 5 key skills relevant to your profession</p>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
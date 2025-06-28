import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  schoolInfo: {
    schoolName: '',
    session: '',
    classLevel: 'KG',
    examType: '',
    declarationDate: '',
    logo: '',
  },
  passingCriteria: {
    criteria: '',
    percentage: '',
    failedPapers: '',
    passedPapers: '',
  },
  subjects: [],
  students: [],
  isLoading: false,
  error: null,
};

const dmcSlice = createSlice({
  name: 'dmc',
  initialState,
  reducers: {
    setLogo(state, action) {
      state.schoolInfo.logo = action.payload;
    },
    setStudentsData(state, action) {
      state.students = action.payload;
    },
    setSchoolName(state, action) {
      state.schoolInfo.schoolName = action.payload;
    },
    setSession(state, action) {
      state.schoolInfo.session = action.payload;
    },
    setClassLevel(state, action) {
      state.schoolInfo.classLevel = action.payload;
    },
    setExamType(state, action) {
      state.schoolInfo.examType = action.payload;
    },
    setDeclarationDate(state, action) {
      state.schoolInfo.declarationDate = action.payload;
    },
    setPassingCriteria(state, action) {
      state.passingCriteria.criteria = action.payload;
    },
    setPassingPercentage(state, action) {
      state.passingCriteria.percentage = action.payload;
    },
    setFailedPapers(state, action) {
      state.passingCriteria.failedPapers = action.payload;
    },
    setPassedPapers(state, action) {
      state.passingCriteria.passedPapers = action.payload;
    },
    addSubject(state, action) {
      state.subjects.push(action.payload);
    },
    removeSubject(state, action) {
      state.subjects.splice(action.payload, 1);
    },
    setFormData(state, action) {
      return { ...state, ...action.payload };
    },
    resetForm(state) {
      return initialState;
    },
  },
});

export const {
  setLogo,
  setStudentsData,
  setSchoolName,
  setSession,
  setClassLevel,
  setExamType,
  setDeclarationDate,
  setPassingCriteria,
  setPassingPercentage,
  setFailedPapers,
  setPassedPapers,
  addSubject,
  removeSubject,
  setFormData,
  resetForm,
} = dmcSlice.actions;

export default dmcSlice.reducer;
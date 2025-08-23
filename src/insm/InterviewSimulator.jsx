import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiUpload, FiMic, FiSkipForward, FiDownload, FiShare2, FiClock, FiBookOpen, FiAward } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Webcam from 'react-webcam';
import Navbar from '../Components/navbar';
import Footer from '../Components/footer';

const InterviewPractice = () => {
  // State declarations
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [practiceMode, setPracticeMode] = useState('full');
  const [showVirtualInterviewer, setShowVirtualInterviewer] = useState(true);
  const [progress, setProgress] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [virtualInterviewerText, setVirtualInterviewerText] = useState('');
  const [isSpeakingAI, setIsSpeakingAI] = useState(false);

  // Refs
  const webcamRef = useRef(null);
  const timerRef = useRef(null);
  const speechDetectionRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Form handling
  const { register, handleSubmit, watch, setValue } = useForm();
  const jobDescription = watch('jobDescription');

  // Video constraints
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
    frameRate: 30
  };

  // Check for speech synthesis support
  const isSpeechSynthesisSupported = () => {
    return 'speechSynthesis' in window;
  };

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      setFile(selectedFile);
      setIsUploading(true);
      setUploadProgress(0);
      setValue('document', e.target.files);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  // Generate questions from job description or document
  const generateQuestions = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('practiceMode', practiceMode);

      if (data.jobDescription && data.jobDescription.trim() !== '') {
        formData.append('jobDescription', data.jobDescription);
      } else if (file) {
        formData.append('document', file);
      } else {
        toast.error('Please provide either a job description or upload a document');
        setIsLoading(false);
        return;
      }

      const response = await axios.post('http://api.crosscareers.com/api/v1/insm/generate-questions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setQuestions(response.data.questions);
      setStep(2);
      startSpeechDetection();
      startTimer();

      // Initialize virtual interviewer with first question
      if (showVirtualInterviewer && response.data.questions.length > 0) {
        speakQuestion(response.data.questions[0].question);
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to generate questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Speak question through virtual interviewer
  const speakQuestion = (question) => {
    setVirtualInterviewerText(question);

    // Check if speech synthesis is supported
    if (!isSpeechSynthesisSupported()) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.rate = 0.9; // Slightly slower than normal
    utterance.pitch = 1; // Normal pitch
    utterance.volume = 1; // Full volume

    // Set voice if available (try to use a natural-sounding voice)
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Prefer female voices as they're often clearer for this use case
      const preferredVoice = voices.find(voice =>
        voice.lang.includes('en') && (voice.name.includes('Female') || voice.name.includes('Samantha') || voice.name.includes('Google'))
      ) || voices[0];

      utterance.voice = preferredVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsSpeakingAI(true);
    };

    utterance.onend = () => {
      setIsSpeakingAI(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeakingAI(false);
    };

    // Speak the utterance
    window.speechSynthesis.speak(utterance);
    speechSynthesisRef.current = utterance;
  };

  // Stop speech synthesis
  const stopSpeech = () => {
    if (isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingAI(false);
  };

  // Speech detection setup without audio feedback
  const startSpeechDetection = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      console.warn('AudioContext not supported');
      return;
    }

    const audioContext = new AudioContext();

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        // Disable audio output to prevent feedback
        const audioStream = new MediaStream();
        stream.getAudioTracks().forEach(track => audioStream.addTrack(track));

        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(audioStream);
        const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        speechDetectionRef.current = {
          audioContext,
          stream,
          javascriptNode
        };

        javascriptNode.onaudioprocess = () => {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          const values = array.reduce((a, b) => a + b) / array.length;
          setIsSpeaking(values > 10);
        };
      })
      .catch(err => {
        console.error('Error setting up speech detection:', err);
      });

    // Improved speech recognition (cross-browser)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3; // Get more alternatives for better accuracy

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            // Use the most confident alternative
            const alternatives = Array.from(result);
            if (alternatives.length > 0) {
              alternatives.sort((a, b) => b.confidence - a.confidence);
              finalTranscript += alternatives[0].transcript + ' ';
            }
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        setTranscript(prev => prev + finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'no-speech' || event.error === 'network') {
          recognition.start(); // Restart on common errors
        }
      };

      recognition.onend = () => {
        recognition.start(); // Restart when ended
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  };

  // Stop speech detection
  const stopSpeechDetection = () => {
    if (speechDetectionRef.current) {
      speechDetectionRef.current.javascriptNode.disconnect();
      speechDetectionRef.current.audioContext.close();
      speechDetectionRef.current.stream.getTracks().forEach(track => track.stop());
      speechDetectionRef.current = null;
    }

    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      speechRecognitionRef.current = null;
    }

    stopSpeech();
  };

  // Timer functions
  const startTimer = () => {
    setTimeElapsed(0);
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Recording functions
  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    await submitAnswer();
  };

  // Answer submission
  const submitAnswer = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post('http://api.crosscareers.com/api/v1/insm/submit-answer', {
        question: questions[currentQuestionIndex].question,
        questionType: questions[currentQuestionIndex].type,
        transcript,
        timeSpent: timeElapsed
      });

      setTranscript(response.data.transcript || transcript);

      setProgress(prev => [...prev, {
        question: questions[currentQuestionIndex].question,
        type: questions[currentQuestionIndex].type,
        timeSpent: timeElapsed,
        transcript
      }]);
    } catch (error) {
      toast.error('Failed to submit answer. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Question navigation
  const nextQuestion = async () => {
    if (isRecording) {
      await stopRecording();
    }

    resetTimer();

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTranscript('');
      setTimeElapsed(0);
      startTimer();

      // Speak next question
      if (showVirtualInterviewer) {
        speakQuestion(questions[nextIndex].question);
      }
    } else {
      await completeInterview();
    }
  };

  // Interview completion
  const completeInterview = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://api.crosscareers.com/api/v1/insm/complete', {
        questions,
        progress
      });

      setAnalysis(response.data);
      setStep(3);

      // Construct answers for save-history
      const answers = response.data.questionAnalysis.map(qa => ({
        question: qa.question,
        questionType: questions.find(q => q.question === qa.question)?.type || 'technical',
        transcript: qa.userAnswer,
        score: qa.score,
        feedback: qa.feedback,
        suggestedAnswer: qa.suggestedAnswer,
        timeSpent: progress.find(p => p.question === qa.question)?.timeSpent || 0
      }));

      await axios.post('http://api.crosscareers.com/api/v1/insm/save-history', {
        userId: "507f1f77bcf86cd799439011",
        jobDescription: jobDescription || '',
        documentText: fileName ? `Uploaded document: ${fileName}` : '',
        practiceMode,
        questions,
        answers,
        overallScore: response.data.overallScore,
        improvementSuggestions: response.data.improvementSuggestions,
        commonQuestions: [
          {
            question: "Explain the concept of [relevant technology]...",
            type: "technical",
            category: "Technology Fundamentals"
          },
          {
            question: "Describe a time when you had a conflict with a team member...",
            type: "scenario",
            category: "Teamwork"
          }
        ]
      });
    } catch (error) {
      toast.error('Failed to complete interview. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
      stopSpeechDetection();
      resetTimer();
    }
  };

  // Download results as PDF via API
  const downloadResults = async () => {
    try {
      setIsLoading(true);

      const fullTranscript = progress.map(p => p.transcript).join(' ... ');

      const response = await axios.post('http://api.crosscareers.com/api/v1/insm/download-results', {
        analysis,
        questions,
        transcript: fullTranscript
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'interview-results.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to download results. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const shareResults = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Interview Results',
          text: `I scored ${analysis?.overallScore}% on my interview practice!`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Helper functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Clean up
  useEffect(() => {
    return () => {
      stopSpeechDetection();
      resetTimer();
      stopSpeech();
    };
  }, []);

  // Load voices when component mounts
  useEffect(() => {
    if (isSpeechSynthesisSupported()) {
      // Some browsers need this to populate voices
      window.speechSynthesis.onvoiceschanged = () => {
        console.log('Voices loaded');
      };

      // Force voices to load
      window.speechSynthesis.getVoices();
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 mt-20">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-gray-200">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center tracking-tight">Interview Practice Simulator</h1>

            {/* Step 1: Input Job Description or Upload Document */}
            {step === 1 && (
              <form onSubmit={handleSubmit(generateQuestions)} className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Select Practice Mode</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setPracticeMode('full')}
                      className={`p-6 border-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${practiceMode === 'full' ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
                    >
                      <div className="flex flex-col items-center">
                        <FiAward className="w-8 h-8 mb-3 text-blue-600" />
                        <span className="font-semibold text-gray-900">Full Mock Interview</span>
                        <span className="text-sm text-gray-500 mt-1">3 Technical + 2 Scenario Questions</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPracticeMode('technical')}
                      className={`p-6 border-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${practiceMode === 'technical' ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
                    >
                      <div className="flex flex-col items-center">
                        <FiBookOpen className="w-8 h-8 mb-3 text-blue-600" />
                        <span className="font-semibold text-gray-900">Technical Focus</span>
                        <span className="text-sm text-gray-500 mt-1">5 Technical Questions</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPracticeMode('scenario')}
                      className={`p-6 border-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${practiceMode === 'scenario' ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
                    >
                      <div className="flex flex-col items-center">
                        <FiClock className="w-8 h-8 mb-3 text-blue-600" />
                        <span className="font-semibold text-gray-900">Scenario Focus</span>
                        <span className="text-sm text-gray-500 mt-1">5 Scenario Questions</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Paste Job Description
                  </label>
                  <textarea
                    {...register('jobDescription')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-200"
                    rows={4}
                    placeholder="Paste the job description here..."
                  />
                </div>

                <div className="text-center text-gray-600 font-semibold">OR</div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Upload Document (PDF, DOCX, TXT)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200 relative overflow-hidden shadow-sm">
                      {!fileName ? (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiUpload className="w-10 h-10 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-600 font-medium">
                            <span className="text-blue-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PDF, DOCX, TXT (Max 5MB)</p>
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <FiUpload className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{fileName}</p>
                          {isUploading && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      )}
                      <input
                        {...register('document')}
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  {fileName && (
                    <div className="mt-3 flex items-center justify-between px-2">
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {fileName}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFileName('');
                          setFile(null);
                          setValue('document', null);
                          setUploadProgress(0);
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium transition duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {(jobDescription || fileName) && (
                    <p className="mt-2 text-sm text-gray-500 italic">
                      Note: Job description text takes priority if both are provided.
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showVirtualInterviewer}
                      onChange={(e) => setShowVirtualInterviewer(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 shadow-sm"
                    />
                    <span className="ml-2 text-gray-700 font-medium">Enable AI Virtual Interviewer</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || (!jobDescription && !file)}
                  className={`w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 shadow-md ${
                    (isLoading || (!jobDescription && !file)) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Generating Questions...' : 'Start Practice Session'}
                </button>
              </form>
            )}

            {/* Step 2: Interview Session */}
            {step === 2 && questions.length > 0 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Question {currentQuestionIndex + 1} / {questions.length}
                    <span className="ml-2 text-sm font-medium text-gray-500">
                      ({questions[currentQuestionIndex].type.charAt(0).toUpperCase() + questions[currentQuestionIndex].type.slice(1)})
                    </span>
                  </h2>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${isSpeaking ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      <FiMic className="mr-1.5" />
                      {isSpeaking ? 'Speaking' : 'Silent'}
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                      {formatTime(timeElapsed)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
                    {showVirtualInterviewer && (
                      <div className="mb-6 flex items-start space-x-4 bg-white p-4 rounded-xl shadow-md">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold text-lg">AI</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium text-lg animate-fade-in">
                            {virtualInterviewerText}
                            {isSpeakingAI && (
                              <span className="ml-3 inline-flex items-center space-x-1">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {questions[currentQuestionIndex].type === 'technical' ? 'Technical Question' : 'Scenario-Based Question'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      {questions[currentQuestionIndex].question}
                    </h3>

                    <div className="mt-6">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Your Real-Time Transcript
                      </label>
                      <textarea
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-200"
                        rows={5}
                        placeholder="Your spoken answer will appear here in real-time..."
                      />
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-2xl overflow-hidden relative aspect-video shadow-lg">
                    <Webcam
                      ref={webcamRef}
                      audio={false} // Disable audio to prevent feedback
                      videoConstraints={videoConstraints}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`flex items-center justify-center p-4 rounded-full shadow-xl transition duration-200 transform hover:scale-110 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-white hover:bg-gray-100'}`}
                      >
                        {isRecording ? (
                          <span className="w-6 h-6 bg-white rounded"></span>
                        ) : (
                          <FiMic className="w-6 h-6 text-gray-800" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6">
                  <div className="text-sm text-gray-600 font-medium">
                    {isRecording ? (
                      <span className="flex items-center">
                        <span className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                        Recording in progress...
                      </span>
                    ) : (
                      'Click the microphone to begin recording your response'
                    )}
                  </div>

                  <button
                    onClick={nextQuestion}
                    disabled={isLoading}
                    className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 shadow-md disabled:opacity-50"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Session'}
                    <FiSkipForward className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Results */}
            {step === 3 && analysis && (
              <div className="space-y-8 p-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Interview Results</h2>
                  <p className="text-gray-600 text-lg">Detailed performance analysis and actionable feedback</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 shadow-md">
                  <h3 className="text-xl font-semibold text-blue-900 mb-6 text-center">Overall Performance Score</h3>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={analysis.overallScore >= 95 ? '#10B981' : analysis.overallScore >= 80 ? '#3B82F6' : '#EF4444'}
                          strokeWidth="3"
                          strokeDasharray={`${analysis.overallScore}, 100`}
                          className="transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <span className="text-3xl font-bold text-gray-900">{analysis.overallScore}%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-gray-700 text-lg font-medium">
                    {analysis.overallScore >= 95 ? 'Outstanding! You demonstrate expert-level skills.' :
                     analysis.overallScore >= 80 ? 'Well done! Solid performance with minor areas for refinement.' :
                     'Good effort! Focus on the feedback to boost your score next time.'}
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">In-Depth Feedback</h3>

                  {analysis.questionAnalysis.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-2xl p-6 shadow-sm transition duration-200 hover:shadow-md">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-gray-900 text-lg">{item.question}</h4>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          item.score >= 90 ? 'bg-green-100 text-green-800' :
                          item.score >= 70 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.score}%
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Your Response:</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">{item.userAnswer || 'No transcript captured'}</p>
                      </div>

                      {item.score < 95 && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-700 mb-1">Suggested Model Answer:</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">{item.suggestedAnswer}</p>
                        </div>
                      )}

                      {item.feedback && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Personalized Feedback:</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">{item.feedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Improvement Areas</h3>
                  <ul className="list-disc pl-6 space-y-3 text-gray-700 text-lg">
                    {analysis.improvementSuggestions.map((suggestion, index) => (
                      <li key={index} className="leading-relaxed">{suggestion}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-center pt-8 space-x-6">
                  <button
                    onClick={downloadResults}
                    disabled={isLoading}
                    className="flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 shadow-md disabled:opacity-50"
                  >
                    <FiDownload className="mr-2" />
                    Download PDF Report
                  </button>

                  <button
                    onClick={shareResults}
                    disabled={isLoading}
                    className="flex items-center px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-xl transition duration-200 shadow-md disabled:opacity-50"
                  >
                    <FiShare2 className="mr-2" />
                    Share Results
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InterviewPractice;
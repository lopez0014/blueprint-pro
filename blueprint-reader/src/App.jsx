import React, { useState } from 'react';
import { Upload, FileText, Lock, Mail, ArrowRight, CheckCircle, LogOut, Cpu, X, Phone, User } from 'lucide-react';
import { simulateBackendRequest } from './services/apiBridge';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  // Estados para el formulario modal de renta
  const [showRentModal, setShowRentModal] = useState(false);
  const [rentForm, setRentForm] = useState({ name: '', phone: '', email: '', terms: false });
  const [rentSubmitted, setRentSubmitted] = useState(false);
  const [isSubmittingRent, setIsSubmittingRent] = useState(false);

  // Estados del Dashboard
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    await simulateBackendRequest('/api/v1/auth/login', { email: userEmail });
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await simulateBackendRequest('/api/v1/auth/logout', { user: userEmail });
    setIsAuthenticated(false);
    setUserEmail('');
    setCurrentView('landing');
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisDone(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisDone(false);
    }
  };

  const processPlan = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    await simulateBackendRequest('/api/v1/blueprints/upload', { fileName: selectedFile.name, size: selectedFile.size });
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisDone(true);
    }, 1200);
  };

  const handleRentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingRent(true);
    await simulateBackendRequest('/api/v1/licenses/request-rental', rentForm);
    setTimeout(() => {
      setIsSubmittingRent(false);
      setRentSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans relative">
      
      {/* NAVBAR */}
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
            <span className="font-bold text-xl tracking-wide text-white">BLUE PRINT PRO</span>
          </div>

          <div className="flex items-center space-x-4">
            {currentView === 'landing' && (
              <>
                <button onClick={() => setCurrentView('login')} className="text-sm text-zinc-400 hover:text-white transition">
                  Sign In
                </button>
                <button onClick={() => setCurrentView('login')} className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg text-sm font-medium transition">
                  Access Portal
                </button>
              </>
            )}
            {currentView === 'login' && (
              <button onClick={() => setCurrentView('landing')} className="text-sm text-zinc-400 hover:text-white transition">
                ← Back to home
              </button>
            )}
            {isAuthenticated && currentView === 'dashboard' && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-zinc-400 hidden md:inline">User: <strong className="text-white">{userEmail || 'admin@blueprint.com'}</strong></span>
                <button onClick={handleLogout} className="flex items-center space-x-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 px-3 py-1.5 rounded-lg text-sm transition">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* LANDING PAGE */}
      {currentView === 'landing' && (
        <main className="flex-1">
          <section className="relative py-28 px-6 text-center overflow-hidden border-b border-zinc-800">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1931&auto=format&fit=crop')] bg-cover bg-center opacity-10 -z-10" />
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
                Executive System for <span className="text-zinc-400">Blueprint Reading</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Professional platform for the digital interpretation, analysis, and management of structural blueprints in construction projects.
              </p>
              <div className="pt-4">
                <button onClick={() => setCurrentView('login')} className="bg-white hover:bg-zinc-200 text-black px-8 py-3.5 rounded-xl font-semibold inline-flex items-center space-x-2 transition">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

          <section className="py-20 px-6 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white">How It Works</h2>
              <p className="text-zinc-400 mt-2">Optimized workflow for engineers, architects, and construction managers.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl">
                <div className="bg-zinc-900 border border-zinc-700 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white font-bold text-lg">1</div>
                <h3 className="text-xl font-bold text-white mb-3">Upload Blueprint</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Securely upload your structural blueprint image files quickly and easily from any device on site.</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl">
                <div className="bg-zinc-900 border border-zinc-700 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white font-bold text-lg">2</div>
                <h3 className="text-xl font-bold text-white mb-3">Automated Analysis</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">The system processes graphic elements to deliver a clean, structured reading of structural layouts.</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl">
                <div className="bg-zinc-900 border border-zinc-700 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white font-bold text-lg">3</div>
                <h3 className="text-xl font-bold text-white mb-3">Field Results</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Obtain executive reports ready for consultation by field crews and general site supervision.</p>
              </div>
            </div>
          </section>

          {/* SECCIÓN A&R CONSTRUCTION / RENTAL */}
          <section className="py-20 px-6 border-t border-zinc-800 bg-zinc-950/60">
            <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-3xl space-y-6 shadow-2xl">
              <div className="inline-flex items-center space-x-2 bg-zinc-800 border border-zinc-700 px-3.5 py-1.5 rounded-full text-xs text-zinc-300 font-mono">
                <Cpu className="w-4 h-4 text-white" />
                <span>Proprietary AI Training • YOLO Computer Vision</span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Built by A&R Construction for Field Excellence
              </h2>
              
              <p className="text-zinc-300 text-base leading-relaxed">
                At <strong>A&R Construction</strong>, we created this powerful tool to facilitate blueprint reading and material takeoff for our workers. Powered by advanced YOLO computer vision trained on over 1,500 structural blueprint sheets, our software accurately recognizes beams, rebars, and structural details instantly.
              </p>

              <div className="border-l-2 border-zinc-500 pl-4 py-1 text-sm text-zinc-400 italic">
                "We use this private platform daily across our projects to streamline execution. Now, you can rent this exact intelligent system for your company's operations."
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800">
                <div>
                  <span className="text-xs text-zinc-500 block">Commercial License Rental</span>
                  <span className="text-2xl font-black text-white">$300 <span className="text-sm font-normal text-zinc-400">/ month</span></span>
                </div>
                <button 
                  onClick={() => { setRentSubmitted(false); setShowRentModal(true); }}
                  className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-xl font-semibold transition text-sm shadow-lg cursor-pointer"
                >
                  Rent System For Your Company
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* MODAL DE RENTA DE LICENCIA */}
      {showRentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl w-full max-w-lg shadow-2xl relative">
            <button 
              onClick={() => setShowRentModal(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-white transition bg-zinc-900 p-2 rounded-full border border-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            {!rentSubmitted ? (
              <form onSubmit={handleRentSubmit} className="space-y-5">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Acquire System License</h3>
                  <p className="text-xs text-zinc-400">Fill out the form below to rent the Blue Print Pro enterprise system for $300/month.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-5 h-5 text-zinc-500 absolute left-3.5 top-3" />
                    <input 
                      type="text" 
                      required
                      value={rentForm.name}
                      onChange={(e) => setRentForm({...rentForm, name: e.target.value})}
                      placeholder="John Doe" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 pl-11 text-sm text-white focus:outline-none focus:border-zinc-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-zinc-500 absolute left-3.5 top-3" />
                    <input 
                      type="tel" 
                      required
                      value={rentForm.phone}
                      onChange={(e) => setRentForm({...rentForm, phone: e.target.value})}
                      placeholder="+1 (555) 000-0000" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 pl-11 text-sm text-white focus:outline-none focus:border-zinc-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-zinc-500 absolute left-3.5 top-3" />
                    <input 
                      type="email" 
                      required
                      value={rentForm.email}
                      onChange={(e) => setRentForm({...rentForm, email: e.target.value})}
                      placeholder="manager@company.com" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 pl-11 text-sm text-white focus:outline-none focus:border-zinc-500 transition"
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-2">
                  <input 
                    type="checkbox" 
                    required
                    id="terms"
                    checked={rentForm.terms}
                    onChange={(e) => setRentForm({...rentForm, terms: e.target.checked})}
                    className="mt-1 bg-zinc-900 border-zinc-800 rounded text-white focus:ring-0"
                  />
                  <label htmlFor="terms" className="text-xs text-zinc-400 leading-relaxed cursor-pointer">
                    I confirm that I am interested in purchasing/renting the commercial license for $300/month. I understand a representative will contact me within 24 hours to finalize details.
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmittingRent}
                  className="w-full bg-white hover:bg-zinc-200 text-black py-3.5 rounded-xl font-semibold transition mt-4"
                >
                  {isSubmittingRent ? 'Submitting Request...' : 'Submit License Request'}
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto text-white">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Request Sent Successfully!</h3>
                <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{rentForm.name}</strong>. Our staff has received your license request and will contact you via phone or email within 24 hours.
                </p>
                <button 
                  onClick={() => setShowRentModal(false)}
                  className="mt-4 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 px-6 py-2.5 rounded-xl text-sm font-medium transition"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOGIN */}
      {currentView === 'login' && (
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="text-center mb-8">
              <div className="bg-zinc-900 border border-zinc-700 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-white">Sign In</h2>
              <p className="text-xs text-zinc-400 mt-1">Corporate access to Blue Print Pro</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-zinc-500 absolute left-3.5 top-3" />
                  <input 
                    type="email" 
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="user@company.com" 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 pl-11 text-sm text-white focus:outline-none focus:border-zinc-500 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-zinc-500 absolute left-3.5 top-3" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••" 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 pl-11 text-sm text-white focus:outline-none focus:border-zinc-500 transition"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-white hover:bg-zinc-200 text-black py-3 rounded-xl font-semibold transition mt-2">
                Log In
              </button>
            </form>
          </div>
        </main>
      )}

      {/* DASHBOARD */}
      {isAuthenticated && currentView === 'dashboard' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <h1 className="text-2xl font-bold text-white">Blueprint Upload & Analysis Panel</h1>
            <p className="text-sm text-zinc-400 mt-1">Upload your structural blueprint image to process its data.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4">
                <h2 className="text-lg font-bold text-white">Upload File</h2>
                <label className="border-2 border-dashed border-zinc-800 hover:border-zinc-600 transition rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-zinc-900/40">
                  <Upload className="w-10 h-10 text-zinc-400 mb-2" />
                  <span className="text-sm font-medium text-zinc-300">Select blueprint</span>
                  <span className="text-xs text-zinc-500 mt-1">PNG or JPG format</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>

                {selectedFile && (
                  <div className="text-xs bg-zinc-900 p-3 rounded-lg border border-zinc-800 text-zinc-300 flex items-center justify-between">
                    <span className="truncate max-w-[200px]">📄 {selectedFile.name}</span>
                    <span className="text-zinc-400 font-mono">Loaded</span>
                  </div>
                )}

                <button 
                  onClick={processPlan}
                  disabled={!selectedFile || isAnalyzing}
                  className={`w-full py-3 rounded-xl font-semibold transition ${
                    !selectedFile || isAnalyzing 
                      ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed' 
                      : 'bg-white hover:bg-zinc-200 text-black'
                  }`}
                >
                  {isAnalyzing ? 'Processing blueprint...' : 'Analyze Blueprint'}
                </button>
              </div>

              {analysisDone && (
                <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Analysis Status</h3>
                  <div className="flex items-center space-x-2 text-zinc-300 text-sm font-medium bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span>Blueprint processed and verified successfully.</span>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 p-6 rounded-2xl flex flex-col min-h-[450px]">
              <h2 className="text-lg font-bold text-white mb-4">Blueprint Viewer</h2>
              
              <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl relative overflow-hidden flex items-center justify-center p-4">
                {previewUrl ? (
                  <img src={previewUrl} alt="Blueprint" className="max-h-[500px] rounded-lg object-contain border border-zinc-800" />
                ) : (
                  <div className="text-center space-y-2">
                    <FileText className="w-12 h-12 text-zinc-700 mx-auto" />
                    <p className="text-sm text-zinc-500">Select a blueprint to view it here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-500 bg-zinc-950/50 mt-auto">
        <p>© 2026 Blue Print Pro. Created by Aura Software LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}

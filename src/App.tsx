/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import React, { useState, useEffect, FormEvent, createContext, useContext } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Menu, X, Phone, Mail, MapPin, MessageCircle, 
  Download, Award, Users, BookOpen, Shield, 
  CheckCircle, ChevronRight, GraduationCap, 
  FlaskConical, Computer, Library, Trophy,
  FileText, Trash2, Plus, LogIn, User, Image as ImageIcon, Settings as SettingsIcon, Save
} from "lucide-react";
import { cn } from "./lib/utils";

// --- Context/State for Settings ---
const SettingsContext = createContext<Record<string, string>>({});

const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Record<string, string>>({
    school_name: "United Secondary School",
    tagline: "We Make The Nation United",
    hero_title: "Welcome to United Secondary School",
    hero_subtitle: "\"Providing Quality Education from Montessori to Matric\"",
    about_text: "United Secondary School is committed to providing quality education in a safe and inspiring learning environment. Our goal is to prepare students for academic excellence and responsible citizenship.",
    phone: "+92 312 2898429",
    email: "info@uss.edu.pk",
    address: "Main Campus, United Secondary School, City, Country",
    logo_path: "/favicon.ico",
    hero_image: "https://picsum.photos/seed/school-campus/1920/1080",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.error("Failed to fetch settings:", err));
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = () => useContext(SettingsContext);

// --- Components ---

const Logo = ({ className, src }: { className?: string, src?: string }) => (
  <img 
    src={src || "https://ais-pre-hnyo252hfwox4rrggamni7-241455624089.asia-east1.run.app/favicon.ico"} 
    alt="U.S.S Logo" 
    className={cn("h-12 w-12 object-contain", className)}
    referrerPolicy="no-referrer"
    onError={(e) => {
      if (!src) (e.target as HTMLImageElement).src = "https://picsum.photos/seed/school-logo/100/100";
    }}
  />
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const settings = useSettings();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Academics", path: "/academics" },
    { name: "Admissions", path: "/admissions" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3">
            <Logo src={settings.logo_path} />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-blue-900 leading-tight">{settings.school_name}</h1>
              <p className="text-[10px] text-red-600 font-semibold tracking-widest uppercase">{settings.tagline}</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  location.pathname === link.path ? "text-blue-600" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admissions"
              className="bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
            >
              Admission Open
            </Link>
            <Link
              to="/admin"
              className="text-gray-400 hover:text-blue-600 transition-colors"
              title="Admin Panel"
            >
              <User size={24} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/admin" className="text-gray-400 hover:text-blue-600">
              <User size={24} />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-4 text-base font-medium border-b border-gray-50",
                    location.pathname === link.path ? "text-blue-600" : "text-gray-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4">
                <Link
                  to="/admissions"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-red-600 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Apply for Admission
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const settings = useSettings();
  return (
    <footer className="bg-blue-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-1 rounded-full">
                <Logo src={settings.logo_path} className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-bold">U.S.S</h2>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Dedicated to providing high-quality education that develops knowledge, skills, and moral values in our students.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-blue-800 pb-2">Quick Links</h3>
            <ul className="space-y-3 text-sm text-blue-100">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/academics" className="hover:text-white transition-colors">Academics</Link></li>
              <li><Link to="/admissions" className="hover:text-white transition-colors">Admissions</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-blue-800 pb-2">Academics</h3>
            <ul className="space-y-3 text-sm text-blue-100">
              <li>Montessori Section</li>
              <li>Primary Section</li>
              <li>Middle Section</li>
              <li>Secondary Section</li>
              <li>Download Syllabus</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-blue-800 pb-2">Contact Info</h3>
            <ul className="space-y-4 text-sm text-blue-100">
              <li className="flex gap-3">
                <MapPin size={18} className="text-red-500 shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-red-500 shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-red-500 shrink-0" />
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-900 pt-8 text-center text-xs text-blue-300">
          <p>&copy; {new Date().getFullYear()} {settings.school_name}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const WhatsAppButton = () => {
  const settings = useSettings();
  const cleanPhone = settings.phone.replace(/\D/g, "");
  return (
    <a
      href={`https://wa.me/${cleanPhone}?text=Hello,%20I%20want%20information%20about%20admission.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-110 flex items-center justify-center"
    >
      <MessageCircle size={32} />
    </a>
  );
};

// --- Pages ---

const Home = () => {
  const settings = useSettings();
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src={settings.hero_image} 
            alt="School Campus" 
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Now Enrolling for 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              {settings.hero_title.split(" ").slice(0, -3).join(" ")} <br />
              <span className="text-blue-400">{settings.hero_title.split(" ").slice(-3).join(" ")}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl font-light">
              {settings.hero_subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/admissions" className="bg-red-600 text-white px-8 py-4 rounded-full font-bold hover:bg-red-700 transition-all shadow-xl">
                Apply for Admission
              </Link>
              <Link to="/about" className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">Committed to Excellence</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {settings.about_text}
              </p>
              <div className="space-y-4 mb-10">
                {[
                  "Experienced & Qualified Faculty",
                  "Modern Science & Computer Labs",
                  "Safe & Disciplined Environment",
                  "Focus on Moral & Ethical Values"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/about" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all">
                Read More About Us <ChevronRight size={20} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://picsum.photos/seed/students-learning/800/600" 
                alt="Students" 
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -left-10 bg-blue-900 text-white p-8 rounded-3xl hidden md:block shadow-xl">
                <p className="text-4xl font-bold mb-1">15+</p>
                <p className="text-sm text-blue-200">Years of Academic Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Academic Sections</h2>
          <p className="text-gray-600 mb-16 max-w-2xl mx-auto">We offer a comprehensive educational journey from early childhood to secondary levels.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Montessori", desc: "Early childhood education focusing on creativity and social development.", icon: <GraduationCap className="text-red-500" /> },
              { title: "Primary", desc: "Grades 1-5 focusing on core subjects like English, Math, and Science.", icon: <BookOpen className="text-blue-500" /> },
              { title: "Middle", desc: "Grades 6-8 emphasizing conceptual learning and skill development.", icon: <Users className="text-green-500" /> },
              { title: "Secondary", desc: "Grades 9-10 preparation for board exams with specialized streams.", icon: <Award className="text-yellow-500" /> },
            ].map((cls, idx) => (
              <motion.div
                key={cls.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
              >
                <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {cls.icon}
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-4">{cls.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{cls.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">World-Class Facilities</h2>
            <p className="text-gray-600">Providing the best resources for a complete learning experience.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Airy Classrooms", icon: <Shield /> },
              { name: "Computer Lab", icon: <Computer /> },
              { name: "Science Lab", icon: <FlaskConical /> },
              { name: "Qualified Teachers", icon: <Users /> },
              { name: "Library", icon: <Library /> },
              { name: "Activity Based Learning", icon: <GraduationCap /> },
              { name: "Sports Activities", icon: <Trophy /> },
              { name: "Safe Environment", icon: <CheckCircle /> },
            ].map((facility) => (
              <div key={facility.name} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-blue-50 transition-colors">
                <div className="text-blue-600 mb-4">{facility.icon}</div>
                <span className="text-gray-800 font-semibold text-sm">{facility.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Why Choose United Secondary School?</h2>
              <div className="space-y-6">
                {[
                  "Experienced & Dedicated Teachers",
                  "Affordable Fee Structure for All",
                  "Safe & Secure Learning Environment",
                  "Strong Focus on Discipline & Character",
                  "Regular Tests & Academic Assessments"
                ].map((point) => (
                  <div key={point} className="flex items-center gap-4">
                    <div className="bg-red-600 p-1 rounded-full">
                      <CheckCircle size={18} />
                    </div>
                    <span className="text-lg text-blue-100">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://picsum.photos/seed/school-1/400/400" alt="Gallery" className="rounded-2xl shadow-lg" referrerPolicy="no-referrer" />
              <img src="https://picsum.photos/seed/school-2/400/400" alt="Gallery" className="rounded-2xl shadow-lg mt-8" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>

      {/* Admission Banner */}
      <section className="py-20 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">ADMISSIONS OPEN 2026</h2>
          <p className="text-xl text-red-100 mb-10">Secure your child's future with quality education today.</p>
          <Link to="/admissions" className="bg-white text-red-600 px-10 py-4 rounded-full font-black text-lg hover:bg-gray-100 transition-all shadow-2xl uppercase tracking-widest">
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  );
};

const About = () => {
  const settings = useSettings();
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">About Us</h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            {settings.about_text}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-6 border-l-4 border-red-600 pl-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              To become a leading educational institution that shapes responsible and successful citizens who contribute positively to society.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-6 border-l-4 border-red-600 pl-4">Our Mission</h2>
            <ul className="space-y-4 text-gray-600 text-lg">
              <li className="flex gap-3"><CheckCircle className="text-blue-600 shrink-0" /> Provide quality education for all.</li>
              <li className="flex gap-3"><CheckCircle className="text-blue-600 shrink-0" /> Develop creativity and innovation.</li>
              <li className="flex gap-3"><CheckCircle className="text-blue-600 shrink-0" /> Encourage critical thinking skills.</li>
              <li className="flex gap-3"><CheckCircle className="text-blue-600 shrink-0" /> Promote discipline and respect.</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-12">Our Core Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Integrity", desc: "Honesty in all actions." },
              { name: "Respect", desc: "Valuing every individual." },
              { name: "Responsibility", desc: "Accountability for choices." },
              { name: "Excellence", desc: "Striving for the best." },
            ].map((val) => (
              <div key={val.name} className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-red-600 mb-2">{val.name}</h3>
                <p className="text-gray-500 text-sm">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Academics = () => {
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/resources")
      .then(res => res.json())
      .then(data => setResources(data));
  }, []);

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">Academics</h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Our curriculum is designed to foster intellectual growth and practical skills across all levels.
          </p>
        </div>

        <div className="space-y-12 mb-24">
          {[
            { title: "Montessori Section", desc: "Early childhood education focusing on creativity, social development, and sensory learning.", focus: ["Creative Arts", "Social Skills", "Basic Numeracy", "Phonics"] },
            { title: "Primary Section (Grades 1-5)", desc: "Building a strong foundation in core academic subjects.", focus: ["English", "Mathematics", "Science", "Islamiyat", "Urdu"] },
            { title: "Middle Section (Grades 6-8)", desc: "Transitioning to conceptual learning and critical thinking.", focus: ["Advanced Science", "Social Studies", "Computer Literacy", "Literature"] },
            { title: "Secondary Section (Grades 9-10)", desc: "Rigorous preparation for board examinations with specialized streams.", focus: ["Physics", "Chemistry", "Biology", "Mathematics", "Computer Science"] },
          ].map((sec) => (
            <div key={sec.title} className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm hover:shadow-md transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">{sec.title}</h2>
                  <p className="text-gray-600 mb-6 text-lg">{sec.desc}</p>
                </div>
                <div>
                  <h3 className="font-bold text-red-600 mb-4 uppercase tracking-wider text-sm">Key Focus Areas:</h3>
                  <div className="flex flex-wrap gap-2">
                    {sec.focus.map(f => (
                      <span key={f} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Download Center */}
        <div className="bg-gray-900 text-white rounded-3xl p-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Download Center</h2>
              <p className="text-gray-400">Access latest syllabus, time tables, and academic resources.</p>
            </div>
            <Download size={48} className="text-red-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.length > 0 ? (
              resources.map((res) => (
                <a
                  key={res.id}
                  href={res.file_path}
                  download
                  className="flex items-center justify-between bg-gray-800 p-6 rounded-2xl hover:bg-gray-700 transition-all border border-gray-700 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-red-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="font-bold">{res.name}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">{res.type}</p>
                    </div>
                  </div>
                  <Download size={20} className="text-blue-400" />
                </a>
              ))
            ) : (
              <p className="text-gray-500 italic">No resources available for download at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Admissions = () => {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">Admissions 2026</h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Join the United Secondary School family. Follow our simple process to secure your child's future.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-8 border-l-4 border-red-600 pl-4">Admission Process</h2>
            <div className="space-y-8">
              {[
                { step: "1", title: "Submit Application", desc: "Collect and submit the admission form from the school office." },
                { step: "2", title: "Entrance Test", desc: "Student will undergo a basic assessment test based on previous class syllabus." },
                { step: "3", title: "Interview", desc: "A brief interview with the parents and the student." },
                { step: "4", title: "Confirmation", desc: "Final admission confirmation after fee submission." },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="bg-blue-900 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 shadow-lg">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
            <h2 className="text-2xl font-bold text-blue-900 mb-8">Required Documents</h2>
            <ul className="space-y-4">
              {[
                "Birth Certificate / B-Form Copy",
                "Previous School Result Card (Original)",
                "School Leaving Certificate (if applicable)",
                "4 Passport Size Photographs",
                "Parent/Guardian CNIC Copy",
              ].map((doc) => (
                <li key={doc} className="flex items-center gap-4 text-gray-700 font-medium">
                  <div className="bg-green-100 p-1 rounded-full text-green-600">
                    <CheckCircle size={18} />
                  </div>
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">Fee Structure</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-8 py-6 text-left font-bold uppercase tracking-wider">Class Level</th>
                  <th className="px-8 py-6 text-left font-bold uppercase tracking-wider">Monthly Fee (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { class: "Montessori", fee: "2500" },
                  { class: "Primary (1-5)", fee: "3000" },
                  { class: "Middle (6-8)", fee: "3500" },
                  { class: "Secondary (9-10)", fee: "4500" },
                ].map((row) => (
                  <tr key={row.class} className="hover:bg-blue-50 transition-colors">
                    <td className="px-8 py-6 font-bold text-gray-900">{row.class}</td>
                    <td className="px-8 py-6 text-blue-600 font-black">{row.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-500 italic text-center">* Note: Admission fee and annual charges are separate.</p>
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  const settings = useSettings();
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">Contact Us</h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Have questions? We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Call Us</h3>
              <p className="text-gray-600">{settings.phone}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="bg-red-50 w-12 h-12 rounded-2xl flex items-center justify-center text-red-600 mb-6">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Email Us</h3>
              <p className="text-gray-600">{settings.email}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="bg-green-50 w-12 h-12 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">{settings.address}</p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-blue-900 mb-8">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input type="text" className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="+92 300 0000000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input type="email" className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea rows={5} className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="How can we help you?"></textarea>
              </div>
              <button className="w-full bg-blue-900 text-white py-5 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all shadow-lg">
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Google Map Placeholder */}
        <div className="w-full h-[450px] bg-gray-200 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center text-gray-500 font-bold">
          <div className="text-center">
            <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
            <p>Google Map Integration</p>
            <p className="text-sm font-normal mt-2">United Secondary School Location</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"notices" | "resources" | "settings">("notices");
  const [notices, setNotices] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [newNotice, setNewNotice] = useState({ title: "", content: "" });
  const [newResource, setNewResource] = useState({ name: "", type: "syllabus", file: null as File | null });

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotices();
      fetchResources();
      fetchSettings();
    }
  }, [isLoggedIn]);

  const fetchNotices = () => fetch("/api/notices").then(res => res.json()).then(setNotices);
  const fetchResources = () => fetch("/api/resources").then(res => res.json()).then(setResources);
  const fetchSettings = () => fetch("/api/settings").then(res => res.json()).then(setSettings);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (username === "uss" && password === "uss12") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid Username or Password");
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    alert("Settings saved successfully!");
    window.location.reload(); // Refresh to apply changes globally
  };

  const handleImageUpload = async (key: string, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.filePath) {
      handleSettingChange(key, data.filePath);
    }
  };

  const addNotice = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/api/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNotice),
    });
    setNewNotice({ title: "", content: "" });
    fetchNotices();
  };

  const deleteNotice = async (id: number) => {
    await fetch(`/api/notices/${id}`, { method: "DELETE" });
    fetchNotices();
  };

  const addResource = async (e: FormEvent) => {
    e.preventDefault();
    if (!newResource.file) return;
    const formData = new FormData();
    formData.append("name", newResource.name);
    formData.append("type", newResource.type);
    formData.append("file", newResource.file);

    await fetch("/api/resources", {
      method: "POST",
      body: formData,
    });
    setNewResource({ name: "", type: "syllabus", file: null });
    fetchResources();
  };

  const deleteResource = async (id: number) => {
    await fetch(`/api/resources/${id}`, { method: "DELETE" });
    fetchResources();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
              <LogIn size={32} />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">Admin Login</h1>
            <p className="text-gray-500 text-sm">Access school management panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                placeholder="uss"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h1 className="text-3xl font-bold text-blue-900">Admin Dashboard</h1>
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
            <button 
              onClick={() => setActiveTab("notices")}
              className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all", activeTab === "notices" ? "bg-blue-900 text-white" : "text-gray-500 hover:text-blue-900")}
            >
              Notices
            </button>
            <button 
              onClick={() => setActiveTab("resources")}
              className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all", activeTab === "resources" ? "bg-blue-900 text-white" : "text-gray-500 hover:text-blue-900")}
            >
              Resources
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all", activeTab === "settings" ? "bg-blue-900 text-white" : "text-gray-500 hover:text-blue-900")}
            >
              Site Settings
            </button>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="text-red-600 font-bold hover:underline">Logout</button>
        </div>

        {activeTab === "settings" ? (
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
                <SettingsIcon className="text-blue-600" /> General Site Settings
              </h2>
              <button 
                onClick={saveSettings}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-lg"
              >
                <Save size={20} /> Save All Changes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Brand & Header</h3>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">School Name</label>
                  <input 
                    type="text" 
                    value={settings.school_name || ""} 
                    onChange={(e) => handleSettingChange("school_name", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Tagline</label>
                  <input 
                    type="text" 
                    value={settings.tagline || ""} 
                    onChange={(e) => handleSettingChange("tagline", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Website Logo</label>
                  <div className="flex items-center gap-4">
                    <Logo src={settings.logo_path} className="h-16 w-16 bg-gray-50 p-2 rounded-xl border" />
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload("logo_path", e.target.files[0])}
                      className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Hero Section</h3>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Hero Title</label>
                  <input 
                    type="text" 
                    value={settings.hero_title || ""} 
                    onChange={(e) => handleSettingChange("hero_title", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Hero Subtitle</label>
                  <input 
                    type="text" 
                    value={settings.hero_subtitle || ""} 
                    onChange={(e) => handleSettingChange("hero_subtitle", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Hero Background Image</label>
                  <div className="space-y-4">
                    <img src={settings.hero_image} className="h-32 w-full object-cover rounded-xl border" referrerPolicy="no-referrer" />
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload("hero_image", e.target.files[0])}
                      className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6 md:col-span-2">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Contact & Footer</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      value={settings.phone || ""} 
                      onChange={(e) => handleSettingChange("phone", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={settings.email || ""} 
                      onChange={(e) => handleSettingChange("email", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">School Address</label>
                    <input 
                      type="text" 
                      value={settings.address || ""} 
                      onChange={(e) => handleSettingChange("address", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">About Preview Text</label>
                  <textarea 
                    value={settings.about_text || ""} 
                    onChange={(e) => handleSettingChange("about_text", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                    rows={4}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Notices Management */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-green-500" /> Add New Notice
                </h2>
                <form onSubmit={addNotice} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Notice Title"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                    required
                  />
                  <textarea
                    placeholder="Notice Content"
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                    rows={3}
                  ></textarea>
                  <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all">
                    Post Notice
                  </button>
                </form>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-blue-900 mb-6">Recent Notices</h2>
                <div className="space-y-4">
                  {notices.map((n) => (
                    <div key={n.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-900">{n.title}</p>
                        <p className="text-xs text-gray-500">{new Date(n.date).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => deleteNotice(n.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resources Management */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-blue-500" /> Upload Resource (PDF)
                </h2>
                <form onSubmit={addResource} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Resource Name (e.g. Class 9 Syllabus)"
                    value={newResource.name}
                    onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                    required
                  />
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                  >
                    <option value="syllabus">Syllabus</option>
                    <option value="timetable">Time Table</option>
                    <option value="notice">Other Notice</option>
                  </select>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setNewResource({ ...newResource, file: e.target.files?.[0] || null })}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                    Upload File
                  </button>
                </form>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-blue-900 mb-6">Uploaded Resources</h2>
                <div className="space-y-4">
                  {resources.map((r) => (
                    <div key={r.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-900">{r.name}</p>
                        <p className="text-xs text-blue-600 uppercase font-bold tracking-tighter">{r.type}</p>
                      </div>
                      <button onClick={() => deleteResource(r.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <SettingsProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
    </SettingsProvider>
  );
}

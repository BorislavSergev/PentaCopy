import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <section id="about" className="py-24 bg-white dark:bg-gray-800 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute right-0 top-1/4 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute left-0 bottom-1/4 w-80 h-80 bg-indigo-50 dark:bg-indigo-900/20 rounded-full opacity-50 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">About Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">About PentaCopy</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We're building the future of AI assistance through innovation and user-centered design.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              PentaCopy was founded with a simple mission: to make advanced AI accessible to everyone. We believe that by harnessing the power of artificial intelligence, we can help people be more productive, creative, and effective in their work.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Our team combines expertise in machine learning, user experience design, and software engineering to create an AI assistant that truly understands your needs and helps you achieve your goals.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mt-10">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl text-center transform hover:-translate-y-2 transition-all duration-300">
                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 block mb-1">10K+</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">Active Users</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl text-center transform hover:-translate-y-2 transition-all duration-300">
                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 block mb-1">5M+</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">AI Responses</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl text-center transform hover:-translate-y-2 transition-all duration-300">
                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 block mb-1">98%</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">Satisfaction</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="Our team" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/30 to-transparent"></div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-600 rounded-full opacity-20 blur-xl"></div>
            
            <div className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Join Our Team</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">We're always looking for talent</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 dark:bg-gray-700/80 p-8 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Privacy-Focused</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We prioritize your privacy and data security. Your conversations are encrypted and protected with industry-leading security measures to ensure your information stays private.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-50 dark:bg-gray-700/80 p-8 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Constant Innovation</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We're constantly improving our AI models and adding new features based on user feedback and the latest advancements in technology to deliver the best experience possible.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-50 dark:bg-gray-700/80 p-8 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Customer-Centric</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our users are at the heart of everything we do. We're committed to providing exceptional support and building features that truly meet your needs and enhance your workflow.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

 
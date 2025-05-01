import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description, features, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300 group"
  >
    <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 p-3 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
    {features && (
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="text-gray-600 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
    )}
  </motion.div>
);

const FeatureRow = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 flex group hover:border-indigo-300 transition-all duration-300"
  >
    <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 p-3 rounded-xl w-14 h-14 flex items-center justify-center mr-6 flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </motion.div>
);

const Features = () => {
  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-100 dark:bg-indigo-900/20 rounded-bl-full opacity-50 dark:opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-indigo-100 dark:bg-indigo-900/20 rounded-tr-full opacity-50 dark:opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover why PentaCopy is the ultimate AI assistant for all your content needs.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <FeatureCard
            delay={0.1}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            }
            title="AI-Powered Insights"
            description="Get intelligent responses powered by state-of-the-art machine learning models."
            features={[
              "Multiple AI models available",
              "Context-aware conversations",
              "Smart suggestions"
            ]}
          />
          
          {/* Feature 2 */}
          <FeatureCard
            delay={0.2}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            }
            title="Credit System"
            description="Our flexible credit system gives you complete control over your usage."
            features={[
              "Free starter credits",
              "Monthly credit refills",
              "Transparent usage tracking"
            ]}
          />
          
          {/* Feature 3 */}
          <FeatureCard
            delay={0.3}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            }
            title="Advanced Chat History"
            description="Never lose an important conversation with our sophisticated history system."
            features={[
              "Organize conversations by topic",
              "Full-text search capability",
              "Seamless cloud sync"
            ]}
          />
        </div>
        
        {/* Additional Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-14">
          {/* Feature 4 */}
          <FeatureRow
            delay={0.4}
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
            }
            title="Multiple AI Models"
            description="Choose from various AI models based on your specific needs and tasks. Each model offers different strengths and capabilities."
          />
          
          {/* Feature 5 */}
          <FeatureRow
            delay={0.5}
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            }
            title="Customizable Experience"
            description="Dark mode, interface preferences, and AI behavior settings give you a personalized experience tailored to your workflow."
          />
        </div>
      </div>
    </section>
  )
}

export default Features; 
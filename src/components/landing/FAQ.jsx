import { useState } from 'react';
import { motion } from 'framer-motion';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  
  const faqs = [
    {
      question: "How does the credit system work?",
      answer: "Each plan comes with a monthly allocation of credits that refresh with your billing cycle. Credits are used for AI interactions, with longer and more complex requests using more credits. You can track your usage in real-time through your account dashboard."
    },
    {
      question: "Can I change my subscription plan?",
      answer: "Yes, you can upgrade or downgrade your subscription at any time. When upgrading, you'll be charged the prorated difference for the remainder of your billing cycle. When downgrading, changes will take effect at the end of your current billing period."
    },
    {
      question: "What AI models are available?",
      answer: "PentaCopy offers access to several state-of-the-art AI models, including Gemini Pro and others. The specific models available depend on your subscription plan, with higher tiers providing access to more advanced models."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take security very seriously. All communications are encrypted, and we do not store your conversations longer than necessary. We never share your data with third parties, and you can delete your chat history at any time."
    },
    {
      question: "Do unused credits roll over?",
      answer: "Credits do not roll over from month to month. Each billing cycle resets your credit balance to your plan's allocation. This encourages regular usage and ensures you always have fresh credits available."
    }
  ];
  
  return (
    <section id="faq" className="py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-20 dark:opacity-10">
        <div className="blur-[106px] h-56 bg-gradient-to-br from-indigo-500 to-purple-400"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-indigo-500"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Got questions? We have answers.
            </p>
          </motion.div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="mb-6"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-md"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <span className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0">
                    <span className="text-sm font-semibold">{index + 1}</span>
                  </span>
                  {faq.question}
                </span>
                <svg 
                  className={`w-6 h-6 text-indigo-600 dark:text-indigo-400 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
                id={`faq-answer-${index}`}
                aria-labelledby={`faq-question-${index}`}
              >
                <div className="p-6 bg-white dark:bg-gray-800 rounded-b-xl border-t-0 border border-gray-200 dark:border-gray-700 border-t-transparent">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">Still have questions?</p>
          <a 
            href="#contact" 
            className="inline-flex items-center bg-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-indigo-700 transition duration-300 shadow-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ; 
import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "PentaCopy has transformed how I work. The credit system is so transparent, and the AI responses are incredibly accurate.",
      author: "Sarah J.",
      role: "Content Creator",
      avatar: "https://randomuser.me/api/portraits/women/18.jpg"
    },
    {
      quote: "As a developer, I use PentaCopy daily for documentation and debugging. The chat history feature is a game-changer.",
      author: "Michael T.",
      role: "Software Engineer",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "My team switched to PentaCopy for all our content needs. The Business plan gives us all the credits we need at a great value.",
      author: "Jessica L.",
      role: "Marketing Director",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-gray-800 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">What Our Users Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Thousands of professionals trust PentaCopy for their AI assistant needs.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-lg relative"
            >
              <div className="absolute top-6 right-6 text-indigo-100 dark:text-indigo-800 opacity-30">
                <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 italic mb-8 relative z-10">"{testimonial.quote}"</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-indigo-100 dark:border-indigo-900"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{testimonial.author}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="mt-4 flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          <a 
            href="#" 
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition duration-200"
          >
            <span>View more testimonials</span>
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials; 
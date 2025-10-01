import React from 'react';
import { MessageCircle, Phone, MapPin, AtSign, User, Mail } from 'lucide-react';

const customTailwindConfig = {
  theme: {
    extend: {
      colors: {
        'gemini-teal': '#00B8D9',
        'gemini-cta': '#00A88E',
        'gemini-dark': '#212529',
        'gemini-light-bg': '#f7f8fa',
        'gemini-blue': '#1e3a8a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};

const BackgroundHexagon = ({ top, bottom, left, right, scale, className = 'opacity-30' }) => (
  <svg
    className={`absolute z-0 ${className}`}
    style={{ top, bottom, left, right, transform: `scale(${scale})`, pointerEvents: 'none' }}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 0L100 25V75L50 100L0 75V25Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      d="M50 0L100 25V75L50 100L0 75V25Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      transform="translate(15, -15) scale(0.6)"
      opacity="0.5"
    />
  </svg>
);

const FormField = ({ id, label, type, placeholder, icon: Icon, isTextArea = false }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-md font-medium text-gray-700 block">
      {label}
    </label>
    <div className="relative">
      {isTextArea ? (
        <textarea
          id={id}
          name={id}
          rows="5"
          placeholder={placeholder}
          required
          className="w-full py-3 pl-4 pr-4 border border-gray-300 rounded-xl focus:ring-gemini-teal focus:border-gemini-teal transition duration-150 resize-none"
        ></textarea>
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          required
          className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-gemini-teal focus:border-gemini-teal transition duration-150"
        />
      )}
      {!isTextArea && Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      )}
    </div>
  </div>
);

const ContactDetailCard = ({ icon: Icon, title, content }) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-4">
    <div className="p-3 bg-gemini-light-bg rounded-full border border-gray-200">
      <Icon className="h-6 w-6 text-gemini-teal" />
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-500">{title}</p>
      <p className="text-lg font-bold text-gemini-dark">{content}</p>
    </div>
  </div>
);


const ContactView = () => {
  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted. Thank you for your message!');
  };

  return (
    <div className="bg-gemini-light-bg min-h-screen flex items-center justify-center py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-12">
            <div className="relative">
              <h1 className="text-5xl font-extrabold text-gemini-dark">
                Get In Touch
              </h1>
              <p className="text-xl text-gray-600 mt-3">
                We're here to help! Send us a message or reach out directly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <ContactDetailCard
                icon={AtSign}
                title="Email Address"
                content="support@logbook.com"
              />
              <ContactDetailCard
                icon={Phone}
                title="Phone Number"
                content="+1 (555) 123-4567"
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
              <div className="text-center pt-4">
                <MapPin className="h-6 w-6 text-gemini-teal mx-auto mb-2" />
                <p className="text-md font-medium text-gray-600">
                  123 kota, rajasthan 90210
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gemini-dark mb-8">Send Us a Message</h2>
            <form onSubmit={handleContactSubmit} className="space-y-6">

              <FormField
                id="contact-name"
                label="Your Name"
                type="text"
                placeholder="Your Name"
                icon={User}
              />
              <FormField
                id="contact-email"
                label="Your Email"
                type="email"
                placeholder="name@email.com"
                icon={Mail}
              />
              <FormField
                id="contact-message"
                label="Message"
                placeholder="Tell us how we can help..."
                isTextArea={true}
              />

              <button
                type="submit"
                className="w-full py-3 mt-4 rounded-xl font-bold text-lg text-white bg-teal-600 transition duration-300 hover:bg-teal-700 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
          </div>

        </div >
      </div >
    </div >
  );
};


const App = () => {
  return (
    <div className="font-sans antialiased text-gemini-dark">
      <script src="https://cdn.tailwindcss.com"></script>
      <script>{`
        tailwind.config = ${JSON.stringify(customTailwindConfig)};
      `}</script>

      <style>{`
        body {
          font-family: 'Inter', sans-serif;
          background-color: #f7f8fa;
        }
      `}</style>

      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none text-sky-400">
        <BackgroundHexagon top="5%" left="0%" scale="0.9" className="opacity-10" />
        <BackgroundHexagon bottom="10%" right="5%" scale="0.7" className="opacity-15" />
      </div>

      <main className="relative z-10">
        <ContactView />
      </main>
    </div>
  );
};

export default App;

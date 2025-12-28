import React from 'react';
import { 
  Shield, Lock, Eye, Server, ArrowLeft, 
  Cookie, Globe, FileText, Users, Mail 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const Section = ({ title, icon: Icon, children }) => (
    <section className="mb-10 border-b border-gray-100 pb-8 last:border-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
        <div className="p-2 bg-teal-50 rounded-lg">
          <Icon className="w-6 h-6 text-[#00B8D9]" />
        </div>
        {title}
      </h2>
      <div className="text-gray-600 leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fa] py-8 px-4 sm:px-6 lg:px-8 font-sans text-[#212529]">
      <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-br from-[#1e3a8a] via-[#0e7490] to-[#00B8D9] p-8 md:p-16 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Privacy Policy</h1>
            <p className="text-teal-100 text-lg md:text-xl max-w-2xl">
              We value your trust. Here is a clear explanation of how we collect, use, and protect your data at Logbook.
            </p>
            <div className="mt-6 inline-block bg-black/20 px-4 py-1.5 rounded-lg text-sm font-medium backdrop-blur-md">
              Last Updated: {lastUpdated}
            </div>
          </div>
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-400 opacity-10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-16">
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-10 rounded-r-lg">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> By accessing or using the Logbook platform, you agree to the terms of this Privacy Policy. If you do not agree with the practices described in this policy, please do not use our services.
            </p>
          </div>

          <Section title="Introduction" icon={Shield}>
            <p>
              Welcome to <strong>Logbook</strong> ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
            </p>
            <p>
              This Privacy Policy governs the privacy policies and practices of our Website, located at logbook.com. Please read our Privacy Policy carefully as it will help you make informed decisions about sharing your personal information with us.
            </p>
          </Section>

          <Section title="Information We Collect" icon={Eye}>
            <p>We collect personal information that you voluntarily provide to us when registering at the Website, expressing an interest in obtaining information about us or our products and services, when participating in activities on the Website or otherwise contacting us.</p>
            
            <h3 className="font-bold text-gray-900 mt-4">1. Personal Information Provided by You</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Account Credentials:</strong> Passwords, password hints, and similar security information used for authentication and account access.</li>
              <li><strong>Contact Data:</strong> We collect email addresses and usernames.</li>
              <li><strong>User Content:</strong> Data you input into your logs, including titles, descriptions, status updates, and attachment URLs.</li>
            </ul>

            <h3 className="font-bold text-gray-900 mt-4">2. Information Automatically Collected</h3>
            <p className="mt-2">
              We automatically collect certain information when you visit, use or navigate the Website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our Website.
            </p>
          </Section>

          <Section title="How We Use Your Data" icon={Server}>
            <p>We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>To facilitate account creation and logon process:</strong> If you choose to link your account with us to a third party account (such as your Google account), we use the information you allowed us to collect from those third parties to facilitate account creation and logon process.</li>
              <li><strong>To post testimonials:</strong> We post testimonials on our Website that may contain personal information.</li>
              <li><strong>Request feedback:</strong> We may use your information to request feedback and to contact you about your use of our Website.</li>
              <li><strong>To manage user accounts:</strong> We may use your information for the purposes of managing our account and keeping it in working order.</li>
              <li><strong>To send administrative information to you:</strong> We may use your personal information to send you product, service and new feature information and/or information about changes to our terms, conditions, and policies.</li>
            </ul>
          </Section>

          <Section title="Cookies and Tracking Technologies" icon={Cookie}>
            <p>
              We use cookies and similar tracking technologies to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-2">Essential Cookies</h4>
              <p className="text-sm">
                We use <strong>HTTP-Only cookies</strong> to store your authentication token (`token`). This is essential for keeping you logged in securely. This cookie cannot be accessed by client-side JavaScript, protecting you from XSS attacks.
              </p>
            </div>
          </Section>

          <Section title="Google OAuth & Third Parties" icon={Globe}>
            <p>
              Our application allows you to register and login using your Google account details. Where you choose to do this, we will receive certain profile information about you from Google. The profile Information we receive may vary depending on the Google provider concerned, but will often include your name, e-mail address, and profile picture.
            </p>
            <p>
              We will use the information we receive only for the purposes that are described in this privacy policy or that are otherwise made clear to you on the Website. Please note that we do not control, and are not responsible for, other uses of your personal information by your third party social media provider.
            </p>
          </Section>

          <Section title="Data Security" icon={Lock}>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Encryption:</strong> All passwords are hashed using <strong>Bcrypt</strong> before being stored in our database. We never store plain-text passwords.</li>
              <li><strong>Secure Transmission:</strong> We communicate with our users using Secure Socket Layer (SSL) encryption technology.</li>
              <li><strong>Access Control:</strong> Access to personal data is restricted to authorized personnel only.</li>
            </ul>
            <p className="mt-4 text-sm italic text-gray-500">
              However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Website is at your own risk.
            </p>
          </Section>

          <Section title="Your Privacy Rights" icon={Users}>
            <p>Depending on your region (like the EEA or California), you may have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.</p>
            <p className="mt-2">
              To make such a request, please use the contact details provided below. We will consider and act upon any request in accordance with applicable data protection laws.
            </p>
            <p className="mt-2">
              If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time. Please note however that this will not affect the lawfulness of the processing before its withdrawal.
            </p>
          </Section>

          <Section title="Data Retention" icon={FileText}>
            <p>
              We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).
            </p>
            <p>
              When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
            </p>
          </Section>

          <div className="bg-gray-900 text-white rounded-2xl p-8 mt-12 text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-[#00B8D9]" />
            <h3 className="text-2xl font-bold mb-2">Have questions about this policy?</h3>
            <p className="text-gray-400 mb-6">
              If you have questions or comments about this policy, you may email us or contact us by post.
            </p>
            <a 
              href="mailto:privacy@logbook.com" 
              className="inline-block bg-[#00B8D9] hover:bg-[#009fb8] text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-teal-500/30"
            >
              Contact Support
            </a>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default PrivacyPolicy;
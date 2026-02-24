import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-circuit p-6 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto glass-blue p-8 md:p-12 rounded-[3rem] space-y-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10 text-blue-500" />
            <h1 className="text-4xl font-bold text-white tracking-tighter">Terms of Service</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate(-1)} icon={ArrowLeft}>
            Back
          </Button>
        </div>

        <div className="space-y-6 text-blue-100/80 leading-relaxed overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Technique ("the Service"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. User Eligibility</h2>
            <p>
              You must be at least 18 years of age to use this Service. By using the Service, you represent and warrant 
              that you have the right, authority, and capacity to enter into this agreement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Liability Disclaimer</h2>
            <p className="font-bold text-blue-400">
              Polypall and Technique are not liable for any interactions, communications, or consequences arising 
              from your use of this service.
            </p>
            <p>
              We do not perform background checks on users. Any in-person meetings or financial transactions 
              conducted between users are at your own risk. We are not responsible for any events, outcomes, 
              or risks associated with such interactions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Prohibited Conduct</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Bullying, harassment, or any form of abusive behavior is strictly prohibited.</li>
              <li>Sexually explicit content or solicitation is not permitted.</li>
              <li>Scams, fraud, or impersonation of other entities will result in immediate termination.</li>
              <li>Intellectual property theft or unauthorized sharing of confidential information is forbidden.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Reporting and Moderation</h2>
            <p>
              Users are encouraged to report any suspicious or harmful activity using the built-in reporting tools. 
              We reserve the right to remove content or suspend accounts that violate these guidelines.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Intellectual Property</h2>
            <p>
              Users retain ownership of the content they post. However, by posting on Technique, you grant us 
              a worldwide, non-exclusive, royalty-free license to use, copy, and display that content in connection 
              with the Service.
            </p>
          </section>
        </div>

        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-gray-500">
            Last Updated: February 23, 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
}

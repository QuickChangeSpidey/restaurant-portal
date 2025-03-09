/* eslint-disable @next/next/no-img-element */
import React from "react";
import Head from "next/head";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";

const SupportPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Support - Bogo Ninja</title>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>
      <div className="flex">
        {/* Main Content Area */}
          <section className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-16">
            <h2 className="text-2xl text-gray-800 font-semibold mb-6">
              Need Help? We&apos;re Here for You!
            </h2>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Support Email */}
              <div className="flex items-center">
                <span className="material-icons text-blue-500 mr-4">
                  email
                </span>
                <div>
                  <h3 className="text-xl font-medium text-gray-700">
                    Email Us
                  </h3>
                  <p className="text-gray-600">
                    For any inquiries or support, please reach out to us at:
                  </p>
                  <a
                    href="mailto:support@bogoninja.com"
                    className="text-blue-500 hover:underline"
                  >
                    support@bogoninja.com
                  </a>
                </div>
              </div>

              {/* Contact Phone */}
              <div className="flex items-center">
                <span className="material-icons text-green-500 mr-4">
                  phone
                </span>
                <div>
                  <h3 className="text-xl font-medium text-gray-700">
                    Call Us
                  </h3>
                  <p className="text-gray-600">
                    Our support team is available to assist you:
                  </p>
                  <a
                    href="tel:+1234567890"
                    className="text-blue-500 hover:underline"
                  >
                    +1 (123) 456-1234
                  </a>
                </div>
              </div>

              {/* Chat Support */}
              <div className="flex items-center">
                <span className="material-icons text-purple-500 mr-4">
                  chat
                </span>
                <div>
                  <h3 className="text-xl font-medium text-gray-700">
                    Live Chat
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Chat with us for instant support.
                  </p>
                  <button
                    disabled
                    className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded cursor-not-allowed"
                    title="Chat support is currently unavailable."
                  >
                    <ChatBubbleBottomCenterIcon className="h-5 w-5 text-gray-500" />
                    Chat Now
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Support Information */}
            <div className="mt-8">
              <h3 className="text-xl font-medium text-gray-700 mb-4">
                Frequently Asked Questions
              </h3>
              <p className="text-gray-600">
                If you have any questions, please visit our{" "}
                <a
                  href="/dashboard/faq"
                  className="text-blue-500 hover:underline"
                >
                  FAQ page
                </a>
                . You&apos;ll find answers to common questions about our services,
                reservations, menu, and more.
              </p>
            </div>
          </section>
      </div>
    </>
  );
};

export default SupportPage;

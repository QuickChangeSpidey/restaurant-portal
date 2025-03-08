/* eslint-disable @next/next/no-img-element */
import React from "react";
import Head from "next/head";
import {
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface FAQItem {
  question: string;
  answer: string;
}
const faqData: FAQItem[] = [
  // Account & Registration
  {
    question: "How do I create an account for my restaurant?",
    answer:
      "To create an account, click on the 'Sign Up' button and fill out your restaurant details. You'll be asked to verify your restaurant's information through our KYC (Know Your Customer) process, which ensures all details are accurate and legitimate.",
  },
  {
    question: "Can I update my restaurant's information after registration?",
    answer:
      "Yes, you can update all details except the primary email. To make changes, go to the settings page of your account and update the necessary fields. The updates will be reviewed and verified before they take effect.",
  },
  {
    question: "How can I delete my restaurant account?",
    answer:
      "If you'd like to delete your account, please contact our support team through the 'Support' tab. Note that this action is irreversible and will permanently remove all your restaurant data from the system.",
  },
  {
    question: "How do I verify my restaurant's KYC?",
    answer:
      "To verify your KYC, you will need to upload proof of your restaurant’s registration and relevant documentation. Once submitted, our team will review and approve the documents, which may take a few business days.",
  },

  // Locations & Menu-Items
  {
    question: "How do I add a new location?",
    answer:
      "To add a new location, go to the 'Locations' tab and click 'Add Location.' Enter your location details, including address, contact information, and upload required KYC documentation. After submission, our team will review the information before it goes live.",
  },
  {
    question: "Can I edit menu items after adding them?",
    answer:
      "Yes, you can edit menu items at any time. Simply go to the 'Menu Items' section, select the item you want to edit, and make your changes. Text and images for menu items are subject to verification for profanity or inappropriate content.",
  },
  {
    question: "Can I delete a location or menu item?",
    answer:
      "Yes, you can delete locations and menu items. To delete, navigate to the relevant section (Locations or Menu Items), select the item or location you wish to delete, and follow the prompts. Deleting a location will also remove its associated menu items.",
  },

  // Coupons
  {
    question: "How do I create and manage coupons?",
    answer:
      "To create a coupon, go to the 'Coupons' tab and click 'Create Coupon.' Fill in the necessary details, such as discount percentage, expiration date, and applicable items. Coupons can be activated or deactivated at any time, giving you full control over promotions.",
  },
  {
    question: "Can I activate or deactivate coupons?",
    answer:
      "Yes, you can activate or deactivate coupons at any time. Simply go to the 'Coupons' section, find the coupon you want to manage, and toggle its status. Deactivated coupons will no longer be applied during checkout.",
  },
  {
    question: "Can I use coupons on specific menu items?",
    answer:
      "Yes, coupons can be applied to specific menu items or categories. While creating the coupon, you can set the applicable menu items or categories that the coupon will apply to. Check the 'Coupons' section for more details.",
  },

  // Billing & Payment
  {
    question: "When will my account start charging for services?",
    answer:
      "Currently, the service is free. However, in future releases, we will introduce a paid model for premium features such as advanced analytics and additional location support. You'll be notified in advance of any changes to billing.",
  },
  {
    question: "How will I be billed once the service becomes paid?",
    answer:
      "Once the service becomes paid, you will be billed based on the plan you've selected, which may depend on factors such as the number of locations, menu items, or coupon campaigns. Payment methods and billing details will be handled through the app.",
  },

  // Support & Assistance
  {
    question: "How can I contact customer support?",
    answer:
      "You can contact customer support through the 'Support' tab in the app. You can reach us via email at support@restaurantapp.com or by phone at (123) 456-7890 for any questions or issues.",
  },
  {
    question: "How do I report inappropriate content or profanity?",
    answer:
      "All text and images related to menu items and coupons are verified for profanity and inappropriate content. If you encounter any issues or inappropriate content, please contact customer support for immediate resolution.",
  },

  // General Information
  {
    question: "Can I add more than one location?",
    answer:
      "Yes, you can add multiple locations to your account. For each new location, you will need to submit KYC documentation and wait for approval. Once approved, the location will be live in your account.",
  },
  {
    question: "How can I track my restaurant's performance?",
    answer:
      "In the future, we will provide performance analytics tools to help you track the success of your menu items, coupons, and promotions. This feature will be available with the paid plans. Stay tuned for updates!",
  },
  {
    question: "How can I suggest new features or improvements?",
    answer:
      "We love hearing from our users! If you have suggestions for new features or improvements, please use the 'Feedback' section in the app or contact our support team directly via email.",
  },
  {
    question: "Can I customize my restaurant's profile page?",
    answer:
      "Yes, you can customize your restaurant's profile page with a logo, description, and more. This will help customers learn more about your restaurant and menu offerings.",
  },
  {
    question: "What is the 'Support' tab, and how does it work?",
    answer:
      "The 'Support' tab is your direct line to customer service. If you have any issues with the app, need assistance with KYC verification, or want to report a problem, this tab provides contact options for email and phone support.",
  },
];



const FAQPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>FAQ - Restaurant App</title>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>

      <div className="flex">
        {/* Main Content Area */}
        <main className="flex-1 bg-white p-6">
          {/* FAQ Section */}
          <section className="max-w-4xl mx-auto">
            <h2 className="text-2xl text-gray-800 font-semibold mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
              {faqData.map((item, index) => (
                <details
                  key={index}
                  className="bg-white p-5 rounded shadow-md transition duration-200 ease-in-out hover:shadow-lg"
                >
                  <summary className="font-medium text-gray-700 cursor-pointer list-none flex justify-between items-center">
                    {item.question}
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  </summary>
                  <p className="mt-3 text-gray-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default FAQPage;

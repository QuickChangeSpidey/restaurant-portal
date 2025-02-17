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
    question: "How do I create an account?",
    answer:
      "To create an account, click on the 'Sign Up' button on the top right corner, fill in your details, and submit the form. You'll receive a confirmation email shortly.",
  },
  {
    question: "I forgot my password. How can I reset it?",
    answer:
      "Click on the 'Forgot Password' link on the login page, enter your registered email address, and follow the instructions sent to your email to reset your password.",
  },
  {
    question: "How can I update my profile information?",
    answer:
      "Navigate to your account settings by clicking on your profile picture in the top right corner, then select 'Profile'. From there, you can update your personal information.",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Yes, you can delete your account by contacting our support team through the 'Contact Us' page. Please note that this action is irreversible.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Absolutely. We use advanced encryption and security protocols to protect your personal information. For more details, please refer to our Privacy Policy.",
  },

  // Reservations
  {
    question: "How do I make a reservation?",
    answer:
      "To make a reservation, go to the 'Reservations' section, choose your desired date and time, select the number of guests, and confirm your booking.",
  },
  {
    question: "Can I modify or cancel my reservation?",
    answer:
      "Yes, you can modify or cancel your reservation by accessing the 'My Reservations' section in your account or by contacting our support team at least 24 hours before your booking time.",
  },
  {
    question: "Do I need to pay a deposit to reserve a table?",
    answer:
      "Depending on the restaurant and the size of your party, a deposit may be required. Details will be provided during the reservation process.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Cancellations made at least 24 hours in advance are free of charge. Late cancellations may incur a fee equivalent to the deposit amount.",
  },
  {
    question: "Can I make a reservation for a large group?",
    answer:
      "Yes, we accommodate large groups. Please contact us directly to ensure availability and to discuss any special arrangements you may need.",
  },

  // Menu & Ordering
  {
    question: "Where can I view your menu?",
    answer:
      "Our menu is available on the 'Menu' page of the app. You can browse through different categories and view detailed descriptions of each dish.",
  },
  {
    question: "Do you offer vegetarian or vegan options?",
    answer:
      "Yes, we have a variety of vegetarian and vegan dishes available. These are clearly marked in our menu for your convenience.",
  },
  {
    question: "Can I customize my order?",
    answer:
      "Absolutely! You can customize your dishes by selecting your preferred ingredients and modifications directly in the ordering interface.",
  },
  {
    question: "Do you cater to food allergies?",
    answer:
      "Yes, we take food allergies seriously. Please inform our staff of any allergies when making a reservation or placing an order, and we will accommodate your needs.",
  },
  {
    question: "Is online ordering available?",
    answer:
      "Yes, you can place orders online through our app or website for pickup or delivery.",
  },

  // Payment & Pricing
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept various payment methods including credit/debit cards, mobile payments, and cash.",
  },
  {
    question: "Is there a minimum order amount for delivery?",
    answer:
      "Yes, there is a minimum order amount for delivery, which varies depending on your location. Please check the delivery section in the app for specific details.",
  },
  {
    question: "Do you offer gift cards?",
    answer:
      "Yes, we offer gift cards that can be purchased through our app. They make perfect gifts for friends and family who love dining with us.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No, all fees including taxes and service charges are clearly displayed during the checkout process.",
  },
  {
    question: "Do you offer discounts or promotions?",
    answer:
      "Yes, we regularly offer discounts and promotions. Subscribe to our newsletter or follow us on social media to stay updated on the latest offers.",
  },

  // Delivery & Pickup
  {
    question: "What areas do you deliver to?",
    answer:
      "We deliver to a wide range of areas. Please enter your address in the app to check if we deliver to your location.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery times vary based on your location and order volume, but typically take between 30 to 60 minutes.",
  },
  {
    question: "Can I track my delivery?",
    answer:
      "Yes, once your order is dispatched, you can track its progress in real-time through the app.",
  },
  {
    question: "Is contactless delivery available?",
    answer:
      "Yes, we offer contactless delivery upon request. You can select this option during the checkout process.",
  },
  {
    question: "Do you offer curbside pickup?",
    answer:
      "Yes, curbside pickup is available. Choose the pickup option when placing your order, and our staff will bring your order to your vehicle.",
  },

  // Loyalty & Rewards
  {
    question: "Do you have a loyalty program?",
    answer:
      "Yes, we have a loyalty program where you can earn points for every dollar spent, which can be redeemed for discounts and free items.",
  },
  {
    question: "How do I earn rewards points?",
    answer:
      "Rewards points are earned with every purchase made through the app or in-store. Make sure you're logged into your account to accumulate points.",
  },
  {
    question: "Can I redeem rewards points online?",
    answer:
      "Yes, you can redeem your rewards points during the checkout process when placing an order online.",
  },
  {
    question: "Are there any restrictions on using rewards points?",
    answer:
      "Rewards points can be used towards any menu items except for gift cards and certain promotional items. Check the Rewards section in the app for detailed information.",
  },
  {
    question: "Do rewards points expire?",
    answer:
      "Yes, rewards points expire 12 months after they are earned. Be sure to use them before the expiration date.",
  },

  // Dining Experience
  {
    question: "Do you offer outdoor seating?",
    answer:
      "Yes, we offer outdoor seating for those who prefer dining al fresco. Please specify your preference when making a reservation.",
  },
  {
    question: "Is your restaurant wheelchair accessible?",
    answer:
      "Yes, our restaurant is fully wheelchair accessible, including entrances, restrooms, and seating areas.",
  },
  {
    question: "Do you host private events or parties?",
    answer:
      "Yes, we can host private events and parties. Please contact our events team to discuss your requirements and availability.",
  },
  {
    question: "Is there parking available?",
    answer:
      "Yes, we have ample parking available for our guests. Valet services may also be available depending on the location.",
  },
  {
    question: "Do you allow pets?",
    answer:
      "We welcome pets in our outdoor seating area. Please let us know if you plan to bring a pet when making a reservation.",
  },

  // Health & Safety
  {
    question: "What health and safety measures are you implementing?",
    answer:
      "We adhere to all local health guidelines, including regular sanitization, mask policies for staff, and contactless payment options to ensure a safe dining experience.",
  },
  {
    question: "Do you offer takeout options?",
    answer:
      "Yes, takeout is available. You can place your order through our app or website for a quick and convenient pickup.",
  },
  {
    question: "Are there options for socially distanced dining?",
    answer:
      "Yes, we have rearranged our seating to ensure social distancing and limit the number of guests per table as per health guidelines.",
  },
  {
    question: "How do you ensure food is prepared safely?",
    answer:
      "Our kitchen staff follow strict hygiene protocols, including regular hand washing, wearing masks and gloves, and maintaining proper food storage temperatures.",
  },
  {
    question: "Can I request no-contact delivery?",
    answer:
      "Yes, you can request no-contact delivery during the checkout process to minimize physical interaction.",
  },

  // Special Requests & Dietary Needs
  {
    question: "Do you accommodate gluten-free diets?",
    answer:
      "Yes, we offer a variety of gluten-free options. Please inform our staff of your dietary needs when ordering.",
  },
  {
    question: "Can I request a specific chef for my reservation?",
    answer:
      "While we cannot guarantee specific chefs, we strive to accommodate any special requests to enhance your dining experience.",
  },
  {
    question: "Do you offer meal plans for regular customers?",
    answer:
      "Currently, we do not offer meal plans, but we regularly update our menu with seasonal and special dishes for our regular patrons.",
  },
  {
    question: "Are high chairs or booster seats available for children?",
    answer:
      "Yes, we provide high chairs and booster seats upon request to ensure comfort for our younger guests.",
  },
  {
    question: "Can I bring my own wine?",
    answer:
      "Yes, we offer a corkage service for guests who wish to bring their own wine. Please inquire about the corkage fee when making your reservation.",
  },

  // Technical Issues
  {
    question: "I'm having trouble logging in. What should I do?",
    answer:
      "Please try resetting your password using the 'Forgot Password' link. If the issue persists, contact our support team for assistance.",
  },
  {
    question: "The app is not loading properly. How can I fix this?",
    answer:
      "First, try refreshing the page or restarting the app. If the problem continues, clear your browser cache or reinstall the app. For further help, reach out to our support team.",
  },
  {
    question: "How do I update the app to the latest version?",
    answer:
      "Visit the App Store or Google Play Store, search for our app, and click 'Update' if a new version is available.",
  },
  {
    question: "I'm experiencing payment issues. What should I do?",
    answer:
      "Ensure your payment information is correct and that your card has sufficient funds. If the issue persists, try a different payment method or contact your bank for assistance.",
  },
  {
    question: "How do I report a bug or provide feedback?",
    answer:
      "You can report bugs or provide feedback through the 'Feedback' section in the app or by contacting our support team directly via the 'Contact Us' page.",
  },

  // General Information
  {
    question: "What are your operating hours?",
    answer:
      "Our operating hours are Monday to Friday from 11:00 AM to 10:00 PM, and Saturday to Sunday from 9:00 AM to 11:00 PM. Holidays may have different hours, so please check the app for updates.",
  },
  {
    question: "Where are you located?",
    answer:
      "We have multiple locations. Please visit the 'Locations' page in the app to find the one nearest to you.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach our customer support via the 'Contact Us' page, through email at support@restaurantapp.com, or by calling our support hotline at (123) 456-7890.",
  },
  {
    question: "Do you have a newsletter I can subscribe to?",
    answer:
      "Yes, you can subscribe to our newsletter through the app or our website to receive the latest news, offers, and updates.",
  },
  {
    question: "Can I suggest a dish to be added to the menu?",
    answer:
      "We love hearing from our customers! Please submit your suggestions through the 'Feedback' section in the app or contact us directly.",
  },
  {
    question: "Do you offer catering services?",
    answer:
      "Yes, we offer catering services for events and special occasions. Please contact our catering team to discuss your requirements.",
  },
  {
    question: "Are reservations required for walk-in customers?",
    answer:
      "Reservations are recommended, especially during peak hours, but walk-ins are welcome based on availability.",
  },
  {
    question: "Do you offer any seasonal or limited-time menus?",
    answer:
      "Yes, we regularly update our menu with seasonal and limited-time offerings to provide fresh and exciting options for our guests.",
  },
  {
    question: "Can I view nutritional information for your dishes?",
    answer:
      "Yes, nutritional information is available for most of our dishes on the 'Menu' page in the app.",
  },
  {
    question: "Do you have live music or entertainment?",
    answer:
      "We host live music and entertainment on select nights. Please check the 'Events' section in the app for upcoming performances.",
  },
  {
    question: "Is there a dress code?",
    answer:
      "Our dress code is smart casual. We want all our guests to feel comfortable while maintaining a pleasant dining atmosphere.",
  },
  {
    question: "Do you offer early bird specials?",
    answer:
      "Yes, we offer early bird specials for guests who dine with us before 6:00 PM. Check the 'Offers' section in the app for current deals.",
  },
  {
    question: "Are there any family-friendly activities available?",
    answer:
      "Yes, we provide a kids' menu and have play areas in some of our locations to ensure a family-friendly environment.",
  },
  {
    question: "Can I rent a private dining room?",
    answer:
      "Yes, our private dining rooms can be rented for special occasions. Please contact our events team to make arrangements.",
  },
  {
    question: "Do you offer delivery for catering orders?",
    answer:
      "Yes, catering orders can be delivered to your specified location. Please discuss delivery options with our catering team.",
  },
  {
    question: "Is Wi-Fi available for customers?",
    answer:
      "Yes, free Wi-Fi is available for all our customers. You can access it by connecting to the network named 'RestaurantApp_WiFi'.",
  },
  {
    question: "How can I provide feedback about my dining experience?",
    answer:
      "We value your feedback! Please leave a review through the app, website, or directly inform our staff during your visit.",
  },
  {
    question: "Do you support online gift cards?",
    answer:
      "Yes, you can purchase and send gift cards directly through our app or website.",
  },
  {
    question: "Are group discounts available?",
    answer:
      "We offer group discounts for large parties. Please contact our support team to inquire about available offers.",
  },
  {
    question: "How do I join your VIP program?",
    answer:
      "Join our VIP program by signing up through the app or website. Enjoy exclusive benefits, early access to events, and special discounts.",
  },
  {
    question: "Can I pre-order my meal for a specific time?",
    answer:
      "Yes, you can pre-order your meal through the app to ensure it's ready when you arrive or at your preferred time.",
  },
  {
    question: "Do you offer seasonal beverages or cocktails?",
    answer:
      "Yes, our bar menu features seasonal beverages and cocktails that change throughout the year. Check the 'Drinks' section for current offerings.",
  },
  {
    question: "Is gratuity included in the bill?",
    answer:
      "Gratuity is not included unless specified for large parties or special events. You can add a tip of your choice during payment.",
  },
  {
    question: "Do you offer smoke-free dining areas?",
    answer:
      "Yes, we are a completely smoke-free restaurant to ensure a comfortable environment for all our guests.",
  },
  {
    question: "Are there any special accommodations for elderly guests?",
    answer:
      "Yes, we provide comfortable seating, accessible restrooms, and attentive service to cater to our elderly guests' needs.",
  },
  {
    question: "Can I request a specific seating area?",
    answer:
      "Yes, you can request specific seating areas such as near a window, in a quiet corner, or outdoor seating when making a reservation.",
  },
  {
    question: "Do you offer any cooking classes or workshops?",
    answer:
      "Occasionally, we host cooking classes and workshops. Stay tuned to the 'Events' section in the app for upcoming sessions.",
  },
  {
    question: "Is there a newsletter to stay updated with your latest news?",
    answer:
      "Yes, you can subscribe to our newsletter through the app or website to receive the latest news, offers, and updates directly to your inbox.",
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

      <div className="flex min-h-screen">
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

import Content from "../Components/Content/Content";
import Menu from "../Components/Menu/Menu";

export default function Page() {
  const texts: { title: string; text: string; id: string }[] = [
    {
      title: "Terms and conditions",
      text: "",
      id: "",
    },
    {
      title: "Last Updated:",
      text: "27/01/2025",
      id: "lastUpdated",
    },
    {
      title: "1. General",
      text: "",
      id: "",
    },
    {
      title: "1.1 Introduction",
      text: "When you place an order with Of The Useless (“the Company,” “we,” “us,” or “our”), you agree to the Terms of purchase set out below. It is important that you read these Terms carefully before making a purchase. We recommend you save or print a copy for future reference.",
      id: "",
    },
    {
      title: "1.2 Age Requirement",
      text: "Purchases can only be made by individuals who are at least 18 years old or have permission from their guardian.",
      id: "",
    },
    {
      title: "1.3 Scope",
      text: "These Terms apply to the purchase of goods or services directly from Of The Useless and via any online platform or direct communication channels we use.",
      id: "",
    },
    {
      title: "1.4 Contact Details",
      text: `<p>Of The Useless</p>
      <p>Hantverkargatan 12A</p>
      <p>122 21 Stockholm, Sweden</p>
      <p>Email: info@oftheuseless.com</p>`,
      id: "",
    },
    {
      title: "2. Company & Jurisdiction",
      text: "",
      id: "",
    },
    {
      title: "2.1 Legal Entity",
      text: "Of The Useless is a business registered in Sweden with its principal address at Hantverkargatan 12A, 122 21 Stockholm, Sweden.",
      id: "",
    },
    {
      title: "2.2 EU and Non-EU Customers",
      text: `<ul>
      <li>EU Residents: All prices (when displayed) are shown in EUR and include VAT.</li>
      <br>
      <li>Non-EU Residents: Pricing may be displayed without VAT, and you may be responsible for import duties, taxes, or other fees imposed by your local authorities.</li>
      <br>
      <li>These Terms apply regardless of your location, although certain consumer protection rights (e.g., the EU right of withdrawal) may differ for non-EU residents.</li>
      </ul>`,
      id: "",
    },
    {
      title: "2.3 Governing Law & Dispute Resolution",
      text: `<ul>
      <li>For EU residents, Swedish law applies, and any dispute that cannot be resolved by mutual agreement may be referred to the Swedish National Board for Consumer Disputes (ARN), and we will comply with ARN’s decision. You can also use the European Commission’s Online Dispute Resolution portal at http://ec.europa.eu/consumers/odr/.</li>
      <br>
      <li>For non-EU residents, this Agreement is governed by Swedish law, and any dispute shall be settled by a Swedish court of general jurisdiction, with the Stockholm District Court as the court of first instance.</li>
      </ul>`,
      id: "",
    },
    {
      title: "3. Orders & Contract Formation",
      text: "",
      id: "",
    },
    {
      title: "3.1 Order Process",
      text: `<p>Orders can be placed via any ordering mechanism we provide (e.g., email, online checkout). Once you submit an order, you typically receive a confirmation acknowledging receipt. However, we reserve the right to confirm or decline the order after reviewing details such as material availability or potential pricing errors.</p>
      <br>  
      <p>The contract between you and the Company is formed only once we have confirmed the order.</p>
      `,
      id: "",
    },
    {
      title: "3.2 Right to Refuse or Cancel",
      text: "We reserve the right to cancel or refuse any order if there is a pricing error, a suspicion of fraud, unavailability of materials, or other legitimate reasons. If you have already paid, we will refund any amounts related to the canceled order.",
      id: "",
    },
    {
      title: "3.3 Changes or Cancellations",
      text: "If you wish to change or cancel your order, please contact us as soon as possible. We will make reasonable efforts to accommodate, but once production of a made-to-order item has begun, changes or cancellations may not be possible.",
      id: "",
    },
    {
      title: "4. Price & Payment",
      text: "",
      id: "",
    },
    {
      title: "4.1 Pricing",
      text: `<p>Prices may not always be displayed on our website. You may receive a quotation or invoice in EUR, which includes VAT for EU residents.</p>
      <br>
      <p>For non-EU residents, VAT is excluded, but you may be liable for any import duties or local taxes.</p>
      `,
      id: "",
    },
    {
      title: "4.2 Payment Methods",
      text: `<p>We process payments securely through Stripe. Stripe supports various payment options (e.g., major credit cards, some digital wallets).</p>
      <br>
      <p>We reserve the right to add or remove payment options at our discretion.</p>
      `,
      id: "",
    },
    {
      title: "4.3 Import Duties & Taxes",
      text: "If you are a non-EU customer, be aware that import duties, taxes, and fees may apply in your country. You are responsible for any such additional charges.",
      id: "",
    },
    {
      title: "5. Delivery",
      text: "",
      id: "",
    },
    {
      title: "5.1 Production & Lead Times",
      text: `<p>Made-to-Order Items: Standard production time is generally 6–10 weeks, although this may vary based on material availability or order volume.</p>
      <br>
      <p>After production, shipping transit time depends on your location and carrier schedules. Any delivery timeframes given are estimates and not guarantees.</p>
      `,
      id: "",
    },
    {
      title: "5.2 Shipping Methods",
      text: `<p>We select the carrier or freight forwarder at our discretion, considering cost, distance, and product size/weight. If you have a preferred delivery method, please let us know, and we will try to accommodate if feasible.</p>
      <br>
      <p>Any additional shipping fees or surcharges will be communicated before you complete the purchase.</p>
      `,
      id: "",
    },
    {
      title: "5.3 Delivery Requirements",
      text: `<p>You or an authorized adult should be present to receive large or bulky items. If the delivery fails because no one is available, re-delivery fees may apply.</p>
      <br>
      <p>Risk and responsibility for the goods pass to you once the goods are physically received by you or a person authorized by you.</p>
      `,
      id: "",
    },
    {
      title: "5.4 Damaged Shipments",
      text: "If you notice external damage to the packaging or product, please document with photos and contact us immediately. We will investigate and take appropriate action, such as arranging a replacement or refund if applicable.",
      id: "",
    },
    {
      title: "6. Right of Withdrawal & Returns",
      text: "",
      id: "",
    },
    {
      title: "6.1 Made-to-Order Products",
      text: `<p>Made-to-order products are manufactured according to your specifications and are therefore exempt from the standard 14-day EU right of withdrawal. Such items cannot be returned or exchanged unless they arrive defective or deviate substantially from what was agreed.</p>
      <br>
      <p>We may, at our discretion, allow a goodwill return or exchange in exceptional cases, but this is not a guaranteed policy.</p>
      `,
      id: "",
    },
    {
      title: "6.2 Non-Custom Products",
      text: "<p>For standard, non-custom items, EU residents have a 14-day right of withdrawal from the day they receive the product, provided it is unused and in its original packaging.The customer is responsible for return shipping costs when exercising this right of withdrawal.</p>",
      id: "",
    },
    {
      title: "6.3 Defective or Incorrect Products",
      text: `<p>If you receive a defective or incorrect product, please contact us immediately with a description (and photos, if possible). We will arrange a replacement, repair, or refund where appropriate.</p>
      <br>
      <p>We cover the return shipping cost for defective or incorrect items.</p>
      `,
      id: "",
    },
    {
      title: "7. Complaints & Warranty",
      text: "",
      id: "",
    },
    {
      title: "7.1 Complaints Period",
      text: "Under Swedish consumer law, private consumers have the right to complain about a product for up to 3 years from receiving it, provided the defect was originally present (i.e., not caused by normal wear or misuse).",
      id: "",
    },
    {
      title: "7.2 Filing a Complaint",
      text: `<p>You must notify us of any defects or faults as soon as you discover them. Complaints made within 2 months from discovery are considered filed within a reasonable time.</p>
      <br>
      <p>We may request photos or additional documentation to assess the fault.</p>
      `,
      id: "",
    },
    {
      title: "7.3 Remedies",
      text: "If your complaint is approved, we will primarily repair or replace the product. If repair or replacement is not possible, you may be entitled to a full or partial refund, depending on the circumstances.",
      id: "",
    },
    {
      title: "8. Liability & Force Majeure",
      text: "",
      id: "",
    },
    {
      title: "8.1 Limitation of Liability",
      text: "To the maximum extent permitted by law, our liability to you for any claim arising out of or in connection with your purchase is limited to the amount you paid for the product(s). We are not liable for indirect or consequential damages, including loss of profits or other financial losses.",
      id: "",
    },
    {
      title: "8.2 Force Majeure",
      text: `<p>We shall not be held responsible for any failure or delay in performance caused by circumstances beyond our reasonable control, such as government actions, new or changed legislation, industrial disputes, war or threat of war, fires, floods, natural disasters, pandemics, or major accidents.</p>
      <br>
      <p>If such circumstances persist for over 30 days, either party may terminate the order without further liability, except for a refund of any product not yet delivered or produced.</p>
      `,
      id: "",
    },
    {
      title: "9. Personal Data & Cookies",
      text: "",
      id: "",
    },
    {
      title: "9.1 Data Processing",
      text: `<p>We collect and store personal data (e.g., contact details, shipping information, payment details) to fulfill orders, provide customer support, and comply with legal obligations.</p>
      <br>
      <p>We handle personal data in accordance with applicable data protection laws, including the GDPR for EU customers.</p>
      `,
      id: "",
    },
    {
      title: "9.2 Cookies",
      text: "We may use cookies or similar technologies to enhance website functionality or user experience. If our use of cookies expands in the future, we will update our policy and, if necessary, obtain consent according to relevant regulations.",
      id: "",
    },
    {
      title: "10. Modifications & Severability",
      text: "",
      id: "",
    },
    {
      title: "10.1 Changes to Terms",
      text: "We reserve the right to modify or update these Terms at any time. Any changes will be posted on our website, and the version in effect at the time of your purchase will govern that order.",
      id: "",
    },
    {
      title: "10.2 Entire Agreement",
      text: "These Terms, together with any other policies or documents referenced herein, constitute the entire agreement between you and us regarding your purchase.",
      id: "",
    },
    {
      title: "10.3 Severability",
      text: "If any provision of these Terms is held invalid or unenforceable, the remaining provisions shall remain in full force and effect.",
      id: "",
    },
    {
      title: "Contact Us",
      text: `<p>If you have any questions regarding these Terms, your order, or any other matter, please contact us at:<p>
      <br>
      <p>Of The Useless</p>
      <p>Hantverkargatan 12A, 122 21 Stockholm, Sweden</p>
      <p>Email: <a href="mailto:info@oftheuseless.com">info@oftheuseless.com</a><p>
      `,
      id: "",
    },
  ];

  const contentMenu = [
    {
      title: "Contact",
      link: "/info#contact",
    },
    {
      title: "Lead times & Shipping",
      link: "/info#shipping",
    },
    {
      title: "Payments",
      link: "/info#payments",
    },
    {
      title: "Custom Pieces",
      link: "/info#customPieces",
    },
    {
      title: "Trade And business clients",
      link: "/info#Trade",
    },
    {
      title: "Exchange and Returns",
      link: "/info#returns",
    },
  ];

  return (
    <main className="relative min-h-[calc(100vh-716px)]">
      <Menu page />
      <div className="lg:h-[180px] h-[410px]"></div>
      <Content texts={texts} columns={2} menu={contentMenu} />
    </main>
  );
}

import Content from "../Components/Content/Content";
import Menu from "../Components/Menu/Menu";

export default function Page() {
  const texts: { title: string; text: string; id: string }[] = [
    {
      title: "Contact",
      text: `<a href="mailto:enquires@oftheuseless.com">enquires@oftheuseless.com</a>`,
      id: "contact",
    },
    {
      title: "Lead times And Shipping",
      text: "Please allow approximately 6–10 weeks for your made-to-order items to be built. shipping time and cost will vary depending on item size, weight, and destination. We can provide an estimated shipping cost once we know your location.",
      id: "shipping",
    },
    {
      title: "Payments",
      text: "All payments are processed securely through Stripe, which supports major credit cards and certain digital wallets. Prices are stated in Euro, with VAT included for EU residents. For Non-EU residents pricing is displayed without VAT.  Prices do not include any applicable taxes, shipping, or handling charges; these will be calculated and added at checkout.",
      id: "payments",
    },
    {
      title: "Custom Pieces",
      text: `<p>We offer custom design services. certain in-line pieces are also available for customization.</p>`,
      id: "customPieces",
    },
    {
      title: "Trade And business clients",
      text: `<p>We welcome inquiries from trade and business customers and may offer specialized pricing or volume discounts.  We offer custom payment terms, potential minimum order quantities, and tailored logistics solutions for larger or repeat orders. For details on lead times, design approvals, and shipping options, please contact us with your project requirements.</p>`,
      id: "trade",
    },
    {
      title: "Exchange and Returns",
      text: `<p>Made-to-order items cannot be returned or exchanged unless they arrive defective or deviate from what was agreed. Standard (non-custom) items for EU residents can be returned within 14 days of delivery if unused and in their original packaging; shipping fees apply. If you receive a defective or incorrect product, please contact us immediately, and we will arrange a replacement, repair, or refund as appropriate.</p>
      <br />
      <br />
      <p>For complete details, please refer to our Terms & Conditions page.</p>
      `,
      id: "returns",
    },
  ];

  const contentMenu = [
    {
      title: "Contact",
      link: "#contact",
    },
    {
      title: "Lead times & Shipping",
      link: "#shipping",
    },
    {
      title: "Payments",
      link: "#payments",
    },
    {
      title: "Custom Pieces",
      link: "#customPieces",
    },
    {
      title: "Trade And business clients",
      link: "#Trade",
    },
    {
      title: "Exchange and Returns",
      link: "#returns",
    },
  ];

  return (
    <main className="relative min-h-[calc(100vh-716px)]">
      <Menu page />
      <div className="lg:h-[180px]"></div>
      <Content texts={texts} columns={2} menu={contentMenu} />
    </main>
  );
}

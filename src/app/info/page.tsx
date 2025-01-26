import Content from "../Components/Content/Content";
import Menu from "../Components/Menu/Menu";

export default function Page() {
  const texts: { title: string; text: string }[] = [
    {
      title: "Contact",
      text: "enquires@oftheuseless.com",
    },
    {
      title: "Lead times And Shipping",
      text: "Please allow 6-10 weeks from the time of your order for items to be built. Shipping time and cost will be determined based on item size/weight and distance. An estimated shipping cost can be calculated once destination is known.",
    },
    {
      title: "Payments",
      text: "We accept checks, wire transfers, ACH payments, and credit cards. Please note that there is a 3% processing fee for all credit card transactions. All transactions are secured and encrypted. Prices shown do not include applicable taxes, shipping, or handling charges. Taxes will be calculated and added during the checkout.",
    },
    {
      title: "Trade And business clients",
      text: `<p>Please allow 8-10 weeks from the time of your order for items to be built. Shipping time and cost will be determined based on item size/weight and distance. An estimated shipping cost can be calculated once destination is known.</p>
          <p style="text-indent:30px">We accept checks, wire transfers, ACH payments, and credit cards. Please note that there is a 3% processing fee for all credit card transactions. All transactions are secured and encrypted. Prices shown do not include applicable taxes, shipping, or handling charges. Taxes will be calculated and added during the checkout.</p>`,
    },
    {
      title: "Exchange and Returns",
      text: `EU Residents<br><br>
      <p>We accept returns within 14 days, starting from the day your order was delivered. Returned items must comply with our return policy:</p>
      <p style="text-indent:30px">Items must be returned undamaged and unused, with any tags attached and the original packaging included.</p>
      <p style="text-indent:30px">Accessories must be returned with the original branded boxes and dust bags, where provided, and placed inside a protective box when returned.</p>
      <p style="text-indent:30px">Household products must be returned unopened and unused, with the seals of any packaging still intact.</p>
      <br>
      <p>Made-to-order items cannot be returned as they have been created to your specification, unless the item arrives damaged or faulty when delivered to you. In this particular case, you must inform us within 72h after receiving your order.</p>
      <br>
      <p>Non-EU Residents</p>
      <br>
      <p>As a private consumer outside the EU there is no specific jurisdiction controlling your right of regret. But please get in touch with us if you have any remarks, regrets or complaints and we will try to accommodate your request.</p>`,
    },
  ];

  return (
    <main className="relative min-h-[calc(100vh-716px)]">
      <Menu page />
      <div className="h-[180px]"></div>
      <Content texts={texts} columns={2} />
    </main>
  );
}
